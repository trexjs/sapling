# Document Structure Migration - Summary

## Overview
Successfully migrated the document structure from a simple object/flat fields to a comprehensive array-based structure with metadata support for both Student and Teacher models.

## Changes Made

### 1. Server Side - Models

#### **studentModel.js** (`server/src/models/studentModel.js`)
**Before:**
```javascript
documents: {
  proof: {
    name: { type: String, default: "" },
    doc: { type: String, default: "" }
  }
}
```

**After:**
```javascript
documents: [{
  type: { 
    type: String, 
    enum: ["proof", "id", "certificate", "photo", "other"], 
    default: "other" 
  },
  original_name: { type: String, default: "" },
  storage_path: { type: String, default: "" },
  mime_type: { type: String, default: "" },
  uploaded_at: { type: Date, default: Date.now }
}]
```

#### **teacherModel.js** (`server/src/models/teacherModel.js`)
**Before:**
```javascript
proof_name: { 
  type: String, 
  required: true,
  trim: true
},
proof_doc: { 
  type: String, 
  required: true,
  trim: true
}
```

**After:**
```javascript
documents: [{
  type: { 
    type: String, 
    enum: ["proof", "id", "certificate", "photo", "other"], 
    default: "other" 
  },
  original_name: { 
    type: String, 
    required: true,
    trim: true
  },
  storage_path: { 
    type: String, 
    required: true,
    trim: true
  },
  mime_type: { 
    type: String, 
    default: ""
  },
  uploaded_at: { 
    type: Date, 
    default: Date.now 
  }
}]
```

### 2. Server Side - Controllers

#### **teacherController.js** (`server/src/controllers/teacherController.js`)
- Updated `onboardTeacher` function to accept `documents` array instead of `proof_name` and `proof_doc`
- Modified validation to check for documents array structure
- Updated teacher data creation to use `documents: documents || []`

### 3. Server Side - Utilities

#### **excelParser.js** (`server/src/utils/excelParser.js`)
- Changed initial record structure from `documents: { proof: {} }` to `documents: []`
- Updated cleanup logic to handle documents as array: `if (Array.isArray(record.documents) && record.documents.length === 0)`

### 4. Frontend - Types

#### **types/index.ts** (`loki/src/types/index.ts`)
Added new Document interface:
```typescript
export interface Document {
  type: 'proof' | 'id' | 'certificate' | 'photo' | 'other';
  original_name: string;
  storage_path: string;
  mime_type: string;
  uploaded_at?: string;
}
```

Updated Teacher interface:
- Removed: `proof_name: string;` and `proof_doc: string;`
- Added: `documents: Document[];`

Updated Student interface:
- Added: `documents: Document[];`

### 5. Frontend - API Service

#### **api.ts** (`loki/src/services/api.ts`)
- Updated `createTeacher` to handle documents array
- Updated `updateTeacher` to include documents in request
- Updated all student transformation functions (`getStudents`, `getStudentById`, `createStudent`, `updateStudent`) to include `documents: backendStudent.documents || []`

### 6. Frontend - Components

#### **TeacherOnboardingForm.tsx** (`loki/src/components/forms/TeacherOnboardingForm.tsx`)
- Changed initial formData from `proof_name` and `proof_doc` to `documents: []`
- Updated validation to check for documents array with required fields
- Redesigned Document step (step 4) to support multiple documents with fields:
  - Document Type (dropdown)
  - Original File Name (input)
  - Storage Path / URL (input)
  - MIME Type (optional input)
- Added "Add Document" and "Remove Document" functionality
- Updated Review step to display all documents in a list format

### 7. Frontend - Pages

#### **TeacherDetailPage.tsx** (`loki/src/pages/TeacherDetailPage.tsx`)
- Added new "Documents" card section that displays all teacher documents
- Shows document type, file name, MIME type, and storage path for each document
- Displays "No documents uploaded" when documents array is empty

#### **StudentDetailPage.tsx** (`loki/src/pages/StudentDetailPage.tsx`)
- Added new "Documents" card section that displays all student documents
- Shows document type, file name, MIME type, and storage path for each document
- Displays "No documents uploaded" when documents array is empty
- Fixed field mapping issues (date_of_birth → dob, address.address → address.site)

## New Document Structure Example

```json
{
  "documents": [
    {
      "type": "proof",
      "original_name": "Passport_Scan.png",
      "storage_path": "s3://student-docs/user_123/id/20240515_b4e2f1.png",
      "mime_type": "image/png",
      "uploaded_at": "2024-05-15T10:30:00.000Z"
    },
    {
      "type": "other",
      "original_name": "UtilityBill_May24.pdf",
      "storage_path": "s3://student-docs/user_123/proof/20240515_a2c1d3.pdf",
      "mime_type": "application/pdf",
      "uploaded_at": "2024-05-15T10:32:00.000Z"
    }
  ]
}
```

## Migration Guide for Existing Data

### For MongoDB Database

If you have existing data in the old format, you'll need to run a migration script. Here's an example:

#### **Migrate Students:**
```javascript
// Migration script for students
db.students.updateMany(
  { "documents.proof": { $exists: true } },
  [{
    $set: {
      documents: {
        $cond: {
          if: { $or: [
            { $ne: ["$documents.proof.name", ""] },
            { $ne: ["$documents.proof.doc", ""] }
          ]},
          then: [{
            type: "proof",
            original_name: "$documents.proof.name",
            storage_path: "$documents.proof.doc",
            mime_type: "",
            uploaded_at: new Date()
          }],
          else: []
        }
      }
    }
  }]
);
```

#### **Migrate Teachers:**
```javascript
// Migration script for teachers
db.teachers.updateMany(
  { proof_name: { $exists: true } },
  [{
    $set: {
      documents: [{
        type: "proof",
        original_name: "$proof_name",
        storage_path: "$proof_doc",
        mime_type: "",
        uploaded_at: new Date()
      }]
    },
    $unset: ["proof_name", "proof_doc"]
  }]
);
```

## Benefits of New Structure

1. **Multiple Documents**: Users can now upload multiple documents per teacher/student
2. **Rich Metadata**: Each document includes type, original filename, storage path, MIME type, and upload timestamp
3. **Extensible**: Easy to add new document types via the enum
4. **Better Organization**: Documents are clearly categorized (proof, id, certificate, photo, other)
5. **S3/Cloud Ready**: Storage path field supports various storage solutions (S3, Azure, local, etc.)
6. **Type Safety**: Frontend TypeScript types ensure compile-time safety

## Testing Checklist

- [ ] Create a new teacher with documents
- [ ] Create a new student with documents
- [ ] View teacher details page - verify documents display
- [ ] View student details page - verify documents display
- [ ] Edit existing teacher - add/remove documents
- [ ] Edit existing student - add/remove documents
- [ ] Upload students via Excel - verify documents field handling
- [ ] Test with empty documents array
- [ ] Test API responses include documents array
- [ ] Verify backward compatibility if migration script is run

## API Changes

### Teacher Onboarding Endpoint
**Endpoint:** `POST /api/teacher/onboard`

**Old Request Body:**
```json
{
  "proof_name": "Aadhar Card",
  "proof_doc": "https://example.com/doc.pdf"
}
```

**New Request Body:**
```json
{
  "documents": [
    {
      "type": "proof",
      "original_name": "AadharCard.pdf",
      "storage_path": "s3://bucket/path/file.pdf",
      "mime_type": "application/pdf"
    }
  ]
}
```

## Notes

- The `uploaded_at` field is automatically set to the current date when a document is added
- Documents array can be empty (no documents required)
- For teachers, at least one document is recommended but not enforced at the model level
- MIME type is optional but recommended for proper file handling
- Storage path can be any valid path (S3, local filesystem, URL, etc.)

## Files Modified

### Server
1. `server/src/models/studentModel.js`
2. `server/src/models/teacherModel.js`
3. `server/src/controllers/teacherController.js`
4. `server/src/utils/excelParser.js`

### Client (Loki)
1. `loki/src/types/index.ts`
2. `loki/src/services/api.ts`
3. `loki/src/components/forms/TeacherOnboardingForm.tsx`
4. `loki/src/pages/TeacherDetailPage.tsx`
5. `loki/src/pages/StudentDetailPage.tsx`

---

**Migration Status:** ✅ Complete  
**Date:** October 18, 2025  
**Linter Errors:** None  
**Breaking Changes:** Yes - API contract changed for teacher onboarding

