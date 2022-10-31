import { useAddress, useContract, useMetamask } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const Mint: NextPage = () => {
  const router = useRouter();
  // Get the currently connected wallet's address
  const address = useAddress();

  // Function to connect to the user's Metamask wallet
  const connectWithMetamask = useMetamask();

  // Get the NFT Collection contract
  const nftMint = useContract(
    "0xf5a9a030965c5F89367283b86C4cB246cbb8eF20", "nft-drop"
  );

  async function claimNft() {
    try {
      const tx = await nftMint.contract?.claim(1);
      console.log(tx);
      alert("NFT Claimed!");
      router.push(`/stake`);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div className={styles.container} style={{ 
      backgroundImage: 'url("frame.svg")'
    }}>
      <h1 className={styles.h1}>Mint Clownies NFTs!</h1>

      <p className={styles.explain}>
        Mint one NFT from our <b>Clownies</b> NFT Collection.
      </p>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />

      {!address ? (
        <button
          className={`${styles.mainButton} ${styles.spacerBottom}`}
          onClick={connectWithMetamask}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          className={`${styles.mainButton} ${styles.spacerBottom}`}
          onClick={() => claimNft()}
        >
          Claim An NFT
        </button>
      )}
    </div>
  );
};

export default Mint;