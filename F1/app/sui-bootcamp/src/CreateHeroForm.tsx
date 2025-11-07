import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const CreateHeroForm = () => {
  const queryClient = useQueryClient();
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction, isPending } =
    useSignAndExecuteTransaction();

  const [heroName, setHeroName] = useState("My Hero");
  const [heroStamina, setHeroStamina] = useState(100);
  const [weaponName, setWeaponName] = useState("My Weapon");
  const [weaponAttack, setWeaponAttack] = useState(1000);

  const handleMint = async () => {
    if (!account) {
      alert("Connect your wallet");
      return;
    }
    if (
      !import.meta.env.VITE_PACKAGE_ID ||
      !import.meta.env.VITE_HEROES_REGISTRY_ID
    ) {
      alert(
        "Environment variables VITE_PACKAGE_ID and VITE_HEROES_REGISTRY_ID must be set in your .env file",
      );
      return;
    }
    const tx = new Transaction();

    // TODO: Populate the commands of the transaction to:
    // TODO: * mint a hero
    // TODO: * mint a weapon
    // TODO: * equip the weapon to the hero
    // TODO: * transfer the hero to the current wallet's address
    const hero = tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::hero::new_hero`,
      arguments: [
        tx.pure.string(heroName),
        tx.pure.u64(Number(heroStamina)),
        tx.object(import.meta.env.VITE_HEROES_REGISTRY_ID),
      ],
    });
    const weapon = tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::hero::new_weapon`,
      arguments: [
        tx.pure.string(weaponName),
        tx.pure.u64(Number(weaponAttack)),
      ],
    });
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::hero::equip_weapon`,
      arguments: [hero, weapon],
    });
    tx.transferObjects([hero], account.address);

    await signAndExecuteTransaction({
      transaction: tx,
    }).then(async (resp) => {
      await suiClient.waitForTransaction({ digest: resp.digest });
      await queryClient.invalidateQueries({
        queryKey: ["testnet", "getOwnedObjects"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["testnet", "getObject"],
      });
    });
  };

  if (!account) {
    return <div>Wallet not connected</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap="3">
      <input
        type="text"
        placeholder="Hero Name"
        value={heroName}
        onChange={(e) => setHeroName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Hero Stamina"
        value={heroStamina}
        onChange={(e) => setHeroStamina(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Weapon Name"
        value={weaponName}
        onChange={(e) => setWeaponName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Weapon Attack"
        value={weaponAttack}
        onChange={(e) => setWeaponAttack(Number(e.target.value))}
      />
      <Button onClick={handleMint}>Mint Hero</Button>
    </Flex>
  );
};
