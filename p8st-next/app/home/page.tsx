"use client";

import { useEffect, useState } from "react";
import Home from "./baseLayout";
import { usePeepsContext } from "../context";
import PostForm from "../components/PostForm";
import {
  Avatar as NAvatar,
  Tabs,
  Tab as NTab,
} from "@nextui-org/react";
import { PostExplore } from "../components/Posts/PostsExplore";
import { Post } from "../components/Posts/Posts";
import toast from "react-hot-toast";

const HomePosts = () => {
  const [dappAddress, setDappAddress] = useState<string>(
    "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
  );
  const { postsNotice, verified } = usePeepsContext();
  const recommendedPosts = postsNotice[0]?.payload
    ? JSON.parse(postsNotice[0]?.payload)?.posts
    : [];

  return (
    <div className={"lg:py-0 w-full"}>
      <div className={"hidden lg:block"}>
        <PostForm dappAddress={dappAddress} />
      </div>
      {recommendedPosts?.length > 0 ? (
        <div className={""}>
          {/* For you & Explore tabs */}
          <Tabs aria-label="Options">
            <NTab key="foryou" title="For You">
              <Post />
            </NTab>

            <NTab key="explore" title="Explore">
              <PostExplore />
            </NTab>
          </Tabs>
        </div>
      ) : (
        <>
          <div
            className={
              "prose text-xl lg:text-4xl font-bold text-gray-400 px-2 py-6 lg:mt-8"
            }
          >
            Posts
          </div>
          <PostExplore />
        </>
      )}
    </div>
  );
};

export default function HomePostsPage() {
  return (
    <Home>
      <HomePosts />
    </Home>
  );
}
