"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Heading,
  Flex,
  Card,
  CardBody,
  CardFooter,
  Stack,
  useBreakpointValue,
  FormErrorMessage,
  useColorModeValue, // Import for Material You colors
  Spinner, // For loading state of initial fetch
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiSave, FiArrowLeft } from "react-icons/fi";

export default function EditCoursePage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true); // New state for initial course load
  const [errors, setErrors] = useState({
    title: "",
    subject: "",
    level: "",
  });
  const toast = useToast();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Material You-inspired colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const inputBorderColor = useColorModeValue("gray.200", "gray.600");
  const inputFocusBorderColor = useColorModeValue("blue.400", "blue.300");
  const buttonColorScheme = "blue";
  const errorColor = useColorModeValue("red.500", "red.300");

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoadingCourse(true); // Start loading
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch course");
        }
        const data = await res.json();
        setForm(data);
      } catch (error: any) {
        toast({
          title: "Error loading course",
          description:
            error.message ||
            "Could not fetch course details. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        // Optionally redirect if course doesn't exist or error occurs
        // router.push('/teacher/classes');
      } finally {
        setIsLoadingCourse(false); // End loading
      }
    };

    if (id) fetchCourse();
  }, [id, toast, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: !form.title.trim() ? "Course title is required." : "",
      subject: !form.subject.trim() ? "Subject is required." : "",
      level: !form.level.trim() ? "Level is required." : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update course");
      }

      toast({
        title: "Course updated!",
        description: `"${form.title}" has been successfully updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      router.push(`/teacher/classes/${id}`); // Redirect to course details page
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCourse) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        minH="80vh"
        bg={bgColor}
      >
        <Spinner size="xl" thickness="4px" color={inputFocusBorderColor} />
      </Flex>
    );
  }

  return (
    <Box
      maxW="900px"
      mx="auto"
      p={{ base: 4, md: 8 }}
      bg={bgColor}
      minH="100vh"
    >
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        direction={{ base: "column", md: "row" }}
      >
        <Heading size="xl" color={headingColor} mb={{ base: 4, md: 0 }}>
          Edit Course Details
        </Heading>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="outline"
          onClick={() => router.push(`/teacher/classes/${id}`)} // Go back to the specific course detail page
          size={isMobile ? "md" : "lg"}
          borderRadius="full" // More rounded
          px={6}
          colorScheme="gray"
          _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
        >
          Back to Course
        </Button>
      </Flex>

      <Card
        bg={cardBgColor}
        borderRadius="2xl" // More rounded corners for the card
        boxShadow="xl" // Pronounced shadow
        p={{ base: 4, md: 8 }} // Generous padding
        borderTop="8px solid"
        borderColor={useColorModeValue("purple.500", "purple.300")} // Accent border top
      >
        <CardBody>
          <Stack spacing={6}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel color={labelColor} fontSize="lg" fontWeight="medium">
                Course Title
              </FormLabel>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Computer Science"
                size="lg" // Larger input size
                borderRadius="lg" // Rounded input corners
                borderColor={inputBorderColor}
                _hover={{
                  borderColor: useColorModeValue("gray.300", "gray.500"),
                }}
                _focus={{
                  borderColor: inputFocusBorderColor,
                  boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
                }}
              />
              <FormErrorMessage color={errorColor} fontSize="sm" mt={2}>
                {errors.title}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel color={labelColor} fontSize="lg" fontWeight="medium">
                Description
              </FormLabel>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed description for your course..."
                rows={6} // More rows for better visibility
                size="lg"
                borderRadius="lg"
                borderColor={inputBorderColor}
                _hover={{
                  borderColor: useColorModeValue("gray.300", "gray.500"),
                }}
                _focus={{
                  borderColor: inputFocusBorderColor,
                  boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
                }}
              />
            </FormControl>

            <Flex gap={5} direction={{ base: "column", md: "row" }}>
              <FormControl isInvalid={!!errors.subject} flex={1}>
                <FormLabel color={labelColor} fontSize="lg" fontWeight="medium">
                  Subject
                </FormLabel>
                <Input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics, History, Physics"
                  size="lg"
                  borderRadius="lg"
                  borderColor={inputBorderColor}
                  _hover={{
                    borderColor: useColorModeValue("gray.300", "gray.500"),
                  }}
                  _focus={{
                    borderColor: inputFocusBorderColor,
                    boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
                  }}
                />
                <FormErrorMessage color={errorColor} fontSize="sm" mt={2}>
                  {errors.subject}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.level} flex={1}>
                <FormLabel color={labelColor} fontSize="lg" fontWeight="medium">
                  Level
                </FormLabel>
                <Input
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  placeholder="e.g. Beginner, Intermediate, Advanced"
                  size="lg"
                  borderRadius="lg"
                  borderColor={inputBorderColor}
                  _hover={{
                    borderColor: useColorModeValue("gray.300", "gray.500"),
                  }}
                  _focus={{
                    borderColor: inputFocusBorderColor,
                    boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
                  }}
                />
                <FormErrorMessage color={errorColor} fontSize="sm" mt={2}>
                  {errors.level}
                </FormErrorMessage>
              </FormControl>
            </Flex>
          </Stack>
        </CardBody>

        <CardFooter
          pt={6}
          borderTop="1px solid"
          borderColor={useColorModeValue("gray.100", "gray.700")}
        >
          <Flex justify="flex-end" w="full" gap={4}>
            <Button
              variant="ghost" // Use ghost variant for cancel
              onClick={() => router.push(`/teacher/classes/${id}`)}
              size="lg"
              borderRadius="full"
              px={6}
              colorScheme="gray"
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            >
              Cancel
            </Button>
            <Button
              colorScheme={buttonColorScheme}
              onClick={handleSubmit}
              leftIcon={<FiSave />}
              isLoading={isSubmitting}
              loadingText="Saving Changes"
              size="lg"
              borderRadius="full" // Rounded button
              px={8}
              boxShadow="md" // Subtle shadow
              _hover={{ boxShadow: "lg", transform: "translateY(-1px)" }} // Lift on hover
            >
              Save Changes
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </Box>
  );
}
