"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Spacer,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched course data:", data);
        setCourse(data);
      });
  }, [id]);

  const handleUnenroll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${id}/unenroll`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to unenroll");

      toast({
        title: "Unenrolled successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/dashboard"); // or /dashboard/courses
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Could not unenroll from course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!course) return <Text>Loading...</Text>;

  return (
    <Box p={6}>
      <Flex mb={4} alignItems="center">
        <Heading>{course.title}</Heading>
        <Spacer />
        <Button colorScheme="red" size="sm" onClick={onOpen}>
          Unenroll
        </Button>
      </Flex>

      <Text mb={4}>{course.description}</Text>

      <Heading size="md" mb={2}>
        Assignments
      </Heading>
      <Stack spacing={4}>
        {course.assignments?.length ? (
          course.assignments.map((a: any) => (
            <Box key={a._id} borderWidth="1px" borderRadius="lg" p={3}>
              <Text fontWeight="bold">{a.title}</Text>
              <Text>{a.description}</Text>
              <Text fontSize="sm" color="gray.500">
                Due: {new Date(a.dueDate).toLocaleDateString()}
              </Text>
              <Button
                mt={2}
                size="sm"
                colorScheme="green"
                onClick={() =>
                  router.push(`/dashboard/courses/${id}/assignments/${a._id}`)
                }
              >
                Open Assignment
              </Button>
            </Box>
          ))
        ) : (
          <Text>No assignments yet.</Text>
        )}
      </Stack>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Unenroll from Course</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to unenroll from this course? You will lose
              access to its assignments.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                isLoading={isLoading}
                onClick={handleUnenroll}
              >
                Unenroll
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
