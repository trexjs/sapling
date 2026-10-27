import express from 'express';
import Response, { IResponse } from '../models/Response';
import Form from '../models/Form';

const router = express.Router();

// Submit a response to a form
router.post('/', async (req, res) => {
  try {
    const { formId, answers, userEmail } = req.body;

    // Check if form exists and is published
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (!form.settings.isPublished) {
      return res.status(400).json({ error: 'Form is not published' });
    }

    // Check if multiple responses are allowed
    if (!form.settings.allowMultipleResponses) {
      const existingResponse = await Response.findOne({ formId, userEmail });
      if (existingResponse) {
        return res.status(400).json({ error: 'Multiple responses not allowed for this form' });
      }
    }

    const response = new Response({
      formId,
      answers,
      userEmail: form.settings.collectEmail ? userEmail : undefined
    });

    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Get responses for a specific form
router.get('/form/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId }).sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get a specific response
router.get('/:id', async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

// Get response statistics for a form
router.get('/stats/:formId', async (req, res) => {
  try {
    const totalResponses = await Response.countDocuments({ formId: req.params.formId });
    const uniqueEmails = await Response.distinct('userEmail', { formId: req.params.formId });
    
    res.json({
      totalResponses,
      uniqueResponses: uniqueEmails.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch response statistics' });
  }
});

export default router;
