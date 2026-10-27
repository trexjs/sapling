import asyncHandler from '../utils/asyncHandler.js';
import Project from '../models/Project.js';

const ensureOwnership = (project, userId) => {
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }

  if (project.owner.toString() !== userId.toString()) {
    const err = new Error('Not authorized to access this project');
    err.status = 403;
    throw err;
  }
};

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id }).select('name description status updatedAt');
  res.json({ projects });
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Project name is required');
  }

  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    pages: [
      {
        name: 'Home',
        slug: 'home',
        rootNodeId: 'ROOT',
        nodes: [],
      },
    ],
  });

  res.status(201).json({ project });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  ensureOwnership(project, req.user._id);
  res.json({ project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const updates = req.body;
  const project = await Project.findById(req.params.id);
  ensureOwnership(project, req.user._id);

  Object.assign(project, updates);
  await project.save();

  res.json({ project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  ensureOwnership(project, req.user._id);

  await project.deleteOne();
  res.json({ success: true });
});

export const savePageData = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  const { nodes, rootNodeId } = req.body;

  const project = await Project.findById(req.params.id);
  ensureOwnership(project, req.user._id);

  const page = project.pages.id(pageId) || project.pages.find((p) => p._id.toString() === pageId);

  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  page.nodes = nodes;
  if (rootNodeId) page.rootNodeId = rootNodeId;
  await project.save();

  res.json({ page });
});
