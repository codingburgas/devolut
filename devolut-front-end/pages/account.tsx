import { getSession, signOut, useSession } from "next-auth/react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ScaleFade,
  Skeleton,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useRouter } from "next/router";
import { IncomingMessage } from "http";
import Head from "next/head";
import autosize from "autosize";
import { useEffect, useRef, useState } from "react";

function formatDate(string) {
  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(string).toLocaleDateString("bg-BG", options);
}

export default function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const ref = useRef();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    autosize(ref.current);
    return () => {
      autosize.destroy(ref.current);
    };
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Devolut • Account</title>
      </Head>

      <ScaleFade initialScale={0.9} in={true}>
        <Box
          width={"full"}
          maxWidth={{ base: "xl", md: "7xl" }}
          marginInline={"auto"}
          paddingInlineStart={{ base: "6", md: "8" }}
          paddingInlineEnd={{ base: "6", md: "8" }}
        >
          <Header session={session} router={router} signOut={signOut} />

          <Heading textAlign={"center"} size={"lg"} marginBottom={"4"}>
            Информация за акаунта
          </Heading>

          <Flex
            direction={"column"}
            alignItems={"center"}
            maxW={"full"}
            padding={"10"}
          >
            <Stack
              width={"full"}
              maxWidth={{ base: "lg", md: "xl" }}
              marginInline={"auto"}
              paddingInlineStart={{ base: "6", md: "8" }}
              paddingInlineEnd={{ base: "6", md: "8" }}
            >
              <Skeleton isLoaded={!isLoading} borderRadius={"md"}>
                <Stack spacing={"4"}>
                  <FormControl id="firstName">
                    <FormLabel>Име</FormLabel>
                    <Input
                      backgroundColor={"gray.700"}
                      type="text"
                      fontWeight={"semibold"}
                      value={
                        session?.user.firstName +
                        " " +
                        session?.user.middleName +
                        " " +
                        session?.user.lastName
                      }
                      readOnly
                    />
                  </FormControl>
                  <FormControl id="dTag">
                    <FormLabel>Devolut Tag</FormLabel>
                    <Input
                      type="text"
                      backgroundColor={"gray.700"}
                      fontWeight={"semibold"}
                      value={session?.user.dTag}
                      readOnly
                    />
                  </FormControl>
                  <FormControl id="dateOfBirth">
                    <FormLabel>Дата на раждане</FormLabel>
                    <Input
                      type="text"
                      backgroundColor={"gray.700"}
                      fontWeight={"semibold"}
                      value={formatDate(session?.user.dateOfBirth)}
                      readOnly
                    />
                  </FormControl>
                  <FormControl id="address">
                    <FormLabel>Адрес</FormLabel>
                    <Textarea
                      readOnly
                      resize={"none"}
                      backgroundColor={"gray.700"}
                      fontWeight={"semibold"}
                      ref={ref}
                      value={
                        session?.user.address +
                        "\n" +
                        session?.user.postCode +
                        " " +
                        session?.user.city +
                        "\n" +
                        session?.user.country
                      }
                    />
                  </FormControl>
                  <FormControl id="phoneNumber">
                    <FormLabel>Телефонен номер</FormLabel>
                    <Input
                      type="number"
                      backgroundColor={"gray.700"}
                      fontWeight={"semibold"}
                      value={session?.user.phoneNumber}
                      readOnly
                    />
                  </FormControl>
                  <FormControl id="email">
                    <FormLabel>Имейл адрес</FormLabel>
                    <Input
                      type="email"
                      backgroundColor={"gray.700"}
                      fontWeight={"semibold"}
                      value={session?.user.email}
                      readOnly
                    />
                  </FormControl>
                </Stack>
              </Skeleton>
            </Stack>
          </Flex>
          <Footer />
        </Box>
      </ScaleFade>
    </>
  );
}

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
