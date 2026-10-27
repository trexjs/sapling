import React, { useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "../../src/components/Typography";
import { Button } from "../../src/components/Button";
import { Stack } from "../../src/components/Stack";
import { Card } from "../../src/components/Card";
import { Input } from "../../src/components/Input";
import { Textarea } from "../../src/components/Textarea";
import { Select } from "../../src/components/Select";
import { Checkbox } from "../../src/components/Checkbox";
import { RadioGroup } from "../../src/components/RadioGroup";
import { Switch } from "../../src/components/Switch";
import { Slider } from "../../src/components/Slider";
import { Alert } from "../../src/components/Alert";
import { Modal } from "../../src/components/Modal";
import { Progress } from "../../src/components/Progress";
import { Spinner } from "../../src/components/Spinner";
import { Tooltip } from "../../src/components/Tooltip";
import { Badge } from "../../src/components/Badge";
import { Avatar } from "../../src/components/Avatar";
import { Tabs, Tab } from "../../src/components/Tabs";
import { Accordion } from "../../src/components/Accordion";
import { List, ListItem } from "../../src/components/List";
import { Table } from "../../src/components/Table";
import { Breadcrumb } from "../../src/components/Breadcrumb";
import { Tag } from "../../src/components/Tag";
import { Kbd } from "../../src/components/Kbd";
import { Rating } from "../../src/components/Rating";
import { Feedback } from "../../src/components/Feedback";
import { Navbar } from "../../src/components/Navbar";
import { Sidebar } from "../../src/components/Sidebar";
import { Drawer } from "../../src/components/Drawer";
import { AlertDialog } from "../../src/components/AlertDialog";
import { Separator } from "../../src/components/Separator";
import { Container } from "../../src/components/Container";
import { Box } from "../../src/components/Box";
import { Divider } from "../../src/components/Divider";

const ShowcaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ComponentCard = styled(Card)`
  padding: 24px;
`;

const ComponentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ComponentDemo = styled.div`
  padding: 24px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin: 16px 0;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
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

interface ComponentExampleProps {
  name: string;
  description: string;
  code: string;
  demo: React.ReactNode;
}

const ComponentExample: React.FC<ComponentExampleProps> = ({ name, description, code, demo }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ComponentCard elevation={2}>
      <ComponentHeader>
        <div>
          <Typography variant="h5">{name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </div>
      </ComponentHeader>
      
      <ComponentDemo>{demo}</ComponentDemo>
      
      <CodeBlock>
        <CopyButton size="small" variant="outlined" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </CopyButton>
        <code>{code}</code>
      </CodeBlock>
    </ComponentCard>
  );
};

export const ComponentShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const components: ComponentExampleProps[] = [
    {
      name: "Button",
      description: "Buttons with multiple variants and sizes",
      code: `<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>`,
      demo: (
        <Stack direction="row" spacing={2}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
        </Stack>
      ),
    },
    {
      name: "Input",
      description: "Text input with label, error, and helper text",
      code: `<Input 
  label="Email" 
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>`,
      demo: (
        <Input 
          label="Email" 
          placeholder="Enter your email"
          helperText="We'll never share your email"
          style={{ width: "300px" }}
        />
      ),
    },
    {
      name: "Select",
      description: "Dropdown select with options",
      code: `<Select
  label="Country"
  options={[
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" }
  ]}
/>`,
      demo: (
        <Select
          label="Country"
          options={[
            { value: "us", label: "United States" },
            { value: "uk", label: "United Kingdom" },
            { value: "ca", label: "Canada" }
          ]}
          style={{ width: "300px" }}
        />
      ),
    },
    {
      name: "Checkbox",
      description: "Checkbox with label",
      code: `<Checkbox label="Accept terms and conditions" />
<Checkbox label="Subscribe to newsletter" defaultChecked />`,
      demo: (
        <Stack spacing={2}>
          <Checkbox label="Accept terms and conditions" />
          <Checkbox label="Subscribe to newsletter" defaultChecked />
        </Stack>
      ),
    },
    {
      name: "Switch",
      description: "Toggle switch",
      code: `<Switch label="Enable notifications" />
<Switch label="Dark mode" defaultChecked />`,
      demo: (
        <Stack spacing={2}>
          <Switch label="Enable notifications" />
          <Switch label="Dark mode" defaultChecked />
        </Stack>
      ),
    },
    {
      name: "Radio Group",
      description: "Radio button group",
      code: `<RadioGroup
  name="plan"
  label="Select a plan"
  options={[
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "enterprise", label: "Enterprise" }
  ]}
/>`,
      demo: (
        <RadioGroup
          name="plan"
          label="Select a plan"
          options={[
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" },
            { value: "enterprise", label: "Enterprise" }
          ]}
        />
      ),
    },
    {
      name: "Slider",
      description: "Range slider with value display",
      code: `<Slider 
  label="Volume" 
  defaultValue={50} 
  showValue 
/>`,
      demo: (
        <Slider 
          label="Volume" 
          defaultValue={50} 
          showValue 
          style={{ width: "300px" }}
        />
      ),
    },
    {
      name: "Rating",
      description: "Star rating component",
      code: `<Rating defaultValue={3.5} precision={0.5} showValue />`,
      demo: <Rating defaultValue={3.5} precision={0.5} showValue />,
    },
    {
      name: "Feedback",
      description: "Thumbs up/down feedback",
      code: `<Feedback showLabels />`,
      demo: <Feedback showLabels />,
    },
    {
      name: "Alert",
      description: "Alert messages with severity levels",
      code: `<Alert severity="success">Operation completed successfully!</Alert>
<Alert severity="error">An error occurred</Alert>
<Alert severity="warning">Warning message</Alert>
<Alert severity="info">Information message</Alert>`,
      demo: (
        <Stack spacing={2} style={{ width: "100%" }}>
          <Alert severity="success">Operation completed successfully!</Alert>
          <Alert severity="error">An error occurred</Alert>
          <Alert severity="warning">Warning message</Alert>
          <Alert severity="info">Information message</Alert>
        </Stack>
      ),
    },
    {
      name: "Card",
      description: "Container with elevation",
      code: `<Card elevation={2} padding={3}>
  <Typography variant="h6">Card Title</Typography>
  <Typography variant="body2">Card content goes here</Typography>
</Card>`,
      demo: (
        <Card elevation={2} padding={3}>
          <Typography variant="h6">Card Title</Typography>
          <Typography variant="body2">Card content goes here</Typography>
        </Card>
      ),
    },
    {
      name: "Badge",
      description: "Notification badge",
      code: `<Badge badgeContent={5} color="primary">
  <Button variant="outlined">Messages</Button>
</Badge>`,
      demo: (
        <Badge badgeContent={5} color="primary">
          <Button variant="outlined">Messages</Button>
        </Badge>
      ),
    },
    {
      name: "Avatar",
      description: "User avatar",
      code: `<Avatar>JD</Avatar>
<Avatar size="large">AB</Avatar>`,
      demo: (
        <Stack direction="row" spacing={2}>
          <Avatar>JD</Avatar>
          <Avatar size="large">AB</Avatar>
        </Stack>
      ),
    },
    {
      name: "Tag",
      description: "Removable tags",
      code: `<Tag color="primary">React</Tag>
<Tag color="success">TypeScript</Tag>
<Tag color="warning" onRemove={() => {}}>Removable</Tag>`,
      demo: (
        <Stack direction="row" spacing={1}>
          <Tag color="primary">React</Tag>
          <Tag color="success">TypeScript</Tag>
          <Tag color="warning" onRemove={() => {}}>Removable</Tag>
        </Stack>
      ),
    },
    {
      name: "Kbd",
      description: "Keyboard key display",
      code: `<Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>`,
      demo: (
        <Stack direction="row" spacing={1} alignItems="center">
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>C</Kbd>
        </Stack>
      ),
    },
    {
      name: "Progress",
      description: "Progress bar",
      code: `<Progress value={75} />
<Progress variant="indeterminate" />`,
      demo: (
        <Stack spacing={2} style={{ width: "300px" }}>
          <Progress value={75} />
          <Progress variant="indeterminate" />
        </Stack>
      ),
    },
    {
      name: "Spinner",
      description: "Loading spinner",
      code: `<Spinner size="small" />
<Spinner size="medium" />
<Spinner size="large" />`,
      demo: (
        <Stack direction="row" spacing={2}>
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
        </Stack>
      ),
    },
    {
      name: "Tooltip",
      description: "Hover tooltip",
      code: `<Tooltip title="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`,
      demo: (
        <Tooltip title="This is a tooltip">
          <Button>Hover me</Button>
        </Tooltip>
      ),
    },
    {
      name: "Modal",
      description: "Dialog modal",
      code: `<Modal open={open} onClose={() => setOpen(false)} title="Modal Title">
  <Typography>Modal content goes here</Typography>
</Modal>`,
      demo: (
        <>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modal Title">
            <Typography>Modal content goes here</Typography>
            <Button onClick={() => setModalOpen(false)} style={{ marginTop: 16 }}>Close</Button>
          </Modal>
        </>
      ),
    },
    {
      name: "Drawer",
      description: "Slide-out drawer",
      code: `<Drawer open={open} onClose={() => setOpen(false)} anchor="left">
  <Typography>Drawer content</Typography>
</Drawer>`,
      demo: (
        <>
          <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left">
            <div style={{ padding: 24, width: 250 }}>
              <Typography variant="h6">Drawer Title</Typography>
              <Typography>Drawer content goes here</Typography>
              <Button onClick={() => setDrawerOpen(false)} style={{ marginTop: 16 }}>Close</Button>
            </div>
          </Drawer>
        </>
      ),
    },
    {
      name: "Alert Dialog",
      description: "Confirmation dialog",
      code: `<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={() => console.log('Confirmed')}
  title="Delete Item?"
  description="This action cannot be undone."
  severity="error"
/>`,
      demo: (
        <>
          <Button onClick={() => setAlertDialogOpen(true)} variant="outlined">
            Open Alert Dialog
          </Button>
          <AlertDialog
            open={alertDialogOpen}
            onClose={() => setAlertDialogOpen(false)}
            onConfirm={() => {
              console.log('Confirmed');
              setAlertDialogOpen(false);
            }}
            title="Delete Item?"
            description="This action cannot be undone."
            severity="error"
          />
        </>
      ),
    },
    {
      name: "Accordion",
      description: "Collapsible content",
      code: `<Accordion title="Section 1">
  <Typography>Content for section 1</Typography>
</Accordion>`,
      demo: (
        <div style={{ width: "100%" }}>
          <Accordion title="Section 1">
            <Typography>Content for section 1</Typography>
          </Accordion>
          <Accordion title="Section 2" defaultExpanded>
            <Typography>Content for section 2</Typography>
          </Accordion>
        </div>
      ),
    },
    {
      name: "Tabs",
      description: "Tab navigation",
      code: `<Tabs>
  <Tab label="Tab 1">Content 1</Tab>
  <Tab label="Tab 2">Content 2</Tab>
  <Tab label="Tab 3">Content 3</Tab>
</Tabs>`,
      demo: (
        <div style={{ width: "100%" }}>
          <Tabs>
            <Tab label="Tab 1">
              <Typography>Content for tab 1</Typography>
            </Tab>
            <Tab label="Tab 2">
              <Typography>Content for tab 2</Typography>
            </Tab>
            <Tab label="Tab 3">
              <Typography>Content for tab 3</Typography>
            </Tab>
          </Tabs>
        </div>
      ),
    },
    {
      name: "List",
      description: "List with items",
      code: `<List>
  <ListItem button>Item 1</ListItem>
  <ListItem button selected>Item 2</ListItem>
  <ListItem button>Item 3</ListItem>
</List>`,
      demo: (
        <div style={{ width: "100%" }}>
          <List>
            <ListItem button>Item 1</ListItem>
            <ListItem button selected>Item 2 (Selected)</ListItem>
            <ListItem button>Item 3</ListItem>
          </List>
        </div>
      ),
    },
    {
      name: "Table",
      description: "Data table",
      code: `<Table striped hoverable>
  <Table.Head>
    <Table.Row>
      <Table.Header>Name</Table.Header>
      <Table.Header>Email</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell>john@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`,
      demo: (
        <div style={{ width: "100%" }}>
          <Table striped hoverable>
            <Table.Head>
              <Table.Row>
                <Table.Header>Name</Table.Header>
                <Table.Header>Email</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>John Doe</Table.Cell>
                <Table.Cell>john@example.com</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Jane Smith</Table.Cell>
                <Table.Cell>jane@example.com</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      ),
    },
    {
      name: "Breadcrumb",
      description: "Navigation breadcrumbs",
      code: `<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Details" }
  ]}
/>`,
      demo: (
        <Breadcrumb
          items={[
            { label: "Home", onClick: () => {} },
            { label: "Products", onClick: () => {} },
            { label: "Details" }
          ]}
        />
      ),
    },
    {
      name: "Separator",
      description: "Visual separator",
      code: `<Separator />
<Separator orientation="vertical" />`,
      demo: (
        <Stack spacing={2} style={{ width: "100%" }}>
          <Separator />
          <Stack direction="row" spacing={2} style={{ height: 40 }}>
            <span>Left</span>
            <Separator orientation="vertical" />
            <span>Right</span>
          </Stack>
        </Stack>
      ),
    },
    {
      name: "Divider",
      description: "Content divider",
      code: `<Divider />
<Divider>OR</Divider>`,
      demo: (
        <Stack spacing={2} style={{ width: "100%" }}>
          <Divider />
          <Divider>OR</Divider>
        </Stack>
      ),
    },
    {
      name: "Navbar",
      description: "Navigation bar with branding and actions",
      code: `<Navbar position="sticky" color="primary">
  <Navbar.Brand>
    <Typography variant="h6" style={{ color: "white" }}>
      My App
    </Typography>
  </Navbar.Brand>
  <Navbar.Actions>
    <Button variant="text" style={{ color: "white" }}>
      Home
    </Button>
    <Button variant="text" style={{ color: "white" }}>
      About
    </Button>
    <Button variant="text" style={{ color: "white" }}>
      Contact
    </Button>
  </Navbar.Actions>
</Navbar>`,
      demo: (
        <div style={{ width: "100%", position: "relative" }}>
          <Navbar position="relative" color="primary">
            <Navbar.Brand>
              <Typography variant="h6" style={{ color: "white" }}>
                My App
              </Typography>
            </Navbar.Brand>
            <Navbar.Actions>
              <Button variant="text" style={{ color: "white" }}>
                Home
              </Button>
              <Button variant="text" style={{ color: "white" }}>
                About
              </Button>
              <Button variant="text" style={{ color: "white" }}>
                Contact
              </Button>
            </Navbar.Actions>
          </Navbar>
        </div>
      ),
    },
  ];

  return (
    <ShowcaseContainer>
      <Typography variant="h3" gutterBottom>
        Component Library
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        All {components.length} components with interactive examples and copy-to-clipboard code snippets
      </Typography>

      {components.map((component, index) => (
        <ComponentExample key={index} {...component} />
      ))}
    </ShowcaseContainer>
  );
};
