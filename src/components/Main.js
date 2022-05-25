import { useEffect, useState } from "react";
import "./Main.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
import Home from "./Home";
import CreateItem from "./CreateItems";
import MyAssest from "./MyAssest";
import CreatorDashboard from "./CreatorDashboard";
import ResellNFT from "./ResellNft";



const Main = () => {

    const [isWalletConnected, setisWalletConnected] = useState(false);

    const walletConnected = async () => {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const obj = {
                    status: "👆🏽 Write a message in the text-field above.",
                    address: addressArray[0],
                };
                setisWalletConnected(true)
                return obj;
            } catch (err) {
                console.log("ERROR :", err);
            }
        }
        else {
            console.log("ERROR  : DOWNLOAD METAMASK FOR ACCESS THIS WEBSITE");
        }
    }

    useEffect(() => {
        walletConnected();
    }, [])


    return (
        <>
            {isWalletConnected ?
                <div className='container'>
                    <Router>
                        <Navbar />
                        <Routes>
                            <Route path='/' exact element={<Home />} ></Route>
                            <Route path='/Creatordashboard' element={<CreatorDashboard />} ></Route>
                            <Route path='/sellDigitAsset' element={<CreateItem />} />
                            <Route path='/MyDigitalAsset' element={<MyAssest />} />
                            <Route path='/resell-nft' element={<ResellNFT />} />

                        </Routes>
                    </Router>
                </div> :

                <div className='connect-btn-div'><button className='wallet-connect-btn' onClick={walletConnected}>Connect Wallet</button></div>}

        </>
    )
}



export default Main;