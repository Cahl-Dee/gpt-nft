// pages/api/connectWallet.js

import Web3 from "web3";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect()
  .post(async (req, res) => {
    try {
      const { signature, publicAddress } = req.body;

      // Validate input
      if (!signature || !publicAddress) {
        return res.status(400).json({ error: "Missing required parameters." });
      }

      // Create a new instance of Web3
      const web3 = new Web3(Web3.givenProvider || process.env.NEXT_PUBLIC_PROVIDER_URL);

      // Verify the signature
      const signer = web3.eth.accounts.recover("Login to My Ethereum App", signature);
      if (signer.toLowerCase() !== publicAddress.toLowerCase()) {
        return res.status(401).json({ error: "Invalid signature." });
      }

      // Connection successful
      res.status(200).json({ success: true });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

export default handler;