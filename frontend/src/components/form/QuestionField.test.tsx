import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuestionField } from "./QuestionField";

describe("QuestionField", () => {
  it("passes the chosen option to onSubmit", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(<QuestionField type="multiple_choice" options={["Red", "Blue"]} value={null} onChange={onChange} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: /Blue/ }));
    expect(onChange).toHaveBeenCalledWith("Blue");
    expect(onSubmit).toHaveBeenCalledWith("Blue");
  });

  it("renders yes/no with Y and N hotkeys and marks the selection", () => {
    render(<QuestionField type="yes_no" options={[]} value="No" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /Y\s*Yes/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /N\s*No/ })).toBeInTheDocument();
  });

  it("renders five stars and submits the clicked rating", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<QuestionField type="rating" options={[]} value={null} onChange={() => {}} onSubmit={onSubmit} />);
    expect(screen.getAllByRole("button", { name: /star/ })).toHaveLength(5);
    await user.click(screen.getByRole("button", { name: "4 star" }));
    expect(onSubmit).toHaveBeenCalledWith(4);
  });

  it("filters dropdown options as you type", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuestionField type="dropdown" options={["Small", "Medium", "Large"]} value="la" onChange={onChange} />);
    await user.click(screen.getByPlaceholderText("Type or select an option"));
    expect(screen.getByRole("button", { name: "Large" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Small" })).not.toBeInTheDocument();
  });

  it("submits long text on Enter but not Shift+Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<QuestionField type="long_text" options={[]} value="" onChange={() => {}} onSubmit={onSubmit} />);
    const field = screen.getByPlaceholderText("Type your answer here...");
    await user.type(field, "{Shift>}{Enter}{/Shift}");
    expect(onSubmit).not.toHaveBeenCalled();
    await user.type(field, "{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
