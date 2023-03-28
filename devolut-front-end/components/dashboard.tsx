import { SmallAddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
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
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  ScaleFade,
  Skeleton,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Balance from "./number";
import Pagination from "./pagination";
import Transaction from "./transaction";

export default function Dashboard({ session }: { session: Session | null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);
  const [sendMoneyModalOpen, setSendMoneyModalOpen] = useState(false);
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false);
  const [sendMoneyLoading, setSendMoneyLoading] = useState(false);
  const [addMoneyLoading, setAddMoneyLoading] = useState(false);
  const toast = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = transactions.slice(startIndex, endIndex);

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  useEffect(() => {
    getBalance();
    getTransactions();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

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

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  async function getTransactions() {
    const res = await fetch(process.env.BACKEND_URL + "/transaction/user", {
      method: "POST",
      body: JSON.stringify({
        id: session?.user.id,
        dTag: session?.user.dTag,
        password: session?.user.password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return signOut();

    const result = await res.json();

    setTransactions(result.reverse());
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      getBalance();
      getTransactions();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAloDa = (e) => {
    let input = e.target.value;
    input = input.replace(/\D/g, "");
    input = input.substring(0, 4);
    let month = input.substring(0, 2);
    let year = input.substring(2);
    if (parseInt(month) > 12) {
      month = "12";
    }
    if (input.length > 1) input = `${month}/${year}`;

    setExpiry(input);
  };

  const handleSubmitAddMoney = async (e: any) => {
    e.preventDefault();

    setAddMoneyLoading(true);

    if (
      Number("20" + expiry.substring(3)) < new Date().getFullYear() ||
      (Number(expiry.substring(0, 2)) < new Date().getMonth() + 1 &&
        Number("20" + expiry.substring(3)) == new Date().getFullYear())
    ) {
      setAddMoneyLoading(false);

      return toast({
        title: "Картата, която се опитвате да използвате, е изтекла!",
        status: "error",
        variant: "left-accent",
        position: "bottom-right",
        isClosable: true,
      });
    }

    setTimeout(async () => {
      const res = await fetch(process.env.BACKEND_URL + "/transaction/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: e.target.cardNumber.value,
          amount: e.target.amount.value,
          dTag: session?.user.dTag,
          id: session?.user.id,
          password: session?.user.password,
        }),
      });

      if (res.ok && res.status == 200) {
        setAddMoneyModalOpen(false);
        setAddMoneyLoading(false);
        setCardNumber("");
        setCvv("");
        setExpiry("");
        getBalance();
        getTransactions();
      } else if (res.status == 404) {
        setAddMoneyModalOpen(false);
        setAddMoneyLoading(false);
        setCardNumber("");
        setCvv("");
        setExpiry("");
        toast({
          title: "Нещо се обърка!",
          status: "error",
          variant: "left-accent",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }, Math.floor(Math.random() * (Math.floor(1300) - Math.ceil(1000)) + Math.ceil(1000)));
  };

  const handleSubmitSendMoney = async (e: any) => {
    e.preventDefault();

    setSendMoneyLoading(true);

    if (e.target.receiver.value == session?.user.dTag) {
      setSendMoneyLoading(false);

      return toast({
        title: "Не можете да пратите пари на себе си!",
        status: "error",
        variant: "left-accent",
        position: "bottom-right",
        isClosable: true,
      });
    }

    await fetch(process.env.BACKEND_URL + "/user/getIdByDTag", {
      method: "POST",
      body: e.target.receiver.value,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.text())
      .then((data) => {
        setTimeout(async () => {
          const res = await fetch(
            process.env.BACKEND_URL + "/transaction/create",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                senderId: session?.user.id,
                receiverId: Number(data),
                amount: e.target.amount.value,
                dTag: session?.user.dTag,
                id: session?.user.id,
                password: session?.user.password,
              }),
            }
          );

          if (res.ok && res.status == 200) {
            setSendMoneyModalOpen(false);
            setSendMoneyLoading(false);
            getBalance();
            getTransactions();
          } else if (res.status == 404) {
            setSendMoneyModalOpen(false);
            setSendMoneyLoading(false);
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
                  <Balance n={balance} />
                </StatNumber>
                <StatHelpText>Български Лев</StatHelpText>
              </Stat>

              <Avatar
                name="BgFlag"
                src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Flag_of_Bulgaria.png"
              />
            </Box>

            <Box
              display={"flex"}
              justifyContent={"flex-start"}
              justifyItems={"flex-start"}
            >
              <ButtonGroup>
                <Button
                  onClick={() => {
                    setAddMoneyModalOpen(true);
                  }}
                  leftIcon={<SmallAddIcon />}
                  size={"md"}
                  rounded={"xl"}
                  h={"9"}
                  colorScheme={"blue"}
                >
                  Добави пари
                </Button>
                <Button
                  onClick={() => {
                    setSendMoneyModalOpen(true);
                  }}
                  leftIcon={<ArrowForwardIcon />}
                  size={"md"}
                  rounded={"xl"}
                  h={"9"}
                  colorScheme={"blue"}
                  isDisabled={balance <= 0}
                >
                  Изпрати
                </Button>
              </ButtonGroup>
            </Box>

            <Text
              marginTop={"2"}
              marginBottom={"3"}
              opacity={"0.8"}
              fontSize={"md"}
            >
              Трансакции
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
                if (transactions.length == 0) {
                  return (
                    <Alert
                      status="info"
                      borderRadius={"md"}
                      fontWeight={"semibold"}
                    >
                      <AlertIcon />
                      Нямате трансакции към този момент!
                    </Alert>
                  );
                } else {
                  return (
                    <>
                      {currentItems.map((item, index) => (
                        <Transaction
                          key={index}
                          transaction={item}
                          session={session}
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
                setAddMoneyModalOpen(false);
                setCardNumber("");
                setCvv("");
                setExpiry("");
              }}
              isOpen={addMoneyModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Добави пари</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleSubmitAddMoney}>
                    <Flex wrap={"wrap"} direction={"column"} gap={"2"}>
                      <Flex wrap={"wrap"}>
                        <Text
                          marginBottom={"1"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                        >
                          Номер на карта
                        </Text>
                        <Input
                          onChange={(e) => {
                            let input = e.target.value;
                            input = input.replace(/\D/g, "");
                            input = input.substring(0, 16);
                            if (input.match(/.{1,4}/g) != null)
                              input = input.match(/.{1,4}/g).join(" ");

                            setCardNumber(input);
                          }}
                          width={"100%"}
                          height={"12"}
                          marginBottom={"2"}
                          minWidth={"0"}
                          fontSize={"lg"}
                          fontWeight={"semibold"}
                          variant="outline"
                          colorScheme={"blue"}
                          name="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          required
                          value={cardNumber}
                          disabled={addMoneyLoading}
                          minLength={19}
                        ></Input>
                      </Flex>

                      <Flex wrap={"nowrap"} gap={"2"}>
                        <Flex wrap={"wrap"}>
                          <Text
                            marginBottom={"1"}
                            fontSize={"md"}
                            fontWeight={"semibold"}
                          >
                            CVV код
                          </Text>
                          <Input
                            onChange={(e) => {
                              let input = e.target.value;
                              input = input.replace(/\D/g, "");
                              input = input.substring(0, 3);

                              setCvv(input);
                            }}
                            width={"100%"}
                            height={"12"}
                            marginBottom={"2"}
                            minWidth={"0"}
                            fontSize={"lg"}
                            fontWeight={"semibold"}
                            variant="outline"
                            colorScheme={"blue"}
                            name="cvv"
                            placeholder="410"
                            required
                            value={cvv}
                            disabled={addMoneyLoading}
                            minLength={3}
                          ></Input>
                        </Flex>

                        <Flex wrap={"wrap"}>
                          <Text
                            marginBottom={"1"}
                            fontSize={"md"}
                            fontWeight={"semibold"}
                          >
                            Валидност на картата
                          </Text>
                          <Input
                            onChange={handleAloDa}
                            width={"100%"}
                            height={"12"}
                            marginBottom={"2"}
                            minWidth={"0"}
                            fontSize={"lg"}
                            fontWeight={"semibold"}
                            variant="outline"
                            colorScheme={"blue"}
                            name="expiry"
                            placeholder="11/21"
                            required
                            value={expiry}
                            disabled={addMoneyLoading}
                            minLength={5}
                          ></Input>
                        </Flex>
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
                          max={1000}
                          precision={2}
                          size="md"
                          marginBottom={"2"}
                          width={"100%"}
                          name="amount"
                          isDisabled={addMoneyLoading}
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
                          isLoading={addMoneyLoading}
                        >
                          Добави
                        </Button>
                        <Button
                          onClick={() => {
                            setAddMoneyModalOpen(false);
                            setCardNumber("");
                            setCvv("");
                            setExpiry("");
                          }}
                          colorScheme="red"
                          width={"100%"}
                          isDisabled={addMoneyLoading}
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
                setSendMoneyModalOpen(false);
              }}
              isOpen={sendMoneyModalOpen}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Изпрати пари</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleSubmitSendMoney}>
                    <Flex wrap={"wrap"} direction={"column"} gap={"2"}>
                      <Flex wrap={"wrap"}>
                        <Text
                          marginBottom={"1"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                        >
                          Получател
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
                          name="receiver"
                          placeholder="Devolut Tag"
                          required
                          disabled={sendMoneyLoading}
                        ></Input>
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
                          isDisabled={sendMoneyLoading}
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
                          isLoading={sendMoneyLoading}
                        >
                          Изпрати
                        </Button>
                        <Button
                          onClick={() => {
                            setSendMoneyModalOpen(false);
                          }}
                          colorScheme="red"
                          width={"100%"}
                          isDisabled={sendMoneyLoading}
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
