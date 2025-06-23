"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  useToast,
  Container,
  useColorModeValue,
  Input,
  IconButton,
  HStack,
  Textarea,
  Button,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  VStack,
  Flex,
  Badge,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  EditIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { useSession } from "next-auth/react";
import { marked } from "marked";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Note {
  _id: string;
  userID: string;
  prompt: string;
  generated_quiz: string;
  createdAt: string;
}

export default function ViewNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [page, setPage] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const limit = 6;
  const toast = useToast();
  const router = useRouter();
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };
  const MotionBox = motion(Box);
  const primaryColor = useColorModeValue("teal.500", "blue.200");
  const primaryContainer = useColorModeValue("teal.100", "blue.900");
  const surfaceColor = useColorModeValue("white", "gray.800");
  const surfaceVariant = useColorModeValue("white", "gray.700");
  const onSurfaceColor = useColorModeValue("gray.800", "gray.100");
  const outlineColor = useColorModeValue("gray.200", "gray.600");
  const onSurface = useColorModeValue("gray.800", "white");

  const userID = session?.user?.id || null;

  const fetchNotes = useCallback(async () => {
    if (!userID) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/notes?skip=${page * limit}&limit=${limit}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to fetch notes");
      }
      const data = await res.json();

      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
        setTotalNotes(data.total);
      } else {
        throw new Error("Invalid notes data structure");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Fetch Error",
        description: (error as Error).message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [userID, page, limit, toast]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotes();
    }
  }, [session, fetchNotes]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const exportToPDF = async (note: Note) => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const parsedHTML = marked(note.generated_quiz, {
        breaks: true,
        gfm: true,
      });

      // Create a wrapper element with structured formatting
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
      <html>
      <head>
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            padding: 32px;
            background: #FFFFFF;
            color: #1C1B1F;
            line-height: 1.5;
          }

          h1.title {
            color: #6750A4;
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 8px;
          }

          .meta {
            font-size: 14px;
            color: #49454F;
            margin-bottom: 24px;
          }

          .content h1, .content h2, .content h3 {
            margin-top: 18px;
            margin-bottom: 8px;
            color: #6750A4;
          }

          .content p {
            margin: 0 0 16px 0;
          }

          .content ul {
            padding-left: 20px;
            margin-bottom: 12px;
            list-style-type: disc;
          }

          .content ul ul {
            list-style-type: circle;
            margin-top: 4px;
            margin-bottom: 4px;
            padding-left: 20px;
          }

          .content ul ul ul {
            list-style-type: square;
            margin-top: 2px;
            margin-bottom: 2px;
            padding-left: 20px;
          }

          .content li {
            margin-bottom: 4px;
          }

          .content pre {
            font-family: 'Fira Code', monospace;
            background: #f5f5f5;
            border-radius: 8px;
            padding: 12px;
            overflow-x: auto;
            margin-bottom: 16px;
            white-space: pre-wrap;
            word-break: break-word;
          }

          .content code {
            background: #eee;
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 13px;
          }

          strong {
            color: #6750A4;
          }
        </style>
      </head>
      <body>
        <h1 class="title">${extractNoteTitle(note?.prompt || "")}</h1>
        <div class="meta">Created on ${formatDate(note.createdAt)}</div>
        <div class="content">${parsedHTML}</div>
      </body>
      </html>
    `;

      // Use html2pdf to render and save the PDF
      await html2pdf()
        .from(wrapper)
        .set({
          margin: 0.5,
          filename: `${extractNoteTitle(note?.prompt || "")
            .substring(0, 30)
            .replace(/\s+/g, "_")}_notes.pdf`,
          html2canvas: {
            scale: 2,
            backgroundColor: "#FFFFFF",
            useCORS: true, // Important if images or fonts are loaded externally
          },
          jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
          },
        })
        .save();
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({
        title: "Export failed",
        description: "Could not generate PDF",
        status: "error",
      });
    }
  };

  const extractNoteTitle = (prompt: string): string => {
    // Match text between ":" and "(" to extract actual topic
    const match = prompt.match(/:\s*(.+?)\s*(?:\(|$)/);
    return match ? match[1].trim() : prompt;
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({
          title: "Note deleted",
          status: "success",
          variant: "subtle",
          position: "top",
        });
        onClose();
        fetchNotes();
      } else {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Delete failed",
        description: (error as Error).message,
        status: "error",
        variant: "subtle",
        position: "top",
      });
    }
  };

  const updateNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedContent: editedContent }),
      });
      if (res.ok) {
        toast({
          title: "Note updated",
          status: "success",
          variant: "subtle",
          position: "top",
        });

        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n._id === id ? { ...n, generated_quiz: editedContent } : n
          )
        );

        setSelectedNote((prevNote) =>
          prevNote && prevNote._id === id
            ? { ...prevNote, generated_quiz: editedContent }
            : prevNote
        );

        setEditingNoteId(null);
      } else {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Update failed",
        description: (error as Error).message,
        status: "error",
        variant: "subtle",
        position: "top",
      });
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <MotionBox variants={itemVariants}>
            <Button
              leftIcon={<ArrowLeft size={20} />}
              variant="ghost"
              color={onSurface}
              size="md"
              borderRadius="full"
              onClick={() => router.back()}
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
              _focus={{ boxShadow: "outline" }}
            >
              Back
            </Button>
          </MotionBox>
          <Heading
            size="xl"
            color={primaryColor}
            fontWeight="medium"
            letterSpacing="tight"
          >
            My Notes
          </Heading>
          <Badge
            colorScheme="purple"
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
          >
            {totalNotes} total
          </Badge>
        </Flex>

        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="filled"
          size="md"
          borderRadius="full"
          bg={surfaceVariant}
          borderColor="transparent"
          _hover={{ bg: surfaceVariant }}
          _focus={{
            bg: surfaceVariant,
            borderColor: primaryColor,
            boxShadow: `0 0 0 1px ${primaryColor}`,
          }}
          px={6}
        />

        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner size="xl" color={primaryColor} thickness="3px" />
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {notes
              .filter((note) =>
                note.prompt.toLowerCase().includes(search.toLowerCase())
              )
              .map((note) => (
                <Card
                  key={note._id}
                  bg={surfaceColor}
                  borderRadius="xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor={outlineColor}
                  transition="all 0.2s"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  cursor="pointer"
                  onClick={() => {
                    setSelectedNote(note);
                    setEditedContent(note.generated_quiz);
                    onOpen();
                  }}
                >
                  <CardBody p={6}>
                    <VStack spacing={3} align="stretch">
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color={onSurfaceColor}
                        noOfLines={2}
                      >
                        {extractNoteTitle(note.prompt)}
                      </Text>
                      <Text fontSize="sm" color="gray.500" fontFamily="mono">
                        {formatDate(note.createdAt)}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
          </SimpleGrid>
        )}

        <Flex justify="center" mt={8}>
          <HStack spacing={4}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              isDisabled={page === 0}
              variant="outline"
              borderRadius="full"
              px={6}
            >
              Previous
            </Button>
            <Text fontSize="sm" color="gray.500">
              Page {page + 1} of {Math.ceil(totalNotes / limit)}
            </Text>
            <Button
              rightIcon={<ChevronRightIcon />}
              onClick={() => setPage((p) => p + 1)}
              isDisabled={(page + 1) * limit >= totalNotes}
              variant="outline"
              borderRadius="full"
              px={6}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent bg={surfaceColor} borderRadius="2xl" overflow="hidden">
          <ModalHeader
            bg={primaryContainer}
            color={primaryColor}
            py={4}
            borderBottom="1px solid"
            borderColor={outlineColor}
          >
            <Text fontWeight="medium" fontSize="xl">
              {extractNoteTitle(selectedNote?.prompt || "")}
            </Text>
            <Text fontSize="sm" color={onSurfaceColor} mt={1}>
              Created on {selectedNote && formatDate(selectedNote.createdAt)}
            </Text>
          </ModalHeader>
          <ModalCloseButton top={4} right={4} color={onSurfaceColor} />
          <ModalBody p={0}>
            <Card variant="unstyled" borderRadius={0} bg={surfaceVariant}>
              <CardBody p={6}>
                {editingNoteId === selectedNote?._id ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={12}
                    color={onSurfaceColor}
                    bg={surfaceColor}
                    borderRadius="lg"
                    borderColor={outlineColor}
                    _focus={{
                      borderColor: primaryColor,
                      boxShadow: `0 0 0 1px ${primaryColor}`,
                    }}
                    p={4}
                    fontFamily="mono"
                    fontSize="sm"
                  />
                ) : (
                  <Box
                    color={onSurfaceColor}
                    fontSize="md"
                    lineHeight="1.8"
                    fontFamily="body"
                  >
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw, rehypeHighlight]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {selectedNote?.generated_quiz || ""}
                    </ReactMarkdown>
                  </Box>
                )}
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter
            bg={surfaceColor}
            borderTop="1px solid"
            borderColor={outlineColor}
            py={4}
          >
            <HStack spacing={3}>
              {editingNoteId === selectedNote?._id ? (
                <>
                  <Button
                    colorScheme="purple"
                    leftIcon={<CheckIcon />}
                    onClick={() => updateNote(selectedNote._id)}
                    borderRadius="full"
                    px={6}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<CloseIcon />}
                    onClick={() => setEditingNoteId(null)}
                    borderRadius="full"
                    px={6}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit"
                    onClick={() =>
                      selectedNote && setEditingNoteId(selectedNote._id)
                    }
                    colorScheme="purple"
                    variant="outline"
                    borderRadius="full"
                  />
                  <IconButton
                    icon={<DownloadIcon />}
                    aria-label="Download"
                    onClick={() => {
                      if (selectedNote) {
                        exportToPDF(selectedNote).catch(console.error);
                      }
                    }}
                    colorScheme="teal"
                    variant="outline"
                    borderRadius="full"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete"
                    onClick={() => selectedNote && deleteNote(selectedNote._id)}
                    colorScheme="red"
                    variant="outline"
                    borderRadius="full"
                  />
                </>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
