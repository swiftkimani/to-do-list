import { render, screen, fireEvent } from "@testing-library/react";
import { TodoWrapper } from "./TodoWrapper";
import { STORAGE_KEY } from "../todos/todo-storage";

// React reports a missing list key through console.error; turn that one warning
// into a failure so the edit-form key regression cannot come back silently.
// Other console.error output (for example dependency deprecation notices) still prints.
const originalConsoleError = console.error;
beforeEach(() => {
    window.localStorage.clear();
    jest.spyOn(console, "error").mockImplementation((...args) => {
        const message = args.join(" ");
        if (message.includes('unique "key" prop')) {
            throw new Error(message);
        }
        originalConsoleError(...args);
    });
});
afterEach(() => jest.restoreAllMocks());

const addTask = (text) => {
    fireEvent.change(screen.getByLabelText("New task"), { target: { value: text } });
    fireEvent.click(screen.getByRole("button", { name: "Add task" }));
};

const startEditing = (text) =>
    fireEvent.click(screen.getByRole("button", { name: `Edit task: ${text}` }));

test("adds a task and shows it in the list", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).not.toBeChecked();
    expect(screen.getByLabelText("New task")).toHaveValue("");
});

test("trims surrounding spaces from a new task", () => {
    render(<TodoWrapper />);
    addTask("  Buy milk  ");
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).toBeInTheDocument();
});

test("refuses a blank task and says why", () => {
    render(<TodoWrapper />);
    addTask("   ");
    expect(screen.getByRole("alert")).toHaveTextContent("Type a task before adding it.");
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
});

test("toggling a task marks it completed", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    fireEvent.click(screen.getByRole("checkbox", { name: "Buy milk" }));
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).toBeChecked();
    expect(screen.getByText("Buy milk")).toHaveClass("completed");
});

test("counts how many tasks are done", () => {
    render(<TodoWrapper />);
    expect(screen.getByText("No tasks yet. Add the first one above.")).toBeInTheDocument();
    addTask("Buy milk");
    addTask("Call mum");
    fireEvent.click(screen.getByRole("checkbox", { name: "Buy milk" }));
    expect(screen.getByText("1 of 2 done")).toBeInTheDocument();
});

test("deleting a task removes it from the list", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    fireEvent.click(screen.getByRole("button", { name: "Delete task: Buy milk" }));
    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
});

test("editing a task replaces its text without a missing-key warning", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    addTask("Call mum");
    startEditing("Buy milk");
    fireEvent.change(screen.getByLabelText("Rename task: Buy milk"), {
        target: { value: "Buy oat milk" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("checkbox", { name: "Buy oat milk" })).toBeInTheDocument();
    expect(screen.queryByText("Buy milk")).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Call mum" })).toBeInTheDocument();
});

test("refuses to rename a task to nothing", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    startEditing("Buy milk");
    fireEvent.change(screen.getByLabelText("Rename task: Buy milk"), { target: { value: " " } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("alert")).toHaveTextContent("A task needs some text.");
});

test("cancelling an edit keeps the original text and returns focus to the edit button", () => {
    render(<TodoWrapper />);
    addTask("Buy milk");
    startEditing("Buy milk");
    const input = screen.getByLabelText("Rename task: Buy milk");
    fireEvent.change(input, { target: { value: "Something else" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit task: Buy milk" })).toHaveFocus();
});

test("keeps tasks after the page is reloaded", () => {
    const { unmount } = render(<TodoWrapper />);
    addTask("Buy milk");
    fireEvent.click(screen.getByRole("checkbox", { name: "Buy milk" }));
    unmount();

    render(<TodoWrapper />);
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).toBeChecked();
});

test("starts empty when the saved tasks are corrupt", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");
    render(<TodoWrapper />);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
});

test("warns that tasks will not be kept when the browser blocks storage", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("SecurityError");
    });
    render(<TodoWrapper />);
    expect(screen.getByRole("status")).toHaveTextContent("This browser is blocking storage");
});
