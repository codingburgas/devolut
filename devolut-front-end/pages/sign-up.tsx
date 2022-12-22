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
      };

      const res = await fetch("http://localhost:8080/user/create", {
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
          title: "User with this devolut tag already exist!",
          status: "error",
          variant: "left-accent",
          position: "top-right",
          isClosable: true,
        });
      } else if (res.status == 302) {
        setSignUpLoading(false);
        toast({
          title: "User with this email already exist!",
          status: "error",
          variant: "left-accent",
          position: "top-right",
          isClosable: true,
        });
      } else {
        setSignUpLoading(false);
        toast({
          title: "Error occured!",
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
              Sign up
            </Heading>
            <Text fontSize={"lg"} color={"gray.400"}>
              to enjoy all of our cool <Link color={"blue.400"}>features</Link>{" "}
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
                      <FormLabel>First Name</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="middleName" isRequired>
                      <FormLabel>Middle Name</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" />
                </FormControl>
                <FormControl id="dTag" isRequired>
                  <FormLabel>Devolut Tag</FormLabel>
                  <Input type="text" maxLength={10} />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Date of birth</FormLabel>
                  <Input type="date" />
                </FormControl>
                <HStack>
                  <Box>
                    <FormControl id="country" isRequired>
                      <FormLabel>Country</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl id="phoneNumber" isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input type="number" />
                    </FormControl>
                  </Box>
                </HStack>

                <FormControl id="address" isRequired>
                  <FormLabel>Address</FormLabel>
                  <Input type="text" />
                </FormControl>

                <HStack>
                  <Box>
                    <FormControl id="city" isRequired>
                      <FormLabel>City/Town</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl id="region" isRequired>
                      <FormLabel>Region</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl id="postCode" isRequired>
                      <FormLabel>Post Code</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                </HStack>
                <Stack spacing={10} pt={2}>
                  <Button
                    isLoading={signUpLoading}
                    type="submit"
                    loadingText="Sign up"
                    size="lg"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Sign up
                  </Button>
                </Stack>
                <Stack pt={2}>
                  <Text align={"center"}>
                    Already have an account?{" "}
                    <Link href="/sign-in" color={"blue.400"}>
                      Sign in
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

export async function getServerSideProps({ req }) {
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
