"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

export default function SubmitAssignmentPage() {
  const { assignmentId } = useParams();
  const id = Array.isArray(assignmentId) ? assignmentId[0] : assignmentId;
  const [assignment, setAssignment] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          fetch(`/api/assignments/${id}`),
          fetch(`/api/assignments/${id}/submit`), // ✔ check if already submitted
        ]);

        if (!assignmentRes.ok || !submissionRes.ok) {
          throw new Error("Failed to fetch assignment or submission");
        }

        const assignmentData = await assignmentRes.json();
        const submissionData = await submissionRes.json();

        console.log("submissionData:", submissionData);

        setAssignment(assignmentData);
        setSubmitted(submissionData.submitted); // ✅ should return true/false
      } catch (err) {
        toast({ title: "Failed to load data", status: "error" });
      }
    };

    fetchData();
  }, [id, toast]);

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: "Please select a file", status: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setSubmitting(true);
    const res = await fetch(`/api/assignments/${id}/submit`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast({ title: result.error || "Submission failed", status: "error" });
    } else {
      toast({ title: "Submitted successfully!", status: "success" });
      setSubmitted(true); // ✅ Disable form immediately
      setFile(null);
    }
  };

  if (!assignment) return <Spinner ml={4} />;

  return (
    <Box p={6} maxW="600px" mx="auto">
      <Heading size="lg" mb={4}>
        {assignment.title}
      </Heading>
      <Text mb={2}>
        <strong>Description:</strong> {assignment.description}
      </Text>
      <Text mb={2}>
        <strong>Due:</strong>{" "}
        {new Date(assignment.dueDate).toLocaleDateString()}
      </Text>

      {assignment.fileUrl && (
        <Text mb={4}>
          <a
            href={assignment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#3182ce" }}
          >
            📄 View Attached File
          </a>
        </Text>
      )}

      {submitted ? (
        <Text color="green.600" fontWeight="semibold" mt={4}>
          ✅ You have already submitted this assignment.
        </Text>
      ) : (
        <VStack spacing={4} align="start">
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button
            colorScheme="teal"
            onClick={handleSubmit}
            isLoading={submitting}
          >
            Submit Assignment
          </Button>
        </VStack>
      )}
    </Box>
  );
}
