import express from "express";
import {
  getAllDocuments,
  getDocument,
  saveDocument,
  updateDocument,
  deleteDocument
} from "../controllers/cmsController.js";

const router = express.Router();

// GET /api/cms/documents - Get all documents
router.get("/documents", getAllDocuments);

// GET /api/cms/terms-and-conditions - Get terms and conditions document
router.get("/terms-and-conditions", (req, res) => {
  req.params.type = 'terms-and-conditions';
  getDocument(req, res);
});

// GET /api/cms/privacy-policy - Get privacy policy document
router.get("/privacy-policy", (req, res) => {
  req.params.type = 'privacy-policy';
  getDocument(req, res);
});

// POST /api/cms/terms-and-conditions - Create or update terms and conditions
router.post("/terms-and-conditions", (req, res) => {
  req.body.type = 'terms-and-conditions';
  saveDocument(req, res);
});

// POST /api/cms/privacy-policy - Create or update privacy policy
router.post("/privacy-policy", (req, res) => {
  req.body.type = 'privacy-policy';
  saveDocument(req, res);
});

// PUT /api/cms/terms-and-conditions - Update terms and conditions
router.put("/terms-and-conditions", (req, res) => {
  req.params.type = 'terms-and-conditions';
  updateDocument(req, res);
});

// PUT /api/cms/privacy-policy - Update privacy policy
router.put("/privacy-policy", (req, res) => {
  req.params.type = 'privacy-policy';
  updateDocument(req, res);
});

// DELETE /api/cms/terms-and-conditions - Delete terms and conditions
router.delete("/terms-and-conditions", (req, res) => {
  req.params.type = 'terms-and-conditions';
  deleteDocument(req, res);
});

// DELETE /api/cms/privacy-policy - Delete privacy policy
router.delete("/privacy-policy", (req, res) => {
  req.params.type = 'privacy-policy';
  deleteDocument(req, res);
});

export default router;
