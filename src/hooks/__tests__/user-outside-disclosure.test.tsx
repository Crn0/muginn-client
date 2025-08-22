import { useRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useDisclosureWithClickOutside } from "@/hooks/use-disclosure-click-outside";

function TestComponent() {
  const dialogRef = useRef(null);
  const { isOpen, open, close } = useDisclosureWithClickOutside(true, dialogRef, null);

  return (
    <div>
      <button type='button' onClick={open}>
        Open
      </button>
      <button type='button' onClick={close}>
        Close
      </button>

      {isOpen && (
        <div ref={dialogRef} data-testid='dialog'>
          Dialog is open
        </div>
      )}

      <div data-testid='outside'>Outside Area</div>
    </div>
  );
}

describe("useDisclosureWithClickOutside - integration", () => {
  it("should close the dialog when clicking outside", async () => {
    render(<TestComponent />);

    await userEvent.click(screen.getByText("Open"));

    expect(screen.queryByTestId("dialog")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("outside"));

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("should NOT close the dialog when clicking inside", async () => {
    render(<TestComponent />);

    await userEvent.click(screen.getByTestId("dialog"));

    expect(screen.queryByTestId("dialog")).toBeInTheDocument();
  });
});
