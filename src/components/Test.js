import { ethers } from "ethers";
import { useState } from "react";
// import SimpleMintContract from './utils/SimpleMintContract.json'
import SimpleMintContract from '../utils/SimpleMintContract.json'

const Test = () => {

    let allTranscation = [];

    const [allTranscationarray, setAllTranscationArray] = useState([]);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const obj = {
                    status: "👆🏽 Write a message in the text-field above.",
                    address: addressArray[0],
                };
                console.log(obj.address);
                // setIsConnected(true)
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                console.log(provider);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner()
                console.log(signer);

                const getBlockNumber = await provider.getBlockNumber()
                console.log(getBlockNumber);

                var balance = await provider.getBalance(obj.address)
                console.log("Balance : ", balance);

                const myAddress = obj.address

                balance = parseFloat(ethers.utils.formatEther(balance));
                console.log("Balance : ", balance);

                const contract = new ethers.Contract("0x53aF647C87b48Ef98B5A79f8deF3d6fA1466f486",
                    SimpleMintContract.abi,
                    provider);
                console.log("Contract", contract);

                console.log(contract.filters.Transfer(myAddress));

                let etherscanProvider = new ethers.providers.EtherscanProvider("rinkeby");

                allTranscation = await etherscanProvider.getHistory(myAddress)
                setAllTranscationArray([...allTranscationarray, allTranscation])
                console.log(allTranscation);
                // console.log(allTranscation.Promise);



                return obj;
            } catch (err) {
                console.log("ERROR :", err);
            }
        } else {
            console.log("ERROR  : DOWNLOAD METAMASK FOR ACCESS THIS WEBSITE");
        }
    }



    return (
        <>
            <div>
                {/* currentBlockChaniNum : {currentBlockChaniNum} */}
                <button onClick={connectWallet}>Connect</button>
                {allTranscationarray.map((transcation) => {
                    <div>{transcation}</div>
                })}
            </div>
        </>
    )
}



export default Test;