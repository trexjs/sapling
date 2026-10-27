import mongoose from 'mongoose';

import { connectDB } from '../config/db.js';
import { Course } from '../models/course.model.js';
import { User } from '../models/user.model.js';

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([User.deleteMany({}), Course.deleteMany({})]);

    const admin = await User.create({
      name: 'Avery Instructor',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'admin',
    });

    const student = await User.create({
      name: 'Jordan Learner',
      email: 'student@example.com',
      password: 'Student123!',
      role: 'student',
    });

    const courses = await Course.insertMany([
      {
        title: 'Modern MERN Bootcamp',
        description: 'Build full-stack applications using MongoDB, Express, React, and Node.js with hands-on projects.',
        prerequisites: ['Basic JavaScript', 'Node.js fundamentals'],
        image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
        price: 149,
        discount: 10,
        duration: 18,
        category: 'Development',
        subCategory: 'Full-stack',
        tags: ['mern', 'fullstack', 'mongodb', 'react'],
        instructors: [admin._id],
        students: [student._id],
        rating: 4.7,
        enrollments: 214,
        status: 'published',
        chapters: [
          {
            title: 'Getting Started with MERN',
            description: 'Set up your environment and understand the architecture.',
            order: 1,
            sections: [
              {
                title: 'Introduction & Setup',
                video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                pdf: 'https://arxiv.org/pdf/2107.02137.pdf',
                duration: 12,
                status: 'published',
              },
              {
                title: 'Project Structure Overview',
                video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
                duration: 9,
                status: 'published',
              },
            ],
          },
          {
            title: 'Building the Backend',
            description: 'Create REST APIs using Express and MongoDB.',
            order: 2,
            sections: [
              {
                title: 'Express Fundamentals',
                pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                duration: 15,
                status: 'draft',
              },
              {
                title: 'Authentication with JWT',
                video: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
                duration: 22,
                status: 'published',
              },
            ],
          },
        ],
      },
      {
        title: 'Advanced React Patterns',
        description: 'Master hooks, context, suspense, and performance optimizations in modern React applications.',
        prerequisites: ['Intermediate React knowledge'],
        image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
        price: 119,
        discount: 0,
        duration: 12,
        category: 'Frontend',
        subCategory: 'React',
        tags: ['react', 'hooks', 'performance'],
        instructors: [admin._id],
        students: [student._id],
        rating: 4.9,
        enrollments: 156,
        status: 'published',
        chapters: [
          {
            title: 'Hooks Deep Dive',
            description: 'Understand how hooks work under the hood.',
            order: 1,
            sections: [
              {
                title: 'useReducer Patterns',
                video: 'https://www.youtube.com/watch?v=f687hBjwFcM',
                duration: 18,
                status: 'published',
              },
              {
                title: 'Custom Hook Design',
                pdf: 'https://arxiv.org/pdf/2203.15556.pdf',
                duration: 14,
                status: 'published',
              },
            ],
          },
          {
            title: 'Performance Optimization',
            description: 'Tools and techniques to keep apps fast.',
            order: 2,
            sections: [
              {
                title: 'React Profiler Walkthrough',
                video: 'https://samplelib.com/lib/preview/mp4/sample-20s.mp4',
                duration: 20,
                status: 'draft',
              },
              {
                title: 'Suspense & Concurrent Rendering',
                pdf: 'https://arxiv.org/pdf/2007.00017.pdf',
                duration: 16,
                status: 'published',
              },
            ],
          },
        ],
      },
    ]);

    console.log('Seed data created:', { users: [admin.email, student.email], courses: courses.length });
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
