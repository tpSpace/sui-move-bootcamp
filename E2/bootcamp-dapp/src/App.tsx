import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { useEffect } from "react";
import { Transaction } from "@mysten/sui/transactions";

function mintHero() {
  9;
  const mint = useSignAndExecuteTransaction({
    transaction: new Transaction(),
    chain: "sui:testnet",
  });
}

function App() {
  useEffect(() => {}, []);

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>dApp Starter Template</Heading>
          <Button onClick={mintHero}>Mint Hero</Button>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
        </Container>
      </Container>
    </>
  );
}

export default App;
