"use client";

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  Divider,
  IconButton,
  useColorModeValue,
  Flex,
  Image,
} from "@chakra-ui/react";
import { FaGlobe, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const footerBg = useColorModeValue("gray.100", "gray.800");
  const footerColor = useColorModeValue("gray.700", "gray.300");
  const linkHoverColor = useColorModeValue("blue.500", "blue.400");

  return (
    <Box as="footer" bg={footerBg} color={footerColor} py={12}>
      <Container maxW="container.xl">
        {/* Footer Content */}
        <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={10}>
          {/* Column 1 - Logo & Company */}
          <Stack align="flex-start">
            <Image src="/logo.svg" alt="Cognivia" h="30px" mb={4} />
            <Text fontWeight="bold">Company</Text>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Careers
            </Link>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Events
            </Link>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Blogs
            </Link>
            {/* <Link href="#" _hover={{ color: linkHoverColor }}>
              Investor Relations
            </Link> */}
            <Link href="/about" _hover={{ color: linkHoverColor }}>
              About Us
            </Link>
          </Stack>

          {/* Column 2 - Products */}
          <Stack align="flex-start">
            <Text fontWeight="bold">Products</Text>
            <Link href="/" _hover={{ color: linkHoverColor }}>
              Cognivia
            </Link>
            <Link
              href="https://zenflow-eight.vercel.app"
              _hover={{ color: linkHoverColor }}
            >
              ZenFlow
            </Link>
            <Link fontWeight="bold" href="#" _hover={{ color: linkHoverColor }}>
              See all products →
            </Link>
          </Stack>

          {/* Column 3 - Resources */}
          <Stack align="flex-start">
            <Text fontWeight="bold">Resources</Text>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Technical Support
            </Link>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Purchasing & Licensing
            </Link>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Cognivia Community
            </Link>
            {/* <Link href="#" _hover={{ color: linkHoverColor }}>
              Marketplace
            </Link> */}
            <Link href="/login" _hover={{ color: linkHoverColor }}>
              My Account
            </Link>
            {/* <Link fontWeight="bold" href="#" _hover={{ color: linkHoverColor }}>
              Create support ticket →
            </Link> */}
          </Stack>

          {/* Column 4 - Learn & Social */}
          <Stack align="flex-start">
            <Text fontWeight="bold">Learn</Text>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Partners
            </Link>
            {/* <Link href="#" _hover={{ color: linkHoverColor }}>
              Training & Certification
            </Link> */}
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Documentation
            </Link>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Developer Resources
            </Link>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Enterprise Services
            </Link>
            <Link fontWeight="bold" href="#" _hover={{ color: linkHoverColor }}>
              See all resources →
            </Link>
            <Divider my={4} />
            <Flex gap={4}>
              <IconButton
                aria-label="Facebook"
                icon={<FaFacebook />}
                variant="ghost"
                size="lg"
                _hover={{ color: linkHoverColor }}
              />
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                variant="ghost"
                size="lg"
                _hover={{ color: linkHoverColor }}
              />
              <IconButton
                aria-label="Instagram"
                icon={<FaInstagram />}
                variant="ghost"
                size="lg"
                _hover={{ color: linkHoverColor }}
              />
            </Flex>
          </Stack>
        </SimpleGrid>

        {/* Divider */}
        <Divider my={6} />

        {/* Bottom Section */}
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          mb={-10}
        >
          <Text>Copyright © {new Date().getFullYear()} Cognivia Inc.</Text>
          <Stack direction="row" spacing={6}>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Privacy Policy
            </Link>
            <Link href="#" _hover={{ color: linkHoverColor }}>
              Terms
            </Link>
            {/* <Link href="#" _hover={{ color: linkHoverColor }}>
              Impressum
            </Link> */}
          </Stack>
          <IconButton
            aria-label="Change language"
            icon={<FaGlobe />}
            variant="ghost"
            _hover={{ color: linkHoverColor }}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
