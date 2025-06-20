"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  useToast,
  Spinner,
  Flex, // For centering spinner and other elements
  useColorModeValue, // For color mode compatibility
  Icon, // For adding icons
  Card, // Using Card for the main content block
  CardBody,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaPaperclip,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa"; // Icons for description, due date, attachment, success/error

export default function SubmitAssignmentPage() {
  const { assignmentId } = useParams();
  const id = Array.isArray(assignmentId) ? assignmentId[0] : assignmentId;
  const [assignment, setAssignment] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoadingAssignment, setIsLoadingAssignment] = useState(true); // Loading state for assignment data
  const toast = useToast();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  // --- Color Mode Values ---
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const cardShadow = useColorModeValue("md", "dark-lg"); // "dark-lg" needs to be defined in theme
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const strongColor = useColorModeValue("gray.800", "whiteAlpha.900"); // For bold text like "Description:"
  const dueDateColor = useColorModeValue("gray.600", "gray.300");

  // File Input Colors
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputHoverBorderColor = useColorModeValue("blue.400", "blue.300");
  const inputFileColor = useColorModeValue("gray.700", "gray.200");

  // Button Colors
  const submitButtonColorScheme = "teal";
  const attachedFileLinkColor = useColorModeValue("blue.600", "blue.400");
  const attachedFileLinkHoverColor = useColorModeValue("blue.700", "blue.300");

  // Submission Status Message Colors
  const submittedMessageColor = useColorModeValue("green.600", "green.400");
  const notSubmittedMessageColor = useColorModeValue(
    "orange.600",
    "orange.400"
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Ensure ID exists
      setIsLoadingAssignment(true);
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          fetch(`/api/assignments/${id}`),
          fetch(`/api/assignments/${id}/submission`), // Corrected endpoint for checking submission
        ]);

        if (!assignmentRes.ok) {
          throw new Error("Failed to fetch assignment details.");
        }
        const assignmentData = await assignmentRes.json();
        setAssignment(assignmentData);

        if (submissionRes.ok) {
          const submissionData = await submissionRes.json();
          setSubmitted(!!submissionData.submission); // Check if submission object exists
        } else {
          // If no submission found (404), treat as not submitted
          setSubmitted(false);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        toast({
          title: "Failed to load assignment",
          description: err.message || "Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setAssignment(null); // Clear assignment if fetch fails
      } finally {
        setIsLoadingAssignment(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please choose a file to submit.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setSubmitting(true);
    try {
      const res = await fetch(`/api/assignments/${id}/submit`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Submission failed");
      }

      toast({
        title: "Assignment submitted!",
        description: "Your file has been successfully uploaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSubmitted(true); // Disable form immediately
      setFile(null); // Clear selected file
    } catch (err: any) {
      console.error("Submission error:", err);
      toast({
        title: "Submission failed",
        description: err.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state for the page content
  if (isLoadingAssignment) {
    return (
      <Flex justify="center" align="center" minH="80vh" bg={pageBg}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Flex>
    );
  }

  // If assignment is not found after loading
  if (!assignment) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="80vh"
        bg={pageBg}
        direction="column"
        p={8}
      >
        <Icon as={FaExclamationCircle} w={12} h={12} color="red.500" mb={4} />
        <Heading size="lg" color={headingColor} mb={4}>
          Assignment Not Found
        </Heading>
        <Text color={textColor} mb={6} textAlign="center">
          The assignment you are looking for does not exist or you do not have
          access.
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => router.back()} // Go back to previous page
          borderRadius="full"
          shadow="md"
          _hover={{ shadow: "lg", transform: "translateY(-1px)" }}
        >
          Go Back
        </Button>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="700px" mx="auto" bg={pageBg} minH="100vh">
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="2xl" // Large rounded corners for the main card
        shadow={cardShadow}
        p={{ base: 4, md: 8 }} // Responsive padding
      >
        <CardBody>
          <Heading size="xl" mb={4} color={headingColor} fontWeight="bold">
            {assignment.title}
          </Heading>

          <Text fontSize="lg" mb={3} color={textColor}>
            <Text
              as="span"
              fontWeight="bold"
              color={strongColor}
              display="inline-flex"
              alignItems="center"
            >
              <Icon as={FaFileAlt} mr={2} /> Description:
            </Text>{" "}
            {assignment.description || "No description provided."}
          </Text>

          <Text fontSize="md" mb={4} color={dueDateColor}>
            <Text
              as="span"
              fontWeight="bold"
              color={strongColor}
              display="inline-flex"
              alignItems="center"
            >
              <Icon as={FaCalendarAlt} mr={2} /> Due:
            </Text>{" "}
            {new Date(assignment.dueDate).toLocaleString()}
          </Text>

          {assignment.fileUrl && (
            <Button
              as="a"
              href={assignment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="blue"
              variant="outline" // Outline variant for a link-like button
              size="md"
              leftIcon={<FaPaperclip />}
              mb={6}
              borderRadius="full" // Rounded button
              color={attachedFileLinkColor}
              borderColor={attachedFileLinkColor}
              _hover={{
                bg: useColorModeValue("blue.50", "blue.900"),
                color: attachedFileLinkHoverColor,
                borderColor: attachedFileLinkHoverColor,
                shadow: "sm",
              }}
              transition="all 0.2s ease-in-out"
            >
              View Attached File
            </Button>
          )}

          {submitted ? (
            <Flex
              align="center"
              p={4}
              bg={useColorModeValue("green.50", "green.900")}
              borderRadius="lg"
              color={submittedMessageColor}
              fontWeight="semibold"
              mt={6}
              shadow="sm"
            >
              <Icon as={FaCheckCircle} mr={3} w={6} h={6} />
              <Text fontSize="lg">
                You have already submitted this assignment.
              </Text>
            </Flex>
          ) : (
            <VStack spacing={5} align="stretch" mt={6}>
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                Submit your work:
              </Text>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                p={2} // Add padding inside input
                h="auto" // Adjust height for file input
                borderWidth="2px"
                borderColor={inputBorderColor}
                borderRadius="lg" // Rounded input
                bg={inputBg}
                color={inputFileColor}
                _hover={{ borderColor: inputHoverBorderColor }}
                _focus={{
                  borderColor: inputHoverBorderColor,
                  boxShadow: useColorModeValue(
                    "0 0 0 1px " + inputHoverBorderColor,
                    "0 0 0 1px " + inputHoverBorderColor
                  ),
                }}
                css={{
                  "&::file-selector-button": {
                    border: "none",
                    outline: "none",
                    marginRight: "16px",
                    borderRadius: "full", // Rounded file selector button
                    bg: useColorModeValue("gray.200", "gray.600"),
                    color: useColorModeValue("gray.800", "gray.100"),
                    padding: "8px 16px",
                    cursor: "pointer",
                    _hover: { bg: useColorModeValue("gray.300", "gray.500") },
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              />
              <Button
                colorScheme={submitButtonColorScheme}
                onClick={handleSubmit}
                isLoading={submitting}
                loadingText="Submitting..."
                size="lg" // Larger button
                px={8} // More padding
                borderRadius="full" // Fully rounded button
                shadow="md"
                _hover={{
                  shadow: "lg",
                  transform: "translateY(-2px)",
                  bg: useColorModeValue(
                    submitButtonColorScheme + ".600",
                    submitButtonColorScheme + ".400"
                  ),
                }}
                transition="all 0.2s ease-in-out"
                mt={3}
              >
                Submit Assignment
              </Button>
            </VStack>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}
