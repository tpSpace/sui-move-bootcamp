import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { ENV } from "../env";
import { getAddress } from "./getAddress";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";

/**
 * Builds, signs, and executes a transaction for:
 * * minting a Hero NFT
 * * minting a Weapon NFT
 * * attaching the Weapon to the Hero
 * * transferring the Hero to the signer's address
 */
export const mintHeroWithWeapon =
    async (): Promise<SuiTransactionBlockResponse> => {
        // TODO: Implement the function
        const tx = new Transaction();

        const r = Math.random();

        const hero = tx.moveCall({
            target: `${ENV.PACKAGE_ID}::hero::new_hero`,
            arguments: [
                tx.pure.string("My Cool hero"),
                tx.pure.u64(66),
                tx.object(ENV.HEROES_REGISTRY_ID),
            ],
        });

        const weapon = tx.moveCall({
            target: `${ENV.PACKAGE_ID}::hero::new_weapon`,
            arguments: [tx.pure.string("My Cool weapon"), tx.pure.u64(100)],
        });

        tx.moveCall({
            target: `${ENV.PACKAGE_ID}::hero::equip_weapon`,
            arguments: [hero, weapon],
        });

        const signer = getSigner({ secretKey: ENV.USER_SECRET_KEY });

        const address = signer.getPublicKey().toSuiAddress();
        console.log(address);
        tx.transferObjects([hero], address);

        return suiClient.signAndExecuteTransaction({
            transaction: tx,
            signer,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });
    };
