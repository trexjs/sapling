import type { Preview } from "@storybook/react";
import React from "react";
import { XloxThemeProvider } from "../src/theme/theme-provider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <XloxThemeProvider>
        <Story />
      </XloxThemeProvider>
    ),
  ],
};

export default preview;
