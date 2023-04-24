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
  Link,
  useToast,
  Avatar,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { IncomingMessage } from "http";
import { v4 as uuidv4 } from "uuid";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleSignup = async (e: any) => {
    e.preventDefault();

    setSignUpLoading(true);

    setTimeout(async () => {
      const file = e.target.avatar.files[0];
      const fileType = file["type"];
      const validImageTypes = [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!validImageTypes.includes(fileType)) {
        setSignUpLoading(false);
        return toast({
          title: "Профилната снимка трябва все пак да бъде снимка :/",
          status: "error",
          variant: "left-accent",
          position: "top-right",
          isClosable: true,
        });
      }

      const userImageUID = uuidv4();

      const formData = new FormData();
      const filename = userImageUID;
      const fileExtension = e.target.avatar.files[0].name.split(".").pop();
      const uniqueFilename = `${filename}.${fileExtension}`;
      const finalImage = new File([e.target.avatar.files[0]], uniqueFilename, {
        type: `image/${fileExtension}`,
        lastModified: Date.now(),
      });
      formData.append("file", finalImage);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const user = {
        dTag: e.target.dTag.value,
        email: e.target.email.value,
        password: e.target.password.value,
        firstName: e.target.firstName.value,
        middleName: e.target.middleName.value,
        lastName: e.target.lastName.value,
        dateOfBirth: e.target.dateOfBirth.value,
        country: "България",
        address: e.target.address.value,
        postCode: e.target.postCode.value,
        city: e.target.city.value,
        region: e.target.region.value,
        phoneNumber: "+359" + e.target.phoneNumber.value,
        avatarSrc: uniqueFilename,
      };

      const res = await fetch(process.env.BACKEND_URL + "/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (res.ok && res.status == 200 && (await res.json())) {
        toast.closeAll();

        const status = await signIn("credentials", {
          redirect: false,
          email: user.email,
          password: user.password,
          callbackUrl: "/",
        });

        if (status?.ok) router.push(status?.url);
      } else if (res.status == 226) {
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

  function handleFileInputChange(event) {
    if (event.target.files[0] == undefined) {
      setImageUrl("");
    } else {
      const file = event.target.files[0];
      const fileType = file["type"];
      const validImageTypes = [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (validImageTypes.includes(fileType)) {
        setImageUrl(URL.createObjectURL(event.target.files[0]));
      }
    }
  }

  return (
    <>
      <Head>
        <title>Devolut • Sign-Up</title>
      </Head>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={"gray.800"}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={2} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Регистрирайте се
            </Heading>
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
            rounded={"lg"}
            bg={"gray.700"}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSignup}>
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>Име</FormLabel>
                      <Input pattern="[А-Яа-яЁё\s]+" type="text" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="middleName" isRequired>
                      <FormLabel>Презиме</FormLabel>
                      <Input pattern="[А-Яа-яЁё\s]+" type="text" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isRequired>
                      <FormLabel>Фамилия</FormLabel>
                      <Input pattern="[А-Яа-яЁё\s]+" type="text" />
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
                <Box display={"flex"} alignItems={"end"} gap={"4"}>
                  <FormControl isRequired>
                    <FormLabel>Снимка на акаунта</FormLabel>
                    <input
                      required
                      id="avatar"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={handleFileInputChange}
                    />
                  </FormControl>

                  <Avatar src={imageUrl} />
                </Box>
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
                      <Input value="България" readOnly type="text" />
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl id="phoneNumber" isRequired>
                      <FormLabel>Телефонен номер</FormLabel>
                      <InputGroup>
                        <InputLeftAddon children="+359" />
                        <Input
                          type="tel"
                          pattern="[1-9]+"
                          minLength={9}
                          maxLength={9}
                        />
                      </InputGroup>
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
                      <Input type="number" minLength={4} maxLength={4} />
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
