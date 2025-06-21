"use client";

import {
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function DashboardPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const secondaryText = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("teal.500", "blue.400");

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      <VStack spacing={8} align="stretch" maxW="7xl" mx="auto">
        {/* Overview */}
        <MotionCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="sm"
        >
          <CardHeader pb={2}>
            <Heading
              as="h1"
              size="xl"
              fontWeight="semibold"
              color={accentColor}
            >
              Archive
            </Heading>
          </CardHeader>
        </MotionCard>
        <Text fontSize="lg" fontWeight="semibold" color={secondaryText}>
          Archive coming soon...
        </Text>
      </VStack>
    </Box>
  );
}
