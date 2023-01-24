import { SmallAddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
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
  Skeleton,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import Transaction from "./transaction";

function Balance({ n }: { n: number }) {
  const { number } = useSpring({
    number: n,
    delay: 100,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        gap: 4,
      }}
    >
      <animated.div>{number.to((n) => n.toFixed(2))}</animated.div> лв
    </div>
  );
}

export default function Dashboard({ session }: { session: Session | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);
  const [sendMoneyModalOpen, setSendMoneyModalOpen] = useState(false);
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false);
  const [sendMoneyLoading, setSendMoneyLoading] = useState(false);
  const [addMoneyLoading, setAddMoneyLoading] = useState(false);
  const toast = useToast();

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  useEffect(() => {
    getBallance();
    getTransactions();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  async function getBallance() {
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

  async function getTransactions() {
    const res = await fetch(process.env.BACKEND_URL + "/transaction/user", {
      method: "POST",
      body: JSON.stringify(session?.user),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    const result = await res.json();

    setTransactions(result.slice(-4).reverse());
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      getBallance();
      getTransactions();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitAddMoney = async (e: any) => {
    e.preventDefault();

    setAddMoneyLoading(true);

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
        getBallance();
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
            getBallance();
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
          >
            {transactions.map((transaction) => (
              <Transaction transaction={transaction} session={session} />
            ))}
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
                          onChange={(e) => {
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
                          }}
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
      </Skeleton>
    </>
  );
}
