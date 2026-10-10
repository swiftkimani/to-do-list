import React, { useState } from "react";
import { MAX_TASK_LENGTH } from "../todos/todo-reducer";

export const TodoForm = ({ addTodo }) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const task = value.trim();
        if (!task) {
            setError("Type a task before adding it.");
            return;
        }
        addTodo(task);
        setValue("");
        setError("");
    };

    const handleChange = (e) => {
        setValue(e.target.value);
        setError("");
    };

    return (
        <form className="TodoForm" onSubmit={handleSubmit} noValidate>
            <label className="todo-label" htmlFor="new-task">
                New task
            </label>
            <div className="todo-form-row">
                <input
                    id="new-task"
                    type="text"
                    className="todo-input"
                    value={value}
                    maxLength={MAX_TASK_LENGTH}
                    autoComplete="off"
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={error ? "new-task-error" : undefined}
                    onChange={handleChange}
                />
                <button type="submit" className="todo-btn">
                    Add task
                </button>
            </div>
            {error && (
                <p id="new-task-error" className="todo-error" role="alert">
                    {error}
                </p>
            )}
        </form>
    );
};
