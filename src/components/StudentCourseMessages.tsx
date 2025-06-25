"use client";

import {
  Box,
  VStack,
  Text,
  HStack,
  Spinner,
  Flex,
  useColorModeValue,
  Card,
  CardBody,
  Avatar,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";

interface Message {
  _id: string;
  content: string;
  postedBy: { name: string; avatar?: string };
  createdAt: string;
}

export default function StudentCourseMessages({
  courseId,
}: {
  courseId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const containerBg = useColorModeValue("white", "gray.800");
  const containerBorder = useColorModeValue("gray.100", "gray.700");
  const containerShadow = useColorModeValue("lg", "dark-lg");
  const messageBubbleBg = useColorModeValue("blue.50", "blue.700");
  const messageBubbleColor = useColorModeValue("gray.800", "gray.50");
  const messageMetaColor = useColorModeValue("gray.600", "gray.300");
  const emptyStateColor = useColorModeValue("gray.500", "gray.400");
  const emptyStateIconColor = useColorModeValue("blue.300", "blue.600");
  const headingColor = useColorModeValue("gray.700", "gray.100");
  const avatarBg = useColorModeValue("blue.200", "blue.600");
  const avatarBgColor = useColorModeValue("blue.800", "white");

  useEffect(() => {
    async function fetchMessages() {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(
          `/api/courses/${courseId}?populate=messages.postedBy`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch messages.");
        }
        const data = await res.json();
        const fetchedMessages = data.messages || data?.course?.messages || [];
        setMessages(
          fetchedMessages.sort(
            (a: Message, b: Message) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
      } catch (err) {
        console.error("Failed to load messages:", err);
        alert(
          `Error loading messages: ${
            (err as Error).message || "Could not retrieve class messages."
          }`
        );
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    }

    fetchMessages();
  }, [courseId]);

  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="xl"
      mt={6}
      bg={containerBg}
      borderColor={containerBorder}
      boxShadow={containerShadow}
      maxH="500px"
      overflowY="auto"
      display="flex"
      flexDirection="column"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} color={headingColor}>
        {" "}
        Class Messages
      </Text>

      <VStack spacing={4} align="stretch" flexGrow={1}>
        {isLoadingMessages ? (
          <Flex justify="center" align="center" minH="200px" flexGrow={1}>
            <Spinner size="lg" color={emptyStateIconColor} />
          </Flex>
        ) : messages.length === 0 ? (
          <VStack
            spacing={3}
            py={10}
            color={emptyStateColor}
            textAlign="center"
            flexGrow={1}
            justify="center"
          >
            <Icon
              as={FiMessageCircle}
              w={16}
              h={16}
              color={emptyStateIconColor}
            />
            <Text fontSize="lg" fontWeight="medium">
              No messages yet.
            </Text>
            <Text>Looks like no one has posted in this class yet.</Text>
          </VStack>
        ) : (
          messages.map((msg) => (
            <Card
              key={msg._id}
              bg={messageBubbleBg}
              borderRadius="xl"
              boxShadow="sm"
              p={4}
              maxW="90%"
              alignSelf="flex-start"
            >
              <CardBody p={0}>
                <HStack justify="space-between" mb={1} align="flex-start">
                  <HStack spacing={2}>
                    <Avatar
                      size="xs"
                      name={msg.postedBy?.name || "Instructor"}
                      bg={avatarBg}
                      color={avatarBgColor}
                    />
                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      color={messageBubbleColor}
                    >
                      {msg.postedBy?.name || "Instructor"}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color={messageMetaColor} mt={0}>
                    {new Date(msg.createdAt).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </HStack>
                <Text
                  mt={1}
                  fontSize="md"
                  color={messageBubbleColor}
                  lineHeight="short"
                >
                  {msg.content}
                </Text>
              </CardBody>
            </Card>
          ))
        )}
      </VStack>
    </Box>
  );
}
