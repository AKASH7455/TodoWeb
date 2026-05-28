import { useState } from "react";
import "../styles/todoform.css";

function TodoForm({ addTodo }) {

  const [input, setInput] = useState("");

  function handleChange(event) {

    setInput(event.target.value);

  }

  function handleSubmit(event) {

    event.preventDefault();

    if(input.trim() === "") return;

    addTodo(input);

    setInput("");

  }

  return (

    <form className="todo-form" onSubmit={handleSubmit}>

      <input
        className="todo-input"
        type="text"
        placeholder="Enter todo..."
        value={input}
        onChange={handleChange}
      />

      <button className="add-btn" type="submit">
        Add
      </button>

    </form>

  );
}

export default TodoForm;