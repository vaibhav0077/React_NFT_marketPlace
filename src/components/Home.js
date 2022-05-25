import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NFTabi from '../utils/NFTMarketplace.json';
import axios from 'axios';
import './Home.css'
import { Loader } from "./Loader";
import Etherium from '../media/ethereum.svg'

const Home = () => {

    const NFTcontractdeployAddress = "0xf6beee18703b4F4d3aCc399E5c501447AD9e4A8F";

    const [nfts, setNfts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // const [test, setTest] = useState([]);

    // const testArray = [1, 2, 3, 4, 5]
    // setTest(() => { return testArray })

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
                const data = await contract.fetchMarketItems.call(function (err, res) {

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

                    setNfts(...nfts, item)
                    return item;
                }))
                setNfts(items);
                setIsLoading(false)

            }

            catch (error) {
                setIsLoading(false)
                alert(`
                    "Status":"${error.code}",
                    "Argument":${error.value}
                `)

            }
        }
    }

    async function buyNft(nft) {
        try {
            setIsLoading(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(
                NFTcontractdeployAddress,
                NFTabi.abi,
                signer
            );

            /* user will be prompted to pay the asking proces to complete the transaction */
            const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
            const transaction = await contract.createMarketSale(nft.tokenId, {
                value: price
            })
            await transaction.wait()
            getAllUnsoldNfts()
            setIsLoading(false)
        }
        catch (error) {
            alert(`
                "Status":"${error.code}",
                "Argument":${error.value}
                `)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAllUnsoldNfts();
    }, [])

    return (
        <>

            {isLoading ? <Loader /> :
                !nfts.length ? "No items Present in Store" :

                    <div className="">
                        <div className="" style={{ maxWidth: '1600px' }}>
                            <div className="NFT-container">
                                {
                                    nfts.map((nft, i) => (
                                        <div key={i} className="nft-card" id="imageId">
                                            <div className="img-div">
                                                <img src={nft.image} />
                                            </div>
                                            <div className="nft-Info">
                                                <p className="">{nft.name}</p>
                                                <p className="">{nft.description}</p>

                                            </div>
                                            <div className="nft-price-div">
                                                <p className="nft-price">Price :  {nft.price} ETH <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" preserveAspectRatio="xMidYMid" viewBox="0 0 256 417"><path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" /><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" /><path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" /><path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" /><path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z" /><path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z" /></svg></p>
                                                <div className="nft-price-buy-btn-div"><button className="nft-price-buy-btn" onClick={() => buyNft(nft)} >Buy</button></div>

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

export default Home;