/// Module: yeru_contract
/// Panda pet NFT contract with equippable cosmetics using Dynamic Object Fields
module yeru_contract::yeru_contract;

use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};
use sui::dynamic_object_field as dof;
use sui::display;
use sui::package;
use sui::event;
use std::string::{Self, String};

// ===== Events =====
/// Event emitted when a cosmetic is equipped
public struct CosmeticEquipped has copy, drop {
    panda_id: ID,
    category: String,
}

/// Event emitted when a cosmetic is unequipped
public struct CosmeticUnequipped has copy, drop {
    panda_id: ID,
    category: String,
}

// ===== Objects =====
/// Panda: The main pet NFT object with key and store abilities
public struct Panda has key, store {
    id: UID,
    name: String,
    owner: address,        // Track the owner for display purposes
}

/// Cosmetic: Equippable item for Panda with key and store abilities
/// The category field acts as a "slot" identifier (e.g., "hat", "shirt", "shoes")
public struct Cosmetic has key, store {
    id: UID,
    category: String,      // "hat", "shirt", "shoes", "accessory", etc.
    name: String,
    description: String,
    rarity: String,        // "common", "rare", "legendary"
}

/// One-Time Witness for Display initialization
public struct YERU_CONTRACT has drop {}

// ===== Errors =====
const ESlotOccupied: u64 = 0;
const ESlotNotFound: u64 = 1;

// ===== Constants =====

// ===== Creation Functions =====

/// Create a new Panda NFT
/// Returns a Panda object owned by the caller
public fun create_panda(
    name: String,
    ctx: &mut TxContext,
): Panda {
    let panda = Panda {
        id: object::new(ctx),
        name,
        owner: tx_context::sender(ctx),
    };
    panda
}

/// Create a new Cosmetic item
/// Returns a Cosmetic object owned by the caller
public fun create_cosmetic(
    category: String,
    name: String,
    description: String,
    rarity: String,
    ctx: &mut TxContext,
): Cosmetic {
    let cosmetic = Cosmetic {
        id: object::new(ctx),
        category,
        name,
        description,
        rarity,
    };
    cosmetic
}

// ===== Dynamic Object Field Functions =====

/// Equip a cosmetic item to the Panda
/// Uses the cosmetic's category as the field name
/// Aborts if the slot is already occupied
public fun equip_item(
    panda: &mut Panda,
    cosmetic: Cosmetic,
) {
    let category_name = cosmetic.category;
    
    // Check if the slot is already occupied
    assert!(!dof::exists_(&panda.id, category_name), ESlotOccupied);
    
    // Add the cosmetic as a dynamic object field using category as key
    dof::add(&mut panda.id, category_name, cosmetic);
    
    // Emit event for off-chain indexing (hybrid system sync)
    event::emit(CosmeticEquipped {
        panda_id: object::id(panda),
        category: category_name,
    });
}

/// Unequip a cosmetic item from the Panda by category
/// Returns the cosmetic to the specified recipient
public fun unequip_item(
    panda: &mut Panda,
    category: String,
    recipient: address,
) {
    // Check if the slot exists
    assert!(dof::exists_(&panda.id, category), ESlotNotFound);
    
    // Remove the cosmetic from the dynamic field
    let cosmetic: Cosmetic = dof::remove(&mut panda.id, category);
    
    // Emit event for off-chain indexing (hybrid system sync)
    event::emit(CosmeticUnequipped {
        panda_id: object::id(panda),
        category: category,
    });
    
    // Transfer it back to the recipient
    transfer::public_transfer(cosmetic, recipient);
}

/// Check if a cosmetic slot is equipped
public fun is_slot_equipped(panda: &Panda, category: String): bool {
    dof::exists_(&panda.id, category)
}

// ===== View Functions =====

public fun get_name(panda: &Panda): String {
    panda.name
}

public fun get_owner(panda: &Panda): address {
    panda.owner
}

public fun get_cosmetic_name(cosmetic: &Cosmetic): String {
    cosmetic.name
}

public fun get_cosmetic_category(cosmetic: &Cosmetic): String {
    cosmetic.category
}

public fun get_cosmetic_rarity(cosmetic: &Cosmetic): String {
    cosmetic.rarity
}

// ===== Display Module Setup =====

/// One-time initialization to set up Display for Panda
fun init(otw: YERU_CONTRACT, ctx: &mut TxContext) {
    let keys = vector[
        string::utf8(b"name"),
        string::utf8(b"description"),
        string::utf8(b"image_url"),
        string::utf8(b"project_url"),
    ];

    let values = vector[
        string::utf8(b"{name}"),
        string::utf8(b"A digital Panda pet NFT with equippable cosmetics"),
        string::utf8(b"https://yeru-panda.example.com/api/panda/{id}.png"),
        string::utf8(b"https://yeru-panda.example.com"),
    ];

    let publisher = package::claim(otw, ctx);
    let mut display = display::new_with_fields<Panda>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display::update_version(&mut display);
    transfer::public_transfer(display, tx_context::sender(ctx));
    transfer::public_transfer(publisher, tx_context::sender(ctx));
}

