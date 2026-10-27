import CMSDocument from "../models/cmsModel.js";

// Helper function to bump version
const bumpVersion = (currentVersion, versionType) => {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  if (versionType === 'MAJOR') {
    return `${major + 1}.0.0`;
  } else {
    return `${major}.${minor + 1}.0`;
  }
};

// Get all CMS documents
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await CMSDocument.find().sort({ type: 1 });
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching all documents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch documents',
      message: error.message 
    });
  }
};

// Get specific document by type
export const getDocument = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate document type
    if (!['terms-and-conditions', 'privacy-policy'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid document type',
        message: 'Document type must be either "terms-and-conditions" or "privacy-policy"'
      });
    }

    let document = await CMSDocument.findOne({ type });
    
    // If document doesn't exist, create a default one
    if (!document) {
      document = new CMSDocument({
        type,
        title: type === 'terms-and-conditions' ? 'Terms and Conditions' : 'Privacy Policy',
        content: '<p>Please add your content here...</p>',
        version: '0.0.0'
      });
      await document.save();
    }

    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ 
      error: 'Failed to fetch document',
      message: error.message 
    });
  }
};

// Create or update document
export const saveDocument = async (req, res) => {
  try {
    const { type, title, content, version, versionBump } = req.body;
    
    // Validate required fields
    if (!type || !title || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Type, title, and content are required'
      });
    }

    // Validate document type
    if (!['terms-and-conditions', 'privacy-policy'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid document type',
        message: 'Document type must be either "terms-and-conditions" or "privacy-policy"'
      });
    }

    // Find existing document
    let document = await CMSDocument.findOne({ type });
    
    let newVersion = version || '0.0.0';
    
    // If version bump is provided, calculate new version
    if (versionBump && document) {
      newVersion = bumpVersion(document.version, versionBump.type);
    }

    if (document) {
      // Update existing document
      document.title = title;
      document.content = content;
      document.version = newVersion;
      document.updatedAt = new Date();
      await document.save();
    } else {
      // Create new document
      document = new CMSDocument({
        type,
        title,
        content,
        version: newVersion
      });
      await document.save();
    }

    res.status(200).json({
      message: 'Document saved successfully',
      document
    });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ 
      error: 'Failed to save document',
      message: error.message 
    });
  }
};

// Update document
export const updateDocument = async (req, res) => {
  try {
    const { type } = req.params;
    const { title, content, version } = req.body;
    
    // Validate document type
    if (!['terms-and-conditions', 'privacy-policy'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid document type',
        message: 'Document type must be either "terms-and-conditions" or "privacy-policy"'
      });
    }

    const document = await CMSDocument.findOne({ type });
    
    if (!document) {
      return res.status(404).json({ 
        error: 'Document not found',
        message: `Document of type "${type}" not found`
      });
    }

    // Update fields if provided
    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;
    if (version !== undefined) document.version = version;
    
    document.updatedAt = new Date();
    await document.save();

    res.status(200).json({
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ 
      error: 'Failed to update document',
      message: error.message 
    });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate document type
    if (!['terms-and-conditions', 'privacy-policy'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid document type',
        message: 'Document type must be either "terms-and-conditions" or "privacy-policy"'
      });
    }

    const document = await CMSDocument.findOneAndDelete({ type });
    
    if (!document) {
      return res.status(404).json({ 
        error: 'Document not found',
        message: `Document of type "${type}" not found`
      });
    }

    res.status(200).json({
      message: 'Document deleted successfully',
      document
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      error: 'Failed to delete document',
      message: error.message 
    });
  }
};
