'use client';
import {
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  useToast,
  Heading,
  Flex,
  Card,
  CardBody,
  CardFooter,
  Stack,
  useBreakpointValue,
  FormErrorMessage
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

export default function EditCoursePage() {
  const { id } = useParams();
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    subject: '', 
    level: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    subject: '',
    level: ''
  });
  const toast = useToast();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error('Failed to fetch course');
        const data = await res.json();
        setForm(data);
      } catch (error) {
        toast({
          title: 'Error loading course',
          description: 'Could not fetch course details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    if (id) fetchCourse();
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: !form.title ? 'Title is required' : '',
      subject: !form.subject ? 'Subject is required' : '',
      level: !form.level ? 'Level is required' : ''
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to update course');

      toast({
        title: 'Course updated!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/teacher/classes');
    } catch (error) {
      toast({
        title: 'Failed to update course',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="xl" color="gray.800">
          Edit Course
        </Heading>
        <Button 
          leftIcon={<FiArrowLeft />} 
          variant="outline"
          onClick={() => router.back()}
          size={isMobile ? "sm" : "md"}
        >
          Back
        </Button>
      </Flex>

      <Card variant="outline" shadow="sm">
        <CardBody>
          <Stack spacing={6}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Course Title</FormLabel>
              <Input 
                name="title" 
                value={form.title} 
                onChange={handleChange}
                placeholder="e.g. Introduction to Computer Science"
                size="lg"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange}
                placeholder="Describe your course..."
                rows={5}
                size="lg"
              />
            </FormControl>

            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
              <FormControl isInvalid={!!errors.subject} flex={1}>
                <FormLabel>Subject</FormLabel>
                <Input 
                  name="subject" 
                  value={form.subject} 
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                  size="lg"
                />
                <FormErrorMessage>{errors.subject}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.level} flex={1}>
                <FormLabel>Level</FormLabel>
                <Input 
                  name="level" 
                  value={form.level} 
                  onChange={handleChange}
                  placeholder="e.g. Beginner"
                  size="lg"
                />
                <FormErrorMessage>{errors.level}</FormErrorMessage>
              </FormControl>
            </Flex>
          </Stack>
        </CardBody>

        <CardFooter>
          <Flex justify="flex-end" w="full" gap={4}>
            <Button 
              variant="outline"
              onClick={() => router.push('/teacher/classes')}
              size="lg"
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              leftIcon={<FiSave />}
              isLoading={isSubmitting}
              loadingText="Saving..."
              size="lg"
            >
              Save Changes
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </Box>
  );
}