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
  Flex,
  useColorModeValue,
  Icon,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaPaperclip,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

interface assignmentType {
  title: string;
  description: string;
  dueDate: string;
  fileUrl?: string; // Optional URL for the assignment file
}

export default function SubmitAssignmentPage() {
  const { assignmentId } = useParams();
  // Ensure id is always a string, handling the case where assignmentId might be an array
  const id = Array.isArray(assignmentId) ? assignmentId[0] : assignmentId;

  const [assignment, setAssignment] = useState<assignmentType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoadingAssignment, setIsLoadingAssignment] = useState(true);
  const toast = useToast();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  // --- Material You-inspired Color Mode Values ---
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const cardShadow = useColorModeValue("lg", "dark-lg"); // Using "lg" for light, "dark-lg" implies a custom theme extension for dark shadows
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const strongColor = useColorModeValue("gray.800", "whiteAlpha.900");
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
  const submittedMessageBg = useColorModeValue("green.50", "green.900");
  const submittedMessageColor = useColorModeValue("green.700", "green.300");
  const submittedMessageBorder = useColorModeValue("green.200", "green.700");

  const submitButtonColor = useColorModeValue(
    submitButtonColorScheme + ".600",
    submitButtonColorScheme + ".400"
  );

  const spinnerColor = useColorModeValue("blue.500", "blue.300");

  const cssBg = useColorModeValue("blue.100", "blue.700");
  const cssColor = useColorModeValue("blue.800", "blue.100");
  const cssHover = useColorModeValue("blue.200", "blue.600");
  const iconColor = useColorModeValue("red.500", "red.400");
  const assignmentButtonColor = useColorModeValue("blue.50", "blue.900");

  // Dynamic Box Shadow for focus states (can be reused)
  const focusBoxShadow = (color: string) => `0 0 0 2px ${color}`;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setIsLoadingAssignment(false);
        return;
      } // Ensure ID exists

      setIsLoadingAssignment(true);
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          fetch(`/api/assignments/${id}`),
          fetch(`/api/assignments/${id}/submit`), // Corrected endpoint for checking submission
        ]);

        if (!assignmentRes.ok) {
          const errorData = await assignmentRes.json();
          throw new Error(
            errorData.message || "Failed to fetch assignment details."
          );
        }
        const assignmentData = await assignmentRes.json();
        setAssignment(assignmentData);

        // Check submission status only if assignment fetch was successful
        if (submissionRes.ok) {
          const submissionData = await submissionRes.json();
          // Assuming a successful fetch of submission data means it exists
          setSubmitted(
            !!submissionData && Object.keys(submissionData).length > 0
          );
        } else {
          // If no submission found (e.g., 404), treat as not submitted
          setSubmitted(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast({
          title: "Failed to load assignment",
          description: (err as Error).message || "Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
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
        position: "top",
      });
      return;
    }

    // Basic file size and type validation (optional but recommended)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_FILE_TYPES = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF, Word document, JPG, or PNG image.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
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
        position: "top",
      });
      setSubmitted(true); // Disable form immediately
      setFile(null); // Clear selected file
    } catch (err) {
      console.error("Submission error:", err);
      toast({
        title: "Submission failed",
        description: (err as Error).message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state for the page content
  if (isLoadingAssignment) {
    return (
      <Flex justify="center" align="center" minH="80vh" bg={pageBg}>
        <Spinner size="xl" color={spinnerColor} thickness="4px" />
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
        <Icon as={FaExclamationCircle} w={16} h={16} color={iconColor} mb={6} />
        <Heading size="xl" color={headingColor} mb={4} textAlign="center">
          Assignment Not Found
        </Heading>
        <Text
          fontSize="lg"
          color={textColor}
          mb={8}
          textAlign="center"
          maxW="lg"
        >
          The assignment you are looking for does not exist or there was an
          error loading its details.
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => router.back()} // Go back to previous page
          borderRadius="full"
          size="lg"
          px={8}
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
        p={{ base: 6, md: 8 }} // Responsive padding
        py={{ base: 8, md: 10 }} // More vertical padding
      >
        <CardBody>
          <Heading
            size="xl"
            mb={6}
            color={headingColor}
            fontWeight="extrabold"
            textAlign="center"
          >
            {assignment.title}
          </Heading>

          <VStack spacing={4} align="stretch" mb={8}>
            <Text fontSize="lg" color={textColor} lineHeight="tall">
              <Text
                as="span"
                fontWeight="bold"
                color={strongColor}
                display="inline-flex"
                alignItems="flex-start"
                mr={2}
              >
                <Icon as={FaFileAlt} mr={2} mt={1} /> Description:
              </Text>{" "}
              {assignment.description ||
                "No description provided for this assignment."}
            </Text>

            <Text fontSize="md" color={dueDateColor}>
              <Text
                as="span"
                fontWeight="bold"
                color={strongColor}
                display="inline-flex"
                alignItems="center"
                mr={2}
              >
                <Icon as={FaCalendarAlt} mr={2} /> Due Date:
              </Text>{" "}
              {new Date(assignment.dueDate).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>

            {assignment.fileUrl && (
              <Button
                as="a"
                href={assignment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="blue"
                variant="outline"
                size="lg" // Larger button for important actions
                leftIcon={<FaPaperclip />}
                borderRadius="full"
                color={attachedFileLinkColor}
                borderColor={attachedFileLinkColor}
                _hover={{
                  bg: assignmentButtonColor,
                  color: attachedFileLinkHoverColor,
                  borderColor: attachedFileLinkHoverColor,
                  shadow: "sm",
                }}
                transition="all 0.2s ease-in-out"
                alignSelf="flex-start" // Align button to start
                px={6}
              >
                View Assignment Instructions
              </Button>
            )}
          </VStack>

          {submitted ? (
            <Flex
              align="center"
              p={5}
              bg={submittedMessageBg}
              borderRadius="xl" // Larger border radius
              color={submittedMessageColor}
              fontWeight="semibold"
              mt={6}
              shadow="md" // Subtle shadow
              border="1px solid"
              borderColor={submittedMessageBorder}
              flexDirection={{ base: "column", md: "row" }}
              textAlign={{ base: "center", md: "left" }}
            >
              <Icon
                as={FaCheckCircle}
                mr={{ base: 0, md: 3 }}
                mb={{ base: 2, md: 0 }}
                w={8}
                h={8}
              />
              <Text fontSize={{ base: "md", md: "lg" }}>
                You have successfully submitted this assignment.
              </Text>
            </Flex>
          ) : (
            <VStack spacing={5} align="stretch" mt={6}>
              <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                Submit your work:
              </Text>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                p={3} // More padding inside input
                h="auto"
                borderWidth="2px"
                borderColor={inputBorderColor}
                borderRadius="xl" // Rounded input
                bg={inputBg}
                color={inputFileColor}
                _hover={{ borderColor: inputHoverBorderColor }}
                _focus={{
                  borderColor: inputHoverBorderColor,
                  boxShadow: focusBoxShadow(inputHoverBorderColor), // Re-use dynamic shadow
                }}
                css={{
                  "&::file-selector-button": {
                    border: "none",
                    outline: "none",
                    marginRight: "16px",
                    borderRadius: "full",
                    bg: cssBg, // Button for file selector
                    color: cssColor,
                    padding: "10px 20px", // Larger padding for file selector button
                    cursor: "pointer",
                    fontWeight: "semibold",
                    _hover: { bg: cssHover },
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              />
              {file && (
                <Text fontSize="sm" color={textColor}>
                  Selected file:{" "}
                  <Text as="span" fontWeight="medium">
                    {file.name}
                  </Text>
                </Text>
              )}
              <Button
                colorScheme={submitButtonColorScheme}
                onClick={handleSubmit}
                isLoading={submitting}
                loadingText="Submitting..."
                size="xl" // Even larger button for submission
                p={3} // More padding
                borderRadius="full"
                shadow="lg" // More prominent shadow
                _hover={{
                  shadow: "xl",
                  transform: "translateY(-2px)",
                  bg: submitButtonColor,
                }}
                transition="all 0.2s ease-in-out"
                mt={4} // More margin top
                alignSelf="center" // Center the button
                isDisabled={!file} // Disable if no file is selected
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
