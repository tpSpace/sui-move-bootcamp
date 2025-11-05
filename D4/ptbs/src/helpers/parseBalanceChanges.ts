import { BalanceChange } from "@mysten/sui/client";

interface Args {
  balanceChanges: BalanceChange[];
  senderAddress: string;
  recipientAddress: string;
}

interface Response {
  recipientSUIBalanceChange: number;
  senderSUIBalanceChange: number;
}

export const parseBalanceChanges = ({
  balanceChanges,
  senderAddress,
  recipientAddress,
}: Args): Response => {
  const SUI_TYPE = "0x2::sui::SUI";
  console.log(balanceChanges);
  const recipientSUIBalanceChange = balanceChanges
    .filter((change) => change.coinType === SUI_TYPE)
    .filter((change) => {
      // owner in latest SDK is a string when it's an address owner
      return change.owner === recipientAddress;
    })
    .reduce((acc, change) => acc + Number(change.amount), 0);

  const senderSUIBalanceChange = balanceChanges
    .filter((change) => change.coinType === SUI_TYPE)
    .filter((change) => {
      return change.owner === senderAddress;
    })
    .reduce((acc, change) => acc + Number(change.amount), 0);

  return {
    recipientSUIBalanceChange,
    senderSUIBalanceChange,
  };
};
