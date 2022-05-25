import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NFTabi from '../utils/NFTMarketplace.json';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'
import { Loader } from "./Loader";



const MyAssest = () => {

    const NFTcontractdeployAddress = "0xf6beee18703b4F4d3aCc399E5c501447AD9e4A8F";

    const [nfts, setNfts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const routerHistory = useNavigate();

    const getAllUnsoldNfts = async () => {
        if (window.ethereum) {
            setIsLoading(true)
            try {
                // const provider = new ethers.providers.JsonRpcProvider();
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const contract = new ethers.Contract(
                    NFTcontractdeployAddress,
                    NFTabi.abi,
                    signer
                );

                // const data = await contract.fetchMarketItems()
                const data = await contract.fetchMyNFTs.call(function (err, res) {

                })
                const items = await Promise.all(data.map(async i => {

                    const tokenUri = await contract.tokenURI(i.tokenId)
                    const meta = await axios.get(tokenUri) //https://ifs...id
                    let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

                    let item = {
                        price,
                        tokenId: i.tokenId.toNumber(),
                        seller: i.seller,
                        owner: i.owner,
                        image: meta.data.image,
                        name: meta.data.name,
                        description: meta.data.description,
                        tokenURI: tokenUri

                    }
                    console.log(item);
                    // setNfts(...nfts, item)
                    return item;
                }))
                setNfts(items);
                setIsLoading(false);

            }

            catch (error) {
                alert("Something Went Wrong!!", error)
                console.log('Error uploading file: ', error)
                setIsLoading(false);

            }
        }
    }

    function listNFT(nft) {
        console.log('nft:', nft)
        routerHistory(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
    }

    useEffect(() => {
        getAllUnsoldNfts()
    }, [])


    return (
        <>
            <div>
                {isLoading ? <Loader /> :
                    !nfts.length ? "Yeu have No Item Purchase Yet" :
                        <div className="">
                            <div className="">
                                <div className="NFT-container">
                                    {
                                        nfts.map((nft, i) => (
                                            <div key={i} className="nft-card">
                                                <div className="img-div">
                                                    <img src={nft.image} />
                                                </div>
                                                <div className="nft-Info">
                                                    <p className="">{nft.name}</p>
                                                    <p className="">{nft.description}</p>

                                                </div>
                                                <div className="nft-price-div">
                                                    <p className="nft-price">price</p>
                                                    <p className="">{nft.price} ETH</p>
                                                    <p className="">{nft.description}</p>
                                                    <button className="nft-price-buy-btn" onClick={() => listNFT(nft)}>Sell NFT</button>

                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                }
            </div>
        </>
    )


}



export default MyAssest;