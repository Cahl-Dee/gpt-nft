// components/connectWallet.js

import { useState } from "react";
import Web3 from "web3";
import Select, { defaultTheme } from 'react-select';
import Modal from "react-modal";



const darkTheme = {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary25: "rgba(100, 100, 100, 0.5)",
      primary: "rgba(100, 100, 100, 0.8)",
      neutral0: "#222",
      neutral5: "red",
      neutral10: "#444",
      neutral80: "#FFF",
      neutral20: "#444",
      backgroundColor: "red",
    }
  };

const ConnectWallet = () => {
  Modal.setAppElement("#__next");

  const [address, setAddress] = useState("");

  const [connectedAddress, setConnectedAddress] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [nfts, setNFTs] = useState([]);

  const [chainFilter, setChainFilter] = useState([]);
  const [collectionNameFilter, setCollectionNameFilter] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);  


  // Get unique chains and collectionNames for filter dropdowns
  const uniqueChains = [...new Set(nfts.map((nft) => nft.chain))];
  const uniqueCollectionNames = [...new Set(nfts.map((nft) => nft.collectionName))];

  // Filter the NFTs based on the selected filters
  const filteredNfts = nfts.filter(
    (nft) =>
      (chainFilter.length === 0 || chainFilter.map(item => item.value).includes(nft.chain)) &&
      (collectionNameFilter.length === 0 || collectionNameFilter.map(item => item.value).includes(nft.collectionName))
  );

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request access to the user's MetaMask account
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const publicAddress = accounts[0];

        // Create a new instance of Web3
        const web3 = new Web3(window.ethereum);

        // Sign a message to authenticate
        const signature = await web3.eth.personal.sign("Login to My Ethereum App", publicAddress, "");

        // Send the signature and public address to the server
        const response = await fetch("/api/connectWallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signature, publicAddress }),
        });

        if (response.ok) {
          setAddress(publicAddress);

          const accounts = await web3.eth.getAccounts();
          setConnectedAddress(accounts[0]);
        } else {
          const data = await response.json();
          setError(data.error);
        }

      } catch (err) {
        setError("Failed to connect wallet.");
        console.error(err);
      }
    } else {
      setError("Please install MetaMask to use this app.");
    }
  };

  const fetchNFTs = async () => {
    if (!address) {
      alert("Please enter a wallet address or connect your wallet.");
      return;
    }

    setLoading(true);
    try {
      if (!address) {
        setError("Please connect your wallet first.");
        return;
      }

      const web3 = new Web3(process.env.NEXT_PUBLIC_PROVIDER_URL);

      web3.extend({
        methods: [
          {
            name: 'qn_fetchNFTs',
            call: 'qn_fetchNFTs',
            params: 1, // Number of parameters expected by the method
          },
        ],
      });

      const options = {
        perPage: 40,
        wallet: address,
      };

      const nfts = await web3.qn_fetchNFTs(options);

      setNFTs(nfts.assets);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (nft) => {
    setSelectedNFT(nft);
    setModalIsOpen(true);
  };
  

  const closeModal = () => {
    setSelectedNFT(null);
    setModalIsOpen(false);
  };
  
  return (
    <div>
        <div>
            <label htmlFor="address">Enter a wallet address</label>
        </div>
        <div>
            <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            />
            <button
            onClick={fetchNFTs}
            disabled={loading}
            className="fetch-nfts-button"
            >
            {loading ? "Loading..." : "Fetch NFTs"}
            </button>
        </div>

        {connectedAddress && <p>Connected with address: {connectedAddress}</p>}
        {!connectedAddress && (
          <div>
            <div>---- or ----</div>
            <button onClick={connectWallet}>Connect Wallet</button>
          </div>
        )}
        {address && (
        <>
            {nfts.length > 0 && (
                <div className="filters">
                <label htmlFor="chainFilter">Chain:</label>
                <Select
                    id="chainFilter"
                    theme={darkTheme}
                    isMulti
                    options={uniqueChains.map((chain) => ({ value: chain, label: chain }))}
                    value={chainFilter}
                    onChange={(selected) => setChainFilter(selected)}
                    className="filter-select"
                />

                <label htmlFor="collectionNameFilter">Collection:</label>
                <Select
                    id="collectionNameFilter"
                    theme={darkTheme}
                    isMulti
                    options={uniqueCollectionNames.map((collectionName) => ({ value: collectionName, label: collectionName }))}
                    value={collectionNameFilter}
                    onChange={(selected) => setCollectionNameFilter(selected)}
                    className="filter-select"
                />
                </div>
            )}

            <div className="nft-grid">
                {filteredNfts.map((nft) => (
                <div key={nft.collectionTokenId} className="nft-item">
                    <img src={nft.imageUrl} alt={nft.name} />
                    <h3>{nft.name}</h3>
                    <div className="single-line">
                        <span className="label">Collection: </span>
                        <span>{nft.collectionName}</span>
                    </div>
                    <div className="single-line" onClick={() => openModal(nft)}>
                      <span className="label">Token ID: </span>
                      <span>{nft.collectionTokenId}</span>
                    </div>
                    </div>
                ))}
            </div>
        </>
        )}
        {error && <p>{error}</p>}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modal"
          overlayClassName="modal-overlay"
        >
          {selectedNFT && (
            <div className="modal-content">
              <h2>{selectedNFT.name}</h2>
              <img src={selectedNFT.imageUrl} alt={selectedNFT.name} />
              <p>{selectedNFT.imageUrl}</p>
              <p>Chain: {selectedNFT.chain}</p>
              <p>Network: {selectedNFT.network}</p>
              <p>Collection: {selectedNFT.collectionName}</p>
              <p>Contract Address: {selectedNFT.collectionAddress}</p>
              <p>Token ID: {selectedNFT.collectionTokenId}</p>
              <p>Description: {selectedNFT.description}</p>
              <button onClick={closeModal}>Close</button>
            </div>
          )}
        </Modal>

    </div>
    );
};

export default ConnectWallet;