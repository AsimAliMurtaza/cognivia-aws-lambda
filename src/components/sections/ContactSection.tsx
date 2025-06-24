"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
  Divider,
  Stack,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCheck,
} from "react-icons/fa";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 2000);
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.700");
  const primaryColor = useColorModeValue("teal.500", "blue.400");
  const dividerColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box py={20} id="contact" bg={bgColor} position="relative" zIndex={1}>
      <Container maxW="container.lg">
        <VStack spacing={8} textAlign="center" mb={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              color={textColor}
              lineHeight="1.2"
            >
              Contact Us
            </Heading>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Text fontSize="xl" color={subTextColor} maxW="2xl">
              Have questions about Cognivia? We&apos;d love to hear from you.
            </Text>
          </motion.div>
        </VStack>

        {/* Split Layout */}
        <Flex direction={{ base: "column", lg: "row" }} gap={8} align="stretch">
          {/* Contact Form - Left Side */}
          <Box flex={1}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Box
                bg={cardBg}
                p={8}
                borderRadius="xl"
                height="100%"
              >
                <VStack spacing={6} align="stretch">
                  <Heading as="h3" size="md" color={textColor}>
                    Send us a message
                  </Heading>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Name</FormLabel>
                    <Input
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      focusBorderColor={primaryColor}
                      size="sm"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      focusBorderColor={primaryColor}
                      size="sm"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Message</FormLabel>
                    <Textarea
                      placeholder="Your Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      focusBorderColor={primaryColor}
                      size="sm"
                    />
                  </FormControl>

                  <Button
                    color={primaryColor}
                    size="lg"
                    isLoading={loading}
                    onClick={handleSubmit}
                    mt={4}
                    borderRadius="full"
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    Send Message
                  </Button>
                </VStack>
              </Box>
            </motion.div>
          </Box>

          {/* Vertical Divider - Hidden on mobile */}
          <Box display={{ base: "none", lg: "block" }}>
            <Divider orientation="vertical" borderColor={dividerColor} />
          </Box>

          {/* Contact Info - Right Side */}
          <Box flex={1}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Box p={8} borderRadius="xl" height="100%">
                <VStack spacing={8} align="flex-start">
                  <Heading as="h3" size="lg" color={textColor}>
                    Contact Information
                  </Heading>

                  <Stack spacing={6}>
                    <List spacing={4}>
                      <ListItem display="flex" alignItems="center">
                        <ListIcon as={FaEnvelope} color={primaryColor} />
                        <Text color={textColor}>masimalimurtaza@gmail.com</Text>
                      </ListItem>
                      <ListItem display="flex" alignItems="center">
                        <ListIcon as={FaPhoneAlt} color={primaryColor} />
                        <Text color={textColor}>(+92) 317-1822-090</Text>
                      </ListItem>
                      <ListItem display="flex" alignItems="flex-start">
                        <ListIcon
                          as={FaMapMarkerAlt}
                          color={primaryColor}
                          mt={1}
                        />
                        <Text color={textColor}>
                          Lahore, Pakistan
                        </Text>
                      </ListItem>
                    </List>

                    <Divider borderColor={dividerColor} />

                    <VStack align="flex-start" spacing={4}>
                      <Text fontSize="lg" fontWeight="medium" color={textColor}>
                        Why contact us?
                      </Text>
                      <List spacing={3}>
                        {[
                          "Get help with your account",
                          "Request a demo",
                          "Provide feedback",
                          "Ask about enterprise plans",
                          "Report technical issues",
                        ].map((item, index) => (
                          <ListItem key={index} display="flex">
                            <ListIcon as={FaCheck} color={primaryColor} />
                            <Text color={subTextColor}>{item}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </Stack>
                </VStack>
              </Box>
            </motion.div>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
