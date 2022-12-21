import React, {useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Web3 from 'web3';
import {Form} from "react-bootstrap";
import SuccessModalComponent from "./SuccessModalComponent";
import ChooseOSContractBuild from '../contracts/ChooseOS.json';
import {setGlobalState, useGlobalState} from "../states/states";


export default function Home() {
    const [walletAddress, setWalletAddress] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [balanceInWallet, setBalanceInWallet] = useState("");
    const [transactionSucceded, setTransactionSucceded] = useState(false);
    const [chooseOSContract, setChooseOSContract] = useState({});
    const [devices, setDevices] = useState(["Windows", "IOS"]);
    const [choosedDeviceId, setChoosedDeviceId] = useState(0);
    const [choosedDeviceName, setChoosedDeviceName] = useState("");
    const [choosedDevicePrice, setChoosedDevicePrice] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const voteCountsIOS = useGlobalState("voteCountsIOS");
    const voteCountsWindows = useGlobalState("voteCountsWindows");

    async function importVoteCounts(chooseOSContract, devices) {
        for(let i=0; i < devices.length; i++) {
            setGlobalState(`voteCounts${devices[i].deviceName}`, await chooseOSContract.methods.getVoteCount(devices[i].deviceId).call());
        }

    }

    async function detectCurrentProvider() {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum
        } else if (window.web3) {
            provider = window.web3.currentProvider;
        } else {
            console.log("Non-Ethereum Browser detected. You should install MetaMask");
        }
        return provider;
    }

    async function onConnectAccount() {
        try {
            const currentProvider = await detectCurrentProvider();
            if (currentProvider) {
                await currentProvider.request({
                    method: "eth_requestAccounts",
                });
                const web3 = new Web3(currentProvider);
                const userAccount = await web3.eth.getAccounts();
                const account = userAccount[0];
                setWalletAddress(account);
                let ethBalance = await web3.eth.getBalance(account);
                let networkId = await web3.eth.net.getId();
                setBalanceInWallet(ethBalance);
                setIsConnected(true);
                let contractAddress = ChooseOSContractBuild.networks[networkId].address;
                const getChooseOSContract = await new web3.eth.Contract(ChooseOSContractBuild.abi, contractAddress);
                setChooseOSContract(getChooseOSContract);
                const devices = await getChooseOSContract.methods.getAllDevices().call();
                setDevices(devices);
                await importVoteCounts(getChooseOSContract, devices);
            }
        } catch (error) {
            console.log("Error Connecting...");
            console.error(error)
        }
    }

    async function buyDeviceTransaction(deviceId, price) {
        let sellerAddr = await chooseOSContract.methods.getSellerAddress().call();
        const deviceTransaction = await chooseOSContract.methods.buyDevice(deviceId).send({
            from: walletAddress,
            to: sellerAddr,
            value: price
        });
        setGlobalState(`voteCounts${choosedDeviceName}`, await chooseOSContract.methods.getVoteCount(deviceId).call());
        return deviceTransaction;
    }

    async function handleTransaction() {
        console.log("I've choosed: ", choosedDeviceId, " ", choosedDeviceName, " ", choosedDevicePrice);
        await buyDeviceTransaction(choosedDeviceId, choosedDevicePrice).then(tx => {
            setTransactionHash(tx['transactionHash']);
            setTransactionSucceded(true);
        }).catch(err => {
            console.log(err);
        });
    }

    function onDisconnect() {
        setIsConnected(false);
        setWalletAddress("");
        setBalanceInWallet("");
        setTransactionSucceded(false);
    }

    async function handleChoosedDevice(event, device) {
        event.persist();
        try {
            setChoosedDeviceId(device.deviceId);
            setChoosedDeviceName(device.deviceName);
            setChoosedDevicePrice(device.price);
        } catch (e) {
            console.log("Error, nothing is checked");
        }
    }

    function shortenEthView (inputPrice){
        return inputPrice/1000000000000000000;
    }

    useEffect(() => {
    }, [devices])

    return (
        <div className="main">
            {!isConnected ? (
                <div><Button class="btn btn-primary" onClick={onConnectAccount}>Request Account</Button></div>
            ) : (
                <div>
                    <p>Your Walletaddress: {walletAddress}</p>
                    <p id="account-address">Your Balance: {shortenEthView(balanceInWallet)} ETH</p>
                    <Form>
                        <Row >
                            {devices.map((device, key) => {
                                return (
                                    <Col>
                                        <div className="device ios">
                                            <Form.Check name="chooseDeviceRadio" inline type="radio"
                                                        label={device.deviceName}
                                                        onClick={(event) => handleChoosedDevice(event, device)}
                                                        id="chooseDeviceRadio"
                                                        disabled={transactionSucceded}/>
                                            <p className="Price">Price: {shortenEthView(device.price)} ETH</p>
                                            {device.deviceName === "IOS" && <p className="voteCount">{voteCountsIOS}</p>}
                                            {device.deviceName === "Windows" && <p className="voteCount">{voteCountsWindows}</p>}
                                        </div>
                                    </Col>
                                )
                            })}

                        </Row>
                        {!transactionSucceded ? (
                            <Button className="btn btn-primary text-white mt-3" variant="outline-success"
                                    onClick={handleTransaction}>Choose</Button>) : (
                            <SuccessModalComponent statusInput={true} transactionHash={transactionHash} deviceName={choosedDeviceName}/>)}
                    </Form>
                    <Button className="btn btn-primary mt-3" onClick={onDisconnect}>Logout</Button>
                </div>)}
        </div>

    )
}
