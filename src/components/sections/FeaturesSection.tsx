"use client";

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaBrain, FaClock, FaBookOpen, FaMobileAlt } from "react-icons/fa";
import {
  MdAssignment,
  MdAssistant,
  MdClass,
  MdMore,
  MdOutlineMeetingRoom,
  MdOutlineNotes,
} from "react-icons/md";

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Quizzes",
      description:
        "Automatically generated quizzes tailored to your learning needs with our advanced algorithms.",
      icon: FaBrain,
    },
    {
      title: "AI-Powered Notes",
      description:
        "Create and manage notes, export them to pdf and take them anywhere with you. ",
      icon: MdOutlineNotes,
    },
    {
      title: "Cognivia AI",
      description:
        "Cognivia AI anytime, anywhere - Summzarize, Explain, Brainstorming Ideas with Cognivia AI",
      icon: MdAssistant,
    },
    {
      title: "Join Virtual Classes",
      description:
        "Join courses offer by instructors, and collaborate with peers in real-time.",
      icon: MdClass,
    },
    {
      title: "Real-Time Feedback",
      description:
        "Get instant feedback and actionable insights to accelerate your learning process.",
      icon: FaClock,
    },
    {
      title: "Personalized Insights",
      description:
        "Detailed analytics and reports to track your learning journey.",
      icon: FaBookOpen,
    },
    {
      title: "Mobile Friendly",
      description:
        "Seamless experience across all your devices, anytime, anywhere.",
      icon: FaMobileAlt,
    },
  ];

  const featuresTeacher = [
    {
      title: "Virtual Classrooms",
      description:
        "Create and manage courses, schedule classes, and interact with students in real-time.",
      icon: MdClass,
    },
    {
      title: "Assignments",
      description:
        "Create, manage, and submit assignments with ease. Get feedback from instructors.",
      icon: MdAssignment,
    },
    {
      title: "Live Sessions",
      description:
        "Attend live classes and interact with instructors and peers in real-time.",
      icon: MdOutlineMeetingRoom,
    },
    {
      title: "More Features Coming Soon",
      description:
        "We are constantly improving and adding new features to enhance your learning experience.",
      icon: MdMore,
    },
  ];

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const primaryColor = useColorModeValue("teal.500", "blue.300");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box
      py={20}
      id="features"
      bg={bgColor}
      position="relative"
      zIndex={1}
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl">
        <VStack spacing={12} textAlign="center">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <VStack spacing={4}>
              <Heading
                as="h2"
                size="2xl"
                fontWeight="bold"
                color={textColor}
                lineHeight="1.2"
              >
                What we offer?
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={subTextColor}
                maxW="2xl"
              >
                Discover how Cognivia transforms your learning experience with
                AI-powered tools
              </Text>
            </VStack>
          </motion.div>
          <Text fontSize="xl" mt={12} color={textColor} fontWeight="bold">
            LEARNERS AND STUDENTS
          </Text>

          {/* Features Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
            width="full"
          >
            {features.map((feature, index) => (
              <GridItem key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Box
                    p={8}
                    borderRadius="2xl"
                    minHeight="250px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    transition="all 0.2s ease"
                    bg={cardBg}
                  >
                    <Box
                      p={4}
                      mb={4}
                      bg={`${primaryColor}20`} // 20% opacity
                      borderRadius="full"
                      display="inline-flex"
                    >
                      <Icon
                        as={feature.icon}
                        boxSize={12}
                        color={primaryColor}
                      />
                    </Box>
                    <Heading
                      as="h3"
                      size="md"
                      color={textColor}
                      mb={3}
                      fontWeight="semibold"
                    >
                      {feature.title}
                    </Heading>
                    <Text fontSize="md" color={subTextColor} lineHeight="tall">
                      {feature.description}
                    </Text>
                  </Box>
                </motion.div>
              </GridItem>
            ))}
          </Grid>
          <Text fontSize="xl" mt={12} color={textColor} fontWeight="bold">
            INSTRUCTORS AND TEACHERS
          </Text>

          {/* Features Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
            width="full"
          >
            {featuresTeacher.map((feature, index) => (
              <GridItem key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Box
                    p={8}
                    borderRadius="2xl"
                    minHeight="250px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    transition="all 0.2s ease"
                    bg={cardBg}
                  >
                    <Box
                      p={4}
                      mb={4}
                      bg={`${primaryColor}20`} // 20% opacity
                      borderRadius="full"
                      display="inline-flex"
                    >
                      <Icon
                        as={feature.icon}
                        boxSize={12}
                        color={primaryColor}
                      />
                    </Box>
                    <Heading
                      as="h3"
                      size="md"
                      color={textColor}
                      mb={3}
                      fontWeight="semibold"
                    >
                      {feature.title}
                    </Heading>
                    <Text fontSize="md" color={subTextColor} lineHeight="tall">
                      {feature.description}
                    </Text>
                  </Box>
                </motion.div>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
