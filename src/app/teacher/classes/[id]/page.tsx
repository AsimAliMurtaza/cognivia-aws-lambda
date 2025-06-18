'use client';
import {
  Box, Button, FormControl, FormLabel, Input, Textarea, useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditCoursePage() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', subject: '', level: '' });
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(res => res.json())
      .then(data => setForm(data));
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast({ title: 'Course updated!', status: 'success' });
      router.push('/teacher/courses');
    } else {
      toast({ title: 'Failed to update course', status: 'error' });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={10}>
      <FormControl mb={4}>
        <FormLabel>Title</FormLabel>
        <Input name="title" value={form.title} onChange={handleChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea name="description" value={form.description} onChange={handleChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Subject</FormLabel>
        <Input name="subject" value={form.subject} onChange={handleChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Level</FormLabel>
        <Input name="level" value={form.level} onChange={handleChange} />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>Update Course</Button>
    </Box>
  );
}
