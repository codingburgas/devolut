import {
  Box,
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

  return <div style={{display: "flex", alignItems: "center", justifyContent: "start", gap: 4}}><animated.div>{number.to((n) => n.toFixed(2))}</animated.div> лв</div>;
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

  const BugIcon = () => (
    <Icon
      viewBox="0 0 16 16"
      fill="currentcolor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A4.985 4.985 0 0 0 3 6h10a4.985 4.985 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A4.978 4.978 0 0 0 8 1a4.979 4.979 0 0 0-2.731.811l-.29-.956z"></path>
      <path d="M13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5H13zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975z"></path>
    </Icon>
  );

  const DownloadIcon = () => (
    <Icon
      viewBox="0 0 16 16"
      fill="currentcolor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
    </Icon>
  );
  return (
    <>
      <Skeleton isLoaded={!isLoading} borderRadius={"md"}>
        <Box
          position={"relative"}
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"flex-end"}
          padding={"2"}
          height={"200px"}
          backgroundColor={"blackAlpha.500"}
          borderRadius={"md"}
        >
          <Stat position={"absolute"} top={"2"} left={"2"}>
            <StatNumber>
              <Balance n={balance} />
            </StatNumber>
            <StatHelpText>Bulgarian Lev</StatHelpText>
          </Stat>
          <ScaleFade initialScale={0.9} in={!isLoading}>
            <Box
              background={"blackAlpha.700"}
              padding={"2"}
              width={"fit-content"}
              borderRadius={"md"}
            >
              <ButtonGroup display={"inline-flex"}>
                {/* <IconButton
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
                </Button> */}
              </ButtonGroup>
            </Box>
          </ScaleFade>
        </Box>
      </Skeleton>
    </>
  );
}
