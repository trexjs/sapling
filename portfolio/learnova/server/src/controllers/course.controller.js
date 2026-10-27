import mongoose from 'mongoose';

import { Course } from '../models/course.model.js';

const parsePaginationParams = (req) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.validatedBody ?? req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const { skip, limit, page } = parsePaginationParams(req);
    const filters = { deletedAt: { $exists: false } };

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.search) {
      filters.$text = { $search: req.query.search };
    }

    if (req.query.category) {
      filters.category = req.query.category;
    }

    const [courses, total] = await Promise.all([
      Course.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Course.countDocuments(filters),
    ]);

    res.json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, deletedAt: { $exists: false } });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const addChapter = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findOne({ _id: courseId, deletedAt: { $exists: false } });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const chapterPayload = req.validatedBody ?? req.body;
    const nextOrder = typeof chapterPayload.order === 'number' ? chapterPayload.order : course.chapters.length;

    course.chapters.push({ ...chapterPayload, order: nextOrder });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const updateChapter = async (req, res, next) => {
  try {
    const { id: courseId, chapterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({ message: 'Invalid chapter ID' });
    }

    const course = await Course.findOne({ _id: courseId, 'chapters._id': chapterId, deletedAt: { $exists: false } });

    if (!course) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const chapter = course.chapters.id(chapterId);

    Object.assign(chapter, req.validatedBody ?? req.body);
    await course.save();

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteChapter = async (req, res, next) => {
  try {
    const { id: courseId, chapterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findOne({ _id: courseId, 'chapters._id': chapterId, deletedAt: { $exists: false } });

    if (!course) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    course.chapters.id(chapterId)?.remove();
    await course.save();

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const addSection = async (req, res, next) => {
  try {
    const { id: courseId, chapterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findOne({ _id: courseId, 'chapters._id': chapterId, deletedAt: { $exists: false } });

    if (!course) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const chapter = course.chapters.id(chapterId);
    chapter.sections.push(req.validatedBody ?? req.body);

    await course.save();

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const { id: courseId, chapterId, sectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findOne({ _id: courseId, 'chapters._id': chapterId, deletedAt: { $exists: false } });

    if (!course) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const chapter = course.chapters.id(chapterId);
    const section = chapter.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    Object.assign(section, req.validatedBody ?? req.body);
    await course.save();

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteSection = async (req, res, next) => {
  try {
    const { id: courseId, chapterId, sectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findOne({ _id: courseId, 'chapters._id': chapterId, deletedAt: { $exists: false } });

    if (!course) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    const chapter = course.chapters.id(chapterId);
    const section = chapter.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.remove();
    await course.save();

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, deletedAt: { $exists: false } },
      req.validatedBody ?? req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const deletedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, deletedAt: { $exists: false } },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateCourseStatus = async (req, res, next) => {
  try {
    const { status } = req.validatedBody ?? req.body;

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, deletedAt: { $exists: false } },
      { status },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const enrollInCourse = async (req, res, next) => {
  try {
    const { studentId: payloadStudentId } = req.validatedBody ?? req.body;
    const studentObjectId = payloadStudentId || req.user?._id?.toString();

    if (!studentObjectId) {
      return res.status(400).json({ message: 'studentId is required' });
    }

    const course = await Course.findOne({ _id: req.params.id, deletedAt: { $exists: false } });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.students.map((id) => id.toString()).includes(studentObjectId)) {
      course.students.push(studentObjectId);
      course.enrollments += 1;
      await course.save();
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};
