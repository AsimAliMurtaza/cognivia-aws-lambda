"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Divider,
  Flex,
  Avatar,
  HStack,
  Card,
  CardBody,
  useToken,
  Badge,
  Link,
  Button,
} from "@chakra-ui/react";
import {
  FaBrain,
  FaLightbulb,
  FaUsers,
  FaEye,
  FaRocket,
  FaHandsHelping,
  FaLaptopCode,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  const [primaryLight, primaryDark] = useToken("colors", [
    "gray.600", // Strong blue for light mode primary
    "teal.300", // Softer teal for dark mode primary
  ]);
  const [secondaryLight, secondaryDark] = useToken("colors", [
    "teal.500", // Teal for light mode accent
    "teal.200", // Lighter teal for dark mode accent
  ]);
  const [surfaceLight, surfaceDark] = useToken("colors", ["white", "gray.900"]); // Main background
  const [surfaceElevatedLight, surfaceElevatedDark] = useToken("colors", [
    "gray.50", // Light elevated surfaces
    "gray.800", // Dark elevated surfaces
  ]);
  const [onSurfaceLight, onSurfaceDark] = useToken("colors", [
    "gray.800", // Text on light surface
    "whiteAlpha.900", // Text on dark surface
  ]);
  const [onSurfaceVariantLight, onSurfaceVariantDark] = useToken("colors", [
    "gray.600", // Secondary text on light surface
    "gray.300", // Secondary text on dark surface
  ]);

  // Color mode values derived from tokens
  const bg = useColorModeValue(surfaceLight, surfaceDark);
  const cardBg = useColorModeValue(surfaceElevatedLight, surfaceElevatedDark);
  const primaryTextColor = useColorModeValue(onSurfaceLight, onSurfaceDark);
  const secondaryTextColor = useColorModeValue(
    onSurfaceVariantLight,
    onSurfaceVariantDark
  );
  const accentColor = useColorModeValue(secondaryLight, secondaryDark);
  const headingColor = useColorModeValue(primaryLight, primaryDark);
  const dividerColor = useColorModeValue("gray.200", "gray.700"); // A subtle divider color

  // Team data
  const teamMembers = [
    {
      name: "Muhammad Asim Ali Murtaza",
      role: "Lead Architect, Fullstack Developer, Cloud Engineer",
      description:
        "Drives system design and core functionalities with a passion for scalable solutions.",
      avatar:
        "https://github.com/AsimAliMurtaza/resources/blob/main/pfp-200kb.jpg?raw=true", // Placeholder, add actual image paths
      social: {
        github: "https://github.com/AsimAliMurtaza", // Replace with actual links
        linkedin: "https://linkedin.com/in/asimalimurtaza",
        twitter: "https://twitter.com/asimalimurtaza",
      },
    },
    {
      name: "Rida Mushtaq",
      role: "Lead Frontend Engineer",
      description:
        "Crafts intuitive interfaces ensuring seamless user experiences.",
      avatar: "https://avatars.githubusercontent.com/u/120158689?v=4", // Placeholder
      social: {
        github: "https://github.com/rida-mushtaq28",
        linkedin: "https://linkedin.com/in/rida-mushtaq28",
        twitter: "https://twitter.com/rida_mushtaq",
      },
    },
    {
      name: "Rafiya Rehan",
      role: "Fullstack Developer",
      description:
        "Specializes in backend development and AI integration for enhanced learning.",
      avatar: "/images/rafiya-avatar.jpg", // Placeholder
      social: {
        github: "https://github.com/Rafiya-Rehan21",
        linkedin: "https://linkedin.com/in/rafiya-rehan",
        twitter: "https://twitter.com/rafiya_rehan",
      },
    },
    {
      name: "Ayesha",
      role: "UX/UI Designer & QA Engineer",
      description: "Focuses on user-centered design and platform quality.",
      avatar: "/images/ayesha-avatar.jpg", // Placeholder
      social: {
        github: "https://github.com/ayeshafqat36",
        linkedin: "https://linkedin.com/in/ayesha",
        twitter: "https://twitter.com/ayesha",
      },
    },
  ];

  return (
    <Box minH="100vh" bg={bg} py={{ base: 10, md: 20 }}>
      <Container maxW="7xl">
        {/* Hero Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <VStack spacing={6} textAlign="center" mb={{ base: 12, md: 20 }}>
            <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
              <Badge
                colorScheme="teal"
                variant="subtle"
                px={4}
                py={1}
                borderRadius="full"
                fontSize="sm"
                fontWeight="semibold"
                mb={4}
              >
                Transforming Education
              </Badge>
              <Heading
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                color={headingColor}
                fontWeight="extrabold"
                letterSpacing="tight"
                lineHeight={1.2}
              >
                Empowering{" "}
                <Box as="span" color={accentColor}>
                  Educators
                </Box>{" "}
                &{" "}
                <Box as="span" color={accentColor}>
                  Learners
                </Box>{" "}
                with AI
              </Heading>
            </motion.div>
            <motion.div variants={fadeIn("up", "spring", 0.4, 1)}>
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                color={secondaryTextColor}
                maxW="4xl"
                lineHeight="tall"
              >
                Cognivia is an intelligent learning platform built to empower
                students and teachers with AI-enhanced tools for a seamless,
                personalized, and impactful educational experience.
              </Text>
            </motion.div>
          </VStack>
        </motion.div>

        <Divider borderColor={dividerColor} my={{ base: 10, md: 20 }} />

        {/* Core Values: Vision, Mission, Approach */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 16 }}>
            <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                color={headingColor}
                mb={2}
              >
                Our Guiding Principles
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={secondaryTextColor}
              >
                Driving innovation with purpose and passion.
              </Text>
            </motion.div>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 8, md: 12 }}
            mb={{ base: 12, md: 20 }}
          >
            <motion.div variants={fadeIn("right", "spring", 0.3, 1)}>
              <ValueCard
                icon={FaEye}
                title="Our Vision"
                description="To revolutionize global education by making personalized, adaptive, and accessible learning a reality for every student, fostering curiosity and critical thinking."
                bg={cardBg}
                textColor={primaryTextColor}
                accentColor={accentColor}
                secondaryTextColor={secondaryTextColor}
              />
            </motion.div>
            <motion.div variants={fadeIn("right", "spring", 0.5, 1)}>
              <ValueCard
                icon={FaRocket}
                title="Our Mission"
                description="To develop cutting-edge, AI-powered educational tools that streamline tasks for teachers, deliver tailored experiences for students, and foster a dynamic, collaborative environment."
                bg={cardBg}
                textColor={primaryTextColor}
                accentColor={accentColor}
                secondaryTextColor={secondaryTextColor}
              />
            </motion.div>
            <motion.div variants={fadeIn("right", "spring", 0.7, 1)}>
              <ValueCard
                icon={FaHandsHelping}
                title="Our Approach"
                description="A multifaceted strategy focusing on intelligent automation, student-centric design, and building a robust collaborative ecosystem for modern learning."
                bg={cardBg}
                textColor={primaryTextColor}
                accentColor={accentColor}
                secondaryTextColor={secondaryTextColor}
              />
            </motion.div>
          </SimpleGrid>
        </motion.div>

        <Divider borderColor={dividerColor} my={{ base: 10, md: 16 }} />

        {/* Features Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <VStack spacing={6} textAlign="center" mb={{ base: 12, md: 20 }}>
            <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                color={headingColor}
                mb={4}
              >
                Innovative Solutions for a Modern Classroom
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={secondaryTextColor}
                maxW="4xl"
                lineHeight="base"
              >
                Combining cutting-edge technology with pedagogical expertise to
                create a seamless learning journey for everyone.
              </Text>
            </motion.div>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 6, md: 8 }}
              mt={8}
              width="100%"
            >
              <motion.div variants={fadeIn("up", "spring", 0.4, 1)}>
                <FeatureCard
                  icon={FaBrain}
                  title="AI-Powered Learning"
                  description="Dynamic quizzes, intelligent content generation, and personalized learning paths tailored to individual student needs and progress."
                  bg={cardBg}
                  textColor={primaryTextColor}
                  accentColor={accentColor}
                  secondaryTextColor={secondaryTextColor}
                />
              </motion.div>
              <motion.div variants={fadeIn("up", "spring", 0.6, 1)}>
                <FeatureCard
                  icon={FaLightbulb}
                  title="Comprehensive Educator Tools"
                  description="Intuitive dashboards for efficient course creation, assignment management, streamlined grading, and insightful performance tracking."
                  bg={cardBg}
                  textColor={primaryTextColor}
                  accentColor={accentColor}
                  secondaryTextColor={secondaryTextColor}
                />
              </motion.div>
              <motion.div variants={fadeIn("up", "spring", 0.8, 1)}>
                <FeatureCard
                  icon={FaUsers}
                  title="Engaging Collaboration Hub"
                  description="Fostering interactive learning environments through robust student-teacher communication, real-time feedback, and integrated live class functionalities."
                  bg={cardBg}
                  textColor={primaryTextColor}
                  accentColor={accentColor}
                  secondaryTextColor={secondaryTextColor}
                />
              </motion.div>
            </SimpleGrid>
          </VStack>
        </motion.div>

        <Divider borderColor={dividerColor} my={{ base: 10, md: 16 }} />

        {/* Team Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <VStack spacing={6} textAlign="center" mb={{ base: 12, md: 20 }}>
            <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
              <Icon as={FaLaptopCode} boxSize={12} color={accentColor} mb={2} />
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                color={headingColor}
              >
                Meet Our Visionary Team
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={secondaryTextColor}
                maxW="4xl"
              >
                Cognivia is proudly developed by a passionate team of Computer
                Science students from Pakistan, united by a shared vision to
                transform education through technology.
              </Text>
            </motion.div>

            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 4 }}
              spacing={{ base: 6, md: 8 }}
              mt={8}
              width="100%"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn("up", "spring", 0.3 * index, 1)}
                >
                  <TeamMemberCard
                    name={member.name}
                    role={member.role}
                    description={member.description}
                    avatarSrc={member.avatar}
                    social={member.social}
                    bg={cardBg}
                    primaryTextColor={primaryTextColor}
                    secondaryTextColor={secondaryTextColor}
                    accentColor={accentColor}
                  />
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeIn("up", "spring", 0.4, 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <Flex
            justify="center"
            align="center"
            direction="column"
            p={{ base: 8, md: 12 }}
            bg={useColorModeValue("gray.50", "gray.800")} // Use blue.50 for light mode, blue.900 for dark mode
            borderRadius="3xl" // More rounded for CTA
            shadow="xl"
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            {/* Background blobs for visual interest */}
            <Box
              position="absolute"
              top="-50px"
              right="-50px"
              w="200px"
              h="200px"
              borderRadius="full"
              bg={useColorModeValue("blue.100", "gray.800")}
              opacity={0.6}
              filter="blur(50px)"
              zIndex={0}
            />
            <Box
              position="absolute"
              bottom="-80px"
              left="-80px"
              w="250px"
              h="250px"
              borderRadius="full"
              bg={useColorModeValue("teal.100", "gray.900")}
              opacity={0.4}
              filter="blur(60px)"
              zIndex={0}
            />
            <VStack position="relative" zIndex={1} spacing={5}>
              <Icon as={FaGlobe} boxSize={14} color={accentColor} />
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                color={headingColor}
              >
                Join Our Educational Revolution
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={secondaryTextColor}
                maxW="3xl"
                lineHeight="base"
              >
                We&apos;re constantly innovating and striving to make education
                more accessible and engaging for everyone. Explore Cognivia
                today!
              </Text>
              <Button
                colorScheme="teal"
                size="lg"
                borderRadius="full"
                px={10}
                py={7} // Increased padding for a larger button
                shadow="lg"
                _hover={{ transform: "translateY(-3px)", shadow: "xl" }}
                rightIcon={<FaRocket />}
                mt={4}
                fontSize="xl" // Larger font size for the button
                onClick={() => router.push("/signup")}
              >
                Get Started
              </Button>
            </VStack>
          </Flex>
        </motion.div>
      </Container>
    </Box>
  );
}

// Component for Value Cards (Vision, Mission, Approach) - Now uses Chakra Card
function ValueCard({
  icon,
  title,
  description,
  bg,
  textColor,
  secondaryTextColor,
  accentColor,
}: {
  icon: IconType;
  title: string;
  description: string;
  bg: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
}) {
  return (
    <Card
      bg={bg}
      borderRadius="2xl" // Consistent rounded corners
      boxShadow={useColorModeValue("md", "dark-sm")} // Subtle shadow
      p={6}
      h="100%"
      border="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")} // Subtle border
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: useColorModeValue("lg", "dark-lg"), // More pronounced hover shadow
        borderColor: accentColor, // Accent border on hover
      }}
    >
      <CardBody textAlign="center">
        <Flex
          justify="center"
          align="center"
          w={16}
          h={16}
          bg={useColorModeValue(`${accentColor}.100`, `${accentColor}.700`)} // Lighter/Darker accent bg for icon circle
          borderRadius="full"
          mx="auto"
          mb={4}
          transition="background 0.3s ease"
        >
          <Icon as={icon} boxSize={7} color={accentColor} /> {/* Larger icon */}
        </Flex>
        <Heading size="lg" color={textColor} mb={3} fontWeight="bold">
          {title}
        </Heading>
        <Text color={secondaryTextColor} fontSize="md">
          {description}
        </Text>
      </CardBody>
    </Card>
  );
}

// Component for Feature Cards (Innovative Solutions) - Now uses Chakra Card
function FeatureCard({
  icon,
  title,
  description,
  bg,
  textColor,
  secondaryTextColor,
  accentColor,
}: {
  icon: IconType;
  title: string;
  description: string;
  bg: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
}) {
  return (
    <Card
      bg={bg}
      borderRadius="3xl" // Even more rounded for these prominent cards
      boxShadow={useColorModeValue("lg", "dark-md")}
      p={8}
      h="100%"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: useColorModeValue("2xl", "dark-xl"),
        borderColor: accentColor,
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Subtle background element for visual depth */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w="120px" // Larger blob
        h="120px"
        bg={useColorModeValue(`${accentColor}.50`, `${accentColor}.900`)} // Match accent
        borderRadius="full"
        transform="translate(40%, -40%)"
        opacity={0.5}
        filter="blur(30px)"
      />
      <CardBody
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        zIndex={1}
      >
        <Flex
          justify="center"
          align="center"
          w={20}
          h={20}
          bg={useColorModeValue(`${accentColor}.100`, `${accentColor}.700`)}
          borderRadius="3xl" // Rounded square for icon container
          mx="auto"
          mb={6}
          transition="background 0.3s ease"
        >
          <Icon as={icon} boxSize={9} color={accentColor} /> {/* Larger icon */}
        </Flex>
        <Heading size="xl" color={textColor} mb={4} fontWeight="extrabold">
          {title}
        </Heading>
        <Text color={secondaryTextColor} fontSize="lg" lineHeight="short">
          {description}
        </Text>
      </CardBody>
    </Card>
  );
}

// Component for Team Member Cards - Now uses Chakra Card
function TeamMemberCard({
  name,
  role,
  description,
  avatarSrc,
  social,
  bg,
  primaryTextColor,
  secondaryTextColor,
  accentColor,
}: {
  name: string;
  role: string;
  description: string;
  avatarSrc?: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  bg: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  accentColor: string;
}) {
  return (
    <Card
      bg={bg}
      borderRadius="xl"
      boxShadow={useColorModeValue("sm", "dark-xs")}
      p={6}
      h="100%"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: useColorModeValue("lg", "dark-md"),
      }}
    >
      <VStack spacing={4} align="center" h="100%" justify="space-between">
        <Avatar
          size="xl"
          name={name}
          src={avatarSrc}
          bg={useColorModeValue(`${accentColor}.100`, `gray.700`)}
          color={useColorModeValue(`${accentColor}.800`, `white`)}
        />
        <Box textAlign="center" flex="1">
          <Heading size="md" color={primaryTextColor} mb={1} fontWeight="bold">
            {name}
          </Heading>
          <Text color={accentColor} fontWeight="semibold" fontSize="sm" mb={2}>
            {role}
          </Text>
          <Text color={secondaryTextColor} fontSize="sm" lineHeight="shorter">
            {description}
          </Text>
        </Box>
        <HStack spacing={3} mt={4}>
          <Link href={social.github} isExternal>
            <Button
              variant="ghost"
              size="sm"
              color={secondaryTextColor}
              _hover={{
                color: accentColor,
                bg: useColorModeValue("gray.100", "teal.700"),
              }}
              borderRadius="md"
            >
              <Icon as={FaGithub} boxSize={5} />
            </Button>
          </Link>
          <Link href={social.linkedin} isExternal>
            <Button
              variant="ghost"
              size="sm"
              color={secondaryTextColor}
              _hover={{
                color: accentColor,
                bg: useColorModeValue("gray.100", "teal.700"),
              }}
              borderRadius="md"
            >
              <Icon as={FaLinkedin} boxSize={5} />
            </Button>
          </Link>
          <Link href={social.twitter} isExternal>
            <Button
              variant="ghost"
              size="sm"
              color={secondaryTextColor}
              _hover={{
                color: accentColor,
                bg: useColorModeValue("gray.100", "teal.700"),
              }}
              borderRadius="md"
            >
              <Icon as={FaTwitter} boxSize={5} />
            </Button>
          </Link>
        </HStack>
      </VStack>
    </Card>
  );
}
