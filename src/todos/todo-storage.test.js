import { STORAGE_KEY, loadTodos, saveTodos } from "./todo-storage";

const milk = { id: "a", task: "Buy milk", completed: true };

beforeEach(() => window.localStorage.clear());
afterEach(() => jest.restoreAllMocks());

test("loads an empty list when nothing has been saved", () => {
    expect(loadTodos()).toEqual([]);
});

test("loads what was saved", () => {
    expect(saveTodos([milk])).toBe(true);
    expect(loadTodos()).toEqual([milk]);
});

test("loads an empty list when the saved JSON is corrupt", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadTodos()).toEqual([]);
});

test("loads an empty list when the saved value is not a list", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos: [milk] }));
    expect(loadTodos()).toEqual([]);
});

test("drops malformed entries and unknown fields", () => {
    const stored = [
        { ...milk, isEditing: true },
        { id: 7, task: "numeric id", completed: false },
        { id: "c", task: "no completed flag" },
        null,
        "a string",
    ];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    expect(loadTodos()).toEqual([milk]);
});

test("reports a failed save when the browser refuses the write", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
    });
    expect(saveTodos([milk])).toBe(false);
});

test("loads an empty list when reading storage is blocked", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
    });
    expect(loadTodos()).toEqual([]);
});
