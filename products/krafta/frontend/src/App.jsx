import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BuilderProvider, useBuilder } from './builder/BuilderContext';
import { ComponentRenderer } from './builder/ComponentRenderer';

const modes = [
  { id: 'mobile', label: 'Mobile', width: 375 },
  { id: 'tablet', label: 'Tablet', width: 768 },
  { id: 'desktop', label: 'Desktop', width: '100%' },
];

const componentTemplates = [
  {
    title: 'Typography',
    items: [
      { name: 'Heading', icon: '📝', type: 'Text', props: { text: 'Beautiful headline', fontSize: 32 } },
      { name: 'Paragraph', icon: '📄', type: 'Text', props: { text: 'A paragraph for readable content', fontSize: 18 } },
    ],
  },
  {
    title: 'Media',
    items: [
      { name: 'Image', icon: '🖼️', type: 'Image', props: {} },
    ],
  },
  {
    title: 'Forms',
    items: [
      { name: 'Text Input', icon: '✏️', type: 'Input', props: { type: 'text', placeholder: 'Enter text...', label: 'Input Field' } },
      { name: 'Email Input', icon: '📧', type: 'Input', props: { type: 'email', placeholder: 'your@email.com', label: 'Email' } },
    ],
  },
  {
    title: 'Actions',
    items: [
      { name: 'Primary Button', icon: '🔘', type: 'Button', props: { text: 'Primary Action' } },
      { name: 'Secondary Button', icon: '⚪', type: 'Button', props: { text: 'Secondary Action', backgroundColor: '#f97316' } },
    ],
  },
  {
    title: 'Layout',
    items: [
      { name: 'Container', icon: '📦', type: 'Container', props: { padding: 32 } },
      { name: 'Grid 2 Columns', icon: '🔲', type: 'Grid', props: { columns: 2, gap: 16 } },
    ],
  },
];

function TopBar({ previewMode, setPreviewMode, onSave, onLoad }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-content-center text-xl font-semibold">
          WB
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">Website Builder Studio</p>
          <p className="text-xs text-gray-500">Drag and drop components to craft responsive pages</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setPreviewMode(mode.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                previewMode === mode.id
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <button
          onClick={onSave}
          className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          <span>💾 Save draft</span>
        </button>
        <button
          onClick={onLoad}
          className="inline-flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-indigo-300 hover:text-indigo-500"
        >
          <span>📂 Load</span>
        </button>
      </div>
    </header>
  );
}

function ComponentPalette() {
  const { addComponent } = useBuilder();

  const handleAddComponent = (type, props) => {
    addComponent(type, props, 'root');
  };

  return (
    <div className="space-y-6">
      {componentTemplates.map((group) => (
        <div key={group.title}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            {group.title}
          </h3>
          <div className="space-y-2">
            {group.items.map((item) => (
              <div
                key={item.name}
                onClick={() => handleAddComponent(item.type, item.props)}
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">{item.name}</p>
                    <p className="text-xs text-gray-500">Click to add</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CanvasShell({ previewMode }) {
  const { components } = useBuilder();
  const modeConfig = modes.find((mode) => mode.id === previewMode);
  const width = modeConfig?.width || '100%';
  const maxWidth = previewMode === 'desktop' ? '1400px' : width;

  const rootComponent = components[0];

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-start overflow-auto p-8">
      <div
        style={{ width: previewMode === 'desktop' ? '100%' : width, maxWidth }}
        className="w-full min-h-[700px] rounded-2xl border-2 border-gray-300 bg-white shadow-2xl overflow-hidden"
      >
        {rootComponent && <ComponentRenderer component={rootComponent} isRoot />}
      </div>
    </div>
  );
}

function SelectedSettings() {
  const { selectedId, findComponent, updateComponent, deleteComponent } = useBuilder();
  const selectedNode = selectedId ? findComponent(selectedId) : null;

  if (!selectedNode || selectedNode.id === 'root') {
    return (
      <div className="h-full grid place-content-center text-center text-sm text-gray-500 px-4">
        <div className="space-y-2">
          <p className="font-medium text-gray-600">Select a component to edit</p>
          <p>Adjust typography, colors, spacing, and responsive styles.</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (propKey, value) => {
    updateComponent(selectedId, { [propKey]: value });
  };

  const renderControls = () => {
    const type = selectedNode.type;

    if (type === 'Text') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Content</label>
            <textarea
              value={selectedNode.props.text || ''}
              onChange={(e) => handlePropChange('text', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Font Size</label>
            <input
              type="number"
              value={selectedNode.props.fontSize || 18}
              onChange={(e) => handlePropChange('fontSize', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      );
    }

    if (type === 'Button') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Label</label>
            <input
              value={selectedNode.props.text || ''}
              onChange={(e) => handlePropChange('text', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Background</label>
              <input
                type="color"
                value={selectedNode.props.backgroundColor || '#3b82f6'}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Text Color</label>
              <input
                type="color"
                value={selectedNode.props.color || '#ffffff'}
                onChange={(e) => handlePropChange('color', e.target.value)}
                className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      );
    }

    if (type === 'Container') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Padding</label>
            <input
              type="number"
              value={selectedNode.props.padding || 20}
              onChange={(e) => handlePropChange('padding', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Background</label>
            <input
              value={selectedNode.props.background || '#ffffff'}
              onChange={(e) => handlePropChange('background', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <p className="mt-1 text-xs text-gray-500">Supports gradients and image URLs.</p>
          </div>
        </div>
      );
    }

    if (type === 'Image') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Image URL</label>
            <input
              value={selectedNode.props.src || ''}
              onChange={(e) => handlePropChange('src', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Alt Text</label>
            <input
              value={selectedNode.props.alt || ''}
              onChange={(e) => handlePropChange('alt', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Width (px)</label>
              <input
                type="number"
                value={selectedNode.props.width || 400}
                onChange={(e) => handlePropChange('width', Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Height (px)</label>
              <input
                type="number"
                value={selectedNode.props.height || 300}
                onChange={(e) => handlePropChange('height', Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>
      );
    }

    if (type === 'Input') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Label</label>
            <input
              value={selectedNode.props.label || ''}
              onChange={(e) => handlePropChange('label', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Placeholder</label>
            <input
              value={selectedNode.props.placeholder || ''}
              onChange={(e) => handlePropChange('placeholder', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Input Type</label>
            <select
              value={selectedNode.props.type || 'text'}
              onChange={(e) => handlePropChange('type', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
              <option value="tel">Phone</option>
            </select>
          </div>
        </div>
      );
    }

    if (type === 'Grid') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Columns</label>
            <input
              type="number"
              min="1"
              max="6"
              value={selectedNode.props.columns || 2}
              onChange={(e) => handlePropChange('columns', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Gap (px)</label>
            <input
              type="number"
              value={selectedNode.props.gap || 16}
              onChange={(e) => handlePropChange('gap', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Editing</p>
        <p className="text-lg font-semibold text-indigo-700">{selectedNode.type}</p>
        <p className="text-xs text-indigo-500 mt-1">Fine-tune copy, colors, and layout.</p>
      </div>
      {renderControls()}
      <div className="mt-8 space-y-3">
        <button
          onClick={() => deleteComponent(selectedId)}
          className="w-full rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          🗑️ Delete component
        </button>
      </div>
    </div>
  );
}

function EditorUI({ previewMode, setPreviewMode }) {
  const { components, setComponents } = useBuilder();

  const handleSave = () => {
    const json = JSON.stringify(components, null, 2);
    localStorage.setItem('website-builder-v2', json);
    alert('✅ Project saved successfully!');
  };

  const handleLoad = () => {
    const json = localStorage.getItem('website-builder-v2');
    if (json) {
      setComponents(JSON.parse(json));
      alert('✅ Project loaded!');
    } else {
      alert('⚠️ No saved project found.');
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onSave={handleSave}
        onLoad={handleLoad}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-gray-200 bg-white px-4 py-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Components</h2>
            <p className="text-xs text-gray-400 mt-1">Click to add elements.</p>
          </div>
          <ComponentPalette />
        </aside>

        <CanvasShell previewMode={previewMode} />

        <aside className="w-80 border-l border-gray-200 bg-white">
          <SelectedSettings />
        </aside>
      </div>
    </div>
  );
}

function App() {
  const [previewMode, setPreviewMode] = useState('desktop');

  return (
    <DndProvider backend={HTML5Backend}>
      <BuilderProvider>
        <div className="h-screen flex flex-col bg-gray-100">
          <EditorUI previewMode={previewMode} setPreviewMode={setPreviewMode} />
        </div>
      </BuilderProvider>
    </DndProvider>
  );
}

export default App;
