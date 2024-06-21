import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { DiscordIcon } from "@/components/icons";
import { LucideLinkedin } from "lucide-react";
import Web3 from "web3";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { useState } from "react";
import { usePeepsContext } from "../context";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function VerifyIdentity() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const web3 = new Web3()
  const { verified, setVerified } = usePeepsContext()

  const discordVerify = async () => {


    try {
      const appid = "c507e55f-4ff0-40fd-b823-e7126c6035d5"

      // Create the connector instance
      const connector = new TransgateConnect(appid)

      // Check if the TransGate extension is installed
      // If it returns false, please prompt to install it from chrome web store
      const isAvailable = await connector.isTransgateAvailable()

      if (isAvailable) {
        // The schema id of the project
        const schemaId = "e9946f5ec15143caa62c57a7e15d4e9d"
        // const schemaId = "516a720e-29a4-4307-ae7b-5aec286e446e"

        // Launch the process of verification
        // This method can be invoked in a loop when dealing with multiple schemas
        const { taskId, validatorAddress, allocatorSignature, uHash, publicFieldsHash, recipient, validatorSignature } = await (connector?.launch(schemaId) as unknown as any);
        const taskIdHex = Web3.utils.stringToHex(taskId)
        const schemaIdHex = Web3.utils.stringToHex(schemaId)

        const encodeParams = web3.eth.abi.encodeParameters(
          ["bytes32", "bytes32", "address"],
          [taskIdHex, schemaIdHex, validatorAddress]
        );
        const paramsHash = Web3.utils.soliditySha3(encodeParams);

        const signedAllocatorAddress = web3.eth.accounts.recover(paramsHash!, allocatorSignature);

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

        const signedValidatorAddress = web3.eth.accounts.recover(paramsHash1!, validatorSignature)

        console.log(signedValidatorAddress === validatorAddress)

        if (signedAllocatorAddress === "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d" && signedValidatorAddress === validatorAddress) {
          setVerified(!verified);
          toast.success("Identity verified successfully");
          toast("You can proceed create your profile");
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

  const linkedinVerify = async () => {


    try {
      const appid = "c507e55f-4ff0-40fd-b823-e7126c6035d5"

      // Create the connector instance
      const connector = new TransgateConnect(appid)

      // Check if the TransGate extension is installed
      // If it returns false, please prompt to install it from chrome web store
      const isAvailable = await connector.isTransgateAvailable()

      if (isAvailable) {
        // The schema id of the project
        const schemaId = "869aed6751ae4b75876f2cfe3ea8c39f"
        // const schemaId = "516a720e-29a4-4307-ae7b-5aec286e446e"

        // Launch the process of verification
        // This method can be invoked in a loop when dealing with multiple schemas
        const { taskId, validatorAddress, allocatorSignature, uHash, publicFieldsHash, recipient, validatorSignature } = await (connector.launch(schemaId) as unknown as any);
        const taskIdHex = Web3.utils.stringToHex(taskId)
        const schemaIdHex = Web3.utils.stringToHex(schemaId)

        const encodeParams = web3.eth.abi.encodeParameters(
          ["bytes32", "bytes32", "address"],
          [taskIdHex, schemaIdHex, validatorAddress]
        )
        const paramsHash = Web3.utils.soliditySha3(encodeParams)

        const signedAllocatorAddress = web3.eth.accounts.recover(paramsHash!, allocatorSignature)

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

        const signedValidatorAddress = web3.eth.accounts.recover(paramsHash1!, validatorSignature)

        console.log(signedValidatorAddress === validatorAddress)

        if (signedAllocatorAddress === "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d" && signedValidatorAddress === validatorAddress) {
          setVerified(!verified);
          toast.success("Identity verified successfully");
          toast("You can proceed create your profile");
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

  useEffect(() => { }, [verified])

  return (
    <>
      <Button onPress={onOpen}>Verify POH</Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 py-8">
                Verify your Proof of Humanity
              </ModalHeader>
              <ModalBody className="flex flex-col gap-y-8">
                <div className="flex flex-row items-center gap-x-8">
                  <Card className="group py-4 hover:bg-green-600/60 transition cursor-pointer">
                    <div className="" onClick={discordVerify}>
                      <CardBody className="items-center overflow-visible py-2">
                        <DiscordIcon size={96} className="text-indigo-500 group-hover:text-default-900 transition" />
                      </CardBody>
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                    <small className="text-default-500">12 Tracks</small> */}
                        <h4 className="font-bold text-large text-center">
                          Verify using Discord
                        </h4>
                      </CardHeader>
                    </div>
                  </Card>

                  <Card className="group py-4 hover:bg-green-600/60 transition cursor-pointer">
                    <div className="" onClick={linkedinVerify}>
                      <CardBody className="items-center overflow-visible py-2">
                        <LucideLinkedin size={96} className="text-blue-500 group-hover:text-default-900 transition" />
                      </CardBody>
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                    <small className="text-default-500">12 Tracks</small> */}
                        <h4 className="font-bold text-large text-center">
                          Verify using LinkedIn
                        </h4>
                      </CardHeader>
                    </div>
                  </Card>
                </div>
                <p className="italic text-center text-sm text-default-500 py-4">
                  Select either of the above for you <b>ZK</b> Proof of Humanity Check
                </p>
              </ModalBody>
              {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
