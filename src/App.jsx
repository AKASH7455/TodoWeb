import { useState, useEffect} from "react";

import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TodoCard from "./components/TodoCard";
import FilterButtons from "./components/FilterButtons";
import EmptyState from "./components/EmptyState";

import useLocalStorage from "./hooks/useLocalStorage";

import "./styles/main.css";


function App() {


  // FILTER STATE
  const [filter, setFilter] =
    useState("all");


  // SEARCH STATE
  const [search, setSearch] =
    useState("");

    const [showSearch, setShowSearch]
  = useState(false);

// TODOS STATE
const [todos, setTodos] =
  useLocalStorage(
    "todos",
    []
  );

  // ADD TODO
function addTodo(todoData) {

  const newTodo = {

    id: Date.now(),

    text: todoData.text,

    completed: false,

    reminder: todoData.reminder,

    notified: false

  };

  setTodos((prev) => [
    newTodo,
    ...prev
  ]);

}


  // DELETE TODO
  function deleteTodo(id) {

    const updatedTodos =
      todos.filter((todo) => {
        return todo.id !== id;
      });

    setTodos(updatedTodos);
  }


  // TOGGLE TODO
  function toggleTodo(id) {

    const updatedTodos =
      todos.map((todo) => {

        if (todo.id === id) {

          return {
            ...todo,
            completed: !todo.completed
          };
        }

        return todo;
      });

    setTodos(updatedTodos);
  }
  // EDIT TODO
function editTodo(id, newText) {

  const updatedTodos =
    todos.map((todo) => {

      if (todo.id === id) {

        return {
          ...todo,
          text: newText
        };
      }

      return todo;
    });

  setTodos(updatedTodos);
}


  // FILTER + SEARCH TODOS

const filteredTodos =
  todos.filter((todo) => {

    const matchesFilter =

      filter === "all"

        ? true

        : filter === "completed"

        ? todo.completed

        : !todo.completed;

    const matchesSearch =

      todo.text
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    return (
      matchesFilter &&
      matchesSearch
    );

  });

    // REMINDER NOTIFICATION

useEffect(() => {

  const interval = setInterval(() => {

    setTodos((prevTodos) => {

      return prevTodos.map((todo) => {

        if (
          todo.reminder &&
          !todo.notified &&
          Date.now() >=
          new Date(todo.reminder).getTime()
        ) {

          if (
            Notification.permission ===
            "granted"
          ) {

            new Notification(
              "Todo Reminder",
              {
                body: todo.text
              }
            );

          }

          return {
            ...todo,
            notified: true
          };

        }

        return todo;

      });

    });

  }, 1000);

  return () => {
    clearInterval(interval);
  };

}, [setTodos]);

useEffect(() => {

  if (
    Notification.permission !==
    "granted"
  ) {

    Notification.requestPermission();

  }

}, []);


  return (

    <div>

      <Navbar
  search={search}
  setSearch={setSearch}
/>

      <div className="container">

        <TodoForm addTodo={addTodo} />

        <FilterButtons
          filter={filter}
          setFilter={setFilter}
        />

        {
          filteredTodos.length === 0
            ? (
              <EmptyState />
            )
            : (
              filteredTodos.map((todo, index) => {

                return (

                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    number={index + 1}
                    deleteTodo={deleteTodo}
                    toggleTodo={toggleTodo}
                    editTodo={editTodo}
                  />

                );
              })
            )
        }

      </div>

    </div>
  );
}

export default App;