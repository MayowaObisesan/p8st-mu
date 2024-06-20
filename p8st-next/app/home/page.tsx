"use client";

import { useState } from "react";
import Home from "./baseLayout";
import { usePeepsContext } from "../context";
import PostForm from "../components/PostForm";
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
import { PostExplore } from "../components/Posts/PostsExplore";
import { Post } from "../components/Posts/Posts";

const HomePosts = () => {
  const [dappAddress, setDappAddress] = useState<string>(
    "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
  );
  const { postsNotice } = usePeepsContext();
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
          {/* <Tab.Group>
            <Tab.List className="bg-base-100 dark:bg-zinc-950/80 backdrop-blur sticky top-[60px] z-10 flex space-x-1 rounded-sm px-1 py-4">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "rounded-xl px-8 py-2.5 lg:py-2 leading-5 prose text-lg lg:text-xl font-semibold text-gray-400 lg:mt-8",
                    "ring-white/60 focus:outline-none hover:bg-gray-300",
                    selected
                      ? "bg-primary dark:bg-[#4563eb] text-primary-content dark:text-white shadow font-bold hover:bg-primary"
                      : "text-blue-100 hover:bg-white/[0.12] dark:hover:text-white"
                  )
                }
              >
                For You
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "rounded-xl px-8 py-2.5 lg:py-2 leading-5 prose text-lg lg:text-xl font-semibold text-gray-400 lg:mt-8",
                    "ring-white/60 focus:outline-none hover:bg-gray-300",
                    selected
                      ? "bg-primary dark:bg-[#4563eb] text-primary-content dark:text-white shadow font-bold hover:bg-primary"
                      : "text-blue-100 hover:bg-white/[0.12] dark:hover:text-white"
                  )
                }
              >
                Explore
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel
                className={classNames(
                  "rounded-xl py-1 lg:p-3",
                  "focus:outline-none focus:ring-2"
                )}
              >
                <Post />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  "rounded-xl py-1 lg:p-3",
                  "focus:outline-none focus:ring-2"
                )}
              >
                <PostExplore />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group> */}
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
