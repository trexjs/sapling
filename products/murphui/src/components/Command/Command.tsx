import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  keywords?: string[];
}

export interface CommandProps {
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

const CommandContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  background-color: ${(props) => (props.theme as XloxTheme).colors.background.paper};
  border: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  border-radius: ${(props) => `${(props.theme as XloxTheme).shape.borderRadius}px`};
  box-shadow: ${(props) => (props.theme as XloxTheme).shadows[3]};
  overflow: hidden;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(2)} ${(props.theme as XloxTheme).spacing(2)}`};
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body1.fontSize};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
  outline: none;
  
  &::placeholder {
    color: ${(props) => (props.theme as XloxTheme).colors.text.disabled};
  }
`;

const CommandList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1)} 0`};
`;

const CommandItemStyled = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.theme as XloxTheme).spacing(1.5)};
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1.5)} ${(props.theme as XloxTheme).spacing(2)}`};
  cursor: pointer;
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
  background-color: ${(props) => {
    if (props.selected) {
      return (props.theme as XloxTheme).colors.primary[50];
    }
    return "transparent";
  }};
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[50]};
  }
`;

const EmptyMessage = styled.div`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(4)} ${(props.theme as XloxTheme).spacing(2)}`};
  text-align: center;
  color: ${(props) => (props.theme as XloxTheme).colors.text.secondary};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
`;

export const Command: React.FC<CommandProps> = ({
  items,
  placeholder = "Type a command or search...",
  emptyMessage = "No results found.",
  ...props
}) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const filteredItems = items.filter((item) => {
    const searchLower = search.toLowerCase();
    const labelMatch = item.label.toLowerCase().includes(searchLower);
    const keywordMatch = item.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(searchLower)
    );
    return labelMatch || keywordMatch;
  });
  
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredItems, selectedIndex]);
  
  return (
    <CommandContainer {...props}>
      <SearchInput
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
      <CommandList>
        {filteredItems.length === 0 ? (
          <EmptyMessage>{emptyMessage}</EmptyMessage>
        ) : (
          filteredItems.map((item, index) => (
            <CommandItemStyled
              key={item.id}
              selected={index === selectedIndex}
              onClick={item.onSelect}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </CommandItemStyled>
          ))
        )}
      </CommandList>
    </CommandContainer>
  );
};

Command.displayName = "Command";
