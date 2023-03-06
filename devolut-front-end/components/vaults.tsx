import { PlusSquareIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  ScaleFade,
  Select,
  Skeleton,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import Balance from "./number";
import Vault from "./vault";

export default function Vaults({ session }: { session: Session | null }) {
  const [vaults, setVaults] = useState([]);
  const [balance, setBalance] = useState(0.0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [createVaultModalOpen, setCreateVaultModalOpen] = useState(false);
  const [addMoneyIntoVaultModalOpen, setAddMoneyIntoVaultModalOpen] =
    useState(false);
  const [createVaultLoading, setCreateVaultLoading] = useState(false);
  const [addMoneyIntoVaultLoading, setAddMoneyIntoVaultLoading] =
    useState(false);
  const [hovered, setHovered] = useState("");
  const toast = useToast();

  useEffect(() => {
    getVaults();
    getBalance();

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  async function getVaults() {
    const res = await fetch(process.env.BACKEND_URL + "/vault/user", {
      method: "POST",
      body: JSON.stringify({
        id: session?.user.id,
        dTag: session?.user.dTag,
        password: session?.user.password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    const vaults = await res.json();

    let totalBalance = 0;

    vaults.forEach((vault) => {
      totalBalance += vault.balance;
    });

    setVaults(vaults);
    setTotalBalance(totalBalance);
  }

  async function getBalance() {
    const res = await fetch(process.env.BACKEND_URL + "/user/read", {
      method: "POST",
      body: JSON.stringify({
        email: session?.user.dTag,
        password: session?.user.password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    const user = await res.json();

    setBalance(user.balance);
  }

  const handleVaultCreation = async (e: any) => {
    e.preventDefault();

    setCreateVaultLoading(true);

    setTimeout(async () => {
      var res;

      if (e.target.goal.value == "") {
        res = await fetch(process.env.BACKEND_URL + "/vault/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: e.target.name.value,
            ownerId: session?.user.id,
            type: e.target.type.value,
          }),
        });
      } else {
        res = await fetch(process.env.BACKEND_URL + "/vault/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: e.target.name.value,
            ownerId: session?.user.id,
            type: e.target.type.value,
            goal: e.target.goal.value,
          }),
        });
      }

      if (res.ok && res.status == 200) {
        setCreateVaultModalOpen(false);
        setCreateVaultLoading(false);
        getVaults();
      } else if (res.status == 302) {
        setCreateVaultModalOpen(false);
        setCreateVaultLoading(false);
        toast({
          title: "Сейф с такова име вече съществува!",
          status: "error",
          variant: "left-accent",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }, Math.floor(Math.random() * (Math.floor(700) - Math.ceil(500)) + Math.ceil(500)));
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      getVaults();
      getBalance();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Skeleton isLoaded={!isLoading} borderRadius={"md"}>
        <ScaleFade initialScale={0.9} in={!isLoading}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={"2"}
            paddingX={"6"}
            paddingY={"3"}
            height={"auto"}
            backgroundColor={"gray.700"}
            borderRadius={"md"}
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Stat>
                <StatNumber>
                  <Balance n={totalBalance} />
                </StatNumber>
                <StatHelpText>Общ баланс</StatHelpText>
              </Stat>

              <Avatar name="BgFlag" src="https://pngimg.com/d/safe_PNG33.png" />
            </Box>

            <Box
              display={"flex"}
              justifyContent={"flex-start"}
              justifyItems={"flex-start"}
            >
              <ButtonGroup>
                <Button
                  onClick={() => {
                    setCreateVaultModalOpen(true);
                  }}
                  leftIcon={<PlusSquareIcon />}
                  size={"md"}
                  rounded={"xl"}
                  h={"9"}
                  colorScheme={"blue"}
                >
                  Създай сейф
                </Button>
                <Button
                  onClick={() => {
                    setAddMoneyIntoVaultModalOpen(true);
                  }}
                  leftIcon={<SmallAddIcon />}
                  size={"md"}
                  rounded={"xl"}
                  h={"9"}
                  colorScheme={"blue"}
                >
                  Добави пари
                </Button>
              </ButtonGroup>
            </Box>

            <Text
              marginTop={"2"}
              marginBottom={"3"}
              opacity={"0.8"}
              fontSize={"md"}
            >
              Сейфове
            </Text>

            <Box
              display={"flex"}
              flexWrap={"wrap"}
              flexDirection={"column"}
              gap={"3"}
              justifyContent={"flex-start"}
              justifyItems={"flex-start"}
            >
              {vaults.map((vault, index) => (
                <Vault
                  key={vault.id}
                  vault={vault}
                  hovered={hovered}
                  setHovered={setHovered}
                />
              ))}
            </Box>

            <Modal
              onClose={() => {
                setCreateVaultModalOpen(false);
              }}
              isOpen={createVaultModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Създай сейф</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleVaultCreation}>
                    <Flex wrap={"wrap"} direction={"column"} gap={"2"}>
                      <Flex wrap={"wrap"}>
                        <Text
                          marginBottom={"1"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                        >
                          Тип на сейфа
                        </Text>
                        <Select
                          width={"100%"}
                          height={"12"}
                          marginBottom={"2"}
                          minWidth={"0"}
                          fontSize={"lg"}
                          fontWeight={"semibold"}
                          variant="outline"
                          colorScheme={"blue"}
                          name="type"
                          required
                        >
                          <option value="personal">Личен</option>
                          <option value="shared">Споделен</option>
                        </Select>
                      </Flex>

                      <Flex wrap={"wrap"}>
                        <Text
                          marginBottom={"1"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                        >
                          Име
                        </Text>
                        <Input
                          width={"100%"}
                          height={"12"}
                          marginBottom={"2"}
                          minWidth={"0"}
                          fontSize={"lg"}
                          fontWeight={"semibold"}
                          variant="outline"
                          colorScheme={"blue"}
                          name="name"
                          placeholder="Спестявания"
                          required
                          disabled={createVaultLoading}
                        ></Input>
                      </Flex>

                      <Flex wrap={"wrap"}>
                        <Text
                          marginBottom={"1"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                        >
                          Цел (Остави празно ако няма)
                        </Text>
                        <NumberInput
                          min={0.01}
                          precision={2}
                          size="md"
                          marginBottom={"2"}
                          width={"100%"}
                          name="goal"
                          isDisabled={createVaultLoading}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </Flex>

                      <Flex
                        justify="space-between"
                        wrap="nowrap"
                        mb="3"
                        mt="4"
                        gap={"2"}
                      >
                        <Button
                          colorScheme="green"
                          type="submit"
                          width={"100%"}
                          isLoading={createVaultLoading}
                        >
                          Създай
                        </Button>
                        <Button
                          onClick={() => {
                            setCreateVaultModalOpen(false);
                          }}
                          colorScheme="red"
                          width={"100%"}
                          isDisabled={createVaultLoading}
                        >
                          Откажи
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal
              onClose={() => {
                setAddMoneyIntoVaultModalOpen(false);
              }}
              isOpen={addMoneyIntoVaultModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Добави пари</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form>
                    <Flex wrap={"wrap"} direction={"column"} gap={"2"}>
                      <Flex wrap={"wrap"}>
                        <Text
                          marginBottom={"1"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                        >
                          Сейф
                        </Text>
                        <Select
                          width={"100%"}
                          height={"12"}
                          marginBottom={"2"}
                          minWidth={"0"}
                          fontSize={"lg"}
                          fontWeight={"semibold"}
                          variant="outline"
                          colorScheme={"blue"}
                          name="vault"
                          required
                          disabled={addMoneyIntoVaultLoading}
                        >
                          {vaults.map((vault) => (
                            <option value={vault.id}>{vault.name}</option>
                          ))}
                        </Select>
                      </Flex>

                      <Flex wrap={"wrap"}>
                        <Text
                          marginBottom={"1"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                        >
                          Сума
                        </Text>
                        <NumberInput
                          defaultValue={1}
                          min={0.01}
                          max={balance}
                          precision={2}
                          size="md"
                          marginBottom={"2"}
                          width={"100%"}
                          name="amount"
                          isDisabled={addMoneyIntoVaultLoading}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </Flex>

                      <Flex
                        justify="space-between"
                        wrap="nowrap"
                        mb="3"
                        mt="4"
                        gap={"2"}
                      >
                        <Button
                          colorScheme="green"
                          type="submit"
                          width={"100%"}
                          isLoading={addMoneyIntoVaultLoading}
                        >
                          Създай
                        </Button>
                        <Button
                          onClick={() => {
                            setAddMoneyIntoVaultModalOpen(false);
                          }}
                          colorScheme="red"
                          width={"100%"}
                          isDisabled={addMoneyIntoVaultLoading}
                        >
                          Откажи
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </ScaleFade>
      </Skeleton>
    </>
  );
}
