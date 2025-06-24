"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Text,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  fileUrl?: string;
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onCreated: () => void;
  assignmentData?: Assignment;
}

interface AssignmentForm {
  title: string;
  description: string;
  dueDate: string;
  fileUrl: string;
}

export default function AssignmentModal({
  isOpen,
  onClose,
  courseId,
  onCreated,
  assignmentData,
}: AssignmentModalProps) {
  const [form, setForm] = useState<AssignmentForm>({
    title: "",
    description: "",
    dueDate: "",
    fileUrl: "",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (assignmentData) {
      setForm({
        title: assignmentData.title,
        description: assignmentData.description,
        dueDate: assignmentData.dueDate.split("T")[0],
        fileUrl: assignmentData.fileUrl || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        dueDate: "",
        fileUrl: "",
      });
    }
  }, [assignmentData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setForm((prev) => ({ ...prev, fileUrl: data.url }));
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "File upload failed",
        description: "Please try again",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const url = assignmentData
        ? `/api/assignments/${assignmentData._id}`
        : "/api/assignments";

      const method = assignmentData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseId }),
      });

      if (!res.ok) throw new Error("Operation failed");

      toast({
        title: assignmentData ? "Assignment updated" : "Assignment created",
        status: "success",
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: assignmentData
          ? "Failed to update assignment"
          : "Failed to create assignment",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!assignmentData) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/assignments/${assignmentData._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Deletion failed");

      toast({
        title: "Assignment deleted",
        status: "success",
      });
      onCreated();
      onClose();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Deletion error:", error);
      toast({
        title: "Failed to delete assignment",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {assignmentData ? "Edit Assignment" : "Create Assignment"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Assignment title"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Assignment description"
                rows={4}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Due Date</FormLabel>
              <Input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Assignment File</FormLabel>
              <Input
                type="file"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              {form.fileUrl && (
                <Text fontSize="sm" mt={2} color="green.500">
                  File uploaded successfully
                </Text>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {assignmentData && (
              <Button
                colorScheme="red"
                mr="auto"
                onClick={() => setIsDeleteOpen(true)}
                isLoading={isSubmitting}
              >
                Delete
              </Button>
            )}
            <Button onClick={onClose} mr={3} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              {assignmentData ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Assignment
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete &quot;{assignmentData?.title}&quot;? This
              action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isSubmitting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
