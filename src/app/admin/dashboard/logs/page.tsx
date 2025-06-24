"use client";
import { AuditLog } from "@/types/types";
import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  useColorModeValue,
  IconButton,
  Tooltip,
  Skeleton,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Wrap,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

const roleColor: Record<string, string> = {
  admin: "purple",
  user: "blue",
  moderator: "teal",
  guest: "gray",
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const LOG_TYPES = [
  { value: "all", label: "All Types" },
  { value: "action", label: "Actions" },
  { value: "session", label: "Sessions" },
];

const ACTION_TYPES = [
  { value: "all", label: "All Actions" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
];

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [searchEmail, setSearchEmail] = useState("");
  const [logType, setLogType] = useState("all");
  const [actionType, setActionType] = useState("all");
  const toast = useToast();
  const router = useRouter();

  const cardBg = useColorModeValue("white", "gray.800");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const paginationButtonBg = useColorModeValue("white", "gray.700");
  const filterBg = useColorModeValue("gray.100", "gray.700");

  const fetchLogs = async () => {
    try {
      let url = `/api/logging/audit?page=${currentPage}&limit=${pageSize}`;

      if (searchEmail) url += `&email=${encodeURIComponent(searchEmail)}`;
      if (logType !== "all") url += `&type=${logType}`;
      if (actionType !== "all" && logType === "action")
        url += `&action=${actionType}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data.logs);
      setTotalLogs(data.total);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error fetching logs",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Debounced search to avoid too many requests while typing
  const debouncedSearch = debounce(() => {
    setCurrentPage(1); // Reset to first page when searching
    fetchLogs();
  }, 500);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize, logType, actionType]);

  useEffect(() => {
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchEmail]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleLogTypeChange = (value: string) => {
    setLogType(value);
    setActionType("all"); // Reset action filter when changing log type
    setCurrentPage(1);
  };

  const handleActionTypeChange = (value: string) => {
    setActionType(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value);
  };

  const totalPages = Math.ceil(totalLogs / pageSize);

  return (
    <Box
      p={{ base: 4, md: 8 }}
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <Flex direction="column" gap={6} maxW="1800px" mx="auto">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Flex align="center" gap={4}>
            <Heading fontSize="2xl" fontWeight="semibold" color={textColor}>
              Audit Logs
            </Heading>
            <Badge
              colorScheme="purple"
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              Admin View
            </Badge>
          </Flex>

          <Flex gap={3}>
            <Tooltip label="Refresh logs">
              <IconButton
                aria-label="Refresh logs"
                icon={<FiRefreshCw />}
                onClick={handleRefresh}
                isLoading={refreshing}
                variant="outline"
                borderRadius="full"
              />
            </Tooltip>
            <Button
              leftIcon={<FiArrowLeft />}
              onClick={() => router.push("/admin/dashboard")}
              variant="outline"
              borderRadius="full"
            >
              Dashboard
            </Button>
          </Flex>
        </Flex>

        {/* Filter and Search Controls */}
        <Card
          borderRadius="xl"
          boxShadow="sm"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
        >
          <CardBody>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <InputGroup maxW="400px">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search by user email..."
                  value={searchEmail}
                  onChange={handleSearchChange}
                />
              </InputGroup>

              <Wrap spacing={4}>
                <Select
                  value={logType}
                  onChange={(e) => handleLogTypeChange(e.target.value)}
                  minW="150px"
                  bg={filterBg}
                >
                  {LOG_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>

                {logType === "action" && (
                  <Select
                    value={actionType}
                    onChange={(e) => handleActionTypeChange(e.target.value)}
                    minW="150px"
                    bg={filterBg}
                  >
                    {ACTION_TYPES.map((action) => (
                      <option key={action.value} value={action.value}>
                        {action.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Wrap>
            </Stack>
          </CardBody>
        </Card>

        <Card
          borderRadius="xl"
          boxShadow="sm"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
        >
          <CardBody p={0}>
            {loading && !refreshing ? (
              <Flex direction="column" gap={4} p={6}>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} height="50px" borderRadius="md" />
                ))}
              </Flex>
            ) : (
              <>
                <Box overflowX="auto">
                  <Table variant="simple" size={{ base: "sm", md: "md" }}>
                    <Thead bg={tableHeaderBg}>
                      <Tr>
                        <Th>User</Th>
                        <Th>Role</Th>
                        <Th>Type</Th>
                        <Th>Action</Th>
                        <Th>IP Address</Th>
                        <Th>Details</Th>
                        <Th>Timestamp</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {logs.length > 0 ? (
                        logs.map((log) => (
                          <Tr
                            key={log._id}
                            _hover={{ bg: hoverBg }}
                            transition="background 0.2s ease"
                          >
                            <Td>
                              <Flex align="center" gap={3}>
                                <Avatar size="sm" name={log.userEmail} />
                                <Box>
                                  <Text fontWeight="medium" color={textColor}>
                                    {log.userEmail}
                                  </Text>
                                </Box>
                              </Flex>
                            </Td>
                            <Td>
                              <Badge
                                px={2}
                                py={1}
                                fontSize="xs"
                                borderRadius="full"
                                colorScheme={roleColor[log.role] || "gray"}
                                textTransform="capitalize"
                              >
                                {log.role}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge
                                px={2}
                                py={1}
                                fontSize="xs"
                                borderRadius="full"
                                colorScheme={
                                  log.type === "action" ? "blue" : "green"
                                }
                                textTransform="capitalize"
                              >
                                {log.type}
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontSize="sm" fontWeight="medium">
                                {log.action}
                              </Text>
                            </Td>
                            <Td>
                              <Text
                                fontSize="sm"
                                color={secondaryText}
                                fontFamily="monospace"
                              >
                                {log.ip || "N/A"}
                              </Text>
                            </Td>
                            <Td maxW="300px">
                              <Tooltip
                                label={log.userAgent || "No details"}
                                placement="top"
                              >
                                <Text
                                  fontSize="xs"
                                  color={secondaryText}
                                  noOfLines={1}
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                >
                                  {log.userAgent || "N/A"}
                                </Text>
                              </Tooltip>
                            </Td>
                            <Td>
                              <Flex direction="column">
                                <Text fontSize="xs" color={secondaryText}>
                                  {new Date(log.createdAt).toLocaleDateString()}
                                </Text>
                                <Text fontSize="xs" color={secondaryText}>
                                  {new Date(log.createdAt).toLocaleTimeString()}
                                </Text>
                              </Flex>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={7} textAlign="center" py={10}>
                            <Text color={secondaryText}>
                              No audit logs found
                            </Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>

                {logs.length > 0 && (
                  <Flex
                    justify="space-between"
                    align="center"
                    p={4}
                    borderTop="1px solid"
                    borderColor={borderColor}
                    flexDirection={{ base: "column", md: "row" }}
                    gap={4}
                  >
                    <Flex align="center" gap={2}>
                      <Text fontSize="sm" color={secondaryText}>
                        Rows per page:
                      </Text>
                      <Select
                        size="sm"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        w="85px"
                        borderRadius="md"
                        bg={paginationButtonBg}
                      >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </Select>
                    </Flex>

                    <Text fontSize="sm" color={secondaryText}>
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, totalLogs)} of{" "}
                      {totalLogs} logs
                    </Text>

                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Previous page"
                        icon={<FiChevronLeft />}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        isDisabled={currentPage === 1}
                        size="sm"
                        borderRadius="md"
                        bg={paginationButtonBg}
                      />

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          // Show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              size="sm"
                              borderRadius="md"
                              bg={
                                currentPage === pageNum
                                  ? "purple.500"
                                  : paginationButtonBg
                              }
                              color={
                                currentPage === pageNum
                                  ? "white"
                                  : secondaryText
                              }
                              _hover={{
                                bg:
                                  currentPage === pageNum
                                    ? "purple.600"
                                    : hoverBg,
                              }}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}

                      <IconButton
                        aria-label="Next page"
                        icon={<FiChevronRight />}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        isDisabled={currentPage === totalPages}
                        size="sm"
                        borderRadius="md"
                        bg={paginationButtonBg}
                      />
                    </HStack>
                  </Flex>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}
