'use client';
import {
  Box, Button, FormControl, FormLabel,
  Input, Textarea, useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const [form, setForm] = useState({ title: '', description: '', subject: '', level: '' });
  const toast = useToast();
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast({ title: 'Course created!', status: 'success' });
      router.push('/teacher/classes');
    } else {
      toast({ title: 'Error creating course', status: 'error' });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={10}>
      <FormControl mb={4}>
        <FormLabel>Title</FormLabel>
        <Input name="title" onChange={handleChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea name="description" onChange={handleChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Subject</FormLabel>
        <Input name="subject" onChange={handleChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Level</FormLabel>
        <Input name="level" onChange={handleChange} />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit}>Create Course</Button>
    </Box>
  );
}
