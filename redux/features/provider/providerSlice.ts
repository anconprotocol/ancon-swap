import { Token } from "@pancakeswap/sdk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

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

export interface StateType {
  provider?: any;
  web3Provider?: ethers.providers.Web3Provider;
  address?: string;
  chainId?: number;
  token1: Token;
  token2: Token;
}

const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
  token1: usdc,
  token2: ancon,
};

export const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setProvider: (state, action: any) => {
      state.provider = action.payload.provider;
      state.web3Provider = action.payload.web3Provider;
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    resetProvider: (state) => {
      state.provider = null;
      state.web3Provider = null;
      state.address = null;
      state.chainId = null;
      state.token1 = usdc;
      state.token2 = ancon;
    },
    switchToken: (state) => {
      state.token1 = ancon;
      state.token2 = usdc;
    },
    switchBack: (state) => {
      state.token1 = usdc;
      state.token2 = ancon;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setProvider,
  setAddress,
  setChainId,
  resetProvider,
  switchBack,
  switchToken,
} = providerSlice.actions;

export const selectProvider = (state) => ({
  provider: state.provider.provider,
  web3Provider: state.provider.web3Provider,
  address: state.provider.address,
  chainId: state.provider.chainId,
  token1: state.provider.token1,
  token2: state.provider.token2,
});
export default providerSlice.reducer;
