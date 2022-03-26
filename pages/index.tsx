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

      <main className="h-screen dark:bg-gradient-to-b dark:from-blueGray-800 dark:to-black bg-gradient-to-b from-gray-100 to-white">
        <SwapModal />
      </main>
    </div>
  );
};

export default Home;
