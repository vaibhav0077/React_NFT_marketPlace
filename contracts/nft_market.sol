// SPDX-License-Identifier: Unlicense
pragma solidity *0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleMintContract is ERC721, Ownable {
    uint256 public mintPrice = 0.0001 ether;
    uint256 public totalSupply;
    uint256 public maxSupply;
    bool public isMintEnabled;
    mapping(address => uint256) public mintedWallets;

    constructor() payable ERC721("Simple Mint", "SIMPLEMINT") {
        maxSupply = 2;
    }

    function _baseURI() internal pure override returns(string memory){
        return "https://gateway.pinata.cloud/ipfs/Qmf9dPbBm4cZUKcRFKpGZUjcV9EyTWbYUgWpzLRWHcmaCM/";
    }

    function toggleTsMintEnabled() external onlyOwner {
        isMintEnabled = !isMintEnabled;
    }

    function setMaxSupply(uint256 maxSupply_) external onlyOwner{
        maxSupply = maxSupply_;
    }

    function mint() external payable{
        require(isMintEnabled, "minting is not enabled");
        require(mintedWallets[msg.sender] < 1, "exceeds max per wallet");
        require(msg.value == mintPrice, "Wrong Value");
        require(maxSupply > totalSupply, "SOld Out");

        mintedWallets[msg.sender]++ ;
        totalSupply++;
        uint256 tokenId = totalSupply;
        _safeMint(msg.sender, tokenId); // come from ERC721 Contract
        // _setTokenURI(tokenId, tokenURI); //  method we use to store an item’s metadata

        
    }
}
