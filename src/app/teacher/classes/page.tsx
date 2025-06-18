"use client";
import { Box, Heading, Text, Stack, Spinner, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box p={6}>
      <Heading mb={6}>My Courses</Heading>
      <Button
        colorScheme="teal"
        mb={4}
        onClick={() => window.location.href = "/teacher/classes/create"}
      >
        Create New Course
      </Button>
      
      <Stack spacing={4}>
        {courses.map((course) => (
          <Box key={course._id} borderWidth="1px" borderRadius="md" p={4}>
            <Heading size="md">{course.title}</Heading>
            <Text>{course.description}</Text>
            <Text fontSize="sm" color="gray.500">
              {course.subject} • {course.level}
            </Text>
            <Button
              colorScheme="red"
              size="sm"
              onClick={async () => {
                const res = await fetch(`/api/courses/${course._id}`, {
                  method: "DELETE",
                });
                if (res.ok) {
                  setCourses(courses.filter((c) => c._id !== course._id));
                  useToast({ title: "Course deleted", status: "success" });
                } else {
                  useToast({ title: "Failed to delete", status: "error" });
                }
              }}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
