import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BuilderContext = createContext();

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return context;
};

export const BuilderProvider = ({ children }) => {
  const [components, setComponents] = useState([
    {
      id: 'root',
      type: 'Container',
      props: {
        background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
        padding: 40,
      },
      children: [],
    },
  ]);
  
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const findComponent = useCallback((id, items = components) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findComponent(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }, [components]);

  const addComponent = useCallback((type, props, parentId = 'root') => {
    const newComponent = {
      id: uuidv4(),
      type,
      props,
      children: type === 'Container' || type === 'Grid' ? [] : undefined,
    };

    setComponents((prev) => {
      const addToParent = (items) => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newComponent],
            };
          }
          if (item.children) {
            return { ...item, children: addToParent(item.children) };
          }
          return item;
        });
      };
      return addToParent(prev);
    });

    setSelectedId(newComponent.id);
    return newComponent.id;
  }, []);

  const updateComponent = useCallback((id, updates) => {
    setComponents((prev) => {
      const updateItem = (items) => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, props: { ...item.props, ...updates } };
          }
          if (item.children) {
            return { ...item, children: updateItem(item.children) };
          }
          return item;
        });
      };
      return updateItem(prev);
    });
  }, []);

  const deleteComponent = useCallback((id) => {
    setComponents((prev) => {
      const removeItem = (items) => {
        return items.filter((item) => {
          if (item.id === id) return false;
          if (item.children) {
            item.children = removeItem(item.children);
          }
          return true;
        });
      };
      return removeItem(prev);
    });
    setSelectedId(null);
  }, []);

  const moveComponent = useCallback((dragId, dropId, position = 'inside') => {
    setComponents((prev) => {
      let draggedItem = null;
      
      // Remove dragged item
      const removeItem = (items) => {
        return items.filter((item) => {
          if (item.id === dragId) {
            draggedItem = item;
            return false;
          }
          if (item.children) {
            item.children = removeItem(item.children);
          }
          return true;
        });
      };
      
      let newTree = removeItem([...prev]);
      
      if (!draggedItem) return prev;
      
      // Add to new position
      const addItem = (items) => {
        return items.map((item) => {
          if (item.id === dropId) {
            if (position === 'inside' && item.children !== undefined) {
              return { ...item, children: [...item.children, draggedItem] };
            }
          }
          if (item.children) {
            return { ...item, children: addItem(item.children) };
          }
          return item;
        });
      };
      
      return addItem(newTree);
    });
  }, []);

  const value = {
    components,
    selectedId,
    setSelectedId,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    findComponent,
    setComponents,
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
};
