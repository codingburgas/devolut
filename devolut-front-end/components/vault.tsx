import { AddIcon, LinkIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Progress,
  ScaleFade,
  Skeleton,
  Text,
} from "@chakra-ui/react";

export default function Vault({ session, vault, hovered, setHovered, setCurrentVault, setAddMoneyIntoVaultModalOpen, setTakeMoneyFromVaultModalOpen, setGiveUserVaultAccessModalOpen }) {
  return (
    <>
      <Skeleton
        isLoaded={true}
        key={vault.id}
        borderRadius={"md"}
        onMouseEnter={() => setHovered(vault.name)}
        onMouseLeave={() => setHovered("")}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          padding={"2"}
          height={"75px"}
          backgroundColor={"gray.600"}
          borderRadius={"md"}
        >
          <Flex
            direction={"column"}
            justifyContent={"space-between"}
            h="full"
            w="20%"
          >
            <Text>
              {vault.name}{" "}
              {vault.goal ? (
                <>
                  -{" "}
                  {vault.goal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  лв
                </>
              ) : (
                <></>
              )}
            </Text>
            {vault.goal ? (
              <Flex direction={"column"} alignItems={"center"}>
                <Progress
                  value={(vault.balance * 100) / vault.goal}
                  size="sm"
                  borderRadius={"md"}
                  colorScheme="blue"
                  w="full"
                />
                <Text w="full">
                  {vault.balance
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  лв ({((vault.balance * 100) / vault.goal).toFixed(1)}%)
                </Text>
              </Flex>
            ) : (
              <>
                {vault.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                лв
              </>
            )}
          </Flex>

          <ScaleFade
            key={vault.id}
            id={vault.name}
            initialScale={0.9}
            in={hovered === vault.name ? true : false}
          >
            <Box
              background={"blackAlpha.700"}
              padding={"2"}
              width={"fit-content"}
              borderRadius={"md"}
            >
              <ButtonGroup display={"flex"}>
                <IconButton
                  colorScheme={"blue"}
                  fontSize={"md"}
                  minWidth={"8"}
                  height={"8"}
                  aria-label="Добави пари"
                  icon={<AddIcon />}
                  onClick={() => {
                    setCurrentVault(vault)
                    setAddMoneyIntoVaultModalOpen(true)
                  }}
                ></IconButton>
                <IconButton
                  colorScheme={"blue"}
                  fontSize={"md"}
                  minWidth={"8"}
                  height={"8"}
                  aria-label="Изтегли пари"
                  icon={<MinusIcon />}
                  onClick={() => {
                    setCurrentVault(vault)
                    setTakeMoneyFromVaultModalOpen(true)
                  }}
                  disabled={vault.balance == 0}
                ></IconButton>
                {vault.type == "shared" && vault.ownerId == session.user.id ? (
                  <IconButton
                    colorScheme={"blue"}
                    fontSize={"md"}
                    minWidth={"8"}
                    height={"8"}
                    aria-label="Сподели сейф"
                    icon={<LinkIcon />}
                    onClick={() => {
                      setCurrentVault(vault)
                      setGiveUserVaultAccessModalOpen(true)
                    }}
                  ></IconButton>
                ) : (
                  <></>
                )}
              </ButtonGroup>
            </Box>
          </ScaleFade>
        </Box>
      </Skeleton>
    </>
  );
}
