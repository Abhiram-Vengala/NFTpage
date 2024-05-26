// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract CoolNFT is ERC721 , ERC721URIStorage  {
    uint256 public mintPrice = 0.01 ether;
    uint256 public maxSupply = 10 ;
    uint256 public maxPerWallet = 2;
    uint256 public totalsupply ;

    mapping (address=>uint256) walletMints;

    constructor()ERC721("CoolNFT" , "CNK"){}

        function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(string memory _uri ) external payable  {
        require(totalsupply<maxSupply,"We are out of NFT's");
        require(walletMints[msg.sender]<maxPerWallet,"Exceed the max amount of NFT per wallet");
        require(msg.value>=mintPrice,"Insufficent amount of ether");

        totalsupply++;
        uint256 tokenId = totalsupply;
        walletMints[msg.sender]++;
        _safeMint(msg.sender,tokenId);
        _setTokenURI(tokenId,_uri);
    }
    function maxsupply()external view returns (uint256){
        return maxSupply;
    }
    function totalSupplied() external view returns(uint256){
        return maxSupply-totalsupply;
    }
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721 , ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}