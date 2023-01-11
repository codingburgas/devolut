import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";

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
  const getUserDTagById = (id) => {
    const [dTag, setDTag] = useState("");

    fetch("http://localhost:8080/user/getDTagById", {
      method: "POST",
      body: id,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.text())
      .then((data) => {
        setDTag(data);
      });

    return dTag;
  };

  return (
    <>
      <Flex
        direction={"row"}
        wrap={"nowrap"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex alignItems={"center"} gap={"3"}>
            {transaction.senderId == session.user.id ? (
                <Avatar name={getUserDTagById(transaction.receiverId)} borderWidth={"2px"} borderColor={"whiteAlpha.50"} />
            ) : (
                <Avatar name={getUserDTagById(transaction.senderId)} borderWidth={"2px"} borderColor={"whiteAlpha.50"} />
            )}

          <Flex direction={"column"}>
            <Text>
              {transaction.senderId == session.user.id ? (
                <>До {getUserDTagById(transaction.receiverId)}</>
              ) : (
                <>От {getUserDTagById(transaction.senderId)}</>
              )}
            </Text>

            <Text opacity={"0.8"} fontSize={"sm"}>
              {formatDate(transaction.created_at)}
            </Text>
          </Flex>
        </Flex>

        <Text>
          {transaction.senderId == session.user.id ? (
            <>-{transaction.amount} лв</>
          ) : (
            <>+{transaction.amount} лв</>
          )}
        </Text>
      </Flex>
    </>
  );
}
