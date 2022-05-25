import { ethers } from "ethers";
import { useState } from "react";
import NFTabi from '../utils/NFTMarketplace.json';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import './CreateItem.css'
import { useNavigate } from 'react-router-dom';
import { Loader } from "./Loader";


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateItem = () => {

    const NFTcontractdeployAddress = "0xf6beee18703b4F4d3aCc399E5c501447AD9e4A8F";

    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const [isLoading, setIsLoading] = useState(false);
    const [isImageloaded, setisImageLoaded] = useState(false)
    const routerBrowser = useNavigate();


    async function onChange(e) {
        const file = e.target.files[0]
        console.log('imaageFile', file);
        var yourImg = document.getElementById('ImageId');
        if (yourImg && yourImg.style) {
            yourImg.style.height = '100px';
            yourImg.style.width = '200px';
        }
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
            console.log("uurrll : ", url);
        } catch (error) {
            alert("Something Went Wrong!!", error)

            console.log('Error uploading file: ', error)
        }
    }


    async function uploadToIPFS() {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return
        /* first, upload to IPFS */

        console.log(isLoading)
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            /* after file is uploaded to IPFS, return the URL to use it in the transaction */
            console.log('uuuuuu', url);
            return url
        } catch (error) {
            alert("Something Went Wrong!!", error)
            console.log('Error uploading file: ', error)

        }
    }


    async function listNFTForSale() {
        try {
            setIsLoading(true)
            console.log(isLoading)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();


            /* next, create the item */
            const price = ethers.utils.parseUnits(formInput.price, 'ether')
            const contract = new ethers.Contract(
                NFTcontractdeployAddress,
                NFTabi.abi,
                signer
            );
            let listingPrice = await contract.getListingPrice()
            listingPrice = listingPrice.toString()
            console.log("listingprice", listingPrice);
            const url = await uploadToIPFS()
            console.log("url : ", url);

            let transaction = await contract.createToken(url, price, { value: listingPrice })

            console.log(("transcation", transaction));
            const response = await transaction.wait()
            console.log("Transcation Complete", response);
            setIsLoading(false)
            routerBrowser('/')
        }
        catch (error) {
            alert("Something Went Wrong!!   refer console For More details")
            console.log('Error uploading file: ', error)
            setIsLoading(false)
        }

        // navigate.push("/profile");
    }
    const handleImageLoaded = () => {
        console.log("imagre ;loaded");
        setisImageLoaded(true)
    }

    return (
        <>
            {isLoading ? <Loader /> :
                <div className="createItem-outside">
                    <div className="createItem-container">
                        <input
                            placeholder="Asset Name"
                            className="input-box"
                            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                        />
                        <textarea
                            placeholder="Asset Description"
                            className="input-box"
                            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                        />
                        <input
                            placeholder="Asset Price in Eth"
                            className="input-box"
                            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                        />
                        <input
                            type="file"
                            name="Asset"
                            className="input-box"
                            onChange={onChange}
                        />
                        {
                            fileUrl && (
                                <img className="upload-img" id="ImageId" alt='upload image preview' width="50px" src={fileUrl} onLoad={handleImageLoaded} />
                            )
                        }
                        <button onClick={listNFTForSale} className="createNft-btn" disabled={fileUrl && isImageloaded ? false : true}>
                            {isImageloaded ? "Create NFT" : 'Loading....'}
                        </button>
                    </div>
                </div>}
        </>
    )

}

export default CreateItem;