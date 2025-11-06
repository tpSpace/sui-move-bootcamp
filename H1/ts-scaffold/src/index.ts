import { ENV } from "./env";
import { SuiClient } from "@mysten/sui/client";
import { getSigner } from "./helpers/getSigner";
import { Transaction } from "@mysten/sui/transactions";
const main = () => {
  console.log("Hello, world!");
  // console.log("This is the Sui sui network: ", ENV.SUI_NETWORK);

  const client = new SuiClient({
    url: ENV.SUI_NETWORK,
    // network: "testnet",
  })
  const signer = getSigner({ secretKey: ENV.USER_PRIVATE_KEY });
  console.log("Client: ", signer.getPublicKey().toSuiAddress());

  const tx = new Transaction();

  const hero = tx.moveCall({
    target: `${ENV.PACKAGE_ID}::hero::mint_hero`,
    arguments: [tx.object(ENV.VERSION_ID)],
  })

  const blacksmith = tx.moveCall({ target: `${ENV.PACKAGE_ID}::blacksmith::new_blacksmith`, arguments: [
    tx.object(ENV.PUBLISHER_ID),
    tx.pure.u64(1000)
  ] });

  const sword = tx.moveCall({ target: `${ENV.PACKAGE_ID}::blacksmith::new_sword`, arguments: [
    blacksmith,
    tx.pure.u64(250)
  ] });

  const equip = tx.moveCall({ target: `${ENV.PACKAGE_ID}::hero::equip_sword`, arguments: [
    hero,
    tx.object(ENV.VERSION_ID),
    sword
  ] });

  tx.transferObjects([hero, blacksmith], signer.getPublicKey().toSuiAddress());
  
  client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options : {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    }
  }).then((result) => {
    console.log("Transaction result: ", result);
  }).catch((error) => {
    console.error("Error executing transaction: ", error);
  });
};

main();
