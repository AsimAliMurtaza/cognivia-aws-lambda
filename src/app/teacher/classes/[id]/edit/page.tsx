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
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiSave, FiArrowLeft } from "react-icons/fi";

type CourseForm = {
  title: string;
  description: string;
  subject: string;
  level: string;
};

type FormErrors = {
  title: string;
  subject: string;
  level: string;
};

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    subject: "",
    level: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({
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
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const borderTopColor = useColorModeValue("purple.500", "purple.300");
  const cardBorderColor = useColorModeValue("gray.100", "gray.700");
  const inputHoverBorderColor = useColorModeValue("gray.300", "gray.500");

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoadingCourse(true);
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch course");
        }
        const data = await res.json();
        setForm(data);
      } catch (error: unknown) {
        const err = error as Error;
        toast({
          title: "Error loading course",
          description:
            err.message || "Could not fetch course details. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setIsLoadingCourse(false);
      }
    };

    if (id) fetchCourse();
  }, [id, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
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
      router.push(`/teacher/classes/${id}`);
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: "Update failed",
        description: err.message || "Please try again later.",
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
          onClick={() => router.push(`/teacher/classes/${id}`)}
          size={isMobile ? "md" : "lg"}
          borderRadius="full"
          px={6}
          colorScheme="gray"
          _hover={{ bg: hoverBg }}
        >
          Back to Course
        </Button>
      </Flex>

      <Card
        bg={cardBgColor}
        borderRadius="2xl"
        boxShadow="xl"
        p={{ base: 4, md: 8 }}
        borderTop="8px solid"
        borderColor={borderTopColor}
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
                size="lg"
                borderRadius="lg"
                borderColor={inputBorderColor}
                _hover={{
                  borderColor: inputHoverBorderColor,
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
                rows={6}
                size="lg"
                borderRadius="lg"
                borderColor={inputBorderColor}
                _hover={{
                  borderColor: inputHoverBorderColor,
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
                    borderColor: inputHoverBorderColor,
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
                    borderColor: inputHoverBorderColor,
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

        <CardFooter pt={6} borderTop="1px solid" borderColor={cardBorderColor}>
          <Flex justify="flex-end" w="full" gap={4}>
            <Button
              variant="ghost"
              onClick={() => router.push(`/teacher/classes/${id}`)}
              size="lg"
              borderRadius="full"
              px={6}
              colorScheme="gray"
              _hover={{ bg: hoverBg }}
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
              borderRadius="full"
              px={8}
              boxShadow="md"
              _hover={{ boxShadow: "lg", transform: "translateY(-1px)" }}
            >
              Save Changes
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </Box>
  );
}
