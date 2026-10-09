import { render, screen, fireEvent } from "@testing-library/react";
import { TodoWrapper } from "./TodoWrapper";

// React reports a missing list key through console.error; treat that as a failure
// so the edit-form key regression cannot come back silently.
let consoleError;
beforeEach(() => {
    consoleError = jest.spyOn(console, "error").mockImplementation((...args) => {
        throw new Error(args.join(" "));
    });
});
afterEach(() => consoleError.mockRestore());

const addTask = (text) => {
    fireEvent.change(screen.getByPlaceholderText("What is the task today?"), {
        target: { value: text },
    });
    fireEvent.click(screen.getByText("Add Task"));
};

test("adds a task and shows it in the list", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
});

test("toggling a task marks it completed", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    fireEvent.click(screen.getByText("Buy milk"));
    expect(screen.getByText("Buy milk")).toHaveClass("completed");
});

test("deleting a task removes it from the list", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    fireEvent.click(screen.getByText("Buy milk").parentElement.querySelector("svg.fa-trash"));
    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
});

test("editing a task replaces its text without a missing-key warning", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    addTask("Call mum");
    fireEvent.click(screen.getByText("Buy milk").parentElement.querySelector("svg.fa-pen-to-square"));
    fireEvent.change(screen.getByPlaceholderText("Update Task"), {
        target: { value: "Buy oat milk" },
    });
    fireEvent.click(screen.getByText("Update Tasks"));
    expect(screen.getByText("Buy oat milk")).toBeInTheDocument();
    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
    expect(screen.getByText("Call mum")).toBeInTheDocument();
});
