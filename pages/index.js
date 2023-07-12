// pages/index.js

import Head from 'next/head';
import ConnectWallet from '../components/connectWallet';

export default function Home() {
  return (
    <div>
      <Head>
        <title>GPT NFT</title>
        <meta name="description" content="Ethereum wallet connection example with Next.js" />
        <link rel="icon" href="/favicon.ico" />
     </Head>

      <main>
        <h1>GPT NFT</h1>
        <ConnectWallet />
      </main>
    </div>
  );
}
