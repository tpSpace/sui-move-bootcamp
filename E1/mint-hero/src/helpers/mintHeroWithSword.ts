import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { ENV } from "../env";
import { getAddress } from "./getAddress";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";
/**
 * Builds, signs, and executes a transaction for:
 * * minting a Hero NFT: use the `package_id::hero::mint_hero` function
 * * minting a Sword NFT: use the `package_id::blacksmith::new_sword` function
 * * attaching the Sword to the Hero: use the `package_id::hero::equip_sword` function
 * * transferring the Hero to the signer
 */
export const mintHeroWithSword =
  async (): Promise<SuiTransactionBlockResponse> => {
    // TODO: Implement this function
    const tx = new Transaction();
    // Get the signer
    const signer = getSigner({ secretKey: ENV.USER_SECRET_KEY });
    const hero = tx.moveCall({ target: `${ENV.PACKAGE_ID}::hero::mint_hero` });

    const sword = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::blacksmith::new_sword`,
      arguments: [tx.pure.u64(100)],
    });

    const equipSword = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::equip_sword`,
      arguments: [hero, sword],
    });

    tx.transferObjects(
      [hero],
      getAddress({ secretKey: `${ENV.USER_SECRET_KEY}` }),
    );
    const resp = await suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: signer,
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });
    return resp;
  };
