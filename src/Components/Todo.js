import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export const Todo = ({ task, deleteTodo, startEdit, toggleComplete, shouldFocusEdit }) => {
    const editButton = useRef(null);
    const checkboxId = `todo-${task.id}`;

    // Closing the edit form unmounts the focused input; hand focus back to the
    // button that opened it so keyboard users keep their place in the list.
    useEffect(() => {
        if (shouldFocusEdit) {
            editButton.current.focus();
        }
    }, [shouldFocusEdit]);

    return (
        <div className="Todo">
            <input
                id={checkboxId}
                type="checkbox"
                className="todo-checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
            />
            <label htmlFor={checkboxId} className={task.completed ? "todo-text completed" : "todo-text"}>
                {task.task}
            </label>
            <div className="todo-actions">
                <button
                    ref={editButton}
                    type="button"
                    className="todo-icon-btn"
                    aria-label={`Edit task: ${task.task}`}
                    onClick={() => startEdit(task.id)}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                    type="button"
                    className="todo-icon-btn"
                    aria-label={`Delete task: ${task.task}`}
                    onClick={() => deleteTodo(task.id)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};
