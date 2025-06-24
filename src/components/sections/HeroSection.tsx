"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  Flex,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const primaryColor = useColorModeValue("teal.500", "blue.400");
  const router = useRouter();

  return (
    <Box
      display="flex"
      minH={{ base: "auto", md: "70vh" }}
      py={28}
      alignItems="center"
      bg={useColorModeValue("white", "gray.800")}
      px={6}
    >
      <Container maxW="container.xl">
        <Grid
          templateColumns={{ base: "1fr", lg: "1.5fr 1px 1fr" }}
          gap={{ base: 8, lg: 12 }}
          alignItems="center"
        >
          {/* Left Column: Text Content */}
          <GridItem>
            <Flex direction="column" gap={6}>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="bold"
                lineHeight="1.5"
              >
                <Box as="span" display="block" mb={2}>
                  Enhance your learning experience with
                </Box>
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  px="4"
                  py="1"
                  bg={primaryColor}
                  color="white"
                  fontWeight="bold"
                >
                  <Typewriter
                    words={[
                      "Cognivia.",
                      "AI Quizzes.",
                      "Adaptive Learning.",
                      "Live Sessions.",
                    ]}
                    loop={true}
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                    deleteSpeed={70}
                    delaySpeed={2000}
                  />
                </Box>
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="tall"
                color={useColorModeValue("gray.600", "gray.300")}
                maxW={{ base: "100%", lg: "90%" }}
              >
                The AI-powered platform for learners and educators. Create,
                share, and discover quizzes, assignments, virtual classrooms to
                enhance your learning journey. We make education engaging and
                effective.
                <br />
                Join a community of learners and educators today!
              </Text>

              <Flex gap={4} mt={4} flexWrap="wrap">
                <Button
                  size="lg"
                  colorScheme={useColorModeValue("teal", "blue")}
                  px={8}
                  borderRadius="full"
                  onClick={() => router.push("/signup")}
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor={primaryColor}
                  color={primaryColor}
                  px={8}
                  borderRadius="full"
                  _hover={{ bg: useColorModeValue("teal.50", "blue.900") }}
                >
                  Learn More
                </Button>
              </Flex>
            </Flex>
          </GridItem>

          {/* Vertical Divider (Desktop only) */}
          <GridItem display={{ base: "none", lg: "block" }}>
            <Divider
              orientation="vertical"
              h="60%"
              borderColor={useColorModeValue("gray.200", "gray.600")}
            />
          </GridItem>

          {/* Right Column: Auth Options */}
          <GridItem>
            <Flex
              direction="column"
              gap={6}
              p={8}
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
            >
              <Heading as="h3" size="lg" textAlign="center">
                Continue with
              </Heading>

              <Button
                leftIcon={<Icon as={FaGoogle} />}
                colorScheme="blue"
                variant="outline"
                size="lg"
                borderRadius="full"
                borderColor={useColorModeValue("gray.300", "gray.500")}
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Google
              </Button>

              <Button
                leftIcon={<Icon as={FaGithub} />}
                colorScheme="gray"
                variant="outline"
                size="lg"
                borderRadius="full"
                borderColor={useColorModeValue("gray.300", "gray.500")}
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              >
                GitHub
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
