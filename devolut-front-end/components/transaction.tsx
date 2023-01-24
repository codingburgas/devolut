import { Avatar, Flex, Text } from "@chakra-ui/react";
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
                return <Avatar name={(transaction.receiverDTag)} borderWidth={"2px"} borderColor={"whiteAlpha.50"} />
              } else {
                return <Avatar name={transaction.senderDTag} borderWidth={"2px"} borderColor={"whiteAlpha.50"} />
              }
            } else {
              return <Avatar src="https://cdn-icons-png.flaticon.com/512/4614/4614115.png" name={(transaction.cardNumber)} borderWidth={"2px"} borderColor={"whiteAlpha.50"} />
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
