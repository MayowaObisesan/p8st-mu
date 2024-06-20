"use client";

import { Input } from "@nextui-org/input";
import { Search } from "./Search";
import { Trending } from "./Trending";
import { usePathname } from "next/navigation";
import { Kbd } from "@nextui-org/kbd";
import { SearchIcon } from "@/components/icons";

export const RightComponent = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Display nothing if the page is not the profile, user or home page.
  if (segments[0] === "arcade") return null;
  if (segments[0] === "wallet") return null;
  if (segments[0] === "settings") return null;

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <section className="hidden lg:block lg:sticky lg:top-[88px] max-w-xs mx-auto h-screen overflow-y-auto">
      {/* <Search /> */}
      {searchInput}
      <section>
        <Trending></Trending>
      </section>
    </section>
  );
};
