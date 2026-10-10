import { todoReducer } from "./todo-reducer";

const milk = { id: "a", task: "Buy milk", completed: false };
const mum = { id: "b", task: "Call mum", completed: false };

test("adds a task as not completed at the end of the list", () => {
    const next = todoReducer([milk], { type: "added", id: "b", task: "Call mum" });
    expect(next).toEqual([milk, mum]);
});

test("renames only the matching task", () => {
    const next = todoReducer([milk, mum], { type: "renamed", id: "a", task: "Buy oat milk" });
    expect(next).toEqual([{ ...milk, task: "Buy oat milk" }, mum]);
});

test("toggles a task to completed and back", () => {
    const done = todoReducer([milk], { type: "toggled", id: "a" });
    expect(done[0].completed).toBe(true);
    expect(todoReducer(done, { type: "toggled", id: "a" })[0].completed).toBe(false);
});

test("deletes only the matching task", () => {
    expect(todoReducer([milk, mum], { type: "deleted", id: "a" })).toEqual([mum]);
});

test("does not mutate the list it was given", () => {
    const todos = Object.freeze([Object.freeze({ ...milk })]);
    expect(() => todoReducer(todos, { type: "toggled", id: "a" })).not.toThrow();
});

test("rejects an unknown action", () => {
    expect(() => todoReducer([], { type: "archived" })).toThrow("Unknown todo action: archived");
});
