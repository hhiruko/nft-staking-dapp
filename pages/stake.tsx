import {
    ThirdwebNftMedia,
    useAddress,
    useMetamask,
    useTokenBalance,
    useOwnedNFTs,
    useContract
  } from "@thirdweb-dev/react";
  import { BigNumber, ethers } from "ethers";
  import type { NextPage } from "next";
  import { useEffect, useState } from "react";
  import styles from "../styles/Home.module.css";
  
  const nftDropContractAddress = "0xf5a9a030965c5F89367283b86C4cB246cbb8eF20";
  const tokenContractAddress = "0xfC2aC54915e7712132aFC7f92fc119401482027B";
  const stakingContractAddress = "0x668F8a15E4DaC202d7eA1CF7819d2b6e6Df49126";
  
  const Stake: NextPage = () => {
    // Wallet Connection Hooks
    const address = useAddress();
    const connectWithMetamask = useMetamask();
  
    // Contract Hooks
    const nftDropContract = useContract(nftDropContractAddress, "nft-drop");
    const tokenContract = useContract(tokenContractAddress,"token");
  
    const { contract, isLoading } = useContract(stakingContractAddress);
  
    // Load Unstaked NFTs
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract.contract, address);
  
    // Load Balance of Token
    const { data: tokenBalance } = useTokenBalance(tokenContract.contract, address);
  
    ///////////////////////////////////////////////////////////////////////////
    // Custom contract functions
    ///////////////////////////////////////////////////////////////////////////
    const [stakedNfts, setStakedNfts] = useState<any[]>([]);
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  
    useEffect(() => {
      if (!contract) return;
  
      async function loadStakedNfts() {
        const stakedTokens = await contract?.call("getStakedTokens", address);
  
        // For each staked token, fetch it from the sdk
        const stakedNfts = await Promise.all(
          stakedTokens?.map(
            async (stakedToken: { staker: string; tokenId: BigNumber }) => {
              const nft = await nftDropContract.contract?.get(stakedToken.tokenId);
              return nft;
            }
          )
        );
  
        setStakedNfts(stakedNfts);
        console.log("setStakedNfts", stakedNfts);
      }
  
      if (address) {
        loadStakedNfts();
      }
    }, [address, contract, nftDropContract]);
  
    useEffect(() => {
      if (!contract || !address) return;
  
      async function loadClaimableRewards() {
        const cr = await contract?.call("availableRewards", address);
        console.log("Loaded claimable rewards", cr);
        setClaimableRewards(cr);
      }
  
      loadClaimableRewards();
    }, [address, contract]);
  
    ///////////////////////////////////////////////////////////////////////////
    // Write Functions
    ///////////////////////////////////////////////////////////////////////////
    async function stakeNft(id: BigNumber) {
      if (!address) return;
  
      const isApproved = await nftDropContract.contract?.isApproved(
        address,
        stakingContractAddress
      );
      // If not approved, request approval
      if (!isApproved) {
        await nftDropContract.contract?.setApprovalForAll(stakingContractAddress, true);
      }
      
      calculate(id);
      const stake = await contract?.call("stake", id);
    }

    async function calculate(id: BigNumber){
      const nft = await nftDropContract.contract?.get(id);
      const level = nft?.metadata.attributes?.0 : 0;
      const calculate = await contract?.call("setLevel", level);
    }
  
    async function withdraw(id: BigNumber) {
      const withdraw = await contract?.call("withdraw", id);
    }
  
    async function claimRewards() {
      const claim = await contract?.call("claimRewards");
    }
  
    if (isLoading) {
      return <div>Loading</div>;
    }
  
    return (
      <div className={styles.container}>
        <h1 className={styles.h1}>Stake Your Clownies</h1>
  
        <hr className={`${styles.divider} ${styles.spacerTop}`} />
  
        {!address ? (
          <button className={styles.mainButton} onClick={connectWithMetamask}>
            Connect Wallet
          </button>
        ) : (
          <>
            <h2>Your Tokens</h2>
  
            <div className={styles.tokenGrid}>
              <div className={styles.tokenItem}>
                <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
                <p className={styles.tokenValue}>
                  <b>
                    {!claimableRewards
                      ? "Loading..."
                      : ethers.utils.formatUnits(claimableRewards, 18)}
                  </b>{" "}
                  {tokenBalance?.symbol}
                </p>
              </div>
              <div className={styles.tokenItem}>
                <h3 className={styles.tokenLabel}>Current Balance</h3>
                <p className={styles.tokenValue}>
                  <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
                </p>
              </div>
            </div>
  
            <button
              className={`${styles.mainButton} ${styles.spacerTop}`}
              onClick={() => claimRewards()}
            >
              Claim Rewards
            </button>
  
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
  
            <h2>Your Staked Clownies</h2>
            <div className={styles.nftBoxGrid}>
              {stakedNfts?.map((nft) => (
                <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    className={styles.nftMedia}
                  />
                  <h3>{nft.metadata.name}</h3>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => withdraw(nft.metadata.id)}
                  >
                    Withdraw
                  </button>
                </div>
              ))}
            </div>
  
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
  
            <h2>Your Unstaked Clownies</h2>
  
            <div className={styles.nftBoxGrid}>
              {ownedNfts?.map((nft) => (
                <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    className={styles.nftMedia}
                  />
                  <h3>{nft.metadata.name}</h3>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => stakeNft(BigNumber.from(nft.metadata.id))}
                  >
                    Stake
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default Stake;