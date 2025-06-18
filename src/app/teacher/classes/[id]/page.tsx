"use client";

import {
  Box,
  Heading,
  Text,
  Stack,
  Divider,
  Badge,
  Spinner,
  useToast,
  Button,
  Flex,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AssignmentModal from "@/components/AssignmentModal";
import { FiEdit, FiDownload, FiTrash2, FiMoreVertical } from "react-icons/fi";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const toast = useToast();
  const router = useRouter();
  
  // Modals
  const { 
    isOpen: isAssignmentModalOpen, 
    onOpen: onAssignmentModalOpen, 
    onClose: onAssignmentModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDeleteAlertOpen, 
    onOpen: onDeleteAlertOpen, 
    onClose: onDeleteAlertClose 
  } = useDisclosure();
  
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/courses/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setCourse(data))
        .catch((error) => {
          console.error("Error fetching course:", error);
          toast({
            title: "Error fetching course details",
            description: "Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        });
    }
  }, [id, toast, refresh]);
  const handleEditAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    onAssignmentModalOpen();
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    onAssignmentModalOpen();
  };

  const handleDeleteAssignment = async () => {
    try {
      const res = await fetch(`/api/assignments/${selectedAssignment?._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete assignment');

      toast({
        title: 'Assignment deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setRefresh(prev => !prev);
    } catch (error) {
      toast({
        title: 'Error deleting assignment',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteAlertClose();
      setSelectedAssignment(null);
    }
  };

  if (!course) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="80vh">
        <Spinner size="xl" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="6xl" mx="auto">
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 300px" }}
        gap={8}
        alignItems="start"
      >
        {/* Main Content Column */}
        <GridItem>
          <Card mb={8} variant="outline">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading as="h1" size="xl" color="gray.800">
                  {course.title}
                </Heading>
                <IconButton
                  aria-label="Edit course"
                  icon={<FiEdit />}
                  onClick={() => router.push(`/teacher/classes/${id}/edit`)}
                />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="lg" color="gray.600" mb={4}>
                {course.description}
              </Text>

              <Flex gap={3} mb={4}>
                <Badge
                  colorScheme="purple"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {course.subject}
                </Badge>
                <Badge
                  colorScheme="teal"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {course.level}
                </Badge>
              </Flex>

              <Text fontSize="sm" color="gray.500" mb={2}>
                Created: {new Date(course.createdAt).toLocaleDateString()}
              </Text>
              <Text fontSize="md" color="gray.700">
                Join Code: <strong>{course.joinCode}</strong>
              </Text>
            </CardBody>
          </Card>

          {/* Assignments Section */}
          <Card variant="outline" mb={8}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="lg">Assignments</Heading>
                <Button 
                  onClick={handleCreateAssignment} 
                  colorScheme="teal" 
                  size="sm"
                >
                  + New Assignment
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              {course.assignments && course.assignments.length > 0 ? (
                <Stack spacing={4}>
                  {course.assignments.map((assignment: any) => (
                    <Card key={assignment._id} variant="elevated">
                      <CardBody>
                        <Flex justify="space-between" align="start">
                          <Box flex="1">
                            <Heading size="md" mb={2}>
                              {assignment.title}
                            </Heading>
                            <Text fontSize="sm" color="gray.600" mb={3}>
                              {assignment.description}
                            </Text>
                            <Text fontSize="xs" color="gray.500" mb={2}>
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </Text>
                            {assignment.fileUrl && (
                              <Button
                                leftIcon={<FiDownload />}
                                size="sm"
                                as="a"
                                href={assignment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                mb={2}
                              >
                                Download
                              </Button>
                            )}
                          </Box>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="Assignment options"
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem 
                                icon={<FiEdit />}
                                onClick={() => handleEditAssignment(assignment)}
                              >
                                Edit Assignment
                              </MenuItem>
                              <MenuItem 
                                icon={<FiTrash2 />} 
                                color="red.500"
                                onClick={() => {
                                  setSelectedAssignment(assignment);
                                  onDeleteAlertOpen();
                                }}
                              >
                                Delete Assignment
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Text color="gray.500" fontStyle="italic">
                  No assignments yet
                </Text>
              )}
            </CardBody>
          </Card>
        </GridItem>

        {/* Sidebar Column */}
        <GridItem>
          <Card variant="outline" position="sticky" top="4">
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Button
                  onClick={handleCreateAssignment}
                  colorScheme="teal"
                  size="md"
                  width="full"
                >
                  Create Assignment
                </Button>
                <Button
                  onClick={() => router.push(`/teacher/classes/${id}/students`)}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  width="full"
                >
                  Manage Students
                </Button>
              </Stack>
            </CardBody>
          </Card>

          <Card variant="outline" mt={4}>
            <CardHeader>
              <Heading size="md">Course Stats</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <Flex justify="space-between">
                  <Text color="gray.600">Assignments</Text>
                  <Text fontWeight="medium">
                    {course.assignments?.length || 0}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Students</Text>
                  <Text fontWeight="medium">
                    {course.students?.length || 0}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Created</Text>
                  <Text fontWeight="medium">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </Text>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Assignment Modal (Create/Edit) */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={onAssignmentModalClose}
        courseId={id as string}
        assignmentData={selectedAssignment}
        onCreated={() => setRefresh((prev) => !prev)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Assignment
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{selectedAssignment?.title}"? 
              This will also delete any associated files and cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDeleteAssignment} 
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}