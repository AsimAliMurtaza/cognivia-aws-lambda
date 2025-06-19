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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function LiveClassDashboard() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses.",
        status: "error",
      });
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/live-classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch classes.",
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !scheduledAt.trim() || !selectedCourse) {
      toast({
        title: "Missing Fields",
        description: "Course, title, and date are required.",
        status: "warning",
      });
      return;
    }

    const parsedDate = new Date(scheduledAt);
    if (isNaN(parsedDate.getTime())) {
      toast({
        title: "Invalid Date",
        description: "Please enter a valid date and time.",
        status: "error",
      });
      return;
    }

    try {
      const res = await fetch("/api/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          courseId: selectedCourse,
          scheduledAt: parsedDate.toISOString(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: "Live class created", status: "success" });
        setTitle("");
        setScheduledAt("");
        setSelectedCourse("");
        fetchClasses();
        fetchCourses();
      } else {
        toast({
          title: "Failed to create class",
          description: data.error || "Unknown error",
          status: "error",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        status: "error",
      });
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Schedule Live Class</Heading>
      <VStack spacing={4} align="start">
        <Select
          placeholder="Select Course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {courses.map((course: any) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Class title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleCreate}>
          Schedule Class
        </Button>
      </VStack>

      <Divider my={6} />
      <Heading size="md">Upcoming Classes</Heading>
      {classes.length === 0 && <Text>No classes scheduled.</Text>}
      {classes.map((cls: any) => (
        <Box key={cls._id} mt={3} p={3} borderWidth="1px" borderRadius="md">
          <Text>
            <b>{cls.title}</b> - {new Date(cls.scheduledAt).toLocaleString()}
          </Text>
          <Button
            mt={2}
            colorScheme="blue"
            onClick={() =>
              window.open(`/live-class/${cls.channelName}?uid=1001`, "_blank")
            }
          >
            Start Class
          </Button>
        </Box>
      ))}
    </Box>
  );
}
