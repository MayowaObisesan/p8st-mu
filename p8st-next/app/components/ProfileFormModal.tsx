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
import { CameraIcon, LucideLock, LucideMail, LucideX } from "lucide-react";
import { AvatarProfile } from "./Avatar";
import { usePeepsContext } from "../context";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProfileFormModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const walletStatus = useActiveWalletConnectionStatus();
  const {
    baseDappAddress,
    setHasProfile,
    pinFileToIPFS,
    profileChanged,
    setProfileChanged,
    updateBaseUserData,
  } = usePeepsContext();
  //   const rollups = useRollups(baseDappAddress);
  const [dp, setDp] = useState<string>("");
  const [dpPreview, setDpPreview] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const profileFormCloseButton = useRef(null);
  const [open, setOpen] = React.useState(false);

  const wait = (milliseconds: any) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  const createProfile = async (imgUrl: string = "") => {
    try {
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 0,
        },
        pinataMetadata: {
          name: "PEEPS_USER",
          keyvalues: {
            addr: `${address}`,
            username: username,
          },
        },
        pinataContent: {
          username: username,
          wallet: `${address}`,
          displayName: displayName,
          profilePicture: imgUrl,
          bio: bio,
          following: 0,
          followers: 0,
          createdAt: new Date(),
        },
      });
      setIsSubmit(true);
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      if (res.data.IpfsHash) {
        setIsSubmit(false);
        toast.success("Profile created");
        setOpen(false);
        setHasProfile(true);
        await wait(800);
        setProfileChanged(!profileChanged);
        updateBaseUserData({
          username: username,
          wallet: `${address}`,
          displayName: displayName,
          profilePicture: imgUrl,
          bio: bio,
          following: 0,
          followers: 0,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
      toast.error("Profile not created");
    }
  };

  const handleCreateProfile = async () => {
    // if (isConnected) {
    if (walletStatus === "connected") {
      // Creating userProfile
      try {
        if (dp == "") {
          await createProfile();
        } else {
          const imgUploadRes = await pinFileToIPFS(dp);
          await wait(600);
          if (imgUploadRes.uploaded) {
            setDp("");
            await createProfile(
              imgUploadRes.uploaded ? imgUploadRes.image : ""
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
  };

  const handleTriggerDpChange = (event: any) => {
    const selectedImage = event.target.files[0];
    setDp(selectedImage);
    setDpPreview(URL.createObjectURL(selectedImage));
  };

  const removeProfileUpload = () => {
    setDp("");
    setDpPreview("");
  };

  return (
    <>
      <Button onPress={onOpen} color="success">
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent className="text-center">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 py-8">
                Create your Profile
              </ModalHeader>
              <ModalBody className="gap-y-4">
                <div className={"relative inline-block"}>
                  <div className="flex flex-col items-center">
                    <Avatar src={dpPreview} className="w-24 h-24 text-large" />
                    {dpPreview && (
                      <span
                        className={
                          "absolute -top-0 -right-0 btn btn-sm btn-circle btn-error"
                        }
                        onClick={removeProfileUpload}
                      >
                        <LucideX size={16} strokeWidth={4} />
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  color="success"
                  variant="flat"
                  startContent={<CameraIcon />}
                  className="flex flex-row justify-center w-auto mx-auto grow-0"
                >
                  <label
                    htmlFor={"id-avatar-dp"}
                    title="Select dp"
                    className="my-4 inline-block w-auto bg-orange-400"
                  >
                    Select display picture
                    <input
                      type="file"
                      name=""
                      id="id-avatar-dp"
                      className="hidden"
                      onChange={handleTriggerDpChange}
                    />
                  </label>
                </Button>
                <Input
                  autoFocus
                  label="Display name"
                  placeholder="e.g., Mayowa Obisesan"
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <Input
                  endContent={
                    <LucideMail className="text-lg text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Username"
                  placeholder="e.g., blessed07.eth"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Textarea
                  label="About yourself"
                  placeholder="Tell the world something about yourself"
                  className=""
                  onChange={(e) => setBio(e.target.value)}
                />
                {/* <Input
                  endContent={
                    <LucideLock className="text-lg text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                /> */}
                <div className="hidden flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Forgot password?
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button> */}
                <Button
                  isDisabled={(displayName && username) === ""}
                  color="success"
                  onPress={onClose}
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
