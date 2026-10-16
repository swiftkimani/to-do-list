import { useCallback, useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { todoReducer } from "./todo-reducer";
import { loadTodos, saveTodos } from "./todo-storage";

/** Owns the task list: loads it once, saves every change, exposes the actions. */
export const useTodos = () => {
    const [todos, dispatch] = useReducer(todoReducer, undefined, loadTodos);
    const [isSaved, setIsSaved] = useState(true);

    useEffect(() => {
        setIsSaved(saveTodos(todos));
    }, [todos]);

    const addTodo = useCallback(
        (task) => dispatch({ type: "added", id: uuidv4(), task }),
        []
    );
    const renameTodo = useCallback(
        (id, task) => dispatch({ type: "renamed", id, task }),
        []
    );
    const toggleTodo = useCallback((id) => dispatch({ type: "toggled", id }), []);
    const deleteTodo = useCallback((id) => dispatch({ type: "deleted", id }), []);

    return { todos, isSaved, addTodo, renameTodo, toggleTodo, deleteTodo };
};
