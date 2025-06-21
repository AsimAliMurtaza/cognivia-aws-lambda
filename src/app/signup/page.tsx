"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Text,
  Divider,
  useToast,
  Grid,
  GridItem,
  useColorMode,
  useColorModeValue,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiSun, FiMoon } from "react-icons/fi";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roleSelected, setRoleSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast();

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue(
    "linear(to-br, #E0F7FA, #F3E5F5)",
    "gray.800"
  );
  const boxColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const inputBgColor = useColorModeValue("white", "gray.700");
  const buttonBgColor = useColorModeValue("teal.500", "blue.400");
  const buttonHoverColor = useColorModeValue("teal.600", "blue.300");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSignup = async () => {
    if (!email || !password || !role) {
      setError("All fields are required!");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    setLoading(false);

    if (res.ok) {
      toast({
        title: "Account created!",
        description:
          "Verify your account by clicking on the email link sent to you.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/login");
    } else {
      setError("Signup failed! Try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgGradient={bgColor}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          bg={boxColor}
          borderRadius="20px"
          boxShadow="lg"
          maxW="900px"
          p={8}
          w="auto"
        >
          <Button
            color="blue.500"
            variant="link"
            fontSize="sm"
            _hover={{ color: buttonHoverColor }}
            onClick={() => router.push("/")}
          >
            <FiArrowLeft style={{ marginRight: "8px", fontSize: "2em" }} />
          </Button>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            {/* Left Content */}
            <GridItem
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Heading size="2xl" fontWeight="thin" color={textColor} mb={4}>
                Cognivia
              </Heading>
              <Text fontSize="sm" color={textColor} mt={4}>
                Create an account to get started.
              </Text>
            </GridItem>

            {/* Right Side */}
            <GridItem>
              <VStack spacing={5} align="stretch">
                <IconButton
                  aria-label="Toggle dark mode"
                  borderRadius="full"
                  icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
                  onClick={toggleColorMode}
                  alignSelf="flex-end"
                  variant="ghost"
                />

                {error && (
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    {error}
                  </Text>
                )}

                <Heading size="md" fontWeight="lg" mb={2} color={textColor}>
                  Create your account
                </Heading>

                {!roleSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FormControl id="signUp-role" isRequired>
                      <FormLabel fontSize="sm" color={textColor}>
                        I am a
                      </FormLabel>
                      <Select
                        bg={inputBgColor}
                        borderRadius="full"
                        onChange={(e) => {
                          setRole(e.target.value.toLowerCase());
                          setRoleSelected(true);
                        }}
                      >
                        <option value="" disabled selected>
                          Select your role
                        </option>
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                      </Select>
                    </FormControl>
                  </motion.div>
                )}

                <AnimatePresence>
                  {roleSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <VStack spacing={5} align="stretch" mt={4}>
                        <FormControl id="signUp-email" isRequired>
                          <FormLabel fontSize="sm" color={textColor}>
                            Email
                          </FormLabel>
                          <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            bg={inputBgColor}
                            color="black"
                            borderRadius="full"
                            border="1px solid #ccc"
                            onChange={handleInputChange}
                            _focus={{
                              borderColor: "blue.500",
                              boxShadow: "outline",
                            }}
                          />
                        </FormControl>

                        <FormControl id="signUp-password" isRequired>
                          <FormLabel fontSize="sm" color={textColor}>
                            Password
                          </FormLabel>
                          <Input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            bg={inputBgColor}
                            color="black"
                            borderRadius="full"
                            border="1px solid #ccc"
                            onChange={handleInputChange}
                            _focus={{
                              borderColor: "blue.500",
                              boxShadow: "outline",
                            }}
                          />
                        </FormControl>

                        <Button
                          onClick={handleSignup}
                          bg={buttonBgColor}
                          color="white"
                          _hover={{ bg: buttonHoverColor }}
                          borderRadius="full"
                          isLoading={loading}
                          w="full"
                        >
                          Sign Up
                        </Button>

                        <Divider />

                        <Text
                          fontSize="sm"
                          textAlign="center"
                          color={textColor}
                        >
                          Already have an account?{" "}
                          <Button
                            variant="link"
                            color="blue.500"
                            onClick={() => router.push("/login")}
                          >
                            Log in
                          </Button>
                        </Text>
                      </VStack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </motion.div>
    </Box>
  );
}
