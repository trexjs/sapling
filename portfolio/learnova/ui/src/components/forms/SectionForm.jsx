import { useState } from 'react';

import { FormField, inputClasses } from '../common/FormField.jsx';

const DEFAULT_SECTION = {
  title: '',
  duration: 0,
  status: 'draft',
  video: '',
  image: '',
  pdf: '',
};

export const SectionForm = ({ initialValue = DEFAULT_SECTION, onSubmit, onCancel, submitLabel = 'Save Section' }) => {
  const [formState, setFormState] = useState({ ...DEFAULT_SECTION, ...initialValue });

  const updateField = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      ...formState,
      duration: Number(formState.duration) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Section Title" required>
          <input
            className={inputClasses}
            value={formState.title}
            onChange={(event) => updateField('title', event.target.value)}
            required
          />
        </FormField>

        <FormField label="Duration (mins)">
          <input
            className={inputClasses}
            type="number"
            min="0"
            value={formState.duration}
            onChange={(event) => updateField('duration', event.target.value)}
          />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Video URL">
          <input
            className={inputClasses}
            type="url"
            value={formState.video}
            onChange={(event) => updateField('video', event.target.value)}
          />
        </FormField>
        <FormField label="PDF URL">
          <input
            className={inputClasses}
            type="url"
            value={formState.pdf}
            onChange={(event) => updateField('pdf', event.target.value)}
          />
        </FormField>
        <FormField label="Image URL">
          <input
            className={inputClasses}
            type="url"
            value={formState.image}
            onChange={(event) => updateField('image', event.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Status">
        <select
          className={inputClasses}
          value={formState.status}
          onChange={(event) => updateField('status', event.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="unpublish">Unpublished</option>
        </select>
      </FormField>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
