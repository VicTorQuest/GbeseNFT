// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GbeseNFT is ERC721URIStorage, Ownable {
   
   uint256 private _tokenIds;

   constructor(address initialOwner) ERC721("Gbese NFT", "GBESENFT") Ownable(initialOwner) {
    
   }


    function mintGbeseNFT(address recipient, string memory tokenURI)
        external
        onlyOwner
        returns (uint256)
    {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

}
