"use client";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  useToast,
  Text,
  Divider,
  Select,
  Flex,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  Spinner,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FiPlus,
  FiVideo,
  FiCalendar,
  FiBookOpen,
  FiClock,
  FiInfo,
} from "react-icons/fi";

type Course = {
  _id: string;
  title: string;
};

type LiveClass = {
  _id: string;
  title: string;
  courseId: string;
  course?: Course;
  scheduledAt: string;
  channelName: string;
};

type FormErrors = {
  title: string;
  scheduledAt: string;
  selectedCourse: string;
};

export default function LiveClassDashboard() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: "",
    scheduledAt: "",
    selectedCourse: "",
  });

  // Material You-inspired colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const lightTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputFocusBorderColor = useColorModeValue("blue.400", "blue.300");
  const accentColor = useColorModeValue("teal.500", "teal.200");
  const errorColor = useColorModeValue("red.500", "red.300");

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {
      title: "",
      scheduledAt: "",
      selectedCourse: "",
    };

    if (!selectedCourse) {
      newErrors.selectedCourse = "Please select a course.";
      isValid = false;
    }
    if (!title.trim()) {
      newErrors.title = "Class title is required.";
      isValid = false;
    }
    if (!scheduledAt.trim()) {
      newErrors.scheduledAt = "Schedule date/time is required.";
      isValid = false;
    } else {
      const parsedDate = new Date(scheduledAt);
      if (isNaN(parsedDate.getTime())) {
        newErrors.scheduledAt = "Please enter a valid date and time.";
        isValid = false;
      } else if (parsedDate < new Date()) {
        newErrors.scheduledAt = "Scheduled time cannot be in the past.";
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      const [coursesRes, classesRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/live-classes"),
      ]);

      const coursesData = await coursesRes.json();
      const classesData = await classesRes.json();

      if (coursesRes.ok) {
        setCourses(coursesData);
      } else {
        throw new Error(coursesData.message || "Failed to fetch courses.");
      }

      if (classesRes.ok) {
        setClasses(classesData);
      } else {
        throw new Error(classesData.message || "Failed to fetch classes.");
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: "Error loading data",
        description: err.message || "Failed to fetch courses or classes.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreate = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          courseId: selectedCourse,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Live class scheduled!",
          description: `"${title}" has been scheduled.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setTitle("");
        setScheduledAt("");
        setSelectedCourse("");
        setFormErrors({ title: "", scheduledAt: "", selectedCourse: "" });
        fetchAllData();
      } else {
        toast({
          title: "Failed to schedule class",
          description: data.message || "Unknown error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "scheduledAt") setScheduledAt(value);
    if (name === "selectedCourse") setSelectedCourse(value);

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isLoadingData) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        minH="80vh"
        bg={bgColor}
      >
        <Spinner size="xl" thickness="4px" color={accentColor} />
      </Flex>
    );
  }

  // Filter upcoming classes
  const upcomingClasses = classes
    .filter((cls) => new Date(cls.scheduledAt) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

  // Filter past classes
  const pastClasses = classes
    .filter((cls) => new Date(cls.scheduledAt) < new Date())
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

  return (
    <Box p={{ base: 4, md: 8 }} maxW="5xl" mx="auto" bg={bgColor} minH="100vh">
      <Heading mb={8} size="xl" color={headingColor} textAlign="center">
        Live Class Dashboard
      </Heading>

      {/* Schedule New Class Section */}
      <Card
        bg={cardBgColor}
        borderRadius="2xl"
        boxShadow="xl"
        p={{ base: 4, md: 6 }}
        mb={8}
      >
        <CardHeader pb={4}>
          <Heading size="lg" color={headingColor}>
            Schedule a New Live Class
          </Heading>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!formErrors.selectedCourse}>
              <FormLabel color={textColor}>Select Course</FormLabel>
              <Select
                name="selectedCourse"
                placeholder="Choose a course for the class"
                value={selectedCourse}
                onChange={handleInputChange}
                size="lg"
                borderRadius="lg"
                borderColor={borderColor}
                _focus={{
                  borderColor: inputFocusBorderColor,
                  boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
                }}
              >
                {courses.length === 0 ? (
                  <option value="" disabled>
                    No courses available. Please create one first.
                  </option>
                ) : (
                  courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))
                )}
              </Select>
              <FormErrorMessage color={errorColor}>
                {formErrors.selectedCourse}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.title}>
              <FormLabel color={textColor}>Class Title</FormLabel>
              <Input
                name="title"
                placeholder="e.g. Weekly Q&A Session, Chapter 3 Review"
                value={title}
                onChange={handleInputChange}
                size="lg"
                borderRadius="lg"
                borderColor={borderColor}
                _focus={{
                  borderColor: inputFocusBorderColor,
                  boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
                }}
              />
              <FormErrorMessage color={errorColor}>
                {formErrors.title}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.scheduledAt}>
              <FormLabel color={textColor}>Scheduled Date & Time</FormLabel>
              <Input
                name="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={handleInputChange}
                size="lg"
                borderRadius="lg"
                borderColor={borderColor}
                _focus={{
                  borderColor: inputFocusBorderColor,
                  boxShadow: `0 0 0 1px ${inputFocusBorderColor}`,
                }}
              />
              <FormErrorMessage color={errorColor}>
                {formErrors.scheduledAt}
              </FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="teal"
              onClick={handleCreate}
              isLoading={isCreating}
              loadingText="Scheduling..."
              leftIcon={<FiPlus />}
              size="lg"
              borderRadius="full"
              px={8}
              mt={4}
              alignSelf="center"
              boxShadow="md"
              _hover={{ boxShadow: "lg", transform: "translateY(-1px)" }}
              isDisabled={courses.length === 0}
            >
              Schedule Class
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <Divider my={10} borderColor={borderColor} />

      {/* Upcoming Classes Section */}
      <Heading size="lg" mb={6} color={headingColor} textAlign="center">
        Upcoming Live Classes
      </Heading>
      {upcomingClasses.length === 0 ? (
        <VStack
          spacing={4}
          align="center"
          justify="center"
          py={10}
          color={lightTextColor}
          textAlign="center"
          bg={cardBgColor}
          borderRadius="2xl"
          boxShadow="md"
          minH="200px"
        >
          <Icon as={FiCalendar} w={12} h={12} color={lightTextColor} />
          <Text fontSize="lg" fontWeight="medium">
            No upcoming live classes scheduled.
          </Text>
          <Text>Schedule one using the form above!</Text>
        </VStack>
      ) : (
        <VStack spacing={5} align="stretch">
          {upcomingClasses.map((cls) => (
            <Card
              key={cls._id}
              bg={cardBgColor}
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.2s ease-in-out"
              p={4}
            >
              <CardBody>
                <Flex
                  justify="space-between"
                  align="center"
                  direction={{ base: "column", md: "row" }}
                >
                  <Box
                    textAlign={{ base: "center", md: "left" }}
                    mb={{ base: 3, md: 0 }}
                  >
                    <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                      {cls.title}
                    </Text>
                    <Text fontSize="md" color={textColor} mt={1}>
                      <Icon as={FiBookOpen} mr={2} />
                      Course: {cls.course?.title || "N/A"}
                    </Text>
                    <Text fontSize="sm" color={lightTextColor} mt={1}>
                      <Icon as={FiClock} mr={2} />
                      {new Date(cls.scheduledAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </Box>
                  <Button
                    mt={{ base: 3, md: 0 }}
                    colorScheme="blue"
                    onClick={() =>
                      window.open(
                        `/live-class/${cls.channelName}?uid=1001`,
                        "_blank"
                      )
                    }
                    leftIcon={<FiVideo />}
                    size="lg"
                    borderRadius="full"
                    px={8}
                    boxShadow="md"
                    _hover={{ boxShadow: "lg", transform: "translateY(-1px)" }}
                  >
                    Start Class
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}

      <Divider my={10} borderColor={borderColor} />

      {/* Past Classes Section */}
      <Heading size="lg" mb={6} color={headingColor} textAlign="center">
        Past Live Classes
      </Heading>
      {pastClasses.length === 0 ? (
        <VStack
          spacing={4}
          align="center"
          justify="center"
          py={10}
          color={lightTextColor}
          textAlign="center"
          bg={cardBgColor}
          borderRadius="2xl"
          boxShadow="md"
          minH="150px"
        >
          <Icon as={FiInfo} w={12} h={12} color={lightTextColor} />
          <Text fontSize="lg" fontWeight="medium">
            No past live classes to display.
          </Text>
        </VStack>
      ) : (
        <VStack spacing={5} align="stretch">
          {pastClasses.map((cls) => (
            <Card
              key={cls._id}
              bg={cardBgColor}
              borderRadius="xl"
              boxShadow="sm"
              p={4}
            >
              <CardBody>
                <Flex
                  justify="space-between"
                  align="center"
                  direction={{ base: "column", md: "row" }}
                >
                  <Box
                    textAlign={{ base: "center", md: "left" }}
                    mb={{ base: 3, md: 0 }}
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color={lightTextColor}
                    >
                      {cls.title}
                    </Text>
                    <Text fontSize="md" color={lightTextColor} mt={1}>
                      <Icon as={FiBookOpen} mr={2} />
                      Course: {cls.course?.title || "N/A"}
                    </Text>
                    <Text fontSize="sm" color={lightTextColor} mt={1}>
                      <Icon as={FiClock} mr={2} />
                      {new Date(cls.scheduledAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </Box>
                  <Button
                    mt={{ base: 3, md: 0 }}
                    colorScheme="gray"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `/live-class/${cls.channelName}?uid=1001`,
                        "_blank"
                      )
                    }
                    leftIcon={<FiVideo />}
                    size="md"
                    borderRadius="full"
                    px={6}
                    isDisabled
                  >
                    View Class
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
}
