import type { NextPage } from "next";
import Head from "next/head";
import SwapModal from "../views/SwapModal";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Ancon Swap</title>
        <meta
          name="description"
          content="Ancon Swap Dapp"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen bg-gradient-to-b from-blueGray-800 to-black">
        <SwapModal />
      </main>
    </div>
  );
};

export default Home;
