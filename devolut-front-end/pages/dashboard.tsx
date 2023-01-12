import { SmallAddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
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
  const [sendMoneyLoading, setSendMoneyLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getBallance();
    getTransactions();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  async function getBallance() {
    const res = await fetch("http://localhost:8080/user/read", {
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
    const res = await fetch("http://localhost:8080/transaction/user", {
      method: "POST",
      body: JSON.stringify(session?.user),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    const result = await res.json();

    setTransactions(result);
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      getBallance();
      getTransactions();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setSendMoneyLoading(true);

    await fetch("http://localhost:8080/user/getIdByDTag", {
      method: "POST",
      body: e.target.receiver.value,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.text())
      .then((data) => {
        setTimeout(async () => {
          const res = await fetch("http://localhost:8080/transaction/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              senderId: session?.user.id,
              receiverId: Number(data),
              amount: e.target.amount.value,
              dTag: session?.user.dTag,
              id: session?.user.id,
              password: session?.user.password
            }),
          });

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
                <form onSubmit={handleSubmit}>
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

          {/* <ScaleFade initialScale={0.9} in={!isLoading}>
            <Box
              background={"blackAlpha.700"}
              padding={"2"}
              width={"fit-content"}
              borderRadius={"md"}
            >
              <ButtonGroup display={"inline-flex"}>
                <IconButton
                  colorScheme={"red"}
                  fontSize={"lg"}
                  minWidth={"12"}
                  height={"12"}
                  disabled={true}
                  aria-label="Bug Report"
                  icon={<BugIcon />}
                ></IconButton>
                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme={"green"}
                  paddingInline={"6"}
                  fontSize={"lg"}
                  minWidth={"12"}
                  height={"12"}
                >
                  Download
                </Button>
              </ButtonGroup>
            </Box>
          </ScaleFade> */}
        </Box>
      </Skeleton>
    </>
  );
}
