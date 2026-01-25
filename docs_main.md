That is a very common and efficient way to build Web3 games. In this model, the **Blockchain** is the "Source of Truth" for ownership, but your **Game Server** is the "Source of Graphics."

This is actually better for "Pou-style" games because you can have complex animations (the Panda eating, sleeping, or dancing) that would be too heavy to put on-chain.

---

## 🏗️ The Hybrid Architecture

You are essentially building a **Bridge** between the Sui network and your private game database.

1. **On-Chain (Sui):** The Panda NFT owns the Hat NFT via a Dynamic Object Field. This ensures that if the user sells the Panda, the buyer truly "owns" the hat too.
2. **Off-Chain (Your Database):** Your server watches the blockchain. When it sees an `Equip` transaction, it receives the emitted event and updates your database to say: *"Panda #123 is now visually wearing Hat #5."*
3. **Frontend (The Game):** The game client asks your server, *"What does Panda #123 look like?"* Your server looks at its database and tells the game, *"Load the Panda model and apply the 'Yellow Hat' animation layer."*

---

## � Updated PRD: Hybrid Game System

### 1. Functional Requirement: "The Sync"

The system must maintain a 1:1 sync between on-chain ownership and off-chain rendering.

* **Trigger:** Whenever a Move function (`equip`, `unequip`, `transfer`) is called, a Sui **Event** must be emitted.
* **Listener:** An off-chain "Indexer" (a small script) listens for these events and updates your game's SQL/NoSQL database.

### 2. Frontend Rendering Flow

Instead of reading NFT metadata directly from IPFS, the frontend follows this flow:

1. **Auth:** User logs in via **zkLogin** or a Sui wallet.
2. **Fetch Ownership:** The frontend checks which Panda NFTs the user owns.
3. **Fetch Visuals:** The frontend sends the Panda's `ObjectID` to your API.
4. **Render:** Your API returns the "Visual State" (e.g., `current_outfit: ["hat_05", "glasses_02"]`). Your game engine (Unity/React) renders the high-quality animated assets from your own server.

---

## � Developer Task List: Hybrid Sync

### Task 1: Move Contract (Events) ✅ COMPLETED

* [x] **Emit Events:** In the `equip_item` and `unequip_item` functions, events are now emitted.
* **Emitted Events:**
  - `CosmeticEquipped { panda_id: ID, category: String }` — Emitted when a cosmetic is equipped
  - `CosmeticUnequipped { panda_id: ID, category: String }` — Emitted when a cosmetic is unequipped
* **Event Flow:** These events are automatically broadcast to the Sui event stream, allowing off-chain indexers to listen and synchronize.



### Task 2: Backend Indexer (The Bridge) 🚀 IN PROGRESS

The Sui Event Listener must now be implemented to watch for contract events and sync with the database:

* [ ] **Sui Event Listener:** Use the Sui TypeScript SDK (`subscribeEvent` or `queryEvents`) to watch for your contract's `CosmeticEquipped` and `CosmeticUnequipped` events.
* [ ] **DB Update Logic:** Write a service that:
  1. Receives an `CosmeticEquipped` or `CosmeticUnequipped` event.
  2. Extracts `panda_id` and `category` from the event.
  3. Verifies the ownership on-chain (optional safety check).
  4. Updates the `pandas` table in your database with the new cosmetic state.
* [ ] **Event Listening Setup:** Initialize the indexer to continuously listen to events in real-time.
* [ ] **Error Handling:** Implement retry logic and logging for failed indexing operations.

Nmkvinnx10-

