import { useState, useEffect } from "react";

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

    setTodos((prev) =>
      prev.filter(
        (todo) =>
          todo.id !== id
      )
    );

  }

  // TOGGLE TODO
  function toggleTodo(id) {

    setTodos((prev) =>
      prev.map((todo) =>

        todo.id === id
          ? {
              ...todo,
              completed:
                !todo.completed
            }
          : todo

      )
    );

  }

  // EDIT TODO
  function editTodo(
    id,
    newText
  ) {

    setTodos((prev) =>
      prev.map((todo) =>

        todo.id === id
          ? {
              ...todo,
              text: newText
            }
          : todo

      )
    );

  }

  // FILTER + SEARCH
  const filteredTodos =
    todos.filter((todo) => {

      const matchesFilter =

        filter === "all"

          ? true

          : filter ===
            "completed"

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

  // REQUEST NOTIFICATION
  useEffect(() => {

    if (
      "Notification" in
      window
    ) {

      Notification
        .requestPermission();

    }

  }, []);

  // REMINDER CHECK
  useEffect(() => {

    const interval =
      setInterval(() => {

        const currentTime =
          Date.now();

        setTodos((prevTodos) => {

          let changed =
            false;

          const updatedTodos =
            prevTodos.map(
              (todo) => {

                if (
                  todo.reminder &&
                  !todo.notified &&
                  currentTime >=
                  new Date(
                    todo.reminder
                  ).getTime()
                ) {

                  changed =
                    true;

                  if (
                    "Notification" in
                      window &&
                    Notification.permission ===
                      "granted"
                  ) {

                    new Notification(
                      "Todo Reminder",
                      {
                        body:
                          todo.text
                      }
                    );

                  }

                  return {

                    ...todo,

                    notified:
                      true

                  };

                }

                return todo;

              }
            );

          return changed
            ? updatedTodos
            : prevTodos;

        });

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [setTodos]);

  return (

    <div>

      <Navbar
        search={search}
        setSearch={setSearch}
      />

      <div className="container">

        <TodoForm
          addTodo={addTodo}
        />

        <FilterButtons
          filter={filter}
          setFilter={
            setFilter
          }
        />

        {
          filteredTodos.length === 0

            ? (
              <EmptyState />
            )

            : (

              filteredTodos.map(
                (
                  todo,
                  index
                ) => (

                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    number={
                      index + 1
                    }
                    deleteTodo={
                      deleteTodo
                    }
                    toggleTodo={
                      toggleTodo
                    }
                    editTodo={
                      editTodo
                    }
                  />

                )
              )

            )
        }

      </div>

    </div>

  );

}

export default App;