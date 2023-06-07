import "./App.css";

import "@rainbow-me/rainbowkit/styles.css";
import Demo from "./Demo";

import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";

import {
  metaMaskWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { polygonMumbai, optimismGoerli, goerli, gnosis, gnosisChiado } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { Chain } from "@wagmi/chains";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { configureChains, createClient, WagmiConfig } from "wagmi";
// import { BananaWallet } from '@rize-labs/banana-rainbowkit-plugin'
import { BananaWallet } from '@rize-labs/banana-rainbowkit-plugin'
import { shibuyaChain } from "@rize-labs/banana-wallet-sdk";

function App() {

  const { chains, provider } = configureChains(
    // currently on these three chains are supported by BananaWallet
    [polygonMumbai, optimismGoerli, goerli, gnosis, gnosisChiado, shibuyaChain],
    // [publicProvider()]
    [
      jsonRpcProvider({
        rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
      }),
    ]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        // default chain would be gnosisChiado for now
        BananaWallet({ chains, connect: { networkId: 81 } }),
        metaMaskWallet({ chains, shimDisconnect: true }),
        rainbowWallet({ chains }),
        walletConnectWallet({ chains }),
        injectedWallet({ chains, shimDisconnect: true }),
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <div className="App">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Demo />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
