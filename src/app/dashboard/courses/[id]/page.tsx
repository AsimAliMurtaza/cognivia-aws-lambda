"use client";
import { useEffect, useState, useRef } from "react";
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
  Spinner,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaRegFileAlt, FaVideo } from "react-icons/fa";

interface Course {
  _id: string;
  title: string;
  description: string;
  liveClasses?: string[];
  assignments?: {
    _id: string;
    title: string;
    description?: string;
    dueDate: string;
  }[];
}

interface LiveClass {
  _id: string;
  title: string;
  scheduledAt: string;
  channelName: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);

  // Color Mode Values
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const descriptionColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const cardShadow = useColorModeValue("md", "dark-lg");
  const unenrollButtonScheme = "red";
  const liveClassButtonScheme = "blue";
  const assignmentButtonScheme = "green";
  const cancelButtonScheme = "gray";
  const alertDialogBg = useColorModeValue("white", "gray.800");
  const alertDialogHeaderColor = useColorModeValue(
    "gray.800",
    "whiteAlpha.900"
  );
  const alertDialogBodyColor = useColorModeValue("gray.700", "gray.200");
  const hoverBg = useColorModeValue("gray.50", "gray.750");
  const unenrollHoverBg = useColorModeValue("red.600", "red.400");
  const liveClassHoverBg = useColorModeValue("blue.600", "blue.400");
  const assignmentHoverBg = useColorModeValue("green.600", "green.400");
  const cancelHoverBg = useColorModeValue("gray.100", "gray.700");
  const alertOverlayBg = useColorModeValue("blackAlpha.300", "blackAlpha.600");

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      setIsLoadingContent(true);
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course data.");
        const data = await res.json();
        setCourse(data);

        if (data.liveClasses && data.liveClasses.length > 0) {
          const liveClassPromises = data.liveClasses.map(
            async (lcId: string) => {
              const lcRes = await fetch(`/api/live-classes/${lcId}`);
              if (!lcRes.ok)
                throw new Error(`Failed to fetch live class ${lcId}`);
              return await lcRes.json();
            }
          );
          const liveClassDetails = await Promise.all(liveClassPromises);
          setLiveClasses(liveClassDetails);
        } else {
          setLiveClasses([]);
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error("Failed to fetch course or live classes:", error);
        toast({
          title: "Error loading course",
          description: error.message || "Could not retrieve course details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchCourse();
  }, [id, toast]);

  const handleUnenroll = async () => {
    setIsUnenrolling(true);
    try {
      const res = await fetch(`/api/courses/${id}/unenroll`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to unenroll");
      }

      toast({
        title: "Unenrolled successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Could not unenroll from course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUnenrolling(false);
      onClose();
    }
  };

  if (isLoadingContent) {
    return (
      <Flex justify="center" align="center" minH="80vh" bg={pageBg}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Flex>
    );
  }

  if (!course) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="80vh"
        bg={pageBg}
        direction="column"
        p={8}
      >
        <Heading size="lg" color={headingColor} mb={4}>
          Course Not Found
        </Heading>
        <Text color={descriptionColor} mb={6}>
          The course you are looking for does not exist or you do not have
          access.
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => router.push("/dashboard")}
          borderRadius="full"
          shadow="md"
        >
          Go to My Classes
        </Button>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="7xl" mx="auto" bg={pageBg} minH="100vh">
      <Flex mb={6} alignItems="center" flexWrap="wrap">
        <Heading
          size="xl"
          color={headingColor}
          fontWeight="bold"
          mr={4}
          mb={{ base: 4, md: 0 }}
        >
          {course.title}
        </Heading>
        <Spacer />
        <Button
          colorScheme={unenrollButtonScheme}
          size="md"
          onClick={onOpen}
          isLoading={isUnenrolling}
          loadingText="Unenrolling..."
          borderRadius="full"
          shadow="md"
          _hover={{
            shadow: "lg",
            transform: "translateY(-1px)",
            bg: unenrollHoverBg,
          }}
          transition="all 0.2s ease-in-out"
        >
          Unenroll
        </Button>
      </Flex>

      <Box
        p={6}
        borderRadius="xl"
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        shadow={cardShadow}
        mb={8}
      >
        <Text fontSize="lg" color={descriptionColor}>
          {course.description}
        </Text>
      </Box>

      <Box mb={8}>
        <Heading size="lg" mb={4} color={headingColor} fontWeight="semibold">
          <Icon as={FaVideo} mr={3} color={`${liveClassButtonScheme}.500`} />
          Upcoming Live Classes
        </Heading>
        <Stack spacing={4}>
          {liveClasses.length > 0 ? (
            liveClasses.map((lc) => (
              <Box
                key={lc._id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                bg={cardBg}
                borderColor={cardBorder}
                shadow="sm"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-2px)",
                  bg: hoverBg,
                }}
                transition="all 0.2s ease-in-out"
              >
                <Text fontSize="md" fontWeight="bold" color={textColor} mb={1}>
                  {lc.title || "Untitled Live Class"}
                </Text>
                <Text fontSize="sm" color={descriptionColor}>
                  Scheduled for: {new Date(lc.scheduledAt).toLocaleString()}
                </Text>
                <Button
                  mt={3}
                  size="sm"
                  colorScheme={liveClassButtonScheme}
                  onClick={() => router.push(`/live-class/${lc.channelName}`)}
                  borderRadius="full"
                  shadow="xs"
                  _hover={{
                    shadow: "md",
                    transform: "translateY(-1px)",
                    bg: liveClassHoverBg,
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  Join Class
                </Button>
              </Box>
            ))
          ) : (
            <Box
              p={4}
              borderRadius="lg"
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              shadow="sm"
            >
              <Text color={descriptionColor} fontStyle="italic">
                No upcoming live classes for this course.
              </Text>
            </Box>
          )}
        </Stack>
      </Box>

      <Box>
        <Heading size="lg" mb={4} color={headingColor} fontWeight="semibold">
          <Icon
            as={FaRegFileAlt}
            mr={3}
            color={`${assignmentButtonScheme}.500`}
          />
          Assignments
        </Heading>
        <Stack spacing={4}>
          {course.assignments && course.assignments.length > 0 ? (
            course.assignments.map((a) => (
              <Box
                key={a._id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                bg={cardBg}
                borderColor={cardBorder}
                shadow="sm"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-2px)",
                  bg: hoverBg,
                }}
                transition="all 0.2s ease-in-out"
              >
                <Text fontWeight="bold" fontSize="md" color={textColor} mb={1}>
                  {a.title}
                </Text>
                <Text
                  fontSize="sm"
                  color={descriptionColor}
                  mb={1}
                  noOfLines={1}
                >
                  {a.description || "No description provided."}
                </Text>
                <Text fontSize="xs" color={descriptionColor}>
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </Text>
                <Button
                  mt={3}
                  size="sm"
                  colorScheme={assignmentButtonScheme}
                  onClick={() =>
                    router.push(`/dashboard/courses/${id}/assignments/${a._id}`)
                  }
                  borderRadius="full"
                  shadow="xs"
                  _hover={{
                    shadow: "md",
                    transform: "translateY(-1px)",
                    bg: assignmentHoverBg,
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  Open Assignment
                </Button>
              </Box>
            ))
          ) : (
            <Box
              p={4}
              borderRadius="lg"
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              shadow="sm"
            >
              <Text color={descriptionColor} fontStyle="italic">
                No assignments for this course yet.
              </Text>
            </Box>
          )}
        </Stack>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay bg={alertOverlayBg} />
        <AlertDialogContent
          bg={alertDialogBg}
          borderRadius="xl"
          shadow="2xl"
          p={4}
        >
          <AlertDialogHeader
            fontSize="xl"
            fontWeight="bold"
            color={alertDialogHeaderColor}
          >
            Unenroll from Course
          </AlertDialogHeader>

          <AlertDialogBody color={alertDialogBodyColor}>
            Are you sure you want to unenroll from &qout;{course.title}&qout;? You will
            lose access to its content and assignments. This action cannot be
            undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              variant="ghost"
              colorScheme={cancelButtonScheme}
              borderRadius="full"
              _hover={{ bg: cancelHoverBg }}
            >
              Cancel
            </Button>
            <Button
              colorScheme={unenrollButtonScheme}
              onClick={handleUnenroll}
              ml={3}
              isLoading={isUnenrolling}
              loadingText="Unenrolling..."
              borderRadius="full"
              shadow="md"
              _hover={{
                shadow: "lg",
                transform: "translateY(-1px)",
                bg: unenrollHoverBg,
              }}
              transition="all 0.2s ease-in-out"
            >
              Unenroll
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
