"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Select,
  Divider,
  Toast as toast,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiTrash2,
  FiSearch,
  FiUser,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (session?.user) {
      await fetch("/api/logging/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          userEmail: session.user.email,
          role: session.user.role,
          action: "Session Ended",
        }),
      });
    }

    signOut({ callbackUrl: "/" });
  };

  return (
    <Box p={6}>
      {/* Header */}
      <Flex justify="center" align="center" mb={8}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Error 404
          </Text>
          <Text fontSize="lg" color="gray.500">
            Page Not Found
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
