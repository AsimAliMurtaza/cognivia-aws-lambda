"use client";

import { useRouter } from "next/navigation";
import { Link as ScrollLink } from "react-scroll";
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Button,
  useColorModeValue,
  Link,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import DarkModeToggle from "./DarkModeToggle";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Header() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const hoverColor = useColorModeValue("blue.500", "blue.300");
  const colorScheme = useColorModeValue("teal", "blue");
  const buttonBgHover = useColorModeValue("gray.100", "gray.700");

  const navLinks = [
    { name: "About Us", type: "route", path: "/about" },
    { name: "Features", type: "scroll", to: "features" },
    { name: "Pricing", type: "scroll", to: "pricing" },
    { name: "Contact", type: "scroll", to: "contact" },
  ];

  return (
    <Box
      position="fixed"
      w="100vw"
      top={0}
      zIndex={100}
      bg={bgColor}
      boxShadow="sm"
      borderBottom="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" py={4}>
          {/* Logo */}
          <Heading
            as="h1"
            size="lg"
            color={useColorModeValue("teal.500", "blue.300")}
            cursor="pointer"
            onClick={() => router.push("/")}
            fontFamily="heading" 
            fontWeight="extrabold"
          >
            Cognivia
          </Heading>

          {/* Desktop Navigation */}
          <Flex display={{ base: "none", md: "flex" }} align="center">
            {navLinks.map((link, index) => (
              <MotionBox key={index} whileTap={{ scale: 0.95 }} mx={4}>
                {link.type === "scroll" ? (
                  <ScrollLink
                    to={link.to as string}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    spy={true}
                  >
                    <Button
                      variant="ghost"
                      fontSize="lg"
                      fontWeight="medium"
                      color={textColor}
                      borderRadius="full"
                      _hover={{ color: hoverColor, textDecoration: "none" }}
                      aria-label={`Go to ${link.name} section`}
                    >
                      {link.name}
                    </Button>
                  </ScrollLink>
                ) : (
                  <Link href={link.path} _hover={{ textDecoration: "none" }}>
                    <Button
                      variant="ghost"
                      fontSize="lg"
                      fontWeight="medium"
                      color={textColor}
                      borderRadius="full"
                      _hover={{ color: hoverColor }}
                      aria-label={`Go to ${link.name} page`}
                    >
                      {link.name}
                    </Button>
                  </Link>
                )}
              </MotionBox>
            ))}
          </Flex>

          {/* Buttons (Auth & Dark Mode Toggle) */}
          <Flex align="center" gap={4}>
            <DarkModeToggle />

            {/* Auth Buttons - Desktop */}
            <HStack spacing={2} display={{ base: "none", md: "flex" }}>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                borderColor={useColorModeValue("teal.400", "blue.300")}
                color={useColorModeValue("teal.600", "blue.300")}
                borderRadius="full"
                size="lg"
                px={6}
                _hover={{ bg: useColorModeValue("blue.50", "blue.800") }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                colorScheme={colorScheme}
                borderRadius="full"
                size="lg"
                px={6}
                fontWeight="bold"
                shadow="md"
                _hover={{ shadow: "lg", transform: "translateY(-1px)" }}
              >
                Get Started
              </Button>
            </HStack>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open Menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              fontSize="2xl"
              borderRadius="full"
              onClick={onOpen}
              color={textColor}
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            />
          </Flex>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <DrawerCloseButton />
          <VStack spacing={4} mt={16} align="stretch" px={6}>
            {" "}
            {navLinks.map((link, index) => (
              <Box key={index} w="full">
                {" "}
                {link.type === "scroll" ? (
                  <ScrollLink
                    to={link.to as string}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    spy={true}
                    onClick={onClose}
                  >
                    <Button
                      variant="ghost"
                      fontSize="xl"
                      fontWeight="medium"
                      color={textColor}
                      w="full"
                      justifyContent="flex-start"
                      borderRadius="md"
                      _hover={{
                        color: hoverColor,
                        bg: buttonBgHover,
                      }}
                    >
                      {link.name}
                    </Button>
                  </ScrollLink>
                ) : (
                  <Link href={link.path} _hover={{ textDecoration: "none" }}>
                    <Button
                      variant="ghost"
                      fontSize="xl"
                      fontWeight="medium"
                      color={textColor}
                      w="full"
                      justifyContent="flex-start"
                      borderRadius="md"
                      onClick={onClose}
                      _hover={{
                        color: hoverColor,
                        bg: buttonBgHover,
                      }}
                    >
                      {link.name}
                    </Button>
                  </Link>
                )}
              </Box>
            ))}
            <Divider
              my={2}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            />{" "}
            <VStack spacing={3} mt={4}>
              {" "}
              <Button
                onClick={() => {
                  onClose();
                  router.push("/login");
                }}
                variant="outline"
                color={useColorModeValue("blue.600", "blue.300")}
                borderColor={useColorModeValue("blue.400", "blue.300")}
                w="full"
                borderRadius="full"
                size="lg"
                _hover={{ bg: useColorModeValue("blue.50", "blue.800") }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  router.push("/signup");
                }}
                colorScheme="blue"
                w="full"
                borderRadius="full"
                size="lg"
                fontWeight="bold"
                shadow="md"
                _hover={{ shadow: "lg", transform: "translateY(-1px)" }}
              >
                Get Started
              </Button>
            </VStack>
          </VStack>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
