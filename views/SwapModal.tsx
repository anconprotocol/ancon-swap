import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  ArrowSmDownIcon,
  CheckCircleIcon,
  CogIcon,
  LogoutIcon,
  XIcon,
} from "@heroicons/react/solid";
import { ethers } from "ethers";
import abi from "../contracts/IPancakeRouter.json";
import Web3 from "web3";
const AnconToken = require("../contracts/Ancon.json");

// SDK
import {
  Token,
  Fetcher,
  Pair,
  TokenAmount,
  Route,
  TradeType,
  Trade,
  Percent,
} from "@pancakeswap/sdk";
import BigNumber from "bignumber.js";

import { useDispatch, useSelector } from "react-redux";
import {
  resetProvider,
  selectProvider,
  setAddress,
  setProvider,
  switchBack,
  switchToken,
} from "../redux/features/provider/providerSlice";

const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
};

// web3 modal
let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions, // required
    theme: {
      background: "#0c0f1c",
      main: "#2b334f",
      secondary: "#D5C7D7",
      border: "#0c0f1c",
      hover: "#872684",
    },
  });
}

function SwapModal() {
  // const [state, dispatch] = useReducer(reducer, initialState);

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [balances, setBalances] = useState({
    udsc: "",
    ancon: "",
  });
  const [qty, setQty] = useState({
    token1: "0",
    token2: "0",
  });
  const { provider, web3Provider, address, chainId, token1, token2 } =
    useSelector(selectProvider);

  // connect
  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect();

    // create the provi
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const addressGot = await signer.getAddress();
    const usdc = new ethers.Contract(
      "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      AnconToken.abi,
      web3Provider
    );
    const ancon = new ethers.Contract(
      "0x217f3bdbb0358082c99e1de01c47D1B2DBA45ad5",
      AnconToken.abi,
      web3Provider
    );

    let usdcBalance;
    let anconBalance;
    try {
      usdcBalance = await usdc.functions.balanceOf(addressGot);

      usdcBalance =
        parseInt(Web3.utils.hexToNumberString(usdcBalance[0]._hex)) /
        1000000000000000000;
    } catch (error) {
      usdcBalance = "0";
    }

    try {
      anconBalance = await ancon.functions.balanceOf(addressGot);
      anconBalance =
        parseInt(Web3.utils.hexToNumberString(anconBalance[0]._hex)) /
        1000000000000000000;
    } catch (error) {
      anconBalance = "0";
    }

    setBalances({
      ancon: anconBalance.toString(),
      udsc: usdcBalance.toString(),
    });

    // setAddress(addressGot);
    const network = await web3Provider.getNetwork();
    dispatch(
      setProvider({
        provider,
        web3Provider,
        address: addressGot,
        chainId: network.chainId,
      })
    );
  }, []);

  // disconnect
  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      // setAddress("");
      if (
        provider?.disconnect &&
        typeof provider.disconnect === "function"
      ) {
        await provider.disconnect();
      }
      dispatch(resetProvider());
    },
    [provider]
  );
  console.log(web3Provider);

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // listen to the events on the provider
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log("accountsChanged", accounts);
        dispatch(setAddress(accounts[0]));
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      const handleDisconnect = (error: {
        code: number;
        message: string;
      }) => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const handleChange = async (name: string, value: string) => {
    if (parseFloat(value) < 0) {
      setQty({ token1: "", token2: "" });
      return;
    }

    if (value.startsWith("0.")) {
      if (isNaN(parseInt(value[2]))) {
        setQty({ token1: "0.", token2: "0" });
        return;
      } else {
        setQty({ token1: value, token2: "0" });
      }
    }

    if (value.length > 2) {
      if (isNaN(parseInt(value[value.length - 1]))) {
        setQty({ token1: "", token2: "" });
        return;
      }
    }
    console.log(token1, token2);

    const pair = await getPair(token1, token2);
    console.log("pair", pair);

    const route = new Route([pair], token1);

    const price =
      parseFloat(route.midPrice.toSignificant(6)) *
      parseFloat(value) *
      0.995;

    if (isNaN(price)) {
      setQty({ token1: "", token2: "0" });
      return;
    }
    setQty({ token1: value, token2: price.toString() });
  };

  const getPair = async (usdc: Token, ancon: Token) => {
    console.log("getting pair", web3Provider);
    const reserves = await Fetcher.fetchPairData(
      usdc,
      ancon,
      web3Provider
    );

    // const reserves = pairad;
    const { reserve0, reserve1 } = reserves;

    const pair = new Pair(reserve0, reserve1);
    return pair;
  };

  const swap = async () => {
    const routerAddress = process.env.NEXT_PUBLIC_ROUTER_ADDRESS;
    const signer = await web3Provider.getSigner();
    const contract = new ethers.Contract(routerAddress, abi, signer);

    // prepare the tokens

    const usdcContract = new ethers.Contract(
      "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      AnconToken.abi,
      signer
    );
    const anconContract = new ethers.Contract(
      "0x217f3bdbb0358082c99e1de01c47D1B2DBA45ad5",
      AnconToken.abi,
      signer
    );

    // create pair
    const pair = await getPair(token1, token2);
    const route = new Route([pair], token1);

    let amountIn = new BigNumber(qty.token1).shiftedBy(18).toFixed();

    const trade = new Trade(
      route,
      new TokenAmount(token1, amountIn),
      TradeType.EXACT_INPUT
    );

    // calculate the min
    const slippageTolerance = new Percent("50", "10000");
    const amountOutMin = trade
      .minimumAmountOut(slippageTolerance)
      .toExact(); // needs to be converted to e.g. hex
    const bigNumberAmountOutMin = new BigNumber(amountOutMin)
      .shiftedBy(18)
      .toFixed();

    const path = [token1.address, token2.address];
    const to = await signer.getAddress(); // should be a checksummed recipient address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex

    const usdcAllowance = await usdcContract.allowance(
      to,
      routerAddress
    );
    if (Web3.utils.hexToNumberString(usdcAllowance._hex) === "0") {
      await usdcContract.approve(
        routerAddress,
        "1000000000000000000000000"
      );
    }

    const anconAllowance = await anconContract.allowance(
      to,
      routerAddress
    );
    if (Web3.utils.hexToNumberString(anconAllowance._hex) === "0") {
      await anconContract.approve(
        routerAddress,
        "1000000000000000000000000"
      );
    }

    let result;
    try {
      result = await contract.functions.swapExactTokensForTokens(
        amountIn,
        bigNumberAmountOutMin,
        path,
        to,
        deadline
      );
      await result?.wait(1);
      setQty({ token1: "0", token2: "0" });
      setShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const switchTokens = () => {
    if (switched) {
      setQty({ token1: "0", token2: "0" });
      setSwitched(false);
      dispatch(switchBack());
    } else {
      setQty({ token1: "0", token2: "0" });
      setSwitched(true);
      dispatch(switchToken());
    }
  };
  return (
    <section className="flex items-center justify-center">
      {show && (
        <div className="fixed w-full h-full bg-black flex items-center justify-center bg-opacity-50 z-50 select-none px-4 inset-0">
          <div className="absolute left-1/2 top-40 -translate-x-1/2 -translate-y-1/2 w-10/12 md:w-1/2 2xl:w-3/12 rounded-md shadow-xl  grid select-none bg-white">
            <div className="flex justify-center items-center space-x-4relative px-2 py-3">
              <h1 className="font-black text-xl">Tokens Swapped!</h1>
              <CheckCircleIcon className="text-green-700 w-10" />
              <XIcon
                className="w-5 absolute right-2 top-2 cursor-pointer hover:text-red-600"
                onClick={() => setShow(false)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0c0f1c] rounded-xl p-2 mt-8 md:mt-32 xl:mt-60 w-10/12 shadow-lg sm:w-7/12 sm:mt-12 sm:px-3 md:w-5/12 xl:w-3/12">
        {/* first section */}
        <div className="flex justify-between items-center">
          {/* title */}
          <h1 className="text-white font-black text-2xl">Swap</h1>
          {/* settings */}
          <LogoutIcon
            className="w-5 text-gray-100 sm:w-8"
            onClick={disconnect}
          />
        </div>

        <div className="relative">
          {/* first token */}
          <div className="bg-[#2b334f] rounded-xl flex justify-between p-3 sm:py-5 items-center mt-2 relative">
            {/* dropdown */}
            <input
              value={qty.token1}
              name="token1"
              onChange={(e) =>
                handleChange(e.target.name, e.target.value)
              }
              className="bg-transparent text-2xl w-1/2 focus:outline-none"
            />
            <div className="grid justify-items-end">
              {token1?.symbol === "USDC" ? (
                <p className="text-gray-300 text-sm">
                  Balance: {balances.udsc.slice(0, 10)}
                </p>
              ) : (
                <p className="text-gray-300 text-sm">
                  Balance: {balances.ancon.slice(0, 10)}
                </p>
              )}
              <div className="bg-[#0c0f1c] flex justify-between rounded-xl px-3 py-2 text-white items-center">
                <p className="font-medium sm:text-xl xl:text-xl select-none">
                  {token1?.symbol === "USDC" ? "USDC" : "ANCON"}
                </p>
                {token1?.symbol === "USDC" ? (
                  <img src="/usdc.png" className="w-6 h-6 ml-3" />
                ) : (
                  <img
                    src="/ancon-logo.png"
                    className="w-6 h-6 ml-3"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center justify-center">
              <div
                onClick={switchTokens}
                className="bg-[#2b334f] p-1 rounded-3xl my-2 border-4 border-[#0c0f1c] cursor-pointer hover:bg-black"
              >
                <ArrowSmDownIcon className="w-5 text-white" />
              </div>
            </div>
          </div>
          {/* second token */}
          <div className="bg-[#2b334f] rounded-xl flex justify-between p-3 items-center mt-4 sm:py-5">
            <p className="text-2xl">{qty.token2.slice(0, 8)}</p>
            <div className="grid justify-items-end">
              {token2?.symbol === "USDC" ? (
                <p className="text-gray-300 text-sm">
                  Balance: {balances.udsc.slice(0, 10)}
                </p>
              ) : (
                <p className="text-gray-300 text-sm">
                  Balance: {balances.ancon.slice(0, 10)}
                </p>
              )}

              {/* dropdown */}
              <div className="bg-[#0c0f1c] flex rounded-xl px-3 py-2 text-white">
                {/* <ChevronDownIcon className="w-5" /> */}
                <p className="font-medium sm:text-xl">
                  {token2?.symbol === "USDC" ? "USDC" : "ANCON"}
                </p>
                {token2?.symbol === "USDC" ? (
                  <img src="/usdc.png" className="w-6 h-6 ml-3" />
                ) : (
                  <img
                    src="/ancon-logo.png"
                    className="w-6 h-6 ml-3"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* button */}

        {web3Provider ? (
          <div
            className="bg-primary-500 rounded-full flex justify-center items-center py-2 mt-5 mb-3 cursor-pointer"
            onClick={swap}
          >
            <button
              className="text-white font-bold text-lg "
              type="button"
            >
              Swap
            </button>
          </div>
        ) : (
          <div
            onClick={connect}
            className="bg-primary-500 rounded-full flex justify-center items-center py-2 mt-5 mb-3 cursor-pointer"
          >
            <button
              className="text-white font-bold text-lg"
              type="button"
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default SwapModal;
