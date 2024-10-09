import React from "react";
import "./Todo.css";
import { useState, useRef, useEffect } from "react";
import { IoMdDoneAll } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

function Todo() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditID] = useState(0);
  const [limitMessage, setLimitMessage] = useState("");
  const [disableAllActions, setDisableAllActions] = useState(false);
  const MAX_TODOS = 5;

  
  const addTodo = () => {
    setLimitMessage("");

    const trimmedTodo = todo.trim();

    if (trimmedTodo === "") return;
    const todoPattern = new RegExp(`^${todo.trim()}$`, "i");
    const isDuplicate = todos.some((t) => todoPattern.test(t.list.trim()));

    if (isDuplicate) {
      setLimitMessage("Duplicate todo detected. Please add a unique todo.");
      return;
    }

    if (editId) {
      const updatedTodos = todos.map((to) =>
        to.id === editId ? { ...to, list: todo } : to
      );
      setTodos(updatedTodos);
      setEditID(0);
      setTodo("");
    } else {
      if (todos.length >= MAX_TODOS) {
        setLimitMessage(`You can't add more than ${MAX_TODOS} todos.`);
        return;
      }
      setTodos([{ list: todo, id: Date.now(), status: false }, ...todos]);
      setTodo("");
    }
  };

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  const onDelete = (id, status) => {
    if (status) {
      alert("This task is completed and cannot be deleted.");
      return;
    }

    if (disableAllActions) {
      alert("Actions are disabled for all items.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete?");
    if (confirm) {
      setTodos(todos.filter((to) => to.id !== id));
      setLimitMessage("");
    }
  };

  const onComplete = (id) => {
    const completedTodos = todos.map((to) =>
      to.id === id ? { ...to, status: !to.status } : to
    );
    setTodos(completedTodos);
  };

  const onEdit = (id, status) => {
    if (status) {
      alert("This task is completed and cannot be edited.");
      return;
    }

    if (disableAllActions) {
      alert("Actions are disabled for all items.");
      return;
    }

    const editTodo = todos.find((to) => to.id === id);
    setTodo(editTodo.list);
    setEditID(editTodo.id);
  };

  const disableActions = () => {
    setDisableAllActions(!disableAllActions);
  };

  return (
    <div className="container">
      <h2>Todo App</h2>
      <form className="form-group" onSubmit={handleSubmit}>
        <input
          type="text"
          ref={inputRef}
          value={todo}
          placeholder="Enter your Todo"
          className="form-control"
          onChange={(event) => setTodo(event.target.value)}
        />
        <button type="submit">{editId ? "EDIT" : "ADD"}</button>
      </form>
      <div className="list">
        {todos.map((to) => (
          <li key={to.id}>
            <div id={to.status ? "list-item" : ""}>{to.list}</div>
            <span>
              <IoMdDoneAll
                className="text-success mx-2 my-1"
                title="complete"
                onClick={() => onComplete(to.id)}
              />
              <FiEdit
                className={`text-warning mx-2 my-1 ${
                  to.status || disableAllActions ? "disabled" : ""
                }`}
                title="edit"
                onClick={() => onEdit(to.id, to.status)}
              />
              <MdDelete
                className={`text-danger mx-2 my-1 ${
                  to.status || disableAllActions ? "disabled" : ""
                }`}
                title="delete"
                onClick={() => onDelete(to.id, to.status)}
              />
            </span>
          </li>
        ))}
      </div>

      {limitMessage && <div className="text-danger mt-3">{limitMessage}</div>}

      <button className="disable-button mt-4" onClick={disableActions}>
        {disableAllActions ? "Enable Actions" : "Disable Actions for All Items"}
      </button>
    </div>
  );
}

export default Todo;
