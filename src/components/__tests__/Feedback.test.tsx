import { describe, expect, it } from "@/setupTests";
import { act, render, screen } from "@testing-library/react";
import { fail } from "assert";
import { Feedback } from "../FeedbackButton";

describe("Feedback", () => {
  it("can click on feedback button", () => {
    render(<Feedback tune={null} />);
    const feedbackButton = document.getElementById("feedback");
    if (feedbackButton) {
      expect(feedbackButton).toBeInTheDocument();
      act(() => {
        feedbackButton.click();
      });
      screen.findByText(/User Feedback/i);
      screen.findByText(/Your Email/i);
    } else fail("Feedback button not clickable");
  });
});
