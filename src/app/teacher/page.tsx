"use client";
import { Box, Text, Flex } from "@chakra-ui/react";

export default function TeacherDashboard() {
  return (
    <Box p={6}>
      <Flex justify="center" align="center" mb={8}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Error 404
          </Text>
          <Text fontSize="lg" color="gray.500">
            Page Not Found
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
