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
            {transaction.senderDTag == session.user.dTag ? (
                <Avatar name={(transaction.receiverDTag)} borderWidth={"2px"} borderColor={"whiteAlpha.50"} />
            ) : (
                <Avatar name={transaction.senderDTag} borderWidth={"2px"} borderColor={"whiteAlpha.50"} />
            )}

          <Flex direction={"column"}>
            <Text>
              {transaction.senderDTag == session.user.dTag ? (
                <>До {transaction.receiverDTag}</>
              ) : (
                <>От {transaction.senderDTag}</>
              )}
            </Text>

            <Text opacity={"0.8"} fontSize={"sm"}>
              {formatDate(transaction.created_at)}
            </Text>
          </Flex>
        </Flex>

        <Text>
          {transaction.senderDTag == session.user.dTag ? (
            <>-{transaction.amount} лв</>
          ) : (
            <>+{transaction.amount} лв</>
          )}
        </Text>
      </Flex>
    </>
  );
}
