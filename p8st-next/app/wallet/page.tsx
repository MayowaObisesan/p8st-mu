"use client";

// import { useConnectWallet } from "@web3-onboard/react";
// import { FaCopy, FaWallet } from "react-icons/fa6";
import { shortenAddress } from "../utils";
import {
  LucideBitcoin,
  LucideCoins,
  LucideCopy,
  LucideWallet,
  LucideWallet2,
} from "lucide-react";
import {
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { usePeepsContext } from "../context";
import { getWalletBalance } from "thirdweb/wallets";
import { client } from "@/app/client";
import { memo, useEffect, useMemo, useState } from "react";
import { GetWalletBalanceResult } from "thirdweb/src/wallets/utils/getWalletBalance";
import { TransferTransaction } from "./components/transferTx";
import { WithDrawTransaction } from "./components/withdrawTx";
import { Balance } from "./balance";
import { FreeMintTransaction } from "./components/freeMint";
import Voucher from "./components/Voucher";
import { DepositTransaction } from "./components/depositTx";
import Home from "../home/baseLayout";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";
import { DiscordIcon } from "@/components/icons";
import TransgateConnect from "@zkpass/transgate-js-sdk";

const nftGrid = [
  {
    type: "sent",
    value: "0.0",
  },
  {
    type: "spent",
    value: "0.0",
  },
  {
    type: "received",
    value: "0.0",
  },
  {
    type: "received",
    value: "0.0",
  },
];

const Wallet = () => {
  const { walletBalance, verified, setVerified } = usePeepsContext();
  // const [{ wallet }] = useConnectWallet();
  const walletStatus = useActiveWalletConnectionStatus();
  const { activeAddress } = usePeepsContext();
  const connectedChain = useActiveWalletChain();
  // const balance = useMemo(() => Balance(), []);
  // const balance = Balance();
  // console.log("balance", balance);
  // console.log("Wallet balance", balance, walletBalance);
  const [transactionsGrid, setTransactionsGrid] = useState([
    {
      type: "Balance",
      value: walletBalance,
    },
    {
      type: "spent",
      value: "0.0",
    },
    {
      type: "received",
      value: "0.0",
    },
  ]);

  const coinbaseVerify = async () => {


    try {
      const appid = "c507e55f-4ff0-40fd-b823-e7126c6035d5"

      // Create the connector instance
      const connector = new TransgateConnect(appid)

      // Check if the TransGate extension is installed
      // If it returns false, please prompt to install it from chrome web store
      const isAvailable = await connector.isTransgateAvailable()

      if (isAvailable) {
        // The schema id of the project
        const schemaId = "2365cd8025794d3cb511a809ffcfdd2b"
        // const schemaId = "516a720e-29a4-4307-ae7b-5aec286e446e"

        // Launch the process of verification
        // This method can be invoked in a loop when dealing with multiple schemas
        const { taskId, validatorAddress, allocatorSignature, uHash, publicFieldsHash, recipient, validatorSignature } = await connector.launch(schemaId)
        const taskIdHex = Web3.utils.stringToHex(taskId)
        const schemaIdHex = Web3.utils.stringToHex(schemaId)

        const encodeParams = web3.eth.abi.encodeParameters(
          ["bytes32", "bytes32", "address"],
          [taskIdHex, schemaIdHex, validatorAddress]
        )
        const paramsHash = Web3.utils.soliditySha3(encodeParams)

        const signedAllocatorAddress = web3.eth.accounts.recover(paramsHash, allocatorSignature)

        console.log(signedAllocatorAddress === "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d")

        const types = ["bytes32", "bytes32", "bytes32", "bytes32"]
        const values = [taskIdHex, schemaIdHex, uHash, publicFieldsHash]

        //If you add the wallet address as the second parameter when launch the Transgate
        if (recipient) {
          types.push("address")
          values.push(recipient)
        }

        const encodeParams1 = web3.eth.abi.encodeParameters(types, values)

        const paramsHash1 = Web3.utils.soliditySha3(encodeParams1)

        const signedValidatorAddress = web3.eth.accounts.recover(paramsHash1, validatorSignature)

        console.log(signedValidatorAddress === validatorAddress)

        if (signedAllocatorAddress === "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d" && signedValidatorAddress === validatorAddress) {
          setVerified(!verified);
        }

        // verify the res onchain/offchain based on the requirement
        // return signedValidatorAddress === validatorAddress

      } else {
        console.log('Please install TransGate')
      }
    } catch (error) {
      console.log('transgate error', error)
    }
  }

  useEffect(() => {
    console.log("Wallet balance set transaction grid");
    setTransactionsGrid([
      {
        type: "Balance",
        value: walletBalance,
      },
      {
        type: "spent",
        value: "0.0",
      },
      {
        type: "received",
        value: "0.0",
      },
    ]);
  }, [walletBalance]);

  // useEffect(() => {
  //     if (connectedChain) {
  //         // walletBalance();
  //         console.log(balance)
  //     }
  // }, [connectedChain, activeAddress]);

  // async function walletBalance() {
  //     console.log("Fetching wallet balance");
  //     const _balance = await getWalletBalance({
  //         address: activeAddress,
  //         client,
  //         chain: connectedChain!,
  //     });
  //     console.log("wallet Balance", _balance);
  //     setBalance(_balance);
  // }

  // console.log(wallet?.accounts[0]);
  // console.log(wallet?.accounts[0].balance?.keys);

  if (walletStatus === "disconnected") {
    return (
      <section className="flex flex-row items-center justify-center hero min-h-96 card dark:bg-transparent">
        <div className="hero-content flex flex-col items-center text-center gap-y-8">
          <div>
            {/* - Bounce animation */}
            <LucideWallet size={48} className="text-default-500" />
          </div>
          <div>
            Unable to access wallet page.
            <br />
            Please Connect your wallet
          </div>
        </div>
      </section>
    );
  }

  return (
    <Home>
      <section>
        {/* This is the wallet page */}
        <section className="bg-base-300 lg:bg-base-200 rounded-xl lg:rounded-3xl px-4 pb-4">
          {verified ? <section className="relative flex flex-row px-2 py-12">
            <div className="flex-1">
              <div className="flex flex-row items-center px-2 lg:px-6 text-xl text-base-content/20">
                <span className="flex-1 flex flex-row items-center gap-4">
                  <LucideWallet /> Address:
                </span>
                <span className="btn rounded-box flex flex-row items-center gap-4 text-lg z-10">
                  <LucideCopy /> Copy
                </span>
              </div>
              <div className="text-5xl lg:text-6xl font-bold">
                {shortenAddress(activeAddress)}
              </div>
            </div>
            <div className="absolute top-0 right-0 flex-grow-0 self-end">
              <LucideWallet2
                size={144}
                className={"text-base-content/5 opacity-40 -ml-24"}
              />
            </div>
          </section> : <Card isFooterBlurred className="">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center"></CardHeader>
            <CardBody className="">
              <section className="relative flex flex-row px-2 py-24">
                <div className="flex-1">
                  <div className="flex flex-row items-center px-2 lg:px-6 text-xl text-base-content/20">
                    <span className="flex-1 flex flex-row items-center gap-4">
                      <LucideWallet /> Address:
                    </span>
                    <span className="btn rounded-box flex flex-row items-center gap-4 text-lg z-10">
                      <LucideCopy /> Copy
                    </span>
                  </div>
                  <div className="text-5xl lg:text-6xl font-bold">
                    {shortenAddress(activeAddress)}
                  </div>
                </div>
                <div className="absolute top-0 right-0 flex-grow-0 self-end">
                  <LucideWallet2
                    size={144}
                    className={"text-base-content/5 opacity-40 -ml-24"}
                  />
                </div>
              </section>

              {activeAddress && walletStatus === "connected" ? (
                <section className="flex flex-row flex-wrap justify-around lg:justify-start gap-2 lg:space-x-8 mb-4 *:flex-1 lg:*:flex-0">
                  {/* Financial Transactions */}
                  <DepositTransaction />
                  <TransferTransaction />
                  <WithDrawTransaction />
                  <FreeMintTransaction />
                </section>
              ) : (
                <section className="flex flex-row flex-wrap justify-around lg:justify-start gap-2 lg:space-x-8 mb-4">
                  <div className="skeleton min-w-40 h-16"></div>
                  <div className="skeleton min-w-40 h-16"></div>
                  <div className="skeleton min-w-40 h-16"></div>
                  <div className="skeleton min-w-40 h-16"></div>
                </section>
              )}
            </CardBody>
            <CardFooter className="hidden flex flex-col gap-y-2 h-[calc(100%_-_8px)] justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <Card className="group py-4 transition cursor-pointer">
                <CardBody className="items-center overflow-visible py-2">
                  <LucideCoins
                    size={96}
                    className="text-blue-800 group-hover:text-default-900 transition"
                  />
                </CardBody>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                  {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                    <small className="text-default-500">12 Tracks</small> */}
                  <h4 className="font-bold text-large text-center">
                    Coinbase Verification required
                  </h4>
                </CardHeader>
              </Card>
              <p className="text-tiny text-white/80">
                Verify your Proof of Finance using Coinbase
              </p>
              <div >
                <Button
                  className="text-tiny text-white bg-black/20"
                  variant="flat"
                  color="default"
                  radius="lg"
                  size="sm"
                >
                  <p onClick={coinbaseVerify}>Verify</p>
                </Button>
              </div>
            </CardFooter>
          </Card>}
          {activeAddress && walletStatus === "connected" && verified ? (
            <section className="flex flex-row flex-wrap justify-around lg:justify-start gap-2 lg:space-x-8 mb-4 *:flex-1 lg:*:flex-0">
              {/* Financial Transactions */}
              <DepositTransaction />
              <TransferTransaction />
              <WithDrawTransaction />
              <FreeMintTransaction />
            </section>
          ) : (
            <section className="flex flex-row flex-wrap justify-around lg:justify-start gap-2 lg:space-x-8 mb-4">
              <div className="skeleton min-w-40 h-16"></div>
              <div className="skeleton min-w-40 h-16"></div>
              <div className="skeleton min-w-40 h-16"></div>
              <div className="skeleton min-w-40 h-16"></div>
            </section>
          )}
        </section>
        <section className={"mt-16 px-2"}>
          <header className="font-medium text-xl text-base-content/60">
            Your Token details on Peeps
          </header>
          <section className={"grid grid-cols-3 gap-4 py-4"}>
            {transactionsGrid.map((eachTxGrid, index) => (
              <div key={index} className="stats shadow bg-base-200 lg:p-4">
                <div className="stat">
                  <div className="stat-title capitalize">{eachTxGrid.type}</div>
                  <div className="stat-value text-5xl">{eachTxGrid.value}</div>
                  {/* <div className="stat-desc">21% more than last month</div> */}
                </div>
              </div>
            ))}
          </section>
        </section>

        <section>
          <section className={"mt-16 lg:mt-28 px-4"}>
            <header className="font-medium text-xl text-base-content/60">
              Your Voucher History
            </header>
            <Voucher />
          </section>

          <section className={"mt-16 lg:mt-28 px-4"}>
            <header className="font-medium text-xl text-base-content/60">
              Your NFTs
            </header>
            <section
              className={"flex flex-row flex-nowrap gap-4 py-8 overflow-x-auto"}
            >
              {nftGrid.map((eachTxGrid, index) => (
                <div
                  key={index}
                  className="stats shadow bg-base-200 min-w-40 lg:p-4"
                >
                  <div className="stat">
                    <div className="stat-title capitalize">
                      {eachTxGrid.type}
                    </div>
                    <div className="stat-value text-5xl">
                      {eachTxGrid.value}
                    </div>
                    {/* <div className="stat-desc">21% more than last month</div> */}
                  </div>
                </div>
              ))}
            </section>
          </section>
        </section>

        {/* <section className={"mt-28 px-4"}>
                <header className="py-8 font-medium text-xl text-base-content/60">
                    Charts and Overview
                </header>
                <ChartTransaction />
            </section> */}
      </section>
    </Home>
  );
};

export default memo(Wallet);
