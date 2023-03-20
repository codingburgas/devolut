import { Box, Button, ButtonGroup, HStack, Text } from "@chakra-ui/react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePageNumbers =
    totalPages <= 10
      ? pageNumbers
      : currentPage <= 6
      ? pageNumbers.slice(0, 7).concat(-1, pageNumbers.slice(-1))
      : currentPage >= totalPages - 5
      ? pageNumbers.slice(0, 1).concat(-1, pageNumbers.slice(-7))
      : pageNumbers
          .slice(currentPage - 4, currentPage + 3)
          .concat(-1, pageNumbers.slice(-1));

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={"2"}
      marginTop={"2"}
    >
      <HStack>
        <ButtonGroup size="md" isAttached variant="outline">
          {visiblePageNumbers.map((pageNumber) =>
            pageNumber === -1 ? (
              <Text key={pageNumber} marginX={"2"}>...</Text>
            ) : (
              <Button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                colorScheme={pageNumber === currentPage ? "blue" : "gray"}
              >
                {pageNumber}
              </Button>
            )
          )}
        </ButtonGroup>
      </HStack>
    </Box>
  );
}

export default Pagination;
