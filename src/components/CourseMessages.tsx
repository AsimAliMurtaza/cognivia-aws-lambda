"use client";

import {
  Box,
  Textarea,
  Button,
  VStack,
  Text,
  HStack,
  useToast,
  Spinner,
  Flex,
  useColorModeValue,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  Avatar,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { FiMessageCircle } from "react-icons/fi";

interface Message {
  _id: string;
  content: string;
  postedBy: { name: string; avatar?: string };
  createdAt: string;
}

export default function CourseMessages({ courseId }: { courseId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isPostingMessage, setIsPostingMessage] = useState(false); // For send button loading
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // --- Material You-inspired Color Mode Values ---
  const containerBg = useColorModeValue("white", "gray.800");
  const containerBorder = useColorModeValue("gray.100", "gray.700");
  const containerShadow = useColorModeValue("lg", "dark-lg");
  const messageInputBg = useColorModeValue("gray.50", "gray.700");
  const messageInputColor = useColorModeValue("gray.800", "gray.100");
  const messageInputBorder = useColorModeValue("gray.200", "gray.600");
  const messageInputFocusBorder = useColorModeValue("blue.400", "blue.300");
  const sendButtonColorScheme = "teal";
  const messageBubbleBg = useColorModeValue("blue.50", "blue.700");
  const messageBubbleColor = useColorModeValue("gray.800", "gray.50");
  const messageMetaColor = useColorModeValue("gray.600", "gray.300");
  const emptyStateColor = useColorModeValue("gray.500", "gray.400");
  const emptyStateIconColor = useColorModeValue("blue.300", "blue.600");
  const avatarBg = useColorModeValue("blue.200", "blue.600");
  const avatarBgColor = useColorModeValue("blue.800", "white");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        toast({
          title: "Error loading messages.",
          description:
            (err as Error).message || "Could not retrieve class messages.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    }

    fetchMessages();
  }, [courseId, toast]);

  useEffect(() => {
    if (!isLoadingMessages) {
      scrollToBottom();
    }
  }, [messages, isLoadingMessages]);

  async function handlePostMessage() {
    if (!newMessage.trim()) return;

    setIsPostingMessage(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, content: newMessage.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        setNewMessage("");
        toast({
          title: "Message posted.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        throw new Error(data.message || "Failed to post message.");
      }
    } catch (err) {
      console.error("Failed to post message:", err);
      toast({
        title: "Failed to post message.",
        description: (err as Error).message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setIsPostingMessage(false);
    }
  }

  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="xl"
      mt={6}
      bg={containerBg}
      borderColor={containerBorder}
      boxShadow={containerShadow}
      maxH="600px"
      overflowY="auto"
      display="flex"
      flexDirection="column"
    >
      <VStack spacing={4} align="stretch" flexGrow={1}>
        {/* Messages Display Area */}
        {isLoadingMessages ? (
          <Flex justify="center" align="center" minH="200px" flexGrow={1}>
            <Spinner size="lg" color={messageInputFocusBorder} />
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
            <Text>Be the first to say something!</Text>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch" flexGrow={1} pb={4}>
            {" "}
            {/* Added padding bottom */}
            {messages.map((msg) => (
              <Card
                key={msg._id}
                bg={messageBubbleBg}
                borderRadius="xl"
                boxShadow="sm"
                p={4}
                maxW="85%"
                alignSelf={
                  msg.postedBy?.name === "You" ? "flex-end" : "flex-start"
                }
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
                      {" "}
                      {/* Adjusted margin */}
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
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </VStack>

      {/* Message Input Area */}
      <Box pt={4}>
        {" "}
        <InputGroup size="lg" borderRadius="xl">
          <Textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            pr="4.5rem"
            minH="unset"
            h="auto"
            rows={2}
            resize="vertical"
            bg={messageInputBg}
            color={messageInputColor}
            borderColor={messageInputBorder}
            borderRadius="xl"
            _hover={{ borderColor: messageInputFocusBorder }}
            _focus={{
              borderColor: messageInputFocusBorder,
              boxShadow: `0 0 0 1px ${messageInputFocusBorder}`,
            }}
          />
          <InputRightElement width="4.5rem" height="100%" pr={2}>
            <Button
              colorScheme={sendButtonColorScheme}
              onClick={handlePostMessage}
              isDisabled={!newMessage.trim() || isPostingMessage}
              isLoading={isPostingMessage}
              loadingText=""
              size="md"
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ boxShadow: "md" }}
            >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  );
}
