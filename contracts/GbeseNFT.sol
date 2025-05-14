// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GbeseNFT
 * @dev NFT contract that allows minting NFTs in exchange for GbeseTokens
 */
contract GbeseNFT is ERC721URIStorage, Ownable {
    // Token ID counter (replaced Counters.Counter with a simple uint256)
    uint256 private _currentTokenId;
    
    // Address of the Gbese ERC20 token contract
    address public gbeseTokenAddress;
    
    // NFT price in tokens (e.g., 100 tokens = 1 NFT)
    uint256 public nftPriceInTokens = 100 * 10**18; // 100 tokens with 18 decimals
    
    // Base URI for token metadata
    string private _baseTokenURI;
    
    // Event declarations
    event NFTMinted(address indexed recipient, uint256 tokenId, string tokenURI);
    event NFTPurchased(address indexed buyer, uint256 tokenId);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    
    /**
     * @dev Constructor initializes the NFT contract with a name and symbol
     * @param initialOwner Address who will be the owner of this contract
     */
    constructor(address initialOwner) ERC721("Gbese NFT", "GBESENFT") Ownable(initialOwner) {
        // Initialize with empty base URI and token ID starts at 0
        _currentTokenId = 0;
    }
    
    /**
     * @dev Internal function to increment and get the next token ID
     * @return The next token ID
     */
    function _getNextTokenId() private returns (uint256) {
        _currentTokenId++;
        return _currentTokenId;
    }
    
    /**
     * @dev Set the token contract address
     * @param tokenAddress Address of the Gbese ERC20 token contract
     */
    function setTokenContract(address tokenAddress) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        gbeseTokenAddress = tokenAddress;
    }
    
    /**
     * @dev Set the base URI for token metadata
     * @param baseURI The base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Override the base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Mint a new NFT (admin function)
     * @param recipient Address of the NFT recipient
     * @param tokenURI URI for the token metadata
     * @return The new token ID
     */
    function mintGbeseNFT(address recipient, string memory tokenURI)
        external
        onlyOwner
        returns (uint256)
    {
        uint256 newItemId = _getNextTokenId();
        
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        emit NFTMinted(recipient, newItemId, tokenURI);
        return newItemId;
    }
    
    /**
     * @dev Purchase an NFT using Gbese tokens
     * @param tokenURI URI for the token metadata
     * @return The new token ID
     */
    function purchaseNFT(string memory tokenURI) external returns (uint256) {
        require(gbeseTokenAddress != address(0), "Token contract not set");
        IERC20 gbeseToken = IERC20(gbeseTokenAddress);
        
        // Check token balance
        require(gbeseToken.balanceOf(msg.sender) >= nftPriceInTokens, "Insufficient token balance");
        
        // Transfer tokens from buyer to this contract
        // Please Take Note: User must approve this contract to spend their tokens first
        bool success = gbeseToken.transferFrom(msg.sender, address(this), nftPriceInTokens);
        require(success, "Token transfer failed");
        
        // Mint the NFT
        uint256 newItemId = _getNextTokenId();
        
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        emit NFTPurchased(msg.sender, newItemId);
        return newItemId;
    }
    
    /**
     * @dev Batch mint NFTs for a user who has enough tokens
     * @param recipient Address to receive NFTs
     * @param count Number of NFTs to mint
     * @param baseTokenURI Base URI for the tokens (will append token ID)
     * @return Array of minted token IDs
     */
    function batchPurchaseNFTs(address recipient, uint256 count, string memory baseTokenURI) 
        external 
        returns (uint256[] memory) 
    {
        require(gbeseTokenAddress != address(0), "Token contract not set");
        require(count > 0, "Count must be greater than zero");
        
        IERC20 gbeseToken = IERC20(gbeseTokenAddress);
        uint256 totalCost = nftPriceInTokens * count;
        
        // Check token balance
        require(gbeseToken.balanceOf(msg.sender) >= totalCost, "Insufficient token balance");
        
        // Transfer all tokens at once
        bool success = gbeseToken.transferFrom(msg.sender, address(this), totalCost);
        require(success, "Token transfer failed");
        
        // Mint all NFTs
        uint256[] memory tokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            uint256 newItemId = _getNextTokenId();
            tokenIds[i] = newItemId;
            
            _mint(recipient, newItemId);
            
            // Create unique token URI by appending token ID to base URI
            string memory tokenURI = string(abi.encodePacked(baseTokenURI, _toString(newItemId)));
            _setTokenURI(newItemId, tokenURI);
            
            emit NFTPurchased(recipient, newItemId);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Set the price of an NFT in tokens
     * @param newPrice New NFT price in tokens
     */
    function setNFTPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than zero");
        uint256 oldPrice = nftPriceInTokens;
        nftPriceInTokens = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
    }
    
    /**
     * @dev Withdraw tokens from the contract
     * @param to Address to send tokens to
     * @param amount Amount of tokens to withdraw
     */
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(gbeseTokenAddress != address(0), "Token contract not set");
        IERC20 gbeseToken = IERC20(gbeseTokenAddress);
        require(gbeseToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        
        bool success = gbeseToken.transfer(to, amount);
        require(success, "Token transfer failed");
    }
    
    /**
     * @dev Convert uint256 to string
     * @param value The uint256 value to convert
     * @return The string representation
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        // This function handles the conversion of a uint to a string
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
    
    /**
     * @dev Get the total number of NFTs minted
     * @return The current token ID counter value
     */
    function totalSupply() external view returns (uint256) {
        return _currentTokenId;
    }
}