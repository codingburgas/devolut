import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { IncomingMessage } from "http";
import { getSession, signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Signin() {
  const router = useRouter();
  const toast = useToast();
  const [signInLoading, setSignInLoading] = useState(false);

  const handleSignin = async (e: any) => {
    e.preventDefault();

    setSignInLoading(true);

    setTimeout(async () => {
      const user = {
        email: e.target.dtmail.value,
        password: e.target.password.value,
      };

      const status = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
        callbackUrl: "/",
      });

      if (status?.ok) {
        toast.closeAll();
        router.push(status.url);
      } else {
        setSignInLoading(false);
        toast({
          title: "Въвели сте неправилни данни!",
          status: "error",
          variant: "left-accent",
          position: "top-right",
          isClosable: true,
        });
      }
    }, Math.floor(Math.random() * (Math.floor(700) - Math.ceil(500)) + Math.ceil(500)));
  };

  return (
    <>
      <Head>
        <title>Devolut • Sign-In</title>
      </Head>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        backgroundImage={"background.jpg"}
        backgroundRepeat={"no-repeat"}
        backgroundAttachment={"fixed"}
        backgroundPosition={"center"}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Влезте в акаунта си</Heading>
            <Flex direction={"row"} alignItems={"center"} gap={"1"}>
              <Text fontSize={"lg"} color={"gray.400"}>
                за да се насладите на всички
              </Text>
              <Text fontSize={"lg"} color={"blue.400"}>
                възможности✌️
              </Text>
            </Flex>
          </Stack>
          <Box
            borderRadius={"lg"}
            bgGradient="linear(to-t, whiteAlpha.400, whiteAlpha.50)"
            boxShadow="rgba(255, 255, 255, 0.05) 0px 0px 0px 1px, rgba(255, 255, 255, 0.05) 0px 4px 6px"
            backdropFilter="blur(10px)"
            p={8}
          >
            <form onSubmit={handleSignin}>
              <Stack spacing={4}>
                <FormControl id="dtmail" isRequired>
                  <FormLabel>Имейл адрес / Devolut Tag</FormLabel>
                  <Input type="text" />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Парола</FormLabel>
                  <Input type="password" />
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    isLoading={signInLoading}
                    loadingText="Вход"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                  >
                    Вход
                  </Button>
                </Stack>
              </Stack>
            </form>
            <Stack pt={6}>
              <Text align={"center"}>
                {"Нямате акаунт?"}{" "}
                <Link href="/sign-up" color={"blue.400"}>
                  Регистрирайте се
                </Link>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
