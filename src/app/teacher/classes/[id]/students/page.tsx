"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  useColorModeValue, // For Material You-inspired theming
  Card, // Using Card component for student items
  CardBody,
  Divider,
  Icon, // For icons in empty state
} from "@chakra-ui/react";
import { FiUserX, FiUsers } from "react-icons/fi"; // Added more icons

type Student = {
  _id: string;
  name: string;
  email: string;
};

type WithdrawDialogProps = {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onWithdraw: (studentId: string, reason: string) => void;
  isLoading: boolean; // Add loading state for the withdraw button
};

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
  isOpen,
  student,
  onClose,
  onWithdraw,
  isLoading,
}) => {
  const [reason, setReason] = useState("");

  // Material You inspired colors for the modal
  const modalBg = useColorModeValue("white", "gray.700");
  const headerColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    if (isOpen) setReason(""); // Clear reason when modal opens
  }, [isOpen]);

  const handleWithdraw = () => {
    if (student && reason.trim()) {
      onWithdraw(student._id, reason.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent bg={modalBg} borderRadius="2xl" boxShadow="2xl" p={4}>
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          color={headerColor}
          pb={2}
        >
          Withdraw Student
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody color={textColor} mb={4}>
          <Text mb={3}>
            Are you sure you want to withdraw{" "}
            <Text
              as="span"
              fontWeight="bold"
              color={useColorModeValue("blue.600", "blue.300")}
            >
              {student?.name}
            </Text>{" "}
            from the course?
          </Text>
          <Textarea
            mt={4}
            placeholder="Please provide a brief reason for withdrawal (e.g., 'Student is no longer attending', 'Transferred to another class', 'Personal reasons'). This field is required."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            focusBorderColor={useColorModeValue("blue.400", "blue.300")}
            borderColor={borderColor}
            _hover={{ borderColor: useColorModeValue("gray.300", "gray.500") }}
            rows={4}
            borderRadius="lg"
          />
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor={borderColor} pt={4}>
          <Button
            onClick={onClose}
            mr={3}
            borderRadius="full"
            variant="ghost"
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleWithdraw}
            isDisabled={!reason.trim() || isLoading}
            isLoading={isLoading}
            loadingText="Withdrawing..."
            borderRadius="full"
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
          >
            Withdraw Student
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const fetchStudents = async (id: string): Promise<Student[]> => {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const res = await fetch(`/api/courses/${id}/students`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch students");
  }
  return res.json();
};

const withdrawStudent = async (
  id: string,
  studentId: string,
  reason: string
) => {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 1500));
  const res = await fetch(`/api/courses/${id}/students/${studentId}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to withdraw student");
  }
};

const StudentsPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false); // New state for withdraw button loading
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Material You-inspired colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const lightTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryActionColor = useColorModeValue("red.500", "red.300"); // For withdraw button

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents(id);
      setStudents(data);
    } catch (err: any) {
      toast({
        title: "Error loading students",
        description:
          err.message || "Failed to load student list. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (studentId: string, reason: string) => {
    setIsWithdrawing(true); // Start loading for the dialog button
    try {
      await withdrawStudent(id, studentId, reason);
      toast({
        title: "Student withdrawn",
        description: `${selectedStudent?.name} has been successfully withdrawn from the course.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      onClose(); // Close the dialog
      await loadStudents(); // Re-fetch the student list
    } catch (err: any) {
      toast({
        title: "Withdrawal failed",
        description:
          err.message || "Could not withdraw student. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsWithdrawing(false); // End loading for the dialog button
      setSelectedStudent(null); // Clear selected student
    }
  };

  useEffect(() => {
    loadStudents();
  }, [id]);

  return (
    <Box p={{ base: 4, md: 8 }} maxW="4xl" mx="auto" bg={bgColor} minH="100vh">
      <Heading size="xl" mb={6} color={headingColor} textAlign="center">
        Enrolled Students
      </Heading>

      {loading ? (
        <Flex justify="center" alignItems="center" minH="50vh">
          <Spinner
            size="xl"
            thickness="4px"
            color={useColorModeValue("blue.500", "blue.300")}
          />
        </Flex>
      ) : students.length === 0 ? (
        <VStack
          spacing={4}
          align="center"
          justify="center"
          minH="60vh"
          color={lightTextColor}
          textAlign="center"
          py={10}
        >
          <Icon
            as={FiUsers}
            w={20}
            h={20}
            color={useColorModeValue("gray.300", "gray.600")}
          />
          <Heading size="lg" color={headingColor} mt={4}>
            No students enrolled yet
          </Heading>
          <Text fontSize="md">
            Students can join your class using the unique join code from the
            course details page.
          </Text>
        </VStack>
      ) : (
        <VStack spacing={5} align="stretch">
          {students.map((student) => (
            <Card
              key={student._id}
              bg={cardBgColor}
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.2s ease-in-out"
            >
              <CardBody p={5}>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" color={headingColor}>
                      {student.name}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {student.email}
                    </Text>
                  </Box>
                  <Button
                    colorScheme="red"
                    size="md"
                    borderRadius="full"
                    leftIcon={<FiUserX />}
                    onClick={() => {
                      setSelectedStudent(student);
                      onOpen();
                    }}
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                    variant="solid"
                  >
                    Withdraw
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}

      <WithdrawDialog
        isOpen={isOpen}
        student={selectedStudent}
        onClose={onClose}
        onWithdraw={handleWithdraw}
        isLoading={isWithdrawing} // Pass loading state to the dialog
      />
    </Box>
  );
};

export default StudentsPage;
