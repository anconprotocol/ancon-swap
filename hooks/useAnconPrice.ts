import { Token, Fetcher, Pair, Route } from "@pancakeswap/sdk";
import { useEffect, useState } from "react";

/**
 *
 * @param web3Provider the ethers web 3 provider
 * @returns the ancon price as a string
 */
const useAnconPrice = (web3Provider) => {
  // stores the price
  const [price, setPrice] = useState("");

  //   tokens to check
  const usdc: Token = new Token(
    56,
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    18,
    "USDC",
    "Binance-Peg USD Coin"
  );
  const ancon: Token = new Token(
    56,
    "0x217f3bdbb0358082c99e1de01c47D1B2DBA45ad5",
    18,
    "ANCON",
    "Ancon Protocol"
  );

  //   get the pair data from pancakeswap
  const getPair = async (usdc: Token, ancon: Token) => {
    const reserves = await Fetcher.fetchPairData(
      usdc,
      ancon,
      web3Provider
    );

    // const reserves = pairad;
    const { reserve0, reserve1 } = reserves;

    // creates and return the pair
    const pair = new Pair(reserve0, reserve1);
    return pair;
  };

  const getPrice = async () => {
    const pair = await getPair(usdc, ancon);

    const route = new Route([pair], usdc);

    const estPrice =
      parseFloat(route.midPrice.toSignificant(6)) * 0.995;
    setPrice(estPrice.toString());
  };

  //   call every time the provider is changed and only executes the function if theres is any provider
  useEffect(() => {
    if (web3Provider) {
      getPrice();
    }
  }, [web3Provider]);

  return price;
};

export default useAnconPrice;
