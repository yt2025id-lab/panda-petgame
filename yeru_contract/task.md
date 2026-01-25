
## 🛠 Move Developer Task List: Panda & Cosmetics

### 1. Object Architecture & Structs

* [ ] **Define the Panda (Parent):** * Struct must have `key` and `store` abilities.
* Must include fields for stats (e.g., `hunger: u64`, `happiness: u64`, `level: u64`).


* [ ] **Define the Cosmetic (Child):** * Struct must have `key` and `store` abilities.
* Include a `category: String` (e.g., "hat", "shirt") to act as the "slot" identifier.



### 2. Implementation of Dynamic Object Fields (DOF)

* [ ] **Create the `equip_item` Function:**
* Use `sui::dynamic_object_field::add`.
* **Logic:** Use the cosmetic's `category` as the name for the dynamic field.
* **Constraint:** Implement a check to ensure a "hat" cannot be equipped if a "hat" field already exists.


* [ ] **Create the `unequip_item` Function:**
* Use `sui::dynamic_object_field::remove`.
* **Logic:** Take the `category` string as input, remove the object from the Panda, and `transfer::public_transfer` it back to the player.



### 3. Pet "Life" Logic (Pou Mechanics)

* [ ] **State Mutation:** Write functions to modify Panda stats (e.g., `feed(panda: &mut Panda)` reduces hunger).
* [ ] **Level Up System:** Implement logic where certain actions increase XP, and hitting a threshold updates the `level` field.

### 4. Sui Display Standard (Front-end Rendering)

* [ ] **Initialize Display:** Use the `sui::display` module to set up metadata for wallets.
* [ ] **Dynamic URL Template:** Define a URL template that front-ends can use to render the Panda, potentially utilizing the Panda's ID or level in the URL string.

---

## 📂 Reference Repositories

Tell your developer to study these specific implementations on GitHub:

1. **[SuiFrens](https://www.google.com/search?q=https://github.com/MystenLabs/sui/tree/main/examples/move/dynamic_fields):** This is the "official" version of what you are building (pets with accessories).
2. **[Sui Hero Example](https://www.google.com/search?q=https://github.com/MystenLabs/sui/tree/main/examples/move/hero):** Shows how a character (Hero) can "pick up" and "equip" an inventory item (Sword).

**Would you like me to draft a sample `Move.toml` file with the necessary dependencies for this project?**