// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract GbeseArts is ERC721URIStorage, Ownable {
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
    
    // Constructor initializes the NFT contract with a name and symbol
    constructor() ERC721("Gbese Arts", "GBA") Ownable(msg.sender) {
        // Initialize with empty base URI and token ID starts at 0
        _currentTokenId = 0;
    }
    
   // Internal function to increment and get the next token ID
    function _getNextTokenId() private returns (uint256) {
        _currentTokenId++;
        return _currentTokenId;
    }
    
    // Set the token contract address
    function setTokenContract(address tokenAddress) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        gbeseTokenAddress = tokenAddress;
    }
    
    // Set the base URI for token metadata
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    // Override the base URI
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    // Mint a new NFT (admin function)
    function mintGbeseArt(address recipient, string calldata tokenURI) external onlyOwner returns (uint256) {
        uint256 newItemId = _getNextTokenId();
        
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        emit NFTMinted(recipient, newItemId, tokenURI);
        return newItemId;
    }
    
    // Purchase an NFT using Gbese tokens
    function purchaseNFT(string calldata tokenURI) external returns (uint256) {
        require(gbeseTokenAddress != address(0), "Token contract not set"); 
        IERC20 gbeseToken = IERC20(gbeseTokenAddress);
        
        // Check token balance
        require(gbeseToken.balanceOf(msg.sender) >= nftPriceInTokens, "Insufficient token balance");
        
        // Transfer tokens from buyer to this contract
        
        // Please Take note: User must approve this contract to spend their tokens first
        bool success = gbeseToken.transferFrom(msg.sender, address(this), nftPriceInTokens);
        require(success, "Token transfer failed");
        
        // Mint the NFT
        uint256 newItemId = _getNextTokenId();
        
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        emit NFTPurchased(msg.sender, newItemId);
        return newItemId;
    }
}