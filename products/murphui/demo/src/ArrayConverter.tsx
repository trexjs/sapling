import { useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "../../src/components/Typography";
import { Card } from "../../src/components/Card";
import { Stack } from "../../src/components/Stack";
import { Textarea } from "../../src/components/Textarea";
import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { RadioGroup } from "../../src/components/RadioGroup";
import { Divider } from "../../src/components/Divider";

const ConverterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const TextInput = styled(Textarea)`
  font-family: 'Courier New', monospace;
  font-size: 14px;
  min-height: 300px;
`;

const CodeOutput = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 300px;
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const CopyButton = styled(Button)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const OutputContainer = styled.div`
  position: relative;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

type OutputFormat = 'javascript' | 'typescript' | 'json' | 'python' | 'php' | 'comma';
type QuoteStyle = 'single' | 'double' | 'none';

const sampleText = `Apple
Banana
Cherry
Date
Elderberry`;

export function ArrayConverter() {
  const [inputText, setInputText] = useState(sampleText);
  const [arrayName, setArrayName] = useState('myArray');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('javascript');
  const [quoteStyle, setQuoteStyle] = useState<QuoteStyle>('single');
  const [copied, setCopied] = useState(false);

  const convertToArray = (): string => {
    if (!inputText.trim()) {
      return '// Enter some text to convert';
    }

    // Split by newlines and filter empty lines
    const items = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (items.length === 0) {
      return '// No valid items to convert';
    }

    // Apply quote style
    const quote = quoteStyle === 'single' ? "'" : quoteStyle === 'double' ? '"' : '';
    const quotedItems = items.map(item => {
      if (quoteStyle === 'none') {
        return item;
      }
      // Escape quotes in the item
      const escaped = item.replace(new RegExp(quote, 'g'), '\\' + quote);
      return `${quote}${escaped}${quote}`;
    });

    switch (outputFormat) {
      case 'javascript':
        return `var ${arrayName} = [\n  ${quotedItems.join(',\n  ')}\n];`;
      
      case 'typescript':
        return `const ${arrayName}: string[] = [\n  ${quotedItems.join(',\n  ')}\n];`;
      
      case 'json':
        return JSON.stringify(items, null, 2);
      
      case 'python':
        return `${arrayName} = [\n    ${quotedItems.join(',\n    ')}\n]`;
      
      case 'php':
        return `$${arrayName} = array(\n    ${quotedItems.join(',\n    ')}\n);`;
      
      case 'comma':
        return quotedItems.join(', ');
      
      default:
        return '';
    }
  };

  const handleCopy = () => {
    const output = convertToArray();
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
  };

  const handleUseSample = () => {
    setInputText(sampleText);
  };

  const output = convertToArray();

  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h4">Array Converter</Typography>
        <Typography variant="body1" color="textSecondary">
          Instantly convert your text list to array format. Enter one item per line.
        </Typography>
      </Stack>

      <InfoBox>
        <strong>Tip:</strong> Enter one item per line. Empty lines will be ignored. Choose your output format and quote style below.
      </InfoBox>

      <ConverterContainer>
        <div>
          <Card elevation={2}>
            <Stack spacing={2}>
              <div>
                <Typography variant="h6" gutterBottom>
                  Input Text
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Enter your list (one item per line)
                </Typography>
              </div>

              <TextInput
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter items here, one per line..."
                rows={15}
              />

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" size="small" onClick={handleClear}>
                  Clear
                </Button>
                <Button variant="primary" size="small" onClick={handleUseSample}>
                  Use Sample
                </Button>
              </Stack>

              <Divider />

              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Array Name
                </Typography>
                <Input
                  value={arrayName}
                  onChange={(e) => setArrayName(e.target.value)}
                  placeholder="myArray"
                />
              </div>

              <OptionsGrid>
                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    Output Format
                  </Typography>
                  <RadioGroup
                    name="outputFormat"
                    value={outputFormat}
                    onChange={(value) => setOutputFormat(value as OutputFormat)}
                    options={[
                      { value: "javascript", label: "JavaScript (var)" },
                      { value: "typescript", label: "TypeScript (const)" },
                      { value: "json", label: "JSON" },
                      { value: "python", label: "Python" },
                      { value: "php", label: "PHP" },
                      { value: "comma", label: "Comma Delimited" },
                    ]}
                  />
                </div>

                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    Quote Style
                  </Typography>
                  <RadioGroup
                    name="quoteStyle"
                    value={quoteStyle}
                    onChange={(value) => setQuoteStyle(value as QuoteStyle)}
                    options={[
                      { value: "single", label: "Single Quotes (')" },
                      { value: "double", label: 'Double Quotes (")' },
                      { value: "none", label: "No Quotes" },
                    ]}
                  />
                </div>
              </OptionsGrid>
            </Stack>
          </Card>
        </div>

        <div>
          <Card elevation={2}>
            <Stack spacing={2}>
              <div>
                <Typography variant="h6" gutterBottom>
                  Output
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Generated array code
                </Typography>
              </div>

              <OutputContainer>
                <CopyButton
                  variant="outlined"
                  size="small"
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy"}
                </CopyButton>
                <CodeOutput>{output}</CodeOutput>
              </OutputContainer>

              <Divider />

              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Statistics
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Items:</strong> {inputText.split('\n').filter(line => line.trim().length > 0).length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Lines:</strong> {inputText.split('\n').length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Characters:</strong> {output.length}
                  </Typography>
                </Stack>
              </div>
            </Stack>
          </Card>
        </div>
      </ConverterContainer>

      <Card elevation={1} style={{ marginTop: 24, background: '#f9fafb' }}>
        <Stack spacing={2}>
          <Typography variant="h6">Examples</Typography>
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Input:
            </Typography>
            <CodeOutput style={{ minHeight: 'auto', background: '#1e293b' }}>
              {`Apple\nBanana\nCherry`}
            </CodeOutput>
          </div>
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Output (JavaScript):
            </Typography>
            <CodeOutput style={{ minHeight: 'auto', background: '#1e293b' }}>
              {`var myArray = [\n  'Apple',\n  'Banana',\n  'Cherry'\n];`}
            </CodeOutput>
          </div>
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Output (Comma Delimited):
            </Typography>
            <CodeOutput style={{ minHeight: 'auto', background: '#1e293b' }}>
              {'Apple, Banana, Cherry'}
            </CodeOutput>
          </div>
        </Stack>
      </Card>
    </div>
  );
}
