// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PandaNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => uint8) public pandaLevel;

    // Cosmetic struct mirip dengan Move
    struct Cosmetic {
        uint256 id;
        string category; // "hat", "shirt", dll
        string name;
        string description;
        string rarity; // "common", "rare", "legendary"
    }

    uint256 public nextCosmeticId;
    mapping(uint256 => Cosmetic) public cosmetics; // cosmeticId => Cosmetic
    // pandaId => category => cosmeticId (0 = none)
    mapping(uint256 => mapping(string => uint256)) public pandaCosmetics;

    // Events
    event CosmeticCreated(uint256 indexed cosmeticId, string category, string name, string rarity);
    event CosmeticEquipped(uint256 indexed pandaId, uint256 indexed cosmeticId, string category);
    event CosmeticUnequipped(uint256 indexed pandaId, string category);

    constructor() ERC721("PandaNFT", "PNFT") Ownable(msg.sender) {}

    // Anyone can mint their own Panda (similar to Move version)
    function mint(string memory _tokenURI) external {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        pandaLevel[tokenId] = 1;
        nextTokenId++;
    }

    // Fungsi membuat cosmetic baru
    function createCosmetic(
        string memory category,
        string memory name,
        string memory description,
        string memory rarity
    ) external onlyOwner returns (uint256) {
        uint256 cosmeticId = nextCosmeticId;
        cosmetics[cosmeticId] = Cosmetic({
            id: cosmeticId,
            category: category,
            name: name,
            description: description,
            rarity: rarity
        });
        nextCosmeticId++;
        emit CosmeticCreated(cosmeticId, category, name, rarity);
        return cosmeticId;
    }

    // Equip cosmetic ke panda
    function equipCosmetic(uint256 pandaId, uint256 cosmeticId) external {
        require(_isAuthorized(ownerOf(pandaId), msg.sender, pandaId), "Not owner nor approved");
        Cosmetic memory cosmetic = cosmetics[cosmeticId];
        require(bytes(cosmetic.category).length > 0, "Invalid cosmetic");
        // Cek slot sudah terisi?
        require(pandaCosmetics[pandaId][cosmetic.category] == 0, "Slot occupied");
        pandaCosmetics[pandaId][cosmetic.category] = cosmeticId;
        emit CosmeticEquipped(pandaId, cosmeticId, cosmetic.category);
    }

    // Unequip cosmetic dari panda
    function unequipCosmetic(uint256 pandaId, string memory category) external {
        require(_isAuthorized(ownerOf(pandaId), msg.sender, pandaId), "Not owner nor approved");
        require(pandaCosmetics[pandaId][category] != 0, "Slot not found");
        pandaCosmetics[pandaId][category] = 0;
        emit CosmeticUnequipped(pandaId, category);
    }

    function levelUp(uint256 tokenId) external {
        require(_isAuthorized(ownerOf(tokenId), msg.sender, tokenId), "Not owner nor approved");
        pandaLevel[tokenId] += 1;
    }

    // ===== View Functions =====

    // Get cosmetic details by ID
    function getCosmetic(uint256 cosmeticId) external view returns (
        uint256 id,
        string memory category,
        string memory name,
        string memory description,
        string memory rarity
    ) {
        Cosmetic memory c = cosmetics[cosmeticId];
        return (c.id, c.category, c.name, c.description, c.rarity);
    }

    // Get equipped cosmetic ID for a panda's category slot
    function getEquippedCosmetic(uint256 pandaId, string memory category) external view returns (uint256) {
        return pandaCosmetics[pandaId][category];
    }

    // Check if a category slot is occupied on a panda
    function isSlotOccupied(uint256 pandaId, string memory category) external view returns (bool) {
        return pandaCosmetics[pandaId][category] != 0;
    }

    // Get total number of pandas minted
    function getTotalPandas() external view returns (uint256) {
        return nextTokenId;
    }

    // Get total number of cosmetics created
    function getTotalCosmetics() external view returns (uint256) {
        return nextCosmeticId;
    }

    // ===== Override Functions (required for multiple inheritance) =====

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
