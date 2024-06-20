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

export default function EditProfileModalForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    baseDappAddress,
    setHasProfile,
    pinFileToIPFS,
    userData,
    unPin,
    userIpfsHash,
    profileChanged,
    setProfileChanged,
  } = usePeepsContext();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const walletStatus = useActiveWalletConnectionStatus();
  const [dp, setDp] = useState<string>("");
  const [dpPreview, setDpPreview] = useState<string>("");
  const [bio, setBio] = useState<string>(userData?.bio);
  const [displayName, setDisplayName] = useState<string>(userData?.displayName);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const profileFormCloseButton = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [disableSave, setDisableSave] = React.useState(true);

  const defaultImage: string = "";

  const profileImageRef = useRef(null);

  const wait = (milliseconds: any) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  const editProfile = async (imgUrl: string = "") => {
    try {
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 0,
        },
        pinataMetadata: {
          name: "PEEPS_USER",
          keyvalues: {
            addr: `${address}`,
            username: userData.username,
          },
        },
        pinataContent: {
          username: userData.username,
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
        toast.success("Profile edited");
        setOpen(false);
        setHasProfile(true);
        await wait(800);
        setProfileChanged(!profileChanged);
      }
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
      toast.error("Profile not edited");
    }
  };

  const handleEditProfile = async () => {
    // if (isConnected) {
    if (walletStatus === "connected") {
      // Creating userProfile
      const unpinRes = await unPin(userIpfsHash);
      if (unpinRes) {
        try {
          if (dp == "") {
            await editProfile(userData.profilePicture);
          } else {
            const imgUploadRes = await pinFileToIPFS(dp);
            await wait(600);
            if (imgUploadRes.uploaded) {
              setDp("");
              await editProfile(
                imgUploadRes.uploaded ? imgUploadRes.image : ""
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
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

  useEffect(() => {
    if (
      dpPreview != "" ||
      displayName != userData?.displayName ||
      bio != userData?.bio
    ) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  }, [dp, displayName, bio]);

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
                Update your Profile
              </ModalHeader>
              <ModalBody>
                <div className={"relative inline-block"}>
                  <div className="flex flex-col items-center">
                    {dpPreview ? (
                      //   <AvatarProfile src={dpPreview} />
                      <Avatar
                        src={dpPreview}
                        className="w-20 h-20 text-large"
                      />
                    ) : (
                      //   <AvatarProfile
                      //     src={
                      //       userData?.profilePicture == ""
                      //         ? defaultImage
                      //         : userData?.profilePicture
                      //     }
                      //   />
                      <Avatar
                        src={
                          userData?.profilePicture == ""
                            ? defaultImage
                            : userData?.profilePicture
                        }
                        className="w-20 h-20 text-large"
                      />
                    )}
                    {/* <div
                    className="w-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2"
                    ref={profileImageRef}
                  >
                    <Image
                      width={100}
                      height={100}
                      alt=""
                      src={
                        userData.profilePicture == ""
                          ? defaultImage
                          : userData.profilePicture
                      }
                      className="bg-base-300"
                    />
                  </div> */}
                  </div>
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
                <label
                  htmlFor={"id-avatar-dp"}
                  title="Select dp"
                  className="btn btn-sm my-4"
                >
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<CameraIcon />}
                  >
                    Select display picture
                  </Button>
                  {/* <CameraIcon />
                  Select display picture */}
                  <input
                    type="file"
                    name=""
                    id="id-avatar-dp"
                    className="hidden"
                    onChange={handleTriggerDpChange}
                    ref={profileImageRef}
                  />
                </label>
                <Input
                  autoFocus
                  label="Display name"
                  placeholder="e.g., Blessed07.eth"
                />
                {/* <Input
                  endContent={
                    <LucideMail className="text-lg text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                /> */}
                <Textarea
                  label="About yourself"
                  placeholder="Tell the world something about yourself"
                  className=""
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
                <Button color="primary" onPress={onClose}>
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
