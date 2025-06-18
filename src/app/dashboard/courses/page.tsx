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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const fetchCourses = async () => {
    const res = await fetch("/api/courses/students");
    const data = await res.json();
    setCourses(data.courses || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleJoinCourse = async () => {
    const res = await fetch("/api/courses/join", {
      method: "POST",
      body: JSON.stringify({ joinCode }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      toast({ title: "Joined class successfully!", status: "success" });
      fetchCourses();
      onClose();
    } else {
      toast({ title: data.error || "Failed to join", status: "error" });
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        My Classes
      </Heading>
      <Button colorScheme="blue" onClick={onOpen} mb={4}>
        Join via Code
      </Button>

      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {courses.map((course) => (
          <Box
            key={course._id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            cursor="pointer"
            onClick={() => router.push(`/dashboard/courses/${course._id}`)}
          >
            <Heading size="md">{course.title}</Heading>
            <Text>{course.description}</Text>
            <Text fontSize="sm" color="gray">
              Teacher: {course.teacher.name}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Class Code</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Class Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleJoinCourse}>
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
