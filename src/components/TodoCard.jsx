import { useState } from "react";

import "../styles/todocard.css";

import {
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaEdit,
  FaCheck,
  FaUndo,
  FaSave
} from "react-icons/fa";

function TodoCard({
  todo,
  number,
  deleteTodo,
  toggleTodo,
  editTodo
}) {

  // EDIT MODE
  const [isEditing, setIsEditing] =
    useState(false);

  // INPUT STATE
  const [editText, setEditText] =
    useState(todo.text);



  // SAVE EDIT
  function handleSave() {

    if(editText.trim() === "") {
      return;
    }

    editTodo(todo.id, editText);

    setIsEditing(false);
  }



  return (

    <div className="todo-card">

      {/* LEFT SIDE */}
      <div className="todo-left">

        {
          isEditing ? (

            <input
              type="text"
              value={editText}
              onChange={(e) =>
                setEditText(e.target.value)
              }
              className="edit-input"
            />

          ) : (

            <h2
              className={
                todo.completed
                  ? "completed-text"
                  : ""
              }
            >
              {number}. {todo.text}
            </h2>

          )
        }



        <p>

          {
            todo.completed
              ? <FaCheckCircle />
              : <FaClock />
          }

          {
            todo.completed
              ? " Completed"
              : " Pending"
          }

        </p>

      </div>



      {/* BUTTONS */}
      <div className="todo-actions">

        {/* COMPLETE */}
        <button
          className="complete-btn"
          onClick={() =>
            toggleTodo(todo.id)
          }
        >

          {
            todo.completed
              ? <FaUndo />
              : <FaCheck />
          }

        </button>



        {/* EDIT / SAVE */}
        {
          isEditing ? (

            <button
              className="edit-btn"
              onClick={handleSave}
            >
              <FaSave />
            </button>

          ) : (

            <button
              className="edit-btn"
              onClick={() =>
                setIsEditing(true)
              }
            >
              <FaEdit />
            </button>

          )
        }



        {/* DELETE */}
        <button
          className="delete-btn"
          onClick={() =>
            deleteTodo(todo.id)
          }
        >
          <FaTrash />
        </button>

      </div>

    </div>
  );
}

export default TodoCard;