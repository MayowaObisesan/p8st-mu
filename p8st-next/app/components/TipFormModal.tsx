import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Textarea,
  Link,
} from "@nextui-org/react";
import {
  CameraIcon,
  LucideCoins,
  LucideHandCoins,
  LucideLock,
  LucideMail,
  LucideX,
} from "lucide-react";
import { AvatarProfile } from "./Avatar";
import { usePeepsContext } from "../context";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRollups } from "../useRollups";
import { erc20Address } from "../utils/constants";
import { ethers } from "ethers";

export default function TipFormModal({ address }: { address: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { baseDappAddress } = usePeepsContext();
  const rollups = useRollups(baseDappAddress);
  const activeAccount = useActiveAccount();
  const [dp, setDp] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [depositAddress, setDepositAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const transferErc20ToPortal = async () => {
    try {
      if (rollups && activeAccount) {
        const input_obj = {
          method: "erc20_transfer",
          args: {
            to: address,
            amount: `${ethers.utils.parseEther(`${transferAmount}`)}`,
            erc20: erc20Address,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.utils.toUtf8Bytes(data);
        await rollups.inputContract.addInput(baseDappAddress, payload);
        setIsModalOpen(false);
        toast.success("Transfer successful");
      }
    } catch (e) {
      console.log(e);
      setIsModalOpen(false);
      toast.error("Transfer failed");
    }
    // "Unload" the submit button
    setIsSubmit(false);
  };

  const handleSendToken = async (e: any) => {
    e.preventDefault();
    setIsSubmit(true);
    await transferErc20ToPortal();
  };

  return (
    <>
      {/* <Button onPress={onOpen} color="success" variant="flat">
        Edit Profile
      </Button> */}
      <Button
        onPress={onOpen}
        className={
          "absolute right-4 btn btn-sm md:btn-md btn-ghost rounded-box font-normal text-xs flex flex-row items-center lg:gap-x-3"
        }
        onClick={() => setIsModalOpen(true)}
      >
        <LucideHandCoins
          size={8}
          width={18}
          height={18}
          className={"text-xs"}
        />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent className="text-center">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 py-8">
                Tip User
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Address to send token"
                  placeholder="e.g., Blessed07.eth"
                  onChange={(e) => setDepositAddress(e.target.value)}
                  defaultValue={address}
                  readOnly
                  disabled
                  required
                />
                <Input
                  endContent={
                    <LucideCoins className="text-lg text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Amount to send"
                  placeholder="Amount"
                  variant="bordered"
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={isSubmit}
                  isDisabled={
                    transferAmount === 0 ||
                    !Number(transferAmount) ||
                    transferAmount.toString() === ""
                  }
                  color="success"
                  onPress={onClose}
                  onClick={handleSendToken}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
