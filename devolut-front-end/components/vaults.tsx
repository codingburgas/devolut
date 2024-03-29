import { PlusSquareIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
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
  ModalFooter,
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Balance from "./number";
import Pagination from "./pagination";
import Vault from "./vault";

interface Vault {
  id: number;
  ownerId: number;
  balance: number;
  goal: number;
  name: string;
  type: string;
  usersWithAccess: any;
}

export default function Vaults({ session }: { session: Session }) {
  const [vaults, setVaults] = useState([]);
  const [currentVault, setCurrentVault] = useState<Vault>({
    id: 0,
    ownerId: 0,
    balance: 0,
    goal: 0,
    name: "",
    type: "",
    usersWithAccess: [],
  });
  const [vaultUsersDTags, setVaultUsersDTags] = useState([]);
  const [balance, setBalance] = useState(0.0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [createVaultModalOpen, setCreateVaultModalOpen] = useState(false);
  const [addMoneyIntoVaultModalOpen, setAddMoneyIntoVaultModalOpen] =
    useState(false);
  const [takeMoneyFromVaultModalOpen, setTakeMoneyFromVaultModalOpen] =
    useState(false);
  const [giveUserVaultAccessModalOpen, setGiveUserVaultAccessModalOpen] =
    useState(false);
  const [editVaultModalOpen, setEditVaultModalOpen] = useState(false);
  const [deleteVaultModalOpen, setDeleteVaultModalOpen] = useState(false);
  const [createVaultLoading, setCreateVaultLoading] = useState(false);
  const [addMoneyIntoVaultLoading, setAddMoneyIntoVaultLoading] =
    useState(false);
  const [takeMoneyFromVaultLoading, setTakeMoneyFromVaultLoading] =
    useState(false);
  const [giveUserVaultAccessLoading, setGiveUserVaultAccessLoading] =
    useState(false);
  const [removeUserVaultAccessLoading, setRemoveUserVaultAccessLoading] =
    useState(false);
  const [editVaultLoading, setEditVaultLoading] = useState(false);
  const [deleteVaultLoading, setDeleteVaultLoading] = useState(false);
  const [hovered, setHovered] = useState(null);
  const toast = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(vaults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = vaults.slice(startIndex, endIndex);
  const [tabIndex, setTabIndex] = useState(0);

  function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

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

    if (!res.ok) return signOut();

    const vaults = await res.json();

    let totalBalance = 0;

    vaults.forEach((vault: Vault) => {
      totalBalance += vault.balance;
    });

    setVaults(vaults);
    setTotalBalance(totalBalance);
  }

  async function getBalance() {
    const res = await fetch(process.env.BACKEND_URL + "/user/balance", {
      method: "POST",
      body: JSON.stringify({
        id: session?.user.id,
        dTag: session?.user.dTag,
        password: session?.user.password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return signOut();

    const balance = await res.json();

    setBalance(balance);
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

  const handleVaultDeposit = async (e: any) => {
    e.preventDefault();

    setAddMoneyIntoVaultLoading(true);

    setTimeout(async () => {
      const res = await fetch(process.env.BACKEND_URL + "/vault/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaultId: e.target.vault.value,
          amount: e.target.amount.value,
          id: session?.user.id,
          dTag: session?.user.dTag,
          password: session?.user.password,
        }),
      });

      if (res.ok && res.status == 200) {
        setAddMoneyIntoVaultModalOpen(false);
        setAddMoneyIntoVaultLoading(false);
        getVaults();
      } else if (res.status == 404) {
        setAddMoneyIntoVaultModalOpen(false);
        setAddMoneyIntoVaultLoading(false);
        toast({
          title: "Нещо се обърка!",
          status: "error",
          variant: "left-accent",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }, Math.floor(Math.random() * (Math.floor(700) - Math.ceil(500)) + Math.ceil(500)));
  };

  const handleVaultWithdraw = async (e: any) => {
    e.preventDefault();

    setTakeMoneyFromVaultLoading(true);

    setTimeout(async () => {
      const res = await fetch(process.env.BACKEND_URL + "/vault/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaultId: currentVault.id,
          amount: e.target.amount.value,
          id: session?.user.id,
          dTag: session?.user.dTag,
          password: session?.user.password,
        }),
      });

      if (res.ok && res.status == 200) {
        setTakeMoneyFromVaultModalOpen(false);
        setTakeMoneyFromVaultLoading(false);
        getVaults();
      } else if (res.status == 404) {
        setTakeMoneyFromVaultModalOpen(false);
        setTakeMoneyFromVaultLoading(false);
        toast({
          title: "Нещо се обърка!",
          status: "error",
          variant: "left-accent",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }, Math.floor(Math.random() * (Math.floor(700) - Math.ceil(500)) + Math.ceil(500)));
  };

  const handleVaultShare = async (e: any) => {
    e.preventDefault();

    setGiveUserVaultAccessLoading(true);

    await fetch(process.env.BACKEND_URL + "/user/getIdByDTag", {
      method: "POST",
      body: e.target.dTag.value,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.text())
      .then((data) => {
        setTimeout(async () => {
          const res = await fetch(process.env.BACKEND_URL + "/vault/share", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              vaultId: currentVault.id,
              userId: Number(data),
              id: session?.user.id,
              dTag: session?.user.dTag,
              password: session?.user.password,
            }),
          });

          if (res.ok && res.status == 200) {
            toast({
              title: `Успешно споделихте ${currentVault.name} с ${e.target.dTag.value}!`,
              status: "success",
              variant: "left-accent",
              position: "bottom-right",
              isClosable: true,
            });
            setGiveUserVaultAccessModalOpen(false);
            setGiveUserVaultAccessLoading(false);
            getVaults();
          } else if (res.status == 302) {
            toast({
              title: `Потребителят ${e.target.dTag.value} вече има достъп до ${currentVault.name}!`,
              status: "error",
              variant: "left-accent",
              position: "bottom-right",
              isClosable: true,
            });
            setGiveUserVaultAccessModalOpen(false);
            setGiveUserVaultAccessLoading(false);
          } else if (res.status == 404) {
            setGiveUserVaultAccessModalOpen(false);
            setGiveUserVaultAccessLoading(false);
            toast({
              title: "Не можете да споделите сейфа със себе си!",
              status: "error",
              variant: "left-accent",
              position: "bottom-right",
              isClosable: true,
            });
          } else if (res.status == 500) {
            setGiveUserVaultAccessModalOpen(false);
            setGiveUserVaultAccessLoading(false);
            toast({
              title: "Потребител с такъв Devolut Tag не съществува!",
              status: "error",
              variant: "left-accent",
              position: "bottom-right",
              isClosable: true,
            });
          }
        }, Math.floor(Math.random() * (Math.floor(700) - Math.ceil(500)) + Math.ceil(500)));
      });
  };

  const handleVaultEdit = async (e: any) => {
    e.preventDefault();

    setEditVaultLoading(true);

    setTimeout(async () => {
      const res = await fetch(process.env.BACKEND_URL + "/vault/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaultId: currentVault.id,
          goal: e.target.goal.value,
          name: e.target.name.value,
          type: e.target.type.value,
          id: session?.user.id,
          dTag: session?.user.dTag,
          password: session?.user.password,
        }),
      });

      if (res.ok && res.status == 200) {
        setEditVaultModalOpen(false);
        setEditVaultLoading(false);
        getVaults();
      } else if (res.status == 404) {
        setEditVaultModalOpen(false);
        setEditVaultLoading(false);
        toast({
          title: "Нещо се обърка!",
          status: "error",
          variant: "left-accent",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }, Math.floor(Math.random() * (Math.floor(700) - Math.ceil(500)) + Math.ceil(500)));
  };

  const handleVaultDelete = async () => {
    setDeleteVaultLoading(true);

    setTimeout(async () => {
      const res = await fetch(process.env.BACKEND_URL + "/vault/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaultId: currentVault.id,
          id: session?.user.id,
          dTag: session?.user.dTag,
          password: session?.user.password,
        }),
      });

      if (res.ok && res.status == 200) {
        setDeleteVaultModalOpen(false);
        setDeleteVaultLoading(false);
        getVaults();
      } else if (res.status == 404) {
        setDeleteVaultModalOpen(false);
        setDeleteVaultLoading(false);
        toast({
          title: "Нещо се обърка!",
          status: "error",
          variant: "left-accent",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }, Math.floor(Math.random() * (Math.floor(700) - Math.ceil(500)) + Math.ceil(500)));
  };

  const handleVaultUserRemove = async (e: any) => {
    e.preventDefault();

    setRemoveUserVaultAccessLoading(true);

    setTimeout(async () => {
      const res = await fetch(
        process.env.BACKEND_URL + "/vault/removeUserAccess",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vaultId: currentVault.id,
            userDTag: e.target.user.value,
            id: session?.user.id,
            dTag: session?.user.dTag,
            password: session?.user.password,
          }),
        }
      );

      if (res.ok && res.status == 200) {
        toast({
          title: `Успешно премахнахте достъпът на ${e.target.user.value} до ${currentVault.name}!`,
          status: "success",
          variant: "left-accent",
          position: "bottom-right",
          isClosable: true,
        });

        setGiveUserVaultAccessModalOpen(false);
        setRemoveUserVaultAccessLoading(false);
        setTabIndex(0);
        getVaults();
      } else if (res.status == 404) {
        setGiveUserVaultAccessModalOpen(false);
        setRemoveUserVaultAccessLoading(false);
        setTabIndex(0);
        toast({
          title: "Нещо се обърка!",
          status: "error",
          variant: "left-accent",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }, Math.floor(Math.random() * (Math.floor(700) - Math.ceil(500)) + Math.ceil(500)));
  };

  const removeUserVaultAccess = async (currentVault: Vault) => {
    const res = await fetch(process.env.BACKEND_URL + "/vault/getUsers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vaultId: currentVault.id,
        id: session?.user.id,
        dTag: session?.user.dTag,
        password: session?.user.password,
      }),
    });

    if (res.ok && res.status == 200) {
      const users = await res.json();
      setVaultUsersDTags(users);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      getVaults();
      getBalance();
    }, 1000);

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
                  disabled={currentItems.length <= 0}
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
              marginBottom={"2"}
            >
              {(() => {
                if (vaults.length == 0) {
                  return (
                    <Alert
                      status="info"
                      borderRadius={"md"}
                      fontWeight={"semibold"}
                    >
                      <AlertIcon />
                      Нямате сейфове към този момент!
                    </Alert>
                  );
                } else {
                  return (
                    <>
                      {currentItems.map((item: Vault, index) => (
                        <Vault
                          key={item.id}
                          session={session}
                          vault={item}
                          hovered={hovered}
                          setHovered={setHovered}
                          setCurrentVault={setCurrentVault}
                          setAddMoneyIntoVaultModalOpen={
                            setAddMoneyIntoVaultModalOpen
                          }
                          setTakeMoneyFromVaultModalOpen={
                            setTakeMoneyFromVaultModalOpen
                          }
                          setGiveUserVaultAccessModalOpen={
                            setGiveUserVaultAccessModalOpen
                          }
                          removeUserVaultAccess={removeUserVaultAccess}
                          setEditVaultModalOpen={setEditVaultModalOpen}
                          setDeleteVaultModalOpen={setDeleteVaultModalOpen}
                        />
                      ))}
                      {totalPages > 1 ? (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      ) : (
                        <></>
                      )}
                    </>
                  );
                }
              })()}
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
                setCurrentVault({
                  id: 0,
                  ownerId: 0,
                  balance: 0,
                  goal: 0,
                  name: "",
                  type: "",
                  usersWithAccess: [],
                });
              }}
              isOpen={addMoneyIntoVaultModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Добави пари</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleVaultDeposit}>
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
                          {vaults.map((vault: Vault) => (
                            <option
                              selected={currentVault.id == vault.id}
                              value={vault.id}
                            >
                              {vault.name}
                            </option>
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
                          Добави
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

            <Modal
              onClose={() => {
                setTakeMoneyFromVaultModalOpen(false);
              }}
              isOpen={takeMoneyFromVaultModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Изтегли пари от {currentVault.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleVaultWithdraw}>
                    <Flex wrap={"wrap"} direction={"column"} gap={"2"}>
                      <Flex wrap={"wrap"}>
                        <Text
                          marginBottom={"1"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                        >
                          Сума
                        </Text>
                        <NumberInput
                          defaultValue={
                            currentVault.balance < 1 ? currentVault.balance : 1
                          }
                          min={0.01}
                          max={currentVault.balance}
                          precision={2}
                          size="md"
                          marginBottom={"2"}
                          width={"100%"}
                          name="amount"
                          isDisabled={takeMoneyFromVaultLoading}
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
                          isLoading={takeMoneyFromVaultLoading}
                        >
                          Изтегли
                        </Button>
                        <Button
                          onClick={() => {
                            setTakeMoneyFromVaultModalOpen(false);
                          }}
                          colorScheme="red"
                          width={"100%"}
                          isDisabled={takeMoneyFromVaultLoading}
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
                setGiveUserVaultAccessModalOpen(false);
                setCurrentVault({
                  id: 0,
                  ownerId: 0,
                  balance: 0,
                  goal: 0,
                  name: "",
                  type: "",
                  usersWithAccess: [],
                });
                setTabIndex(0);
              }}
              isOpen={giveUserVaultAccessModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalBody>
                  <Tabs
                    onChange={(index) => setTabIndex(index)}
                    isFitted
                    colorScheme={"blue"}
                  >
                    <TabList>
                      <Tab isDisabled={removeUserVaultAccessLoading || giveUserVaultAccessLoading} fontWeight={"semibold"}>Сподели</Tab>
                      <Tab isDisabled={currentVault.usersWithAccess.length <= 0 || removeUserVaultAccessLoading || giveUserVaultAccessLoading} fontWeight={"semibold"}>Премахни</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        {tabIndex == 0 ? (
                          <>
                            <form onSubmit={handleVaultShare}>
                              <Flex
                                wrap={"wrap"}
                                direction={"column"}
                                gap={"2"}
                              >
                                <Flex wrap={"wrap"}>
                                  <Text
                                    marginBottom={"1"}
                                    fontSize={"md"}
                                    fontWeight={"semibold"}
                                  >
                                    Devolut Tag
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
                                    name="dTag"
                                    required
                                    disabled={giveUserVaultAccessLoading}
                                  ></Input>
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
                                    isLoading={giveUserVaultAccessLoading}
                                  >
                                    Сподели
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setGiveUserVaultAccessModalOpen(false);
                                    }}
                                    width={"100%"}
                                    isDisabled={giveUserVaultAccessLoading}
                                  >
                                    Откажи
                                  </Button>
                                </Flex>
                              </Flex>
                            </form>
                          </>
                        ) : (
                          <></>
                        )}
                      </TabPanel>
                      <TabPanel>
                        {tabIndex == 1 ? (
                          <>
                            <form onSubmit={handleVaultUserRemove}>
                              <Flex
                                wrap={"wrap"}
                                direction={"column"}
                                gap={"2"}
                              >
                                <Flex wrap={"wrap"}>
                                  <Text
                                    marginBottom={"1"}
                                    fontSize={"md"}
                                    fontWeight={"semibold"}
                                  >
                                    Devolut Tag
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
                                    name="user"
                                    required
                                    disabled={removeUserVaultAccessLoading}
                                  >
                                    {vaultUsersDTags.map((user) => (
                                      <option value={user}>{user}</option>
                                    ))}
                                  </Select>
                                </Flex>

                                <Flex
                                  justify="space-between"
                                  wrap="nowrap"
                                  mb="3"
                                  mt="4"
                                  gap={"2"}
                                >
                                  <Button
                                    colorScheme="red"
                                    type="submit"
                                    width={"100%"}
                                    isLoading={removeUserVaultAccessLoading}
                                  >
                                    Премахни
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setGiveUserVaultAccessModalOpen(false);
                                      setTabIndex(0);
                                    }}
                                    colorScheme="gray"
                                    width={"100%"}
                                    isDisabled={removeUserVaultAccessLoading}
                                  >
                                    Откажи
                                  </Button>
                                </Flex>
                              </Flex>
                            </form>
                          </>
                        ) : (
                          <></>
                        )}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal
              onClose={() => {
                setEditVaultModalOpen(false);
              }}
              isOpen={editVaultModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Редактиране на сейф</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleVaultEdit}>
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
                          <option
                            selected={currentVault.type == "personal"}
                            value="personal"
                          >
                            Личен
                          </option>
                          <option
                            selected={currentVault.type == "shared"}
                            value="shared"
                          >
                            Споделен
                          </option>
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
                          defaultValue={currentVault.name}
                          required
                          disabled={editVaultLoading}
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
                          defaultValue={currentVault.goal}
                          isDisabled={editVaultLoading}
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
                          isLoading={editVaultLoading}
                        >
                          Редактирай
                        </Button>
                        <Button
                          onClick={() => {
                            setEditVaultModalOpen(false);
                          }}
                          colorScheme="red"
                          width={"100%"}
                          isDisabled={editVaultLoading}
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
                setDeleteVaultModalOpen(false);
              }}
              isOpen={deleteVaultModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Изтрийте сейф</ModalHeader>
                <ModalBody>
                  Наистина ли искате да изтриете сейф{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {currentVault.name}
                  </span>
                  ?
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      setDeleteVaultModalOpen(false);
                    }}
                    isDisabled={deleteVaultLoading}
                  >
                    Откажи
                  </Button>
                  <Button
                    colorScheme="red"
                    ml={3}
                    onClick={handleVaultDelete}
                    isLoading={deleteVaultLoading}
                  >
                    Изтрий
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </ScaleFade>
      </Skeleton>
    </>
  );
}
