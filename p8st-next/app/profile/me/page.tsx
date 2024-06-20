"use client";

import {
  PostActionsContainer,
  PostBody,
  PostContainer,
  PostUser,
} from "../../components/Posts";
import React, { useEffect, useState } from "react";
import { usePeepsContext } from "../../context";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { EditProfileForm } from "../../components/EditProfileForm";
import { Avatar, NoProfileCard } from "../../components/UserLeft";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import Home from "@/app/home/baseLayout";
import {
  Avatar as NAvatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Tabs,
  Tab as NTab,
} from "@nextui-org/react";
import NextImage from "next/image";
import EditProfileModalForm from "@/app/components/EditProfileModal";
import { LucideWifiOff } from "lucide-react";

const Profile = ({ params }: { params: any }) => {
  const {
    activeAddress,
    userData,
    userIpfsHash,
    hasProfile,
    profileChanged,
    myPosts,
    myPostsData,
    myLikedPosts,
    myLikedPostsData,
    myFollowersList,
    myFollowersListData,
  } = usePeepsContext();
  const [userProfileData, setUserProfileData] = useState({
    wallet: "",
    profilePicture: "",
    displayName: "",
    username: "",
    bio: "",
    createdAt: "",
    followers: "",
    following: "",
  });
  const [userProfileIpfsHash, setUserProfileIpfsHash] = useState(null);
  const [relationshipIpfsHash, setRelationshipIpfsHash] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const walletStatus = useActiveWalletConnectionStatus();
  const [isFollowedTriggered, setIsFollowedTriggered] =
    React.useState(isFollow);

  const defaultImage: string = "";

  const unPin = async (IpfsHash: any) => {
    try {
      const res = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${IpfsHash}`,
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
      toast.error("unpinning failed");
      return false;
    }
  };

  const pinPost = async (userData: any, profileData: any, action: string) => {
    try {
      if (action == "follow") {
        const follow_data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_FOLLOW",
            keyvalues: {
              follower: `${userData?.username}`,
              following: `${profileData?.username}`,
            },
          },
          pinataContent: {
            relationship: true,
          },
        });

        const follow_res = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          follow_data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        if (follow_res.data.IpfsHash) {
          toast.success(`${action} successful`);
        }
      }
      const current_username = userData?.username;
      const current_walletAddrress = userData.wallet;
      const current_displayName = userData.displayName;
      const current_profilePicture = userData.profilePicture;
      const current_bio = userData.bio;
      const current_following = userData.following;
      const current_followers = userData.followers;
      const current_createdAt = userData?.createdAt;

      try {
        const user_data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_USER",
            keyvalues: {
              addr: current_walletAddrress,
              username: current_username,
            },
          },
          pinataContent: {
            username: current_username,
            wallet: current_walletAddrress,
            displayName: "",
            profilePicture: current_profilePicture,
            bio: current_bio,
            following:
              action == "follow"
                ? current_following + 1
                : action == "unfollow"
                ? current_following - 1
                : current_following,
            followers: current_followers,
            createdAt: current_createdAt,
          },
        });

        const user_res = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          user_data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        if (user_res.data.IpfsHash) {
          toast.success("Repinning userData successful");
        }
      } catch (error) {
        console.log(error);
        toast.error("Repinning userData failed");
      }

      const profile_username = profileData?.username;
      const profile_walletAddrress = profileData.wallet;
      const profile_displayName = profileData.displayName;
      const profile_profilePicture = profileData.profilePicture;
      const profile_bio = profileData.bio;
      const profile_following = profileData.following;
      const profile_followers = profileData.followers;
      const profile_createdAt = profileData?.createdAt;

      try {
        const profile_data = JSON.stringify({
          pinataOptions: {
            cidVersion: 0,
          },
          pinataMetadata: {
            name: "PEEPS_USER",
            keyvalues: {
              addr: profile_walletAddrress,
              username: profile_username,
            },
          },
          pinataContent: {
            username: profile_username,
            wallet: profile_walletAddrress,
            displayName: "displayName",
            profilePicture: profile_profilePicture,
            bio: profile_bio,
            following: profile_following,
            followers:
              action == "follow"
                ? profile_followers + 1
                : action == "unfollow"
                ? profile_followers - 1
                : profile_followers,
            createdAt: profile_createdAt,
          },
        });

        const profile_res = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          profile_data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
        if (profile_res.data.IpfsHash) {
          toast.success("Repinning profileData successful");
        }
      } catch (error) {
        console.log(error);
        toast.error("Repinning profileData failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(`${action} failed`);
    }
  };

  const followerUser = async () => {
    // if (isConnected) {
    if (walletStatus === "connected") {
      //unpin from ipfs
      const unPinResOne = await unPin(userIpfsHash);
      if (unPinResOne) {
        const unPinResTwo = await unPin(userProfileIpfsHash);
        if (unPinResTwo) {
          await pinPost(userData, userProfileData, "follow").then(() =>
            checkIfFollowing()
          );
        }
        // Then repin on ipfs
      } else {
        toast.error(
          "Something went wrong at our end. We are working to resolve it as we speak."
        );
        toast.error("Please try again in a few minutes.");
      }
    } else {
      toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
  };

  const unfollowerUser = async () => {
    // if (isConnected) {
    if (walletStatus) {
      //unpin from ipfs
      const unPinResOne = await unPin(userIpfsHash);
      if (unPinResOne) {
        const unPinResTwo = await unPin(userProfileIpfsHash);
        if (unPinResTwo) {
          const unPinResThree = await unPin(relationshipIpfsHash);
          if (unPinResThree) {
            await pinPost(userData, userProfileData, "unfollow").then(() =>
              checkIfFollowing()
            );
          }
        }
        // Then repin on ipfs
      } else {
        toast.error(
          "Something went wrong at our end. We are working to resolve it as we speak."
        );
        toast.error("Please try again in a few minutes.");
      }
    } else {
      toast.error("Error, Can't make post!");
      toast.error("Please connect your wallet!");
    }
  };

  const checkIfFollowing = async () => {
    try {
      const res = await axios.get(
        `https://api.pinata.cloud/data/pinList?metadata[name]=PEEPS_FOLLOW&metadata[keyvalues]={"follower":{"value":"${userData?.username}","op":"eq"},"following":{"value":"${params.id}","op":"eq"}}&status=pinned`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          },
        }
      );
      if (res.data.rows.length > 0) {
        setIsFollow(true);
        setRelationshipIpfsHash(res.data.rows[0].ipfs_pin_hash);
      } else {
        setIsFollow(false);
      }
    } catch (error) {
      console.log(error);
      setIsFollow(false);
    }
  };

  if (walletStatus === "disconnected") {
    return (
      <section className="flex flex-row items-center justify-center hero min-h-96 card dark:bg-transparent">
        <div className="hero-content flex flex-col items-center text-center gap-y-8">
          <div>
            {/* - Bounce animation */}
            <LucideWifiOff size={48} className="text-default-500" />
          </div>
          <div>
            Unable to access your Profile.
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
        {/*<div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Your Profile
      </div>*/}
        {walletStatus === "connected" && !hasProfile ? (
          <>
            <div
              className={
                "card card-bordered bg-gray-200 dark:bg-base-200 p-4 flex flex-row items-center gap-x-4 rounded-sm"
              }
            >
              <Avatar profileImage={""} />
              <div className="grow">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                  {"Anonymous"}
                </h4>
                <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-gray-500">
                  ...
                </p>
              </div>
            </div>
            <NoProfileCard />
          </>
        ) : (
          <section>
            {activeAddress === "" ? (
              <div>
                <div className="hero min-h-60 bg-gray-200 dark:bg-base-200 rounded-lg">
                  <div className="hero-content text-center"></div>
                </div>
                <div className={"relative w-full px-4"}>
                  <div className={"absolute -top-12 z-10"}>
                    <div className="avatar">
                      <div className="skeleton w-24 rounded-full ring ring-base-200 dark:ring-base-200 ring-offset-base-100 ring-offset-2"></div>
                    </div>
                  </div>
                  <div className={"absolute top-2 right-2 z-[1]"}>
                    <div className="skeleton w-32 h-12"></div>
                  </div>
                  <div
                    className={"relative pt-20 pb-16 space-y-4 bg-transparent"}
                  >
                    <div className={"space-y-3"}>
                      <div
                        className={"skeleton h-8 w-48 font-bold text-2xl"}
                      ></div>
                      <div className="skeleton h-4 w-24"></div>
                    </div>
                    <div className={"skeleton w-96 h-6"}></div>
                    <div className={"skeleton w-52 h-4"}></div>
                    <div className="flex flex-row items-center gap-x-4">
                      <span className={"skeleton w-24 h-4"}></span>
                      <div className="skeleton w-2 h-2"></div>
                      <span className={"skeleton w-24 h-4"}></span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="hero min-h-60 max-h-60 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <div className="hero-content text-center"></div>
                  <Image
                    as={NextImage}
                    width={800}
                    height={200}
                    alt="NextUI hero Image with delay"
                    src={userData?.profilePicture}
                    className={"w-full object-cover object-top blur-3xl"}
                  />
                </div>
                <div className={"relative w-full px-4"}>
                  <div className={"absolute -top-12 z-10"}>
                    <div className="avatar">
                      {/* <div className="w-24 rounded-full ring ring-primary dark:ring-[#4563eb] ring-offset-base-100 ring-offset-2">
                        <Image
                          width={100}
                          height={100}
                          src={
                            userData?.profilePicture
                              ? userData?.profilePicture
                              : defaultImage
                          }
                          alt=""
                        />
                      </div> */}
                      <NAvatar
                        showFallback
                        isBordered
                        color="success"
                        src={userData?.profilePicture}
                        className="w-20 h-20 text-large"
                      />
                    </div>
                  </div>
                  <div className={"absolute top-2 right-2 z-[1]"}>
                    {params.id === "me" ? (
                      <Button
                        className={
                          isFollowedTriggered
                            ? "bg-transparent text-foreground border-default-200"
                            : ""
                        }
                        color="primary"
                        radius="full"
                        size="sm"
                        variant={isFollowedTriggered ? "bordered" : "solid"}
                        onPress={() =>
                          setIsFollowedTriggered(!isFollowedTriggered)
                        }
                        onClick={isFollow ? unfollowerUser : followerUser}
                      >
                        {isFollowedTriggered ? "Unfollow" : "Follow"}
                      </Button>
                    ) : (
                      <EditProfileModalForm />
                    )}
                    {/* {params.id != userData?.username ? (
                      isFollow ? (
                        <button
                          className={
                            "btn btn-primary dark:bg-[#4563eb] dark:border-0 rounded-box"
                          }
                          onClick={unfollowerUser}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className={
                            "btn btn-primary dark:bg-[#4563eb] dark:border-0 rounded-box"
                          }
                          onClick={followerUser}
                        >
                          Follow
                        </button>
                      )
                    ) : (
                      <EditProfileForm />
                    )} */}
                  </div>
                  <div
                    className={"relative pt-20 pb-16 space-y-4 bg-transparent"}
                  >
                    <div className={""}>
                      <div className={"font-bold text-2xl"}>
                        {userData?.displayName}
                      </div>
                      <div>@{userData?.username}</div>
                    </div>
                    <div className={""}>{userData?.bio}</div>
                    <div>{new Date(userData?.createdAt).toDateString()}</div>
                    <div className="flex flex-row items-center gap-x-4">
                      <span>Followers: {userData?.followers}</span>
                      <div className="w-2 h-2 rounded-full bg-base-200"></div>
                      <span>Following: {userData?.following}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tabs - Posts, Followers, Likes*/}
            <Tabs aria-label="Options">
              <NTab key="posts" title="Postss">
                {myPostsData ? (
                  myPostsData.map((eachPost: any, index: number) => (
                    <PostContainer key={index}>
                      {/*{console.log(eachPost)}*/}
                      <PostUser {...eachPost} />
                      <PostBody postMetaData={myPosts[index]}>
                        {eachPost?.post_content}
                      </PostBody>
                      <PostActionsContainer
                        postId={index}
                        message={eachPost?.post_content}
                        upload={eachPost?.post_media}
                        postData={eachPost}
                        postMetaData={myPosts}
                      />
                      {/*{<PostContainer></PostContainer>}*/}
                    </PostContainer>
                  ))
                ) : (
                  <Card>
                    <CardBody>
                      <div>No posts</div>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </CardBody>
                  </Card>
                )}
              </NTab>

              <NTab key="likes" title="Likes">
                {myLikedPostsData?.length > 0 ? (
                  myLikedPostsData.map((eachPost: any, index: number) => (
                    <PostContainer key={index}>
                      <PostUser {...eachPost} />
                      <PostBody postMetaData={myLikedPosts?.[index]}>
                        {eachPost?.post_content}
                      </PostBody>
                      <PostActionsContainer
                        postId={index}
                        message={eachPost?.post_content}
                        upload={eachPost?.post_media}
                        postData={eachPost}
                        postMetaData={myPosts}
                      />
                      {/*{<PostContainer></PostContainer>}*/}
                    </PostContainer>
                  ))
                ) : (
                  <Card>
                    <CardBody>
                      <div>No Liked posts</div>
                    </CardBody>
                  </Card>
                )}
              </NTab>
              <NTab key="followers" title="Followers">
                {myFollowersListData?.length > 0 ? (
                  myFollowersListData.map(
                    (eachFollower: any, index: number) => (
                      <Link
                        key={index}
                        href={`/profile/${eachFollower?.username}`}
                        className={
                          "card card-compact p-4 flex flex-row gap-x-3 bg-base-200"
                        }
                      >
                        <div className="avatar">
                          <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                            {eachFollower?.displayPicture ? (
                              <Image src="" alt={""} width={56} height={56} />
                            ) : (
                              <span className="text-3xl"></span>
                            )}
                          </div>
                        </div>
                        {eachFollower?.username}
                      </Link>
                    )
                  )
                ) : (
                  <Card>
                    <CardBody>
                      <div>No Followers yet</div>
                      <br />
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </CardBody>
                  </Card>
                )}
              </NTab>
            </Tabs>
          </section>
        )}

        {/*<section className="flex flex-row justify-center w-full mx-auto">
        <button
          title="load more button"
          type="button"
          className="btn btn-wide block"
          onClick={() => setEndCursor((endCursor) => endCursor + 20)}
        >
          Load more
        </button>
      </section>*/}
      </section>
    </Home>
  );
};

export default Profile;
