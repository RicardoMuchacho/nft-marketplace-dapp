# 🌐 NFT Marketplace

A smart contract for creating and managing an NFT marketplace. It enables users to list, buy, and unlist NFTs while charging a 5% marketplace fee on each transaction. Built using Foundry and fully tested to ensure reliability and security.

---

## ✨ Key Features

| **Feature**        | **Description**                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| 5% Marketplace Fee | A 5% fee is charged when buying lsited NFTs, ensuring the sustainability and growth of the marketplace. |
| Security Measures  | Proper access control ensures that only the seller can list or unlist their NFTs and only the owner can withdraw fees                  |                     |
| Fully Tested       | The contract is fully tested using Foundry to ensure security and functionality.                    |

---

## 📊 Contract Overview

### `Marketplace.sol`

This contract defines the core functionality of the NFT marketplace

| **Function**                                                     | **Description**                                                                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `constructor()`                                                  | Initializes the contract. |
| `listNFT(address nftAddress_, uint256 tokenId_, uint256 price_)` | Allows a seller to list their NFT for sale at a specific price.                                                          |
| `unlistNFT(address nftAddress_, uint256 tokenId_)`               | Allows the seller to unlist their NFT from the marketplace.                                                              |
| `buyNFT(address nftAddress_, uint256 tokenId_)`                  | Allows a buyer to purchase an NFT, deducting the 5% marketplace fee and transferring the remaining amount to the seller. |
| `withdrawFees()`                                                 | Allows the contract owner to withdraw the accumulated fees.                                                              |

---

## 🛠️ Installation

To interact with the contract, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/nft-marketplace.git
   cd nft-marketplace
   ```

2. **Install Dependencies:**

   Ensure you have Foundry installed. If not, you can follow the [Foundry installation guide](https://book.getfoundry.sh/).

3. **Compile the Contract:**

   ```bash
   forge build
   ```

4. **Run Tests:**

   The contract is fully tested with Foundry. To run the tests, use the following command:

   ```bash
   forge test
   ```

---
