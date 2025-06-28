import { useState, useRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useClickOutside from "../use-click-outside";

function TestComponent() {
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef();

  useClickOutside(ref, null, isOpen, () => setIsOpen(false));

  return (
    <>
      {isOpen && (
        <div ref={ref} data-testid='dialog'>
          Dialog is open
        </div>
      )}

      <div data-testid='outside'>Outside Area</div>
    </>
  );
}

describe("useClickOutside hook", () => {
  it("should close the dialog when clicking outside", async () => {
    render(<TestComponent />);

    const dialog = screen.queryByTestId("dialog");

    await userEvent.click(dialog);

    expect(dialog).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("outside"));

    expect(dialog).not.toBeInTheDocument();
  });

  it("should NOT close the dialog when clicking inside", async () => {
    render(<TestComponent />);

    const dialog = screen.getByTestId("dialog");

    await userEvent.click(dialog);

    expect(dialog).toBeInTheDocument();
  });
});
