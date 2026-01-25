#[test_only]
module yeru_contract::yeru_contract_tests;

use yeru_contract::yeru_contract::{
    create_panda, create_cosmetic, equip_item, unequip_item, is_slot_equipped,
    get_name, get_owner, get_cosmetic_name, get_cosmetic_category, get_cosmetic_rarity,
};

use sui::test_scenario;
use std::string;

// ===== Test Constants =====
const TEST_ADDR: address = @0x1;

// ===== Test: Object Creation =====

#[test]
fun test_create_panda() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create a Panda
    let panda = create_panda(string::utf8(b"Fluffy"), ctx);
    
    // Assert initial values
    assert!(get_name(&panda) == string::utf8(b"Fluffy"), 0);
    assert!(get_owner(&panda) == TEST_ADDR, 0);
    
    // Transfer panda to drop it properly
    sui::transfer::public_transfer(panda, TEST_ADDR);
    test_scenario::end(scenario);
}

#[test]
fun test_create_cosmetic() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create a Cosmetic
    let cosmetic = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Red Hat"),
        string::utf8(b"A stylish red hat"),
        string::utf8(b"rare"),
        ctx,
    );
    
    // Assert values
    assert!(get_cosmetic_category(&cosmetic) == string::utf8(b"hat"), 0);
    assert!(get_cosmetic_name(&cosmetic) == string::utf8(b"Red Hat"), 0);
    assert!(get_cosmetic_rarity(&cosmetic) == string::utf8(b"rare"), 0);
    
    // Transfer cosmetic to drop it properly
    sui::transfer::public_transfer(cosmetic, TEST_ADDR);
    test_scenario::end(scenario);
}

// ===== Test: Dynamic Object Fields (DOF) =====

#[test]
fun test_equip_item_success() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create Panda and Cosmetic
    let mut panda = create_panda(string::utf8(b"Fluffy"), ctx);
    let cosmetic = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Red Hat"),
        string::utf8(b"A stylish red hat"),
        string::utf8(b"rare"),
        ctx,
    );
    
    // Initially, hat slot should be empty
    assert!(!is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    
    // Equip the cosmetic
    equip_item(&mut panda, cosmetic);
    
    // Now hat slot should be occupied
    assert!(is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    
    // Transfer panda to drop it properly
    sui::transfer::public_transfer(panda, TEST_ADDR);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure]
fun test_equip_duplicate_slot_fails() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create Panda and two cosmetics with the same category
    let mut panda = create_panda(string::utf8(b"Fluffy"), ctx);
    let cosmetic1 = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Red Hat"),
        string::utf8(b"A stylish red hat"),
        string::utf8(b"rare"),
        ctx,
    );
    let cosmetic2 = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Blue Hat"),
        string::utf8(b"A stylish blue hat"),
        string::utf8(b"legendary"),
        ctx,
    );
    
    // Equip first cosmetic (should succeed)
    equip_item(&mut panda, cosmetic1);
    
    // Try to equip second cosmetic to the same slot (should fail)
    equip_item(&mut panda, cosmetic2);
    
    // This line should never be reached due to abort
    sui::transfer::public_transfer(panda, TEST_ADDR);
    test_scenario::end(scenario);
}

#[test]
fun test_equip_different_slots_success() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create Panda and two cosmetics with different categories
    let mut panda = create_panda(string::utf8(b"Fluffy"), ctx);
    let hat = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Red Hat"),
        string::utf8(b"A stylish red hat"),
        string::utf8(b"rare"),
        ctx,
    );
    let shirt = create_cosmetic(
        string::utf8(b"shirt"),
        string::utf8(b"Blue Shirt"),
        string::utf8(b"A cozy blue shirt"),
        string::utf8(b"common"),
        ctx,
    );
    
    // Equip both cosmetics
    equip_item(&mut panda, hat);
    equip_item(&mut panda, shirt);
    
    // Both slots should be occupied
    assert!(is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    assert!(is_slot_equipped(&panda, string::utf8(b"shirt")), 0);
    
    // Transfer panda to drop it properly
    sui::transfer::public_transfer(panda, TEST_ADDR);
    test_scenario::end(scenario);
}

#[test]
fun test_unequip_item_success() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create Panda and Cosmetic
    let mut panda = create_panda(string::utf8(b"Fluffy"), ctx);
    let cosmetic = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Red Hat"),
        string::utf8(b"A stylish red hat"),
        string::utf8(b"rare"),
        ctx,
    );
    
    // Equip the cosmetic
    equip_item(&mut panda, cosmetic);
    assert!(is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    
    // Unequip the cosmetic
    unequip_item(&mut panda, string::utf8(b"hat"), TEST_ADDR);
    
    // Hat slot should now be empty
    assert!(!is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    
    // Transfer panda to drop it properly
    sui::transfer::public_transfer(panda, TEST_ADDR);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure]
fun test_unequip_nonexistent_slot_fails() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create Panda without any cosmetics
    let mut panda = create_panda(string::utf8(b"Fluffy"), ctx);
    
    // Try to unequip a non-existent slot (should fail)
    unequip_item(&mut panda, string::utf8(b"hat"), TEST_ADDR);
    
    // This line should never be reached due to abort
    sui::transfer::public_transfer(panda, TEST_ADDR);
    test_scenario::end(scenario);
}

// ===== Test: Integration =====

#[test]
fun test_full_lifecycle() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create Panda
    let mut panda = create_panda(string::utf8(b"Fluffy"), ctx);
    
    // Create and equip cosmetic
    let hat = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Red Hat"),
        string::utf8(b"A stylish red hat"),
        string::utf8(b"rare"),
        ctx,
    );
    equip_item(&mut panda, hat);
    
    // Verify cosmetic is equipped
    assert!(is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    
    // Verify Panda state is still intact
    assert!(get_name(&panda) == string::utf8(b"Fluffy"), 0);
    assert!(get_owner(&panda) == TEST_ADDR, 0);
    
    // Transfer panda to drop it properly
    sui::transfer::public_transfer(panda, TEST_ADDR);
    test_scenario::end(scenario);
}

#[test]
fun test_equip_unequip_reequip() {
    let mut scenario = test_scenario::begin(TEST_ADDR);
    let ctx = test_scenario::ctx(&mut scenario);
    
    // Create Panda
    let mut panda = create_panda(string::utf8(b"Fluffy"), ctx);
    
    // Create first cosmetic and equip
    let hat1 = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Red Hat"),
        string::utf8(b"A stylish red hat"),
        string::utf8(b"rare"),
        ctx,
    );
    equip_item(&mut panda, hat1);
    assert!(is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    
    // Unequip first hat
    unequip_item(&mut panda, string::utf8(b"hat"), TEST_ADDR);
    assert!(!is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    
    // Create second cosmetic with same slot and equip
    let hat2 = create_cosmetic(
        string::utf8(b"hat"),
        string::utf8(b"Blue Hat"),
        string::utf8(b"A stylish blue hat"),
        string::utf8(b"legendary"),
        ctx,
    );
    equip_item(&mut panda, hat2);
    assert!(is_slot_equipped(&panda, string::utf8(b"hat")), 0);
    
    // Transfer panda to drop it properly
    sui::transfer::public_transfer(panda, TEST_ADDR);
    test_scenario::end(scenario);
}
