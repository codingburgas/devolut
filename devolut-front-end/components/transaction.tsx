import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";

function formatDate(string) {
  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(string).toLocaleDateString("bg-BG", options);
}

export default function Transaction({
  transaction,
  session,
}: {
  transaction: any;
  session: Session;
}) {
  return (
    <>
      <Flex
        direction={"row"}
        wrap={"nowrap"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex alignItems={"center"} gap={"3"}>
          {(() => {
            if (transaction.senderDTag) {
              if (transaction.senderDTag == session.user.dTag) {
                return <Box display={"flex"} alignItems={"flex-end"}>
                  <Avatar src={transaction.receiverAvatarSrc} name={transaction.receiverDTag} borderWidth={"2px"} borderColor={"whiteAlpha.50"} marginRight={"-4"} />
                  <Box backgroundColor={"blue.300"} border='2px' borderColor={'black'} zIndex={"3"} w={"5"} h={"5"} borderRadius={"xl"} display={"flex"} alignItems={'center'} alignContent={'center'} justifyContent={'center'} justifyItems={'center'}>
                    <ArrowForwardIcon color={"black"} />
                  </Box>
                </Box>
              } else {
                return <Box display={"flex"} alignItems={"flex-end"}>
                  <Avatar src={transaction.senderAvatarSrc} name={transaction.senderDTag} borderWidth={"2px"} borderColor={"whiteAlpha.50"} marginRight={"-4"} />
                  <Box backgroundColor={"blue.300"} border='2px' borderColor={'black'} zIndex={"3"} w={"5"} h={"5"} borderRadius={"xl"} display={"flex"} alignItems={'center'} alignContent={'center'} justifyContent={'center'} justifyItems={'center'}>
                    <ArrowBackIcon color={"black"} />
                  </Box>
                </Box> 
              }
            } else {
              return <Avatar src="https://cdn-icons-png.flaticon.com/512/4614/4614115.png" name={"Credit card"} borderWidth={"2px"} borderColor={"whiteAlpha.50"} />
            }
          })()}

          <Flex direction={"column"}>
            <Text>
              {(() => {
                if (transaction.senderDTag) {
                  if (transaction.senderDTag == session.user.dTag) {
                    return <>До {transaction.receiverDTag}</>
                  } else {
                    return <>От {transaction.senderDTag}</>
                  }
                } else {
                  return <>От карта завършваща на {transaction.cardNumber.slice(-4)}</>
                }
              })()}
            </Text>

            <Text opacity={"0.8"} fontSize={"sm"}>
              {formatDate(transaction.created_at)}
            </Text>
          </Flex>
        </Flex>

        <Text>
          {(() => {
            if (transaction.senderDTag) {
              if (transaction.senderDTag == session.user.dTag) {
                return <>-{transaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} лв</>
              } else {
                return <>+{transaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} лв</>
              }
            } else {
              return <>+{transaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} лв</>
            }
          })()}
        </Text>
      </Flex>
    </>
  );
}
