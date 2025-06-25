"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Grid,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  useBreakpointValue,
  Icon,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { FaCheckCircle, FaChartLine, FaStickyNote } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MdDone, MdUpcoming } from "react-icons/md";

const MotionCard = motion(Card);

const extractNoteTitle = (prompt: string): string => {
  const match = prompt.match(/:\s*(.+?)\s*(?:\(|$)/);
  return match ? match[1].trim() : prompt;
};

interface Course {
  title: string;
  id: string;
}

interface DashboardStatProps {
  icon: React.ElementType;
  title: string;
  value: string;
  bgGradient: string;
}

const DashboardStatCard = ({
  icon,
  title,
  value,
  bgGradient,
}: DashboardStatProps) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      bgGradient={bgGradient}
      color="white"
      borderRadius="xl"
      p={6}
      boxShadow="md"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <CardBody>
        <VStack align="flex-start" spacing={3}>
          <HStack>
            <Icon as={icon} boxSize={5} opacity={0.8} />
            <Text fontSize="md" fontWeight="medium" letterSpacing="wide">
              {title}
            </Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold" lineHeight="1">
            {value}
          </Text>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

interface RecentActivityItemProps {
  title: string;
  date: string;
}

const RecentActivityItem = ({ title, date }: RecentActivityItemProps) => {
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const boxBg = useColorModeValue("gray.100", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      p={3}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      bg={boxBg}
    >
      <HStack justify="space-between">
        <Text fontWeight="medium">{title}</Text>
        <Text fontSize="sm" color={secondaryText}>
          {date}
        </Text>
      </HStack>
    </Box>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    quizzesCount: number;
    averageScore: number;
    notesCount: number;
    recentQuizzes: { topic: string; createdAt: string }[];
    recentNotes: { prompt: string; createdAt: string }[];
    takenQuizCount: number;
    upcomingAssignments: { title: string; dueDate: string; courseId: Course }[];
    submittedAssignments: {
      title: string;
      dueDate: string;
      courseId: Course;
    }[];
  } | null>(null);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const secondaryText = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("teal.500", "blue.400");
  const borderColorAssignments = useColorModeValue("gray.200", "gray.700");
  const bgAssignemnts = useColorModeValue("white", "gray.800");
  const bgGradientColors = useColorModeValue(
    "linear(to-br, teal.400, teal.500)",
    "linear(to-br, blue.400, blue.500)"
  );
  const bgGradientColorsfour = useColorModeValue(
    "linear(to-br, teal.300, teal.500)",
    "linear(to-tl, blue.400, blue.500)"
  );
  const bgGradientColorstwo = useColorModeValue(
    "linear(to-tr, teal.300, teal.400)",
    "linear(to-br, blue.300, blue.400)"
  );
  const bgGradientColorsthree = useColorModeValue(
    "linear(to-bl, teal.200, teal.300)",
    "linear(to-br, blue.200, blue.300)"
  );

  const bgGradientColorsfive = useColorModeValue(
    "linear(to-br, purple.400, purple.500)",
    "linear(to-tl, green.300, green.500)"
  );

  const bgGradientColorssix = useColorModeValue(
    "linear(to-br, orange.400, orange.300)",
    "linear(to-br, green.300, green.400)"
  );

  const gridColumns = useBreakpointValue({
    base: "1fr",
    md: "repeat(2, 1fr)",
    lg: "repeat(4, 1fr)", // Adjusted to 4 columns for stats
  });

  const recentActivityColumns = useBreakpointValue({
    base: "1fr",
    md: "repeat(2, 1fr)",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: session.user?.id }),
        });
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!dashboardData) return null;

  const {
    quizzesCount,
    averageScore,
    notesCount,
    recentNotes,
    recentQuizzes,
    takenQuizCount,
    upcomingAssignments,
    submittedAssignments,
  } = dashboardData;

  const statsData = [
    {
      icon: FaCheckCircle,
      title: "Quizzes Created",
      value: quizzesCount.toString(),
      bgGradient: bgGradientColors,
    },
    {
      icon: FaCheckCircle,
      title: "Completed Quizzes",
      value: takenQuizCount.toString(),
      bgGradient: bgGradientColorsfour,
    },
    {
      icon: FaChartLine,
      title: "Average Score",
      value: `${averageScore}%`,
      bgGradient: bgGradientColorstwo,
    },
    {
      icon: FaStickyNote,
      title: "Notes Created",
      value: notesCount.toString(),
      bgGradient: bgGradientColorsthree,
    },
    {
      icon: MdUpcoming,
      title: "Upcoming Assignments",
      value: upcomingAssignments.length.toString(),
      bgGradient: bgGradientColorsfive,
    },
    {
      icon: MdDone,
      title: "Submitted Assignments",
      value: submittedAssignments.length.toString(),
      bgGradient: bgGradientColorssix,
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      <VStack spacing={8} align="stretch" maxW="7xl" mx="auto">
        {/* Overview */}
        <MotionCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="sm"
        >
          <CardHeader pb={2}>
            <Heading
              as="h1"
              size="xl"
              fontWeight="semibold"
              color={accentColor}
            >
              Dashboard
            </Heading>
            <Text color={secondaryText} fontSize="md">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </Text>
          </CardHeader>
        </MotionCard>

        {/* Stats */}
        <Grid templateColumns={gridColumns} gap={4}>
          {statsData.map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} />
          ))}
        </Grid>

        {/* Upcoming Assignments */}
        <MotionCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="sm"
        >
          <CardHeader pb={2}>
            <Heading
              as="h2"
              size="md"
              fontWeight="semibold"
              color={accentColor}
            >
              Upcoming Assignments
            </Heading>
          </CardHeader>
          <CardBody>
            {upcomingAssignments.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                No upcoming assignments
              </Text>
            ) : (
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
              >
                {upcomingAssignments.map((assignment) => (
                  <Box
                    key={assignment.title}
                    p={4}
                    borderWidth={1}
                    borderColor={borderColorAssignments}
                    borderRadius="md"
                    bg={bgAssignemnts}
                  >
                    <Text fontWeight="medium">{assignment.title}</Text>
                    <Text fontSize="sm" color={secondaryText}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Text>
                    <Text fontSize="sm" color={secondaryText}>
                      Course: {assignment.courseId?.title || ""}
                    </Text>
                  </Box>
                ))}
              </Grid>
            )}
          </CardBody>
        </MotionCard>

        {/* Recent Activity */}
        <MotionCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="sm"
        >
          <CardHeader pb={2}>
            <Heading
              as="h2"
              size="md"
              fontWeight="semibold"
              color={accentColor}
            >
              Recent Activity
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={recentActivityColumns} gap={6}>
              {/* Recent Quizzes */}
              <Box>
                <Text fontWeight="medium" color={secondaryText} mb={2}>
                  Recent Quizzes
                </Text>
                {recentQuizzes.length === 0 ? (
                  <Text fontSize="sm" color="gray.500">
                    No recent quizzes
                  </Text>
                ) : (
                  recentQuizzes
                    .slice(0, 3)
                    .map((quiz) => (
                      <RecentActivityItem
                        key={quiz.topic}
                        title={quiz.topic}
                        date={new Date(quiz.createdAt).toLocaleDateString()}
                      />
                    ))
                )}
                {recentQuizzes.length > 3 && (
                  <Text
                    mt={2}
                    fontSize="sm"
                    color={accentColor}
                    cursor="pointer"
                  >
                    See All Quizzes
                  </Text>
                )}
              </Box>

              {/* Recent Notes */}
              <Box>
                <Text fontWeight="medium" color={secondaryText} mb={2}>
                  Recent Notes
                </Text>
                {recentNotes.length === 0 ? (
                  <Text fontSize="sm" color="gray.500">
                    No recent notes
                  </Text>
                ) : (
                  recentNotes
                    .slice(0, 3)
                    .map((note) => (
                      <RecentActivityItem
                        key={note.prompt}
                        title={extractNoteTitle(note.prompt)}
                        date={new Date(note.createdAt).toLocaleDateString()}
                      />
                    ))
                )}
                {recentNotes.length > 3 && (
                  <Text
                    mt={2}
                    fontSize="sm"
                    color={accentColor}
                    cursor="pointer"
                  >
                    See All Notes
                  </Text>
                )}
              </Box>
            </Grid>
          </CardBody>
        </MotionCard>
      </VStack>
    </Box>
  );
}
