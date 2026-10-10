import React, { useState } from "react";
import { MAX_TASK_LENGTH } from "../todos/todo-reducer";

export const EditTodoForm = ({ task, saveTask, cancelEdit }) => {
    const [value, setValue] = useState(task.task);
    const [error, setError] = useState("");
    const errorId = `edit-error-${task.id}`;

    const handleSubmit = (e) => {
        e.preventDefault();

        const renamed = value.trim();
        if (!renamed) {
            setError("A task needs some text. Delete it instead if it is done with.");
            return;
        }
        saveTask(task.id, renamed);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            cancelEdit();
        }
    };

    return (
        <form className="TodoForm" onSubmit={handleSubmit} noValidate>
            <div className="todo-form-row">
                <input
                    type="text"
                    className="todo-input"
                    value={value}
                    maxLength={MAX_TASK_LENGTH}
                    autoComplete="off"
                    autoFocus
                    aria-label={`Rename task: ${task.task}`}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={error ? errorId : undefined}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setError("");
                    }}
                    onKeyDown={handleKeyDown}
                />
                <button type="submit" className="todo-btn">
                    Save
                </button>
                <button type="button" className="todo-btn todo-btn-quiet" onClick={cancelEdit}>
                    Cancel
                </button>
            </div>
            {error && (
                <p id={errorId} className="todo-error" role="alert">
                    {error}
                </p>
            )}
        </form>
    );
};
