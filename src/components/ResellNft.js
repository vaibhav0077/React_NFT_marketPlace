import { ethers } from "ethers";
import { useEffect, useState } from "react";
import NFTabi from '../utils/NFTMarketplace.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateItem.css'
import { Loader } from "./Loader";


export default function ResellNFT() {
    const NFTcontractdeployAddress = "0xf6beee18703b4F4d3aCc399E5c501447AD9e4A8F";

    const [formInput, updateFormInput] = useState({ price: '', image: '' })
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let id = params.get('id');
    let tokenURI = params.get('tokenURI')
    const { image, price } = formInput
    const routerBrowser = useNavigate();

    const [isLoading, setisLoading] = useState(false)



    async function fetchNFT() {
        if (!tokenURI) return
        setisLoading(true)
        const meta = await axios.get(tokenURI)
        updateFormInput(state => ({ ...state, image: meta.data.image }))
        setisLoading(false)
    }

    async function listNFTForSale() {
        try {
            if (!price) return
            setisLoading(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(
                NFTcontractdeployAddress,
                NFTabi.abi,
                signer
            );

            let listingPrice = await contract.getListingPrice()
            const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
            listingPrice = listingPrice.toString()
            let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
            await transaction.wait()
            setisLoading(false)
            routerBrowser('/')
        }
        catch (error) {
            alert(`
                "Status":"${error.code}",
                "Argument":${error.value}

            `)
            setisLoading(false)
        }
    }
    useEffect(() => {
        fetchNFT()
    }, [id])

    return (
        <>
            {isLoading ? <Loader /> :
                <div className="createItem-outside">
                    <div className="createItem-container">
                        <input
                            placeholder="Enter Sell Price In ETH"
                            className="input-box"
                            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                        />
                        {
                            image && (
                                <img className="ImageId" width="350" alt="image error" src={image} />
                            )
                        }
                        <button onClick={listNFTForSale} className="createNft-btn">
                            List NFT
                        </button>
                    </div>
                </div>
            }
        </>

    )
}