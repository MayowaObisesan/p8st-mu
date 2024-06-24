"use client";

import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { ThirdwebProvider } from "thirdweb/react";
import PeepsProvider from "./context";
import { Toaster } from "react-hot-toast";
import { MobileNavigation } from "./components/MobileNavigation";
import { MinimalFooter } from "@/components/footer";

const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

//Setup GraphQL Apollo client
const URL_QUERY_GRAPHQL = process.env.NEXT_PUBLIC_NODE_URL;

const httpLink = createHttpLink({
  uri: URL_QUERY_GRAPHQL, // URL of your proxy server
  fetchOptions: {
    mode: "no-cors",
  },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Origin: "*",
  },
});

const client = new ApolloClient({
  uri: URL_QUERY_GRAPHQL,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "w-full min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ApolloProvider client={client}>
          <ThirdwebProvider>
            <PeepsProvider>
              <Providers
                themeProps={{ attribute: "class", defaultTheme: "dark" }}
              >
                <div className="relative flex flex-col h-screen p-0 overflow-auto">
                  <Navbar />
                  <main className="mx-auto w-full pt-16 flex-grow">
                    {children}
                  </main>
                  <footer className="w-full flex flex-col items-center justify-center gap-x-4 gap-y-2 py-8">
                    <Link
                      isExternal
                      className="flex items-center gap-1 text-current text-lg font-bold"
                      href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                      title="nextui.org homepage"
                    >
                      <span className="text-default-600">Powered by</span>
                      <p className="text-success">ZK-PASS</p>
                    </Link>
                    <Link
                      isExternal
                      className="flex items-center gap-1 text-current text-sm"
                      href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                      title="nextui.org homepage"
                    >
                      <span className="text-default-600">Design Library by</span>
                      <p className="text-primary">NextUI</p>
                    </Link>
                  </footer>
                </div>
                <MobileNavigation />
                <Toaster
                  position="top-right"
                  containerStyle={{ top: "88px" }}
                  toastOptions={{}}
                />
              </Providers>
            </PeepsProvider>
          </ThirdwebProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
