import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NFTabi from '../utils/NFTMarketplace.json';
import axios from 'axios';
import './Home.css'
import { Loader } from "./Loader";



const CreatorDashboard = () => {

    const NFTcontractdeployAddress = "0xf6beee18703b4F4d3aCc399E5c501447AD9e4A8F";

    const [nfts, setNfts] = useState([]);
    const [sold, setSold] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const loadNfts = async () => {
        if (window.ethereum) {
            setIsLoading(true);
            try {
                // const provider = new ethers.providers.JsonRpcProvider();
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const contract = new ethers.Contract(
                    NFTcontractdeployAddress,
                    NFTabi.abi,
                    signer
                );

                const data = await contract.fetchItemsListed.call(function (err, res) {

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

                    }

                    // setNfts(...nfts, item)
                    return item;
                }))

                const soldItems = items.filter(i => i.sold)
                setSold(soldItems)
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

    useEffect(() => {
        loadNfts()
    }, [])


    return (
        <>
            {isLoading ? <Loader /> :
                <div>
                    <div className="">
                        <h2 className="" style={{ color: "#fff" }}>Items Listed</h2>
                        <div className="NFT-container">
                            {
                                nfts.map((nft, i) => (
                                    <div key={i} className="nft-card">
                                        <div className="img-div">
                                            <img src={nft.image} alt="Alternate Image" />
                                        </div>
                                        <div className="nft-Info">
                                            <p className="">{nft.name}</p>
                                            <p className="">{nft.description}</p>
                                            <p className="">Ethers : {nft.price}</p>

                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>}
        </>
    )

}


export default CreatorDashboard;