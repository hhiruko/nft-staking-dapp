import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();

  return (

    <div className={styles.container} style={{ 
      backgroundImage: 'url("frame.svg")'
    }}>
      {/* Top Section */}
      <h1 className={styles.h1}>Clownies NFT Collection</h1>
      
      <div className={styles.place}>
      <div className={styles.nftBoxGrid}>
        <div
          className={`${styles.mainButton2} ${styles.spacerBottom}`}
          role="button"
          onClick={() => router.push(`/mint`)}
        >
          {/* Mint a new NFT */}
            <h2 className={styles.selectBoxTitle}>Mint a new Clownie</h2>
        </div>

        <div
          className={`${styles.mainButton3} ${styles.spacerBottom}`}
          role="button"
          onClick={() => router.push(`/stake`)}
        >
          {/* Staking an NFT */}
          <h2 className={styles.selectBoxTitle}>Stake Your Clownies</h2>
        </div>
      </div>
      </div>
    </div>

   
  );
};

export default Home;