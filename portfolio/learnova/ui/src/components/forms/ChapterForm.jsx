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

const DEFAULT_CHAPTER = {
  title: '',
  description: '',
  order: 0,
  sections: [DEFAULT_SECTION],
};

export const ChapterForm = ({ initialValue = DEFAULT_CHAPTER, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState({
    ...DEFAULT_CHAPTER,
    ...initialValue,
    sections: initialValue.sections?.length ? initialValue.sections : [DEFAULT_SECTION],
  });

  const updateChapterField = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const updateSectionField = (index, key, value) => {
    setFormState((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], [key]: value };
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    setFormState((prev) => ({ ...prev, sections: [...prev.sections, DEFAULT_SECTION] }));
  };

  const removeSection = (index) => {
    setFormState((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      ...formState,
      sections: formState.sections.map((section) => ({
        ...section,
        duration: Number(section.duration) || 0,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Chapter Title" required>
          <input
            className={inputClasses}
            value={formState.title}
            onChange={(event) => updateChapterField('title', event.target.value)}
            required
          />
        </FormField>
        <FormField label="Order">
          <input
            className={inputClasses}
            type="number"
            min="0"
            value={formState.order}
            onChange={(event) => updateChapterField('order', Number(event.target.value))}
          />
        </FormField>
      </div>

      <FormField label="Description">
        <textarea
          className={`${inputClasses} min-h-[100px]`}
          value={formState.description}
          onChange={(event) => updateChapterField('description', event.target.value)}
        />
      </FormField>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Sections</span>
          <button
            type="button"
            className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100"
            onClick={addSection}
          >
            + Add section
          </button>
        </div>

        <div className="space-y-4">
          {formState.sections.map((section, index) => (
            <div key={`section-${index}`} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Section {index + 1}</p>
                <button
                  type="button"
                  className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  onClick={() => removeSection(index)}
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Title" required>
                  <input
                    className={inputClasses}
                    value={section.title}
                    onChange={(event) => updateSectionField(index, 'title', event.target.value)}
                    required
                  />
                </FormField>

                <FormField label="Duration (mins)">
                  <input
                    className={inputClasses}
                    type="number"
                    min="0"
                    value={section.duration}
                    onChange={(event) => updateSectionField(index, 'duration', event.target.value)}
                  />
                </FormField>

                <FormField label="Video URL">
                  <input
                    className={inputClasses}
                    type="url"
                    value={section.video}
                    onChange={(event) => updateSectionField(index, 'video', event.target.value)}
                  />
                </FormField>

                <FormField label="PDF URL">
                  <input
                    className={inputClasses}
                    type="url"
                    value={section.pdf}
                    onChange={(event) => updateSectionField(index, 'pdf', event.target.value)}
                  />
                </FormField>

                <FormField label="Image URL">
                  <input
                    className={inputClasses}
                    type="url"
                    value={section.image}
                    onChange={(event) => updateSectionField(index, 'image', event.target.value)}
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    className={inputClasses}
                    value={section.status}
                    onChange={(event) => updateSectionField(index, 'status', event.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="unpublish">Unpublished</option>
                  </select>
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </div>

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
          Save Chapter
        </button>
      </div>
    </form>
  );
};
