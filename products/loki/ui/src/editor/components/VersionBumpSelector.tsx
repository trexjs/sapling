import React from 'react';
import styled from 'styled-components';
import { VersionType } from '../types';

const SelectorContainer = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #555;
`;

const RadioInput = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

const VersionInfo = styled.div`
  margin-top: 8px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
`;

interface VersionBumpSelectorProps {
  currentVersion: string;
  selectedType: VersionType;
  onTypeChange: (type: VersionType) => void;
}

const VersionBumpSelector: React.FC<VersionBumpSelectorProps> = ({
  currentVersion,
  selectedType,
  onTypeChange,
}) => {
  const getNewVersion = (type: VersionType): string => {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    if (type === 'MAJOR') {
      return `${major + 1}.0.0`;
    } else {
      return `${major}.${minor + 1}.0`;
    }
  };

  const newVersion = getNewVersion(selectedType);

  return (
    <SelectorContainer>
      <Label>Version Bump Type</Label>
      <RadioGroup>
        <RadioOption>
          <RadioInput
            type="radio"
            name="versionType"
            value="MINOR"
            checked={selectedType === 'MINOR'}
            onChange={(e) => onTypeChange(e.target.value as VersionType)}
          />
          MINOR (0.0.0 → 0.1.0)
        </RadioOption>
        <RadioOption>
          <RadioInput
            type="radio"
            name="versionType"
            value="MAJOR"
            checked={selectedType === 'MAJOR'}
            onChange={(e) => onTypeChange(e.target.value as VersionType)}
          />
          MAJOR (0.0.0 → 1.0.0)
        </RadioOption>
      </RadioGroup>
      <VersionInfo>
        <strong>Current Version:</strong> {currentVersion} → <strong>New Version:</strong> {newVersion}
      </VersionInfo>
    </SelectorContainer>
  );
};

export default VersionBumpSelector;
