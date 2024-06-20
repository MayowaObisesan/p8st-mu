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
import classNames from "classnames";
import { PostBody, PostContainer, PostUser } from "./Posts";

interface ICommentModal {
  postUuid: number;
  message: string;
  upload: string;
  postData: any;
  postMetaData: any;
}

export default function CommentFormModal({
  postUuid,
  message,
  upload,
  postData,
  postMetaData,
}: ICommentModal) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { userData, setRefreshPost, refreshPost } = usePeepsContext();
  const walletStatus = useActiveWalletConnectionStatus();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [commentsUpdate, setCommentsUpdate] = useState(postData.post_comments);
  const [open, setOpen] = React.useState(false);

  const unPin = async (postMetaData: any) => {
    try {
      const res = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${postMetaData.ipfs_pin_hash}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      toast.success("unpinning successful");
      return true;
    } catch (error) {
      console.log(error);
      toast.success("unpinning failed");
      return false;
    }
  };

  const pinPost = async (postData: any, postMetaData: any, action: string) => {
    const likelist = postData?.post_likes;
    const post_creator = postMetaData.metadata?.keyvalues?.addr;
    const post_uuid = postMetaData.metadata?.keyvalues?.uuid;
    const username = postData?.post_username;
    const userDp = postData?.post_user_dp;
    const displayName = postData?.displayName;
    const postContent = postData?.post_content;
    const postMedia = postData?.post_media;
    const commentList = postData?.post_comments;
    const repeepList = postData?.post_repeeps;
    const createdAt = postData?.createdAt;
    try {
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 0,
        },
        pinataMetadata: {
          name: "PEEPS_POSTS",
          keyvalues: {
            addr: `${post_creator}`,
            uuid: `${post_uuid}`,
          },
        },
        pinataContent: {
          post_username: username,
          post_user_dp: userDp,
          post_displayName: displayName,
          post_content: postContent,
          post_media: postMedia,
          post_comments:
            action == "comment"
              ? commentList + 1
              : action == "uncomment"
              ? commentList - 1
              : commentList,
          post_repeeps:
            action == "repeep"
              ? repeepList + 1
              : action == "unrepeep"
              ? repeepList - 1
              : repeepList,
          post_likes:
            action == "like"
              ? likelist + 1
              : action == "unlike"
              ? likelist - 1
              : likelist,
          createdAt: createdAt,
        },
      });

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
        toast.success("Repinning successful");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      toast.error("Repinning failed");
    }
  };

  const wait = (milliseconds: any) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };

  const handleCreateComment = async () => {
    if (walletStatus === "connected") {
      setIsSubmit(true);
      //unpin from ipfs
      const unPinRes = await unPin(postMetaData);

      if (unPinRes) {
        try {
          const data = JSON.stringify({
            pinataOptions: {
              cidVersion: 0,
            },
            pinataMetadata: {
              name: "PEEPS_COMMENT",
              keyvalues: {
                addr: `${address}`,
                parent_post_uuid: `${postMetaData.metadata?.keyvalues?.uuid}`,
              },
            },
            pinataContent: {
              post_username: userData?.username,
              post_content: commentText,
              post_media: "",
              post_comments: 0,
              post_repeeps: 0,
              post_likes: 0,
              createdAt: new Date(),
            },
          });
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
            const pinRes = await pinPost(postData, postMetaData, "comment");
            if (pinRes.IpfsHash) {
              setIsSubmit(false);
              toast.success(`commented successful`);
              setOpen(false);
              await wait(300);
              setRefreshPost(!refreshPost);
            }
          }
        } catch (error) {
          console.log(error);
          setIsSubmit(false);
          toast.error(`Unable to post comment`);
        }
        // Then repin on ipfs

        // Update the comments count - clientSide
        setCommentsUpdate(postData.post_comments + 1);
      } else {
        toast.error(
          "Something went wrong at our end. We are working to resolve it as we speak."
        );
        toast.error("Please try again in a few minutes.");
      }
    } else {
      // toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
  };

  return (
    <>
      {/* <Button onPress={onOpen} color="success" variant="flat">
        Edit Profile
      </Button> */}
      <Button onPress={onOpen} variant="light" radius="md">
        <span className="flex-shrink-0 inline-flex justify-center items-center lg:h-[48px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 mx-auto scale-75 lg:scale-100 dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200">
          <svg
            className={classNames("flex-shrink-0 w-5 h-5", {
              "text-primary": commentsUpdate > 0,
            })}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
          </svg>
        </span>
        <span
          className={classNames("text-xs", {
            "font-bold": commentsUpdate > 0,
          })}
        >
          {/*{postData?.post_comments > 0 ? postData?.post_comments : "Comment"}*/}
          {commentsUpdate > 0 ? commentsUpdate : "Comment"}
        </span>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent className="text-left">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 py-8">
                Comment on this post
              </ModalHeader>
              <ModalBody>
                <PostContainer>
                  <PostUser {...postData} />
                  <PostBody postMetaData={postMetaData}>{message}</PostBody>
                  {/* <PostActions postId={postData.id} /> */}
                </PostContainer>

                <Textarea
                  minRows={7}
                  autoFocus
                  label="Your comment"
                  placeholder="Write your comment here"
                  onChange={(e) => setCommentText(e.target.value)}
                  className=""
                />
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button> */}
                <Button
                  isLoading={isSubmit}
                  isDisabled={commentText === ""}
                  color="success"
                  onPress={onClose}
                  onClick={handleCreateComment}
                >
                  Send comment
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
