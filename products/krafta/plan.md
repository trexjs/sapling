# Website Builder Plan

Here's a structured plan for building a low-code website builder using Node.js, focusing on drag-and-drop functionality for creating responsive websites.

## Overview
- **Tech Stack**: Node.js backend (Express/Fastify), React frontend, MongoDB database, React DnD for drag-and-drop.
- **Architecture**: Separate frontend and backend, component-based design.
- **Key Features**: Visual editor with component library, responsive preview, export capabilities, user management.

## High-Priority Tasks

| Task | Status | Key Missing Functionality |
| --- | --- | --- |
| Define Requirements | ✅ Complete | — |
| Research Tech Stack | ✅ Complete | — |
| Setup Project Structure | ✅ Complete | — |
| Build Backend API | 🔄 Not started | Data models for projects/pages/components, REST endpoints (CRUD), JWT auth, asset uploads, deployment configuration |
| Create Component Library | ⚠️ In progress | Image/Video/Form/Grid components, property panels (typography, spacing, colors), reusable layout presets, per-breakpoint styling controls |
| Implement Drag-and-Drop | ⚠️ In progress | Grid/snap alignment, selection/duplicate/delete actions, keyboard shortcuts, undo/redo, settings sidebar integration |
| Add Responsive Tools | ⚠️ In progress | Breakpoint manager, per-component responsive overrides, live device frames (mobile/tablet/desktop), media-query generation/export |
| Implement Save/Load | ⚠️ In progress | Persist to backend (user + project scope), version history, autosave, publish snapshots |

## Medium-Priority Tasks
- **Add Export/Deploy**: Generate static HTML/CSS/JS from component tree, ZIP download, optional integration with hosting (Netlify/Vercel).
- **Add Themes/Styling**: Pre-built themes, design tokens, CSS editor, color/font pickers.
- **Implement Auth**: Sign-up, login, password reset, secure project access with role-based permissions.

## Lower-Priority Tasks
- **Test Platform**: Unit tests (Jest), integration tests for drag-and-drop, e2e testing (Cypress).
- **Write Documentation**: User guide, API docs, setup instructions.

## Immediate Next Steps
1. **Backend Foundations**: Define MongoDB schemas (users, projects, pages, assets), scaffold Express routes, wire up JWT auth and project ownership rules.
2. **Editor Enhancements**: Add a right-side settings panel with form controls for selected components (text, button, container) and enable delete/duplicate actions.
3. **Responsive Styling Engine**: Introduce breakpoint-aware style storage in component props and ensure preview toggles apply the correct class set.
4. **Persistence Integration**: Replace localStorage save/load with API calls to the backend, keeping local draft autosave as a fallback.

Revisit this plan after completing the above to ensure medium- and lower-priority items remain aligned with the updated architecture.

This plan prioritizes MVP features first. Start with requirements and tech research, then build incrementally.
