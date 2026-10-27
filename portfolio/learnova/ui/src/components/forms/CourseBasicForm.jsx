import { useMemo, useState } from 'react';

import { FormField, inputClasses } from '../common/FormField.jsx';

const INITIAL_FORM = {
  title: '',
  description: '',
  prerequisites: [''],
  image: '',
  price: 0,
  discount: 0,
  duration: 0,
  category: '',
  subCategory: '',
  tags: [''],
  status: 'draft',
};

export const CourseBasicForm = ({ initialValue = INITIAL_FORM, onSubmit, submitLabel = 'Save Course' }) => {
  const [formState, setFormState] = useState({
    ...INITIAL_FORM,
    ...initialValue,
    prerequisites: initialValue.prerequisites?.length ? initialValue.prerequisites : [''],
    tags: initialValue.tags?.length ? initialValue.tags : [''],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPublishable = useMemo(() => formState.title && formState.description && formState.category, [formState]);

  const updateField = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const updateArrayField = (key, value, index) => {
    setFormState((prev) => {
      const items = [...prev[key]];
      items[index] = value;
      return { ...prev, [key]: items };
    });
  };

  const addArrayItem = (key) => {
    setFormState((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  const removeArrayItem = (key, index) => {
    setFormState((prev) => {
      const items = prev[key].filter((_, idx) => idx !== index);
      return { ...prev, [key]: items.length ? items : [''] };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit?.({
        ...formState,
        prerequisites: formState.prerequisites.filter(Boolean),
        tags: formState.tags.filter(Boolean),
      });
    } catch (error) {
      setErrors({ form: error.message || 'Unable to save course' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Title" required error={errors.title}>
          <input
            className={inputClasses}
            value={formState.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Enter course title"
            required
          />
        </FormField>

        <FormField label="Category" required error={errors.category}>
          <input
            className={inputClasses}
            value={formState.category}
            onChange={(event) => updateField('category', event.target.value)}
            placeholder="Primary course category"
            required
          />
        </FormField>

        <FormField label="Sub Category" error={errors.subCategory}>
          <input
            className={inputClasses}
            value={formState.subCategory}
            onChange={(event) => updateField('subCategory', event.target.value)}
            placeholder="Optional sub category"
          />
        </FormField>

        <FormField label="Hero Image URL" error={errors.image}>
          <input
            className={inputClasses}
            value={formState.image}
            onChange={(event) => updateField('image', event.target.value)}
            placeholder="https://example.com/course.png"
            type="url"
          />
        </FormField>
      </div>

      <FormField label="Description" required error={errors.description}>
        <textarea
          className={`${inputClasses} min-h-[120px]`}
          value={formState.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="What will students learn?"
          required
        />
      </FormField>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Price" error={errors.price}>
          <input
            className={inputClasses}
            type="number"
            min="0"
            step="0.01"
            value={formState.price}
            onChange={(event) => updateField('price', Number(event.target.value))}
          />
        </FormField>

        <FormField label="Discount (%)" error={errors.discount}>
          <input
            className={inputClasses}
            type="number"
            min="0"
            max="100"
            value={formState.discount}
            onChange={(event) => updateField('discount', Number(event.target.value))}
          />
        </FormField>

        <FormField label="Duration (hours)" error={errors.duration}>
          <input
            className={inputClasses}
            type="number"
            min="0"
            step="0.5"
            value={formState.duration}
            onChange={(event) => updateField('duration', Number(event.target.value))}
          />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">Prerequisites</p>
          <div className="space-y-2">
            {formState.prerequisites.map((item, index) => (
              <div key={`prerequisite-${index}`} className="flex items-center gap-2">
                <input
                  className={inputClasses}
                  value={item}
                  onChange={(event) => updateArrayField('prerequisites', event.target.value, index)}
                  placeholder="Enter prerequisite"
                />
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:border-primary-200 hover:text-primary-600"
                  onClick={() => removeArrayItem('prerequisites', index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
            onClick={() => addArrayItem('prerequisites')}
          >
            + Add prerequisite
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">Tags</p>
          <div className="space-y-2">
            {formState.tags.map((tag, index) => (
              <div key={`tag-${index}`} className="flex items-center gap-2">
                <input
                  className={inputClasses}
                  value={tag}
                  onChange={(event) => updateArrayField('tags', event.target.value, index)}
                  placeholder="Enter tag"
                />
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:border-primary-200 hover:text-primary-600"
                  onClick={() => removeArrayItem('tags', index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
            onClick={() => addArrayItem('tags')}
          >
            + Add tag
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
        <FormField label="Status" error={errors.status}>
          <select
            className={inputClasses}
            value={formState.status}
            onChange={(event) => updateField('status', event.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published" disabled={!isPublishable}>
              Published
            </option>
            <option value="unpublish">Unpublished</option>
          </select>
        </FormField>
        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>

      {errors.form ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{errors.form}</div>
      ) : null}
    </form>
  );
};
