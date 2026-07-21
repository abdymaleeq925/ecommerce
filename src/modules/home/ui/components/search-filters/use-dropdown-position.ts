import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>,
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // Width of dropdown (w-60 = 15rem = 240px)

    // Calculate the initial position
    let viewportLeft = rect.left;

    // Check if dropdown would go off right edge of the viewport
    if (viewportLeft + dropdownWidth > window.innerWidth) {
      // Align to the right edge of button instead
      viewportLeft = rect.right - dropdownWidth;

      // If still off-screen, align to the rightedge of the viewport with some padding
      if (viewportLeft < 0) {
        viewportLeft = window.innerWidth - dropdownWidth - 16;
      }
    }

    // Ensure dropdown doesn't go off left edge
    if (viewportLeft < 0) {
      viewportLeft = 16;
    }

    return {
      top: rect.bottom + window.scrollY,
      left: viewportLeft + window.scrollX,
    };
  };
  return { getDropdownPosition };
};
