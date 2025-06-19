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
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
  AttachmentIcon,
} from "@chakra-ui/icons";
import { FiPlus, FiBook, FiUsers } from "react-icons/fi";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAssignmentOpen,
    onOpen: onAssignmentOpen,
    onClose: onAssignmentClose,
  } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

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
      toast({ title: "Error loading courses", status: "error" });
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
        toast({ title: "Course created!", status: "success" });
        setCourses([...courses, newCourse]);
        onClose();
        setForm({ title: "", description: "", subject: "", level: "" });
      } else {
        throw new Error("Failed to create course");
      }
    } catch (error) {
      toast({ title: "Error creating course", status: "error" });
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
        toast({ title: "Assignment created!", status: "success" });

        // Update the selected course with the new assignment
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
        throw new Error("Failed to create assignment");
      }
    } catch (error) {
      toast({ title: "Error creating assignment", status: "error" });
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
          toast({ title: "Course deleted", status: "success" });
        } else {
          // Update the course to remove the deleted assignment
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
          toast({ title: "Assignment deleted", status: "success" });
        }
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast({ title: "Error deleting", status: "error" });
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
    if (students.length === 0) return null;

    // If students are just IDs (strings)
    // if (typeof students[0] === "string") {
    //   return (
    //     <AvatarGroup size="sm" max={3}>
    //       <Avatar name={"students.length"} />
    //     </AvatarGroup>
    //   );
    // }

    // // If students are populated user objects
    // return (
    //   <AvatarGroup size="sm" max={3}>
    //     {(students as User[]).map((student) => (
    //       <Avatar key={student._id} name={student?.name} src={student?.avatar} />
    //     ))}
    //   </AvatarGroup>
    // );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl" color="gray.800">
          My Classes
        </Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={onOpen}
          size={isMobile ? "md" : "lg"}
        >
          Create Class
        </Button>
      </Flex>

      {courses.length === 0 ? (
        <Box
          textAlign="center"
          p={10}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
        >
          <FiBook
            size="48px"
            color="#4299E1"
            style={{ margin: "0 auto 16px" }}
          />
          <Heading size="md" mb={2}>
            No classes yet
          </Heading>
          <Text color="gray.600" mb={4}>
            Create your first class to get started
          </Text>
          <Button colorScheme="blue" onClick={onOpen}>
            Create Class
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {courses.map((course) => (
            <Card
              key={course._id}
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              borderTop="4px solid"
              borderColor="blue.400"
              _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
              transition="all 0.2s"
            >
              <CardHeader pb={0}>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="gray.800">
                    {course.title}
                  </Heading>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      variant="ghost"
                      zIndex={1000}
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={() =>
                          router.push(`/teacher/classes/${course._id}`)
                        }
                      >
                        View Class
                      </MenuItem>
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
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {course.subject} • {course.level}
                </Text>
              </CardHeader>

              <CardBody py={4}>
                <Text fontSize="sm" color="gray.600" noOfLines={3}>
                  {course.description || "No description provided"}
                </Text>

                <Flex align="center" mt={4}>
                  <Text fontSize="sm" mr={2}>
                    Students:
                  </Text>
                  {getStudentAvatars(course.students) || (
                    <Text fontSize="sm" color="gray.500">
                      {course.students.length === 0
                        ? "No students enrolled"
                        : `${course.students.length} student(s)`}
                    </Text>
                  )}
                </Flex>
              </CardBody>

              <CardFooter pt={0}>
                <Button
                  leftIcon={<FiUsers />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  w="full"
                  onClick={() =>
                    router.push(`/teacher/classes/${course._id}/students`)
                  }
                >
                  Manage Students
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Create Course Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4} isRequired>
              <FormLabel>Class Title</FormLabel>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Algebra 101"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your class..."
                rows={3}
              />
            </FormControl>
            <Flex gap={4}>
              <FormControl mb={4} isRequired>
                <FormLabel>Subject</FormLabel>
                <Input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Level</FormLabel>
                <Input
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  placeholder="e.g. Grade 10"
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateCourse}>
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
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {itemToDelete?.type === "course" ? "Class" : "Assignment"}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this {itemToDelete?.type}?
              {itemToDelete?.type === "assignment" &&
                " The associated file will be deleted from storage."}
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteAlertOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
