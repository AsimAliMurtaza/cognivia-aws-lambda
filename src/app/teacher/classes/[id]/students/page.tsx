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
} from "@chakra-ui/react";

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
};

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
  isOpen,
  student,
  onClose,
  onWithdraw,
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  const handleWithdraw = () => {
    if (student && reason.trim()) {
      onWithdraw(student._id, reason.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Withdraw Student</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure you want to withdraw <b>{student?.name}</b> from the
            course?
          </Text>
          <Textarea
            mt={4}
            placeholder="Enter withdrawal reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleWithdraw}
            isDisabled={!reason.trim()}
          >
            Withdraw
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const fetchStudents = async (id: string): Promise<Student[]> => {
  const res = await fetch(`/api/courses/${id}/students`);
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

const withdrawStudent = async (
  id: string,
  studentId: string,
  reason: string
) => {
  const res = await fetch(
    `/api/courses/${id}/students/${studentId}/withdraw`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    }
  );
  if (!res.ok) throw new Error("Failed to withdraw student");
};

const StudentsPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents(id);
      setStudents(data);
      console.log("Fetched students:", data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load students.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (studentId: string, reason: string) => {
    try {
      await withdrawStudent(id, studentId, reason);
      toast({
        title: "Student withdrawn",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      onClose();
      await loadStudents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to withdraw student.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadStudents();
  }, [id]);

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        Enrolled Students
      </Heading>

      {loading ? (
        <Flex justify="center">
          <Spinner size="lg" />
        </Flex>
      ) : students.length === 0 ? (
        <Text>No students registered in this course.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {students.map((student) => (
            <Flex
              key={student._id}
              justify="space-between"
              align="center"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
            >
              <Box>
                <Text fontWeight="bold">{student.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {student.email}
                </Text>
              </Box>
              <Button
                colorScheme="red"
                onClick={() => {
                  setSelectedStudent(student);
                  onOpen();
                }}
              >
                Withdraw
              </Button>
            </Flex>
          ))}
        </VStack>
      )}

      <WithdrawDialog
        isOpen={isOpen}
        student={selectedStudent}
        onClose={onClose}
        onWithdraw={handleWithdraw}
      />
    </Box>
  );
};

export default StudentsPage;
