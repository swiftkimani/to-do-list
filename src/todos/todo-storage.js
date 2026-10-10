// Versioned so a future change to the stored shape can migrate or ignore old data.
export const STORAGE_KEY = "to-do-list.todos.v1";

const isStoredTodo = (value) =>
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.task === "string" &&
    typeof value.completed === "boolean";

/**
 * Reads the saved tasks. Anything that is not a well-formed task is dropped,
 * because localStorage can be edited by hand or written by an older version.
 */
export const loadTodos = () => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
            return [];
        }
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed
            .filter(isStoredTodo)
            .map(({ id, task, completed }) => ({ id, task, completed }));
    } catch (error) {
        // Storage is blocked or the saved JSON is corrupt. Start with an empty
        // list; saveTodos reports whether saving works so the UI can say so.
        return [];
    }
};

/** Saves the tasks and returns whether the browser accepted the write. */
export const saveTodos = (todos) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        return true;
    } catch (error) {
        // Private browsing or a full quota. The caller tells the user.
        return false;
    }
};
