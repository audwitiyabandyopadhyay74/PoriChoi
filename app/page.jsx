"use client";

import Head from "next/head";
import NavBar from "./Components/NavBar";
import MobNavBar from "./Components/Mobile Nav";
import Posts from "./Components/Posts";
import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import("./Components/no-ssr"), { ssr: false });

export default function Page() {
  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <MobNavBar />
      <NoSSR>
        <Posts />
      </NoSSR>
    </>
  );
}
