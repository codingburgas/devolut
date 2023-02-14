import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { IncomingMessage } from "http";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const [signUpLoading, setSignUpLoading] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();

    setSignUpLoading(true);

    setTimeout(async () => {
      const user = {
        dTag: e.target.dTag.value,
        email: e.target.email.value,
        password: e.target.password.value,
        firstName: e.target.firstName.value,
        middleName: e.target.middleName.value,
        lastName: e.target.lastName.value,
        dateOfBirth: e.target.dateOfBirth.value,
        country: e.target.country.value,
        address: e.target.address.value,
        postCode: e.target.postCode.value,
        city: e.target.city.value,
        region: e.target.region.value,
        phoneNumber: e.target.phoneNumber.value,
        avatarSrc: e.target.avatarSrc.value
      };

      const res = await fetch(process.env.BACKEND_URL + "/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (res.ok && res.status == 200 && await res.json()) {
        toast.closeAll();

        const status = await signIn("credentials", {
          redirect: false,
          email: user.email,
          password: user.password,
          callbackUrl: "/",
        });

        if (status?.ok) router.push(status?.url);
      } else if(res.status == 226) {
        setSignUpLoading(false);
        toast({
          title: "Потребител с такъв Devolut Tag вече съществута!",
          status: "error",
          variant: "left-accent",
          position: "top-right",
          isClosable: true,
        });
      } else if (res.status == 302) {
        setSignUpLoading(false);
        toast({
          title: "Потребител с такъв имейл адрес вече съществува!",
          status: "error",
          variant: "left-accent",
          position: "top-right",
          isClosable: true,
        });
      } else {
        setSignUpLoading(false);
        toast({
          title: "Нещо се обърка!",
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
        <title>Devolut • Sign-Up</title>
      </Head>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={2} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Регистрирайте се
            </Heading>
            <Text fontSize={"lg"} color={"gray.400"}>
              за да се насладите на всички <Link color={"blue.400"}>възможност</Link>{" "}
              ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSignup}>
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>Име</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="middleName" isRequired>
                      <FormLabel>Презиме</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isRequired>
                      <FormLabel>Фамилия</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>Имейл адрес</FormLabel>
                  <Input type="email" />
                </FormControl>
                <FormControl id="dTag" isRequired>
                  <FormLabel>Devolut Tag</FormLabel>
                  <Input type="text" maxLength={10} />
                </FormControl>
                <FormControl id="avatarSrc" isRequired>
                  <FormLabel>Снимка на акаунта</FormLabel>
                  <Input type="url" />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Парола</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? "text" : "password"} />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl id="dateOfBirth" isRequired>
                  <FormLabel>Дата на раждане</FormLabel>
                  <Input type="date" />
                </FormControl>
                <HStack>
                  <Box>
                    <FormControl id="country" isRequired>
                      <FormLabel>Държава</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl id="phoneNumber" isRequired>
                      <FormLabel>Телефонен номер</FormLabel>
                      <Input type="number" />
                    </FormControl>
                  </Box>
                </HStack>

                <FormControl id="address" isRequired>
                  <FormLabel>Адрес</FormLabel>
                  <Input type="text" />
                </FormControl>

                <HStack>
                  <Box>
                    <FormControl id="city" isRequired>
                      <FormLabel>Град/Село</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl id="region" isRequired>
                      <FormLabel>Регион</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl id="postCode" isRequired>
                      <FormLabel>Пощ. код</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                </HStack>
                <Stack spacing={10} pt={2}>
                  <Button
                    isLoading={signUpLoading}
                    type="submit"
                    loadingText="Регистриране"
                    size="lg"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Регистриране
                  </Button>
                </Stack>
                <Stack pt={2}>
                  <Text align={"center"}>
                    Вече имате регистрация?{" "}
                    <Link href="/sign-in" color={"blue.400"}>
                      Влезте в акаунта си
                    </Link>
                  </Text>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export async function getServerSideProps({ req }: {req: IncomingMessage}) {
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
