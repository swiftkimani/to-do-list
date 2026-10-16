// Longest task text the forms accept; keeps one row from swallowing the list.
export const MAX_TASK_LENGTH = 200;

// Pure state transitions for the task list. Ids are supplied by the caller so
// the reducer stays deterministic and testable.
export const todoReducer = (todos, action) => {
    switch (action.type) {
        case "added":
            return [...todos, { id: action.id, task: action.task, completed: false }];
        case "renamed":
            return todos.map((todo) =>
                todo.id === action.id ? { ...todo, task: action.task } : todo
            );
        case "toggled":
            return todos.map((todo) =>
                todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
            );
        case "deleted":
            return todos.filter((todo) => todo.id !== action.id);
        default:
            throw new Error(`Unknown todo action: ${action.type}`);
    }
};
