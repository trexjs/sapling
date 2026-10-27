import React, { useState } from "react";
import { XloxThemeProvider } from "../../src/theme/theme-provider";
import { ColorShowcase } from "../../src/components/ColorShowcase";
import { Typography } from "../../src/components/Typography";
import { Button } from "../../src/components/Button";
import { Stack } from "../../src/components/Stack";
import { Container } from "../../src/components/Container";
import { Navbar } from "../../src/components/Navbar";
import { Tabs, Tab } from "../../src/components/Tabs";
import { Card } from "../../src/components/Card";
import { Divider } from "../../src/components/Divider";
import { colors, type ColorName } from "../../src/theme/colors";
import { ComponentShowcase } from "./ComponentShowcase";
import { IconShowcase } from "./IconShowcase";
import { DevToolsShowcase } from "./DevToolsShowcase";
import styled from "@emotion/styled";
import ScrollToTop from "./components/ScrollToTop";

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const ContentArea = styled.div`
  padding: 32px 0;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const ColorCard = styled(Card)<{ color: string }>`
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 100%;
  height: 120px;
  background-color: ${(props) => props.color};
  border-radius: 8px 8px 0 0;
`;

const ColorInfo = styled.div`
  padding: 16px;
`;

const TypographyShowcase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TypographyExample = styled.div`
  padding: 24px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  position: relative;
`;

const CodeBlock = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 16px;
  position: relative;
`;

const CopyButton = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const colorFamilies: ColorName[] = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime",
  "green", "emerald", "teal", "cyan", "sky",
  "blue", "indigo", "violet", "purple", "fuchsia",
  "pink", "rose"
];

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorName | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderColorPalette = () => {
    if (selectedColor) {
      return (
        <div>
          <Stack direction="row" spacing={2} alignItems="center" style={{ marginBottom: 24 }}>
            <Button variant="outlined" onClick={() => setSelectedColor(null)}>
              ← Back to All Colors
            </Button>
            <Typography variant="h4" style={{ textTransform: "capitalize" }}>
              {selectedColor}
            </Typography>
          </Stack>
          <ColorShowcase colorName={selectedColor} />
        </div>
      );
    }

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Color Palette
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Click on any color family to see all shades
        </Typography>
        
        <ColorGrid>
          {colorFamilies.map((colorName) => (
            <ColorCard
              key={colorName}
              elevation={2}
              color={colors[colorName][500]}
              onClick={() => setSelectedColor(colorName)}
            >
              <ColorPreview color={colors[colorName][500]} />
              <ColorInfo>
                <Typography variant="subtitle1" style={{ textTransform: "capitalize" }}>
                  {colorName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {colors[colorName][500]}
                </Typography>
              </ColorInfo>
            </ColorCard>
          ))}
        </ColorGrid>
      </div>
    );
  };

  const renderTypography = () => {
    return (
      <TypographyShowcase>
        <div>
          <Typography variant="h3" gutterBottom>
            Typography System
          </Typography>
          <Typography variant="body1" color="textSecondary">
            A complete set of typography variants for all your text needs
          </Typography>
        </div>

        <Divider />

        <TypographyExample>
          <Typography variant="overline" color="textSecondary" gutterBottom>
            Headings
          </Typography>
          <Stack spacing={2}>
            <Typography variant="h1">Heading 1 - The quick brown fox</Typography>
            <Typography variant="h2">Heading 2 - The quick brown fox</Typography>
            <Typography variant="h3">Heading 3 - The quick brown fox</Typography>
            <Typography variant="h4">Heading 4 - The quick brown fox</Typography>
            <Typography variant="h5">Heading 5 - The quick brown fox</Typography>
            <Typography variant="h6">Heading 6 - The quick brown fox</Typography>
          </Stack>
          <CodeBlock>
            <CopyButton 
              size="small" 
              variant="outlined" 
              onClick={() => handleCopyCode(`<Typography variant="h1">Heading 1</Typography>\n<Typography variant="h2">Heading 2</Typography>\n<Typography variant="h3">Heading 3</Typography>\n<Typography variant="h4">Heading 4</Typography>\n<Typography variant="h5">Heading 5</Typography>\n<Typography variant="h6">Heading 6</Typography>`)}
            >
              {copiedCode?.includes('variant="h1"') ? "Copied!" : "Copy"}
            </CopyButton>
            <code>{`<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="h3">Heading 3</Typography>
<Typography variant="h4">Heading 4</Typography>
<Typography variant="h5">Heading 5</Typography>
<Typography variant="h6">Heading 6</Typography>`}</code>
          </CodeBlock>
        </TypographyExample>

        <TypographyExample>
          <Typography variant="overline" color="textSecondary" gutterBottom>
            Subtitles
          </Typography>
          <Stack spacing={2}>
            <Typography variant="subtitle1">
              Subtitle 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
            <Typography variant="subtitle2">
              Subtitle 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
          </Stack>
          <CodeBlock>
            <CopyButton 
              size="small" 
              variant="outlined" 
              onClick={() => handleCopyCode(`<Typography variant="subtitle1">Subtitle 1</Typography>\n<Typography variant="subtitle2">Subtitle 2</Typography>`)}
            >
              {copiedCode?.includes('variant="subtitle1"') ? "Copied!" : "Copy"}
            </CopyButton>
            <code>{`<Typography variant="subtitle1">Subtitle 1</Typography>
<Typography variant="subtitle2">Subtitle 2</Typography>`}</code>
          </CodeBlock>
        </TypographyExample>

        <TypographyExample>
          <Typography variant="overline" color="textSecondary" gutterBottom>
            Body Text
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body1">
              Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris.
            </Typography>
            <Typography variant="body2">
              Body 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris.
            </Typography>
          </Stack>
          <CodeBlock>
            <CopyButton 
              size="small" 
              variant="outlined" 
              onClick={() => handleCopyCode(`<Typography variant="body1">Body 1 text</Typography>\n<Typography variant="body2">Body 2 text</Typography>`)}
            >
              {copiedCode?.includes('variant="body1"') ? "Copied!" : "Copy"}
            </CopyButton>
            <code>{`<Typography variant="body1">Body 1 text</Typography>
<Typography variant="body2">Body 2 text</Typography>`}</code>
          </CodeBlock>
        </TypographyExample>

        <TypographyExample>
          <Typography variant="overline" color="textSecondary" gutterBottom>
            Small Text
          </Typography>
          <Stack spacing={2}>
            <Typography variant="caption">
              Caption - Small text for captions and helper text
            </Typography>
            <Typography variant="overline">
              Overline - All caps text for labels
            </Typography>
            <Typography variant="button">
              Button - Text style for buttons
            </Typography>
          </Stack>
          <CodeBlock>
            <CopyButton 
              size="small" 
              variant="outlined" 
              onClick={() => handleCopyCode(`<Typography variant="caption">Caption text</Typography>\n<Typography variant="overline">Overline text</Typography>\n<Typography variant="button">Button text</Typography>`)}
            >
              {copiedCode?.includes('variant="caption"') ? "Copied!" : "Copy"}
            </CopyButton>
            <code>{`<Typography variant="caption">Caption text</Typography>
<Typography variant="overline">Overline text</Typography>
<Typography variant="button">Button text</Typography>`}</code>
          </CodeBlock>
        </TypographyExample>

        <TypographyExample>
          <Typography variant="overline" color="textSecondary" gutterBottom>
            Text Colors
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body1" color="textPrimary">
              Primary text color
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Secondary text color
            </Typography>
            <Typography variant="body1" color="primary">
              Primary brand color
            </Typography>
            <Typography variant="body1" color="secondary">
              Secondary brand color
            </Typography>
            <Typography variant="body1" color="error">
              Error color
            </Typography>
          </Stack>
          <CodeBlock>
            <CopyButton 
              size="small" 
              variant="outlined" 
              onClick={() => handleCopyCode(`<Typography color="textPrimary">Primary text</Typography>\n<Typography color="textSecondary">Secondary text</Typography>\n<Typography color="primary">Primary brand</Typography>\n<Typography color="error">Error text</Typography>`)}
            >
              {copiedCode?.includes('color="textPrimary"') ? "Copied!" : "Copy"}
            </CopyButton>
            <code>{`<Typography color="textPrimary">Primary text</Typography>
<Typography color="textSecondary">Secondary text</Typography>
<Typography color="primary">Primary brand</Typography>
<Typography color="error">Error text</Typography>`}</code>
          </CodeBlock>
        </TypographyExample>

        <TypographyExample>
          <Typography variant="overline" color="textSecondary" gutterBottom>
            Text Alignment
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body1" align="left">
              Left aligned text (default)
            </Typography>
            <Typography variant="body1" align="center">
              Center aligned text
            </Typography>
            <Typography variant="body1" align="right">
              Right aligned text
            </Typography>
            <Typography variant="body1" align="justify">
              Justified text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Stack>
          <CodeBlock>
            <CopyButton 
              size="small" 
              variant="outlined" 
              onClick={() => handleCopyCode(`<Typography align="left">Left aligned</Typography>\n<Typography align="center">Center aligned</Typography>\n<Typography align="right">Right aligned</Typography>\n<Typography align="justify">Justified text</Typography>`)}
            >
              {copiedCode?.includes('align="left"') ? "Copied!" : "Copy"}
            </CopyButton>
            <code>{`<Typography align="left">Left aligned</Typography>
<Typography align="center">Center aligned</Typography>
<Typography align="right">Right aligned</Typography>
<Typography align="justify">Justified text</Typography>`}</code>
          </CodeBlock>
        </TypographyExample>

        <TypographyExample>
          <Typography variant="overline" color="textSecondary" gutterBottom>
            Text Wrapping
          </Typography>
          <Stack spacing={2}>
            <div style={{ maxWidth: 300 }}>
              <Typography variant="body1" noWrap>
                No wrap - This is a very long text that will be truncated with ellipsis when it exceeds the container width
              </Typography>
            </div>
            <div style={{ maxWidth: 300 }}>
              <Typography variant="body1">
                Normal wrap - This is a very long text that will wrap to multiple lines when it exceeds the container width
              </Typography>
            </div>
          </Stack>
          <CodeBlock>
            <CopyButton 
              size="small" 
              variant="outlined" 
              onClick={() => handleCopyCode(`<Typography noWrap>Text with no wrap (ellipsis)</Typography>\n<Typography>Normal wrapping text</Typography>`)}
            >
              {copiedCode?.includes('noWrap') ? "Copied!" : "Copy"}
            </CopyButton>
            <code>{`<Typography noWrap>Text with no wrap (ellipsis)</Typography>
<Typography>Normal wrapping text</Typography>`}</code>
          </CodeBlock>
        </TypographyExample>
      </TypographyShowcase>
    );
  };

  return (
    <XloxThemeProvider>
      <AppContainer>
        <Navbar position="sticky" color="primary">
          <Navbar.Brand>
            <Typography variant="h6" style={{ color: "white" }}>
              Xlox UI Showcase
            </Typography>
          </Navbar.Brand>
          <Navbar.Actions>
            <Button variant="text" style={{ color: "white" }}>
              Documentation
            </Button>
            <Button variant="text" style={{ color: "white" }}>
              GitHub
            </Button>
          </Navbar.Actions>
        </Navbar>

        <Container maxWidth="xl">
          <ContentArea>
            <Card elevation={0} style={{ marginBottom: 32 }}>
              <Stack spacing={2}>
                <Typography variant="h2">
                  Design System Showcase
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Explore our comprehensive color palette with 23 color families, complete typography system, 28 interactive components, and 50+ SVG icons
                </Typography>
              </Stack>
            </Card>

            <Tabs value={selectedTab} onChange={setSelectedTab}>
              <Tab label="Colors">
                <div style={{ marginTop: 24 }}>
                  {renderColorPalette()}
                </div>
              </Tab>
              <Tab label="Typography">
                <div style={{ marginTop: 24 }}>
                  {renderTypography()}
                </div>
              </Tab>
              <Tab label="Components">
                <div style={{ marginTop: 24 }}>
                  <ComponentShowcase />
                </div>
              </Tab>
              <Tab label="Icons">
                <div style={{ marginTop: 24 }}>
                  <IconShowcase />
                </div>
              </Tab>
              <Tab label="All Colors">
                <div style={{ marginTop: 24 }}>
                  <Typography variant="h4" gutterBottom>
                    Complete Color Palette
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    All 23 color families with 11 shades each (253 colors total)
                  </Typography>
                  <ColorShowcase showAllColors />
                </div>
              </Tab>
              <Tab label="DevTools">
                <div style={{ marginTop: 24 }}>
                  <DevToolsShowcase />
                </div>
              </Tab>
            </Tabs>
          </ContentArea>
          <ScrollToTop />
        </Container>
      </AppContainer>
    </XloxThemeProvider>
  );
}

export default App;
