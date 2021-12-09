// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 totalSupply = 0;
    uint256 maxSupply = 50;

    string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green", "cornflowerblue", "orange"];


    string[] firstWords = ["aries", "leo", "sagittarius", "taurus", "virgo", 
    "capricorn", "libra", "aquarius", "cancer", "scorpio", "pisces"];
    string[] secondWords = ["aries", "leo", "sagittarius", "taurus", "virgo", 
    "capricorn", "libra", "aquarius", "cancer", "scorpio", "pisces"];
    string[] thirdWords = ["aries", "leo", "sagittarius", "taurus", "virgo", 
    "capricorn", "libra", "aquarius", "cancer", "scorpio", "pisces"];

    event NewNFTMinted(address sender, uint256 tokenId);

    
    constructor() ERC721 ("ZodiacNFT", "ZODIAC") {
        console.log("Contract initialized");
    }
    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
      // I seed the random generator. More on this in the lesson. 
      uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
      // Squash the # between 0 and the length of the array to avoid going out of bounds.
      rand = rand % firstWords.length;
      return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
      uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
      rand = rand % secondWords.length;
      return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
      uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
      rand = rand % thirdWords.length;
      return thirdWords[rand];
    }
    
    function pickRandomColor(uint256 tokenId) public view returns (string memory) {
      uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
      rand = rand % colors.length;
      return colors[rand];
    }
    
    function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
    }

    function getTotalNFTsMinted() external view returns (uint256) {
     return _tokenIds.current();
    } 

    function makeNFT() public {
      uint256 newItemId = _tokenIds.current();
      require(newItemId <= maxSupply, "Maximum mint reached");
      string memory first = pickRandomFirstWord(newItemId);
      string memory second = pickRandomSecondWord(newItemId);
      string memory third = pickRandomThirdWord(newItemId);
      string memory combinedWord = string(abi.encodePacked(first, second, third));
      string memory randomColor = pickRandomColor(newItemId);

      string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo,combinedWord, "</text></svg>"));

       // Get all the JSON metadata in place and base64 encode it.
      string memory json = Base64.encode(
          bytes(
              string(
                  abi.encodePacked(
                      '{"name": "',
                      // We set the title of our NFT as the generated word.
                      combinedWord,
                      '", "description": "Sun, Moon, Rising", "image": "data:image/svg+xml;base64,',
                      // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                      Base64.encode(bytes(finalSvg)),
                      '"}'
                  )
              )
          )
      );

      // Just like before, we prepend data:application/json;base64, to our data.
      string memory finalTokenUri = string(
          abi.encodePacked("data:application/json;base64,", json)
      );

      console.log("\n--------------------");
      console.log(finalTokenUri);
      console.log("--------------------\n");

      _safeMint(msg.sender, newItemId);
    
        // Update your URI!!!
      _setTokenURI(newItemId, finalTokenUri);
  
    
      _tokenIds.increment();
      console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
      emit NewNFTMinted(msg.sender, newItemId);
      totalSupply +=1;
    }
}