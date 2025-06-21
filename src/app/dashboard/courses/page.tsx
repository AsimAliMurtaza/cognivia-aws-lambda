"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
  Spinner, // Import Spinner
  Flex, // Import Flex for alignment
  useColorModeValue, // Import useColorModeValue
  Icon, // For icons like a placeholder for course cards
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa"; // Example icon for courses

interface Course {
  _id: string;
  title: string;
  description: string;
  teacher?: {
    name: string;
  };
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [joinCode, setJoinCode] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  // --- Color Mode Values ---
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");

  // Course Card Colors
  const courseCardBg = useColorModeValue("white", "gray.800");
  const courseCardBorder = useColorModeValue("gray.100", "gray.700");
  const courseCardShadow = useColorModeValue("md", "dark-lg"); // "dark-lg" needs to be defined in your theme
  const courseCardHoverBg = useColorModeValue("blue.50", "gray.700"); // Subtle hover for cards
  const courseCardTitleColor = useColorModeValue("blue.700", "blue.300"); // Blue for titles
  const courseCardDescriptionColor = useColorModeValue("gray.600", "gray.300");
  const courseCardTeacherColor = useColorModeValue("gray.500", "gray.400");

  // Button Colors
  const buttonColorScheme = "teal"; // Main action button
  const modalButtonColorScheme = "blue"; // Modal button

  // Modal Colors
  const modalBg = useColorModeValue("white", "gray.800");
  const modalHeaderColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const modalInputBg = useColorModeValue("white", "gray.700");
  const modalInputBorder = useColorModeValue("gray.300", "gray.600");
  const modalInputColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const buttonBg = useColorModeValue(
    buttonColorScheme + ".600",
    buttonColorScheme + ".400"
  );
  const cancelButtonBg = useColorModeValue("gray.100", "gray.700");
  const joinButtonBg = useColorModeValue(
    modalButtonColorScheme + ".600",
    modalButtonColorScheme + ".400"
  );
  const modalBgOverlay = useColorModeValue("blackAlpha.300", "blackAlpha.600");

  const inputBorderColor = useColorModeValue("blue.500", "blue.300");
  const inputShadow = useColorModeValue(
    "0 0 0 1px blue.500",
    "0 0 0 1px blue.300"
  );

  const fetchCourses = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch("/api/courses/students");
      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      toast({
        title: "Error fetching courses",
        description: (error as Error).message || "Could not load your classes.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []); // Empty dependency array means this runs once on mount

  const handleJoinCourse = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Please enter a class code.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch("/api/courses/join", {
        method: "POST",
        body: JSON.stringify({ joinCode }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Joined class successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchCourses(); // Re-fetch courses to show the newly joined one
        onClose(); // Close modal
        setJoinCode(""); // Clear input
      } else {
        toast({
          title: data.error || "Failed to join class",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error joining course:", error);
      toast({
        title: "Network error",
        description: "Could not connect to the server.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Spinner size="xl" color={buttonColorScheme + ".500"} thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="7xl" mx="auto" bg={pageBg} minH="100vh">
      <Flex justify="space-between" align="center" mb={8} wrap="wrap">
        <Heading
          size="xl"
          mb={{ base: 4, md: 0 }}
          color={headingColor}
          fontWeight="bold"
        >
          My Classes
        </Heading>
        <Button
          colorScheme={buttonColorScheme}
          onClick={onOpen}
          size="lg" // Larger button
          px={6}
          py={6}
          borderRadius="full" // Fully rounded button
          shadow="md" // Subtle shadow
          _hover={{
            shadow: "lg",
            transform: "translateY(-2px)",
            bg: buttonBg,
          }}
          transition="all 0.2s ease-in-out"
        >
          Join via Code
        </Button>
      </Flex>

      {courses.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="50vh"
          bg={courseCardBg}
          borderRadius="2xl"
          shadow={courseCardShadow}
          p={8}
          borderWidth="1px"
          borderColor={courseCardBorder}
        >
          <Icon
            as={FaGraduationCap}
            w={16}
            h={16}
            color={courseCardTeacherColor}
            mb={4}
          />
          <Text
            fontSize="xl"
            fontWeight="semibold"
            mb={2}
            color={courseCardDescriptionColor}
          >
            You haven&apos;t joined any classes yet.
          </Text>
          <Text
            fontSize="md"
            color={courseCardTeacherColor}
            textAlign="center"
            maxW="md"
          >
            Click &qout;Join via Code&qout; to enroll in a new class, or wait
            for your teacher to add you.
          </Text>
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={6}>
          {courses.map((course) => (
            <Box
              key={course._id}
              borderWidth="1px"
              borderColor={courseCardBorder}
              borderRadius="2xl" // More rounded corners for cards
              p={6} // Increased padding
              bg={courseCardBg} // Card background
              shadow={courseCardShadow} // Material You shadow
              cursor="pointer"
              onClick={() => router.push(`/dashboard/courses/${course._id}`)}
              _hover={{
                shadow: "xl", // More pronounced shadow on hover
                transform: "translateY(-4px)", // Subtle lift effect
                bg: courseCardHoverBg, // Gentle background change on hover
              }}
              transition="all 0.3s ease-in-out" // Smooth transition
              position="relative" // For potential absolute positioning of elements
              overflow="hidden" // Ensures nothing leaks outside border radius
            >
              <Flex mb={3} alignItems="center">
                <Icon
                  as={FaGraduationCap}
                  mr={3}
                  color={courseCardTitleColor}
                  w={6}
                  h={6}
                />
                <Heading
                  size="md"
                  fontWeight="bold"
                  color={courseCardTitleColor}
                  noOfLines={3}
                >
                  {course.title}
                </Heading>
              </Flex>
              <Text
                fontSize="md"
                color={courseCardDescriptionColor}
                noOfLines={2}
                mb={3}
              >
                {course.description}
              </Text>
              <Text
                fontSize="sm"
                color={courseCardTeacherColor}
                fontWeight="medium"
              >
                Teacher: {course.teacher?.name || "N/A"}{" "}
                {/* Handle missing teacher name */}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Modal for Joining Class */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg={modalBgOverlay} /> {/* Subtle overlay */}
        <ModalContent
          bg={modalBg}
          borderRadius="xl" // Rounded modal corners
          shadow="2xl" // Stronger shadow for modal
          p={4} // Padding inside modal content
        >
          <ModalHeader
            color={modalHeaderColor}
            fontSize="2xl"
            fontWeight="bold"
          >
            Enter Class Code
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="e.g., ABC-123-XYZ"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              size="lg" // Larger input field
              borderRadius="lg" // Rounded input field
              bg={modalInputBg}
              borderColor={modalInputBorder}
              color={modalInputColor}
              _focus={{
                borderColor: inputBorderColor,
                boxShadow: inputShadow,
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                onClose();
                setJoinCode(""); // Clear code on cancel
              }}
              mr={3}
              variant="ghost" // Ghost variant for cancel
              colorScheme="gray"
              borderRadius="full" // Rounded button
              _hover={{ bg: cancelButtonBg }}
            >
              Cancel
            </Button>
            <Button
              colorScheme={modalButtonColorScheme}
              onClick={handleJoinCourse}
              isDisabled={!joinCode.trim()} // Disable if input is empty
              borderRadius="full" // Rounded button
              shadow="md"
              _hover={{
                shadow: "lg",
                transform: "translateY(-1px)",
                bg: joinButtonBg,
              }}
              transition="all 0.2s ease-in-out"
            >
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
