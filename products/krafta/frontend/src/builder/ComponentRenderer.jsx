import { useDrag, useDrop } from 'react-dnd';
import { useBuilder } from './BuilderContext';
import { Text, Button, Container, Image, Input, Grid } from '../components';

const COMPONENT_MAP = {
  Text,
  Button,
  Container,
  Image,
  Input,
  Grid,
};

export const ComponentRenderer = ({ component, isRoot = false }) => {
  const { selectedId, setSelectedId, moveComponent } = useBuilder();
  const Component = COMPONENT_MAP[component.type];

  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { id: component.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isRoot,
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      if (item.id !== component.id && !monitor.didDrop()) {
        moveComponent(item.id, component.id, 'inside');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    canDrop: () => component.children !== undefined,
  });

  const isSelected = selectedId === component.id;

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedId(component.id);
  };

  if (!Component) return null;

  const wrapperStyle = {
    position: 'relative',
    opacity: isDragging ? 0.5 : 1,
    outline: isSelected ? '2px solid #6366f1' : isOver ? '2px dashed #6366f1' : 'none',
    outlineOffset: '2px',
    cursor: isRoot ? 'default' : 'move',
  };

  return (
    <div
      ref={(node) => {
        if (!isRoot) {
          drag(drop(node));
        } else {
          drop(node);
        }
      }}
      style={wrapperStyle}
      onClick={handleClick}
    >
      <Component {...component.props}>
        {component.children?.map((child) => (
          <ComponentRenderer key={child.id} component={child} />
        ))}
      </Component>
    </div>
  );
};
