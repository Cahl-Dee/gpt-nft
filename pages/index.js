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
    <script>(function () {Grin = window.Grin || (window.Grin = []);var s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = 'https://d38xvr37kwwhcm.cloudfront.net/js/grin-sdk.js';var x = document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);})();</script>
      </Head>

      <main>
        <h1>GPT NFT</h1>
        <ConnectWallet />
      </main>
    </div>
  );
}
