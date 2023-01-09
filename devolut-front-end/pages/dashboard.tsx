import { SmallAddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  ScaleFade,
  Skeleton,
  Stat,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

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

  useEffect(() => {
    getBallance();
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

  useEffect(() => {
    const interval = setInterval(async () => {
      getBallance();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Skeleton isLoaded={!isLoading} borderRadius={"md"}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={"2"}
          paddingX={"6"}
          paddingY={"3"}
          height={"200px"}
          backgroundColor={"gray.700"}
          borderRadius={"md"}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
          >
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
              <Button leftIcon={<SmallAddIcon/>} size={"md"} rounded={"xl"} h={"9"} colorScheme={"blue"}>Добави пари</Button>
              <Button leftIcon={<ArrowForwardIcon/>} size={"md"} rounded={"xl"} h={"9"} colorScheme={"blue"}>Изпрати</Button>
            </ButtonGroup>
          </Box>

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
