import 'rc-slider/assets/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as WagmiProvider } from 'wagmi';
import { chain, defaultChains } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletLinkConnector } from 'wagmi/connectors/walletLink';

import './fonts/line-awesome-1.3.0/css/line-awesome.css';
import './index.css';
import './styles/index.scss';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const infuraId = process.env.INFURA_ID;

const chains = defaultChains;

export const connectors = ({ chainId }: { chainId: any }) => {
  const rpcUrl = chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0];
  return [
    new WalletLinkConnector({
      options: {
        appName: 'My wagmi app',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
  ];
};

root.render(
  <React.StrictMode>
    {/* @ts-ignore */}
    <WagmiProvider autoConnect connectors={connectors}>
      <App />
    </WagmiProvider>
  </React.StrictMode>
);
