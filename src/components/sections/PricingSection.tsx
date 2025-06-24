"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Grid,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  GridItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Basic",
    price: "$9.99/mo",
    features: ["200 Credits", "20 Quizzes", "50 Requests/Day"],
    colorScheme: "gray",
  },
  {
    name: "Pro",
    price: "$16.66/mo",
    features: ["400 Credits", "40 Quizzes", "100 Requests/Day"],
    popular: true,
  },
  {
    name: "Premium",
    price: "$25.00/mo",
    features: ["700 Credits", "70 Quizzes", "Unlimited Requests/Day"],
    colorScheme: "teal",
  },
];

export default function PricingSection() {
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const planColorScheme = useColorModeValue("teal.500", "blue.400");
  const anotherPlanColorScheme = useColorModeValue("gray.500", "gray.300");

  return (
    <Box
      py={20}
      id="pricing"
      bg={bgColor}
      position="relative"
      zIndex={1}
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.lg">
        <VStack spacing={12} textAlign="center">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <VStack spacing={4}>
              <Heading
                as="h2"
                size="2xl"
                fontWeight="bold"
                color={textColor}
                lineHeight="1.2"
              >
                Simple, transparent pricing
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={subTextColor}
                maxW="2xl"
              >
                Choose the perfect plan for your learning journey with no hidden
                fees or surprises. Upgrade or cancel anytime.
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="thin">
                (Applicable to AI-Based features only)
              </Text>
            </VStack>
          </motion.div>

          {/* Pricing Cards */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={6}
            width="full"
          >
            {pricingPlans.map((plan, index) => (
              <GridItem key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    borderRadius="2xl"
                    height="100%"
                    position="relative"
                    overflow="hidden"
                  >
                    <CardHeader pb={0}>
                      <VStack spacing={1}>
                        <Heading as="h3" size="lg" color={planColorScheme}>
                          {plan.name}
                        </Heading>
                        <Box>
                          <Text
                            fontSize="xl"
                            fontWeight="normal"
                            color={textColor}
                          >
                            {plan.price}
                          </Text>
                          {/* {plan.period && (
                            <Text fontSize="sm" color={subTextColor}>
                              {plan.period}
                            </Text>
                          )} */}
                        </Box>
                      </VStack>
                    </CardHeader>

                    <CardBody>
                      <VStack spacing={3} align="flex-start">
                        {plan.features.map((feature, idx) => (
                          <Text
                            key={idx}
                            color={subTextColor}
                            display="flex"
                            alignItems="center"
                            gap={2}
                          >
                            <Box as="span" color={anotherPlanColorScheme}>
                              ✓
                            </Box>
                            {feature}
                          </Text>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </motion.div>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
