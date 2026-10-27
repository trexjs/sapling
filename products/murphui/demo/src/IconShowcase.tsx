import React, { useState, useMemo } from "react";
import styled from "@emotion/styled";
import { Typography } from "../../src/components/Typography";
import { Button } from "../../src/components/Button";
import { Stack } from "../../src/components/Stack";
import { Input } from "../../src/components/Input";
import { iconLibrary, type IconData } from "./icons";

const ShowcaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const IconCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #374151;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const IconName = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 8px;
  word-break: break-word;
`;

const CopyButton = styled(Button)`
  font-size: 11px;
  padding: 4px 8px;
`;

const CategorySection = styled.div`
  margin-bottom: 32px;
`;

const SearchBar = styled.div`
  margin-bottom: 24px;
  max-width: 500px;
`;

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export function IconShowcase() {
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyIcon = (name: string, svg: string) => {
    navigator.clipboard.writeText(svg);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return iconLibrary;
    const query = searchQuery.toLowerCase();
    return iconLibrary.filter(
      (icon) =>
        icon.name.toLowerCase().includes(query) ||
        icon.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group icons by category
  const iconsByCategory = useMemo(() => {
    const grouped: Record<string, IconData[]> = {};
    filteredIcons.forEach((icon) => {
      if (!grouped[icon.category]) {
        grouped[icon.category] = [];
      }
      grouped[icon.category].push(icon);
    });
    return grouped;
  }, [filteredIcons]);

  const categories = Object.keys(iconsByCategory).sort();
  const totalIcons = iconLibrary.length;

  return (
    <ShowcaseContainer>
      <div>
        <Typography variant="h3" gutterBottom>
          Icon Library
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {totalIcons} hand-crafted SVG icons organized into {Object.keys(iconsByCategory).length} categories
        </Typography>
      </div>

      <StatsBar>
        <StatItem>
          <StatValue>{totalIcons}</StatValue>
          <StatLabel>Total Icons</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{categories.length}</StatValue>
          <StatLabel>Categories</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{filteredIcons.length}</StatValue>
          <StatLabel>Showing</StatLabel>
        </StatItem>
      </StatsBar>

      <SearchBar>
        <Input
          placeholder="Search icons by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      {categories.map((category) => (
        <CategorySection key={category}>
          <Typography variant="h5" gutterBottom>
            {category} ({iconsByCategory[category].length})
          </Typography>
          <IconGrid>
            {iconsByCategory[category].map((icon) => (
              <IconCard key={icon.name}>
                <IconWrapper
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                />
                <IconName>{icon.name}</IconName>
                <CopyButton
                  size="small"
                  variant="outlined"
                  onClick={() => handleCopyIcon(icon.name, icon.svg)}
                >
                  {copiedIcon === icon.name ? "Copied!" : "Copy"}
                </CopyButton>
              </IconCard>
            ))}
          </IconGrid>
        </CategorySection>
      ))}

      {filteredIcons.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Typography variant="h6" color="textSecondary">
            No icons found matching "{searchQuery}"
          </Typography>
        </div>
      )}
    </ShowcaseContainer>
  );
}
