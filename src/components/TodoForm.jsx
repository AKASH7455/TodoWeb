import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../styles/todoform.css";

function TodoForm({ addTodo }) {

  const [input, setInput] = useState("");
  const [reminder, setReminder] = useState(null);

  function handleChange(event) {

    setInput(event.target.value);

  }

  function capitalizeWords(text) {

    return (
      text.charAt(0).toUpperCase() +
      text.slice(1).toLowerCase()
    );

  }

  function handleSubmit(event) {

    event.preventDefault();

    if (input.trim() === "") return;

    addTodo({
      text: capitalizeWords(input),
      reminder
    });

    setInput("");
    setReminder(null);

  }

  return (

    <form
      className="todo-form"
      onSubmit={handleSubmit}
    >

      <input
        className="todo-input"
        type="text"
        placeholder="Enter todo..."
        value={input}
        onChange={handleChange}
      />

      <div className="reminder-field">

        <DatePicker
          selected={reminder}
          onChange={(date) =>
            setReminder(date)
          }
          showTimeSelect
          minDate={new Date()}
          timeIntervals={5}
          dateFormat="dd MMM yyyy, h:mm aa"
          placeholderText="Set reminder"
          className="reminder-input"
          calendarClassName="todo-calendar"
          popperClassName="todo-calendar-popper"
          popperPlacement="bottom-start"
          showPopperArrow={false}
          isClearable
        />

      </div>

      <button
        className="add-btn"
        type="submit"
      >
        Add
      </button>

    </form>

  );

}

export default TodoForm;
