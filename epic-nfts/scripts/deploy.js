const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  console.log('here after deploy')
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  let txn = await nftContract.makeNFT();
  await txn.wait();
  console.log('nft created')
  txt = await nftContract.makeNFT();
  console.log('nft created')
  await txn.wait();
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch(error){
    console.log(error);
    process.exit(1);
  }
};

runMain()