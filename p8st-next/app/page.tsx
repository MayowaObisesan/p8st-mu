import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Button, Card, CardBody, Image, Slider } from "@nextui-org/react";
import { HeartIcon } from "lucide-react";

export default function Landing() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed hidden dark:md:block dark:opacity-70 -bottom-[40%] -left-[20%] z-0"
      >
        <Image
          src="https://nextui.org/gradients/docs-left.png"
          className="relative z-10 opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large"
          alt="docs left background"
          data-loaded="true"
        />
      </div>
      <div
        aria-hidden="true"
        className="fixed hidden dark:md:block dark:opacity-70 -top-[80%] -right-[60%] 2xl:-top-[60%] 2xl:-right-[45%] z-0 rotate-12"
      >
        <Image
          src="https://nextui.org/gradients/docs-right.png"
          className="relative z-10 opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large"
          alt="docs right background"
          data-loaded="true"
        />
      </div>
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center text-balance justify-center leading-10 py-24">
          <h1 className={title()}>Social Interactions using&nbsp;</h1>
          <br />
          {/* <h1 className={title({ color: "green"})}>Zero-Knowledge&nbsp;</h1> */}
          <h1 className={"text-green-400 font-semibold text-8xl"}>
            Zero-Knowledge&nbsp;
          </h1>
          <div className={title({ class: "mt-4" })}>Proof verifications</div>
          <div className={subtitle({ class: "mt-8 text-sm" })}>
            {/* Beautiful, fast and modern React UI library. */}
            Powerful Zero-knowledge Verification Scheme powered by ZK-Pass
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "success",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            How it works
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>

        {/* <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div> */}

        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 min-w-[80%] max-w-[960px] mt-32"
          shadow="sm"
        >
          <CardBody>
            <div className="flex flex-row justify-center items-stretch gap-x-4 p-8">
              <div className="w-[42%] flex flex-col justify-center items-center py-12 overflow-hidden rounded-xl">
                <Image
                  alt="Album cover"
                  className={""}
                  height={400}
                  shadow="md"
                  src="https://nextui.org/images/album-cover.png"
                />
              </div>
              <div className="min-w-[54%] w-[32%] text-left self-center">
                <div className="text-5xl font-extrabold">
                  VERIFY YOUR ONLINE PRESENCE BEFORE YOU OWN AN ACCOUNT
                </div>
                <div className="text-2xl leading-10">
                  Use Zero-Knowledge Technology to verify your Proof of
                  Humanity. Verify using Discord or Linked in to show that you
                  are not a bot.
                </div>
              </div>
            </div>
            {/* <div className="grid grid-cols-8 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                alt="Album cover"
                className="object-cover"
                height={800}
                width={800}
                shadow="md"
                src="https://nextui.org/images/album-cover.png"
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8">
              <div className="text-4xl font-bold">
                MAKE YOUR GROUP CHATS MORE FUN
              </div>
              <div>
                Use custom emoji, stickers, soundboard effects and more to add
                your personality to your voice, video, or text chat. Set your
                avatar and a custom status, and write your own profile to show
                up in chat your way.
              </div>
            </div>
          </div> */}
          </CardBody>
        </Card>

        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 min-w-[80%] max-w-[960px] mt-32"
          shadow="sm"
        >
          <CardBody>
            <div className="flex flex-row-reverse justify-center items-stretch gap-x-4 p-8">
              <div className="w-[42%] flex flex-col justify-center items-center py-16">
                <Image
                  alt="Album cover"
                  className="object-cover"
                  height={400}
                  shadow="md"
                  src=""
                />
              </div>
              <div className="min-w-[54%] w-[32%] text-left self-center">
                <div className="text-5xl font-extrabold">
                  CREATE YOUR IDENTITY ONCE VERIFIED
                </div>
                <div className="text-2xl leading-10">
                  Create your account to be a part of the social trend. Join
                  those conversation. Share your contents, and get paid for
                  loved contents.
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 min-w-[80%] max-w-[960px] mt-32"
          shadow="sm"
        >
          <CardBody>
            <div className="flex flex-row justify-center items-stretch gap-x-4 p-8">
              <div className="w-[42%] flex flex-col justify-center items-center py-16">
                <Image
                  alt="Album cover"
                  className="object-cover"
                  height={400}
                  shadow="md"
                  src=""
                />
              </div>
              <div className="min-w-[54%] w-[32%] text-left self-center">
                <div className="text-5xl font-extrabold">
                  COINBASE PROOF OF FINANCE USING ZK-PASS
                </div>
                <div className="text-2xl leading-10">
                  Using ZK-PASS & Coinbase, Verify your Proof of Finance.
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 min-w-[80%] max-w-[960px] mt-32"
          shadow="sm"
        >
          <CardBody>
            <div className="flex flex-row-reverse justify-center items-stretch gap-x-4 p-8">
              <div className="w-[42%] flex flex-col justify-center items-center py-16">
                <Image
                  alt="Album cover"
                  className="object-cover"
                  height={400}
                  shadow="md"
                  src=""
                />
              </div>
              <div className="min-w-[54%] w-[32%] text-left self-center">
                <div className="text-5xl font-extrabold">
                  TIP CONTENTS YOU LIKE
                </div>
                <div className="text-2xl leading-10">
                  Tip content creators using the platform token. All done within
                  the platform.
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
}
