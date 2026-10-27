import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outlined", "text"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    fullWidth: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Outlined: Story = {
  args: {
    children: "Outlined Button",
    variant: "outlined",
  },
};

export const Text: Story = {
  args: {
    children: "Text Button",
    variant: "text",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "small",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "large",
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading Button",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};
