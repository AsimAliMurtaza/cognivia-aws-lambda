"use client";
import {
  Box,
  Heading,
  Text,
  Stack,
  Spinner,
  Button,
  useToast,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
  Divider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AvatarGroup,
  Avatar,
  useColorModeValue, // Import useColorModeValue for theming
  useColorMode, // Import useColorMode if needed for toggling
  InputGroup,
  InputRightElement,
  Tooltip,
  HStack, // Added for join code
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
  AttachmentIcon,
  CopyIcon, // For copy join code
} from "@chakra-ui/icons";
import { FiPlus, FiBook, FiUsers, FiClipboard, FiShare2 } from "react-icons/fi"; // Added more icons

type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
};

type Submission = {
  studentId: User | string;
  fileUrl: string;
  submittedAt?: Date;
};

type Assignment = {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  fileUrl?: string;
  submissions: Submission[];
  createdAt?: string;
  updatedAt?: string;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  createdBy: User | string;
  students: User[] | string[];
  joinCode: string;
  assignments: Assignment[];
  createdAt?: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
  });
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    file: null as File | null,
  });
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "course" | "assignment";
  } | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure(); // For Create Course Modal
  const {
    isOpen: isAssignmentOpen,
    onOpen: onAssignmentOpen,
    onClose: onAssignmentClose,
  } = useDisclosure(); // For Create Assignment Modal

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const lightTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("teal.500", "blue.400");
  const spinnerColor = useColorModeValue("teal.500", "blue.300");
  const buttonColor = useColorModeValue("teal", "blue");
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(
        "/api/courses?populate=assignments,students,createdBy"
      );
      const data = await res.json();
      setCourses(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error loading classes",
        description: "Failed to fetch your classes.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssignmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAssignmentForm({ ...assignmentForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAssignmentForm({
        ...assignmentForm,
        file: e.target.files[0],
      });
    }
  };

  const handleCreateCourse = async () => {
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newCourse = await res.json();
        toast({
          title: "Class created!",
          description: "Your new class has been successfully added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setCourses([...courses, newCourse]);
        onClose();
        setForm({ title: "", description: "", subject: "", level: "" });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create class");
      }
    } catch (error: any) {
      toast({
        title: "Error creating class",
        description: error.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreateAssignment = async () => {
    if (!selectedCourse) return;

    try {
      const formData = new FormData();
      formData.append("title", assignmentForm.title);
      formData.append("description", assignmentForm.description);
      formData.append("dueDate", assignmentForm.dueDate);
      formData.append("courseId", selectedCourse._id);

      if (assignmentForm.file) {
        formData.append("file", assignmentForm.file);
      }

      const res = await fetch("/api/assignments", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newAssignment = await res.json();
        toast({
          title: "Assignment created!",
          description: "The assignment has been added to the class.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        const updatedCourses = courses.map((course) => {
          if (course._id === selectedCourse._id) {
            return {
              ...course,
              assignments: [...(course.assignments || []), newAssignment],
            };
          }
          return course;
        });

        setCourses(updatedCourses);
        setAssignmentForm({
          title: "",
          description: "",
          dueDate: "",
          file: null,
        });
        onAssignmentClose();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create assignment");
      }
    } catch (error: any) {
      toast({
        title: "Error creating assignment",
        description: error.message || "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint =
        itemToDelete.type === "course"
          ? `/api/courses/${itemToDelete.id}`
          : `/api/assignments/${itemToDelete.id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (res.ok) {
        if (itemToDelete.type === "course") {
          setCourses(courses.filter((c) => c._id !== itemToDelete.id));
          toast({
            title: "Class deleted",
            description: "The class and all its assignments have been removed.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          const updatedCourses = courses.map((course) => {
            if (course.assignments?.some((a) => a._id === itemToDelete.id)) {
              return {
                ...course,
                assignments: course.assignments?.filter(
                  (a) => a._id !== itemToDelete.id
                ),
              };
            }
            return course;
          });
          setCourses(updatedCourses);
          toast({
            title: "Assignment deleted",
            description: "The assignment has been removed.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to delete ${itemToDelete.type}`
        );
      }
    } catch (error: any) {
      toast({
        title: "Deletion error",
        description:
          error.message || "Could not delete the item. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setItemToDelete(null);
    }
  };

  const openDeleteAlert = (id: string, type: "course" | "assignment") => {
    setItemToDelete({ id, type });
    setIsDeleteAlertOpen(true);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStudentAvatars = (students: User[] | string[]) => {
    if (!students || students.length === 0) return null;

    // Check if students are populated User objects
    const isPopulated =
      typeof students[0] === "object" &&
      (students[0] as User).name !== undefined;

    if (isPopulated) {
      return (
        <AvatarGroup size="sm" max={3}>
          {(students as User[]).map((student) => (
            <Avatar
              key={student._id}
              name={student?.name || "Unknown User"}
              src={student?.avatar}
              bg={useColorModeValue("blue.100", "blue.700")}
              color={useColorModeValue("blue.800", "blue.100")}
            />
          ))}
        </AvatarGroup>
      );
    } else {
      // If students are just IDs or not fully populated, show a count
      return (
        <Badge
          colorScheme="blue"
          variant="subtle"
          borderRadius="full"
          px={3}
          py={1}
          ml={1}
          display="flex"
          alignItems="center"
        >
          <FiUsers style={{ marginRight: "4px" }} />
          <Text fontSize="xs" fontWeight="bold">
            {students.length}
          </Text>
        </Badge>
      );
    }
  };

  const handleCopyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Join code copied!",
      description: "You can now share this code with your students.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg={bg}>
        <Spinner size="xl" thickness="4px" color={spinnerColor} />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg={bg} minH="100vh">
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={8}
        direction={{ base: "column", md: "row" }}
      >
        <Heading
          size={{ base: "lg", md: "xl" }}
          color={headingColor}
          mb={{ base: 4, md: 0 }}
        >
          My Classes
        </Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme={buttonColor}
          onClick={onOpen}
          size={isMobile ? "md" : "lg"}
          borderRadius="full"
          px={isMobile ? 6 : 8}
          py={isMobile ? 3 : 6}
          fontWeight="semibold"
          boxShadow="md"
          _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
        >
          Create New Class
        </Button>
      </Flex>

      {courses.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="60vh"
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
          p={10}
          textAlign="center"
        >
          <FiBook
            size="64px"
            color={highlightColor}
            style={{ marginBottom: "24px" }}
          />
          <Heading size="lg" mb={3} color={headingColor}>
            No Classes Yet
          </Heading>
          <Text color={textColor} fontSize="lg" mb={6} maxW="md">
            It looks like you haven't created any classes. Start by creating
            your first one!
          </Text>
          <Button
            colorScheme="blue"
            onClick={onOpen}
            size="lg"
            borderRadius="full"
            px={8}
            py={6}
            fontWeight="semibold"
            boxShadow="md"
            _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
          >
            Create Class Now
          </Button>
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {courses.map((course) => (
            <Card
              key={course._id}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="md"
              borderTop="6px solid"
              borderColor={highlightColor}
              _hover={{ transform: "translateY(-4px)", boxShadow: "xl" }}
              transition="all 0.3s ease-in-out"
            >
              <CardHeader pb={0}>
                <Flex justify="space-between" align="flex-start" mb={2}>
                  <Heading size="md" color={headingColor} flex="1">
                    {course.title}
                  </Heading>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      variant="ghost"
                      size="sm"
                      borderRadius="full"
                      _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                    />
                    <MenuList zIndex={10}>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={() =>
                          router.push(`/teacher/classes/${course._id}`)
                        }
                      >
                        View Class Details
                      </MenuItem>
                      <MenuItem
                        icon={<FiShare2 />}
                        onClick={() => handleCopyJoinCode(course.joinCode)}
                      >
                        Copy Join Code
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        icon={<DeleteIcon />}
                        color="red.500"
                        onClick={() => openDeleteAlert(course._id, "course")}
                      >
                        Delete Class
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                <Badge
                  colorScheme="purple"
                  variant="subtle"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  {course.subject}
                </Badge>
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="semibold"
                  ml={2}
                >
                  {course.level}
                </Badge>
              </CardHeader>

              <CardBody py={4}>
                <Text fontSize="sm" color={textColor} noOfLines={3} mb={3}>
                  {course.description ||
                    "No description provided for this class."}
                </Text>

                <HStack align="center" mt={4} spacing={2}>
                  <Text fontSize="sm" color={lightTextColor}>
                    Students:
                  </Text>
                  {getStudentAvatars(course.students) || (
                    <Text
                      fontSize="sm"
                      color={lightTextColor}
                      fontStyle="italic"
                    >
                      No students enrolled
                    </Text>
                  )}
                  {course.students.length > 0 &&
                    typeof course.students[0] === "string" && (
                      <Text fontSize="sm" color={lightTextColor}>
                        ({course.students.length} enrolled)
                      </Text>
                    )}
                </HStack>

                <Flex mt={4} justify="space-between" align="center">
                  <Text
                    fontSize="sm"
                    color={lightTextColor}
                    fontWeight="medium"
                  >
                    Join Code:
                  </Text>
                  <InputGroup size="sm" w="auto">
                    <Input
                      value={course.joinCode}
                      isReadOnly
                      size="sm"
                      variant="filled"
                      borderRadius="md"
                      pr="3rem" // Space for the button
                      fontWeight="bold"
                      color={useColorModeValue("blue.700", "blue.200")}
                      bg={useColorModeValue("blue.50", "blue.900")}
                    />
                    <InputRightElement width="3rem">
                      <Tooltip
                        label="Copy Join Code"
                        aria-label="Copy join code tooltip"
                      >
                        <IconButton
                          aria-label="Copy join code"
                          icon={<CopyIcon />}
                          size="xs"
                          variant="ghost"
                          onClick={() => handleCopyJoinCode(course.joinCode)}
                          colorScheme={buttonColor}
                        />
                      </Tooltip>
                    </InputRightElement>
                  </InputGroup>
                </Flex>
              </CardBody>

              <CardFooter
                pt={0}
                display="flex"
                justifyContent="space-between"
                gap={3}
              >
                <Button
                  leftIcon={<FiUsers />}
                  colorScheme={buttonColor}
                  variant="solid"
                  size="sm"
                  flex="1"
                  borderRadius="lg"
                  onClick={() =>
                    router.push(`/teacher/classes/${course._id}/students`)
                  }
                >
                  Manage Students
                </Button>
                {/* Potentially add another button here, e.g., "View Assignments" */}
                {/* <Button
                  leftIcon={<AttachmentIcon />}
                  colorScheme="purple"
                  variant="outline"
                  size="sm"
                  flex="1"
                  borderRadius="lg"
                  onClick={() => router.push(`/teacher/classes/${course._id}/assignments`)}
                >
                  Assignments
                </Button> */}
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Create Course Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent bg={cardBg} borderRadius="xl" boxShadow="2xl">
          <ModalHeader color={headingColor} fontSize="2xl" pt={6} pb={2}>
            Create New Class
          </ModalHeader>
          <ModalCloseButton mt={2} />
          <ModalBody pb={6}>
            <FormControl mb={4} isRequired>
              <FormLabel color={textColor}>Class Title</FormLabel>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Algebra 101"
                focusBorderColor={highlightColor}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel color={textColor}>Description</FormLabel>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your class in detail..."
                rows={3}
                focusBorderColor={highlightColor}
              />
            </FormControl>
            <Flex gap={4} direction={{ base: "column", sm: "row" }}>
              <FormControl mb={4} isRequired>
                <FormLabel color={textColor}>Subject</FormLabel>
                <Input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                  focusBorderColor={highlightColor}
                />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel color={textColor}>Level</FormLabel>
                <Input
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  placeholder="e.g. Grade 10, University"
                  focusBorderColor={highlightColor}
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor={borderColor} pt={4}>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              borderRadius="full"
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            >
              Cancel
            </Button>
            <Button
              colorScheme={buttonColor}
              onClick={handleCreateCourse}
              borderRadius="full"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              Create Class
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay bg="blackAlpha.600">
          <AlertDialogContent bg={cardBg} borderRadius="xl" boxShadow="2xl">
            <AlertDialogHeader
              fontSize="2xl"
              fontWeight="bold"
              color={headingColor}
              pt={6}
            >
              Delete {itemToDelete?.type === "course" ? "Class" : "Assignment"}
            </AlertDialogHeader>

            <AlertDialogBody color={textColor}>
              Are you sure you want to delete this {itemToDelete?.type}?
              {itemToDelete?.type === "assignment" &&
                " The associated file will be deleted from storage."}
              <Text mt={2} fontWeight="bold" color="red.400">
                This action cannot be undone.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter
              borderTop="1px solid"
              borderColor={borderColor}
              pt={4}
            >
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteAlertOpen(false)}
                borderRadius="full"
                variant="ghost"
                _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                borderRadius="full"
              >
                Yes, Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
