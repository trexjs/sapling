import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { XloxThemeProvider } from "../../theme/theme-provider";
import { Button } from "./Button";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<XloxThemeProvider>{component}</XloxThemeProvider>);
};

describe("Button", () => {
  it("renders children correctly", () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders different variants", () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>);
    expect(screen.getByText("Primary")).toBeInTheDocument();

    rerender(
      <XloxThemeProvider>
        <Button variant="secondary">Secondary</Button>
      </XloxThemeProvider>
    );
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("renders different sizes", () => {
    const { rerender } = renderWithTheme(<Button size="small">Small</Button>);
    expect(screen.getByText("Small")).toBeInTheDocument();

    rerender(
      <XloxThemeProvider>
        <Button size="large">Large</Button>
      </XloxThemeProvider>
    );
    expect(screen.getByText("Large")).toBeInTheDocument();
  });

  it("disables button when disabled prop is true", () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("shows loading state", () => {
    renderWithTheme(<Button loading>Loading</Button>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders full width button", () => {
    renderWithTheme(<Button fullWidth>Full Width</Button>);
    const button = screen.getByText("Full Width");
    expect(button).toBeInTheDocument();
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByText("Disabled"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button loading onClick={handleClick}>Loading</Button>);
    
    fireEvent.click(screen.getByText("Loading..."));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
