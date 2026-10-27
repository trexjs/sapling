import { useNavigate } from 'react-router-dom';

import { CourseBasicForm } from '../components/forms/CourseBasicForm.jsx';
import { useLms } from '../context/LmsContext.jsx';

export default function CourseCreatePage() {
  const navigate = useNavigate();
  const { createCourse } = useLms();

  const handleCreate = async (payload) => {
    const created = await createCourse(payload);
    navigate(`/courses/${created._id}`);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Create Course</h1>
        <p className="text-sm text-slate-600">Configure course details, pricing, and initial publish status.</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <CourseBasicForm onSubmit={handleCreate} submitLabel="Create course" />
      </div>
    </div>
  );
}
