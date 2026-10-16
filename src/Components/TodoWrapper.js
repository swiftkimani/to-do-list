import React, { useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";
import { useTodos } from "../todos/use-todos";

const describeProgress = (todos) => {
    if (todos.length === 0) {
        return "No tasks yet. Add the first one above.";
    }
    const done = todos.filter((todo) => todo.completed).length;
    return `${done} of ${todos.length} done`;
};

export const TodoWrapper = () => {
    const { todos, isSaved, addTodo, renameTodo, toggleTodo, deleteTodo } = useTodos();
    // Which row is being edited is view state, so it is not saved with the tasks.
    const [editingId, setEditingId] = useState(null);
    const [lastEditedId, setLastEditedId] = useState(null);

    const closeEdit = () => {
        setLastEditedId(editingId);
        setEditingId(null);
    };

    const saveTask = (id, task) => {
        renameTodo(id, task);
        closeEdit();
    };

    return (
        <main className="TodoWrapper">
            <h1>Get things done</h1>
            <TodoForm addTodo={addTodo} />
            <p className="todo-status" aria-live="polite">
                {describeProgress(todos)}
            </p>
            {!isSaved && (
                <p className="todo-notice" role="status">
                    This browser is blocking storage, so these tasks will be gone when you
                    close the tab.
                </p>
            )}
            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.id === editingId ? (
                            <EditTodoForm task={todo} saveTask={saveTask} cancelEdit={closeEdit} />
                        ) : (
                            <Todo
                                task={todo}
                                deleteTodo={deleteTodo}
                                startEdit={setEditingId}
                                toggleComplete={toggleTodo}
                                shouldFocusEdit={todo.id === lastEditedId}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </main>
    );
};
