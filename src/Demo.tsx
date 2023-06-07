import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ethers } from "ethers";
import { useSigner, useProvider, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { SampleAbi } from "./constants/sample";
import "./App.css";

const Demo = () => {
  const { isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  // gnosisChiado address
  const SampleContractAddress = "0xCB8a3Ca479aa171aE895A5D2215A9115D261A566";

  const [output, setOutput] = useState("");
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setOutput("Wallet connected!");
    } else {
      setOutput("Welcome to Banana <> Rainbow Example");
    }
  }, [isConnected]);

  const getChainID = async () => {
    try {
      //@ts-ignore
      const chainId = await signer.getChainId();
      setOutput(JSON.stringify(chainId.toString()));
    } catch (e) {
      console.error(e);
    }
  };

  const getBalance = async () => {
    try {
      //@ts-ignore
      const account = await signer.getAddress();
      const balanceChk1 = await provider!.getBalance(account);
      setOutput(JSON.stringify(balanceChk1));
    } catch (e) {
      console.error(e);
    }
  };

  const getNetworks = async () => {
    try {
      const network = await provider!.getNetwork();
      setOutput(JSON.stringify(network));
    } catch (e) {
      console.error(e);
    }
  };

  const signMessage = async () => {
    try {
      setIsLoading(true);
      const message = "Welcome to Banana Wallet";

      //@ts-ignore
      const sig = await signer.signBananaMessage(message);
      setOutput(JSON.stringify(sig));
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  const sendETH = async () => {
    try {
      setIsLoading(true);
      //@ts-ignore
      const toAddress = ethers.Wallet.createRandom().address;

      const tx1 = {
        gasLimit: "0x55555",
        to: toAddress,
        value: ethers.utils.parseEther("0.000001"),
        data: "0x",
      };

      //@ts-ignore
      const txnResp = await signer.sendTransaction(tx1);
      setOutput(JSON.stringify(txnResp));
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  const stakeTxn = async () => {
    try {
      setIsLoading(true);
      const amount = "0.00001";

      const tx = {
        gasLimit: "0x55555",
        to: SampleContractAddress,
        value: ethers.utils.parseEther(amount),
        data: new ethers.utils.Interface(SampleAbi).encodeFunctionData(
          "stake",
          []
        ),
      };

      //@ts-ignore
      const txn = await signer.sendTransaction(tx);
      setOutput(JSON.stringify(txn));
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const getWalletActions = () => {
    if (!isConnected) {
      return null;
    }
    return (
      <>
        <button className="action-btn" onClick={() => getChainID()}>
          ChainID
        </button>

        <button className="action-btn" onClick={() => getNetworks()}>
          Networks
        </button>

        <button className="action-btn" onClick={() => getBalance()}>
          Get Balance
        </button>

        <button className="action-btn" onClick={() => signMessage()}>
          Sign Message
        </button>

        <button className="action-btn" onClick={() => sendETH()}>
          Send ETH
        </button>

        <button className="action-btn" onClick={() => stakeTxn()}>
          Stake txn
        </button>
      </>
    );
  };

  return (
    <div className="connect-div">
      <h1> Banana Rainbow Kit Plugin Example </h1>
      <ConnectButton />
      {getWalletActions()}
      <h1> Output </h1>
      <div className="output-div">
        <p>{loading ? "Loading..": output}</p>
      </div>
    </div>
  );
};

export default Demo;
