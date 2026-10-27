import express from 'express';
import Form, { IForm } from '../models/Form';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Get a specific form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Create a new form
router.post('/', async (req, res) => {
  try {
    const { title, description, questions, settings } = req.body;
    
    const form = new Form({
      title,
      description,
      questions: questions || [],
      settings: {
        isPublished: false,
        allowMultipleResponses: true,
        collectEmail: false,
        showProgressBar: true,
        ...settings
      }
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Update a form
router.put('/:id', async (req, res) => {
  try {
    const { title, description, questions, settings } = req.body;
    
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        questions,
        settings: { ...settings }
      },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update form' });
  }
});

// Publish/unpublish a form
router.patch('/:id/publish', async (req, res) => {
  try {
    const { isPublished } = req.body;
    
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { 'settings.isPublished': isPublished },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update form status' });
  }
});

// Delete a form
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

export default router;
