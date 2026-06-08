import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TodoCard from "./components/TodoCard";
import FilterButtons from "./components/FilterButtons";
import EmptyState from "./components/EmptyState";

import "./styles/main.css";

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function App() {

  // FILTER STATE
  const [filter, setFilter] =
    useState("all");

  // SEARCH STATE
  const [search, setSearch] =
    useState("");

  // TODOS STATE
  const [todos, setTodos] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadTodos() {

      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest(
          "/api/todos"
        );

        setTodos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }

    }

    loadTodos();

  }, []);

  // REQUEST NOTIFICATION
  async function requestNotificationPermission() {

    if (
      !("Notification" in
        window)
    ) {
      return "unsupported";
    }

    if (
      Notification.permission ===
      "granted"
    ) {
      return "granted";
    }

    if (
      Notification.permission ===
      "denied"
    ) {
      return "denied";
    }

    return await Notification
      .requestPermission();

  }

  // SHOW REMINDER
  function showReminder(todo) {

    if (
      "Notification" in
        window &&
      Notification.permission ===
        "granted"
    ) {

      new Notification(
        "Todo Reminder",
        {
          body: todo.text,
          tag: `todo-${todo.id}`
        }
      );

      return;

    }

    if (
      document.visibilityState ===
      "visible"
    ) {
      alert(
        `Todo Reminder: ${todo.text}`
      );
    }

  }

  // ADD TODO
  async function addTodo(todoData) {

    if (todoData.reminder) {
      await requestNotificationPermission();
    }

    const todoPayload = {
      text: todoData.text,
      reminder: todoData.reminder
        ? new Date(
            todoData.reminder
          ).toISOString()
        : null
    };

    try {
      setError("");

      const newTodo = await apiRequest(
        "/api/todos",
        {
          method: "POST",
          body: JSON.stringify(todoPayload)
        }
      );

      setTodos((prev) => [
        newTodo,
        ...prev
      ]);
    } catch (error) {
      setError(error.message);
    }

  }

  // DELETE TODO
  async function deleteTodo(id) {

    try {
      setError("");

      await apiRequest(
        `/api/todos/${id}`,
        {
          method: "DELETE"
        }
      );

      setTodos((prev) =>
        prev.filter(
          (todo) =>
            todo.id !== id
        )
      );
    } catch (error) {
      setError(error.message);
    }

  }

  // TOGGLE TODO
  async function toggleTodo(id) {

    const todoToUpdate =
      todos.find(
        (todo) =>
          todo.id === id
      );

    if (!todoToUpdate) return;

    try {
      setError("");

      const updatedTodo = await apiRequest(
        `/api/todos/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            completed:
              !todoToUpdate.completed
          })
        }
      );

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? updatedTodo
            : todo
        )
      );
    } catch (error) {
      setError(error.message);
    }

  }

  // EDIT TODO
  async function editTodo(
    id,
    newText
  ) {

    try {
      setError("");

      const updatedTodo = await apiRequest(
        `/api/todos/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            text: newText
          })
        }
      );

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? updatedTodo
            : todo
        )
      );
    } catch (error) {
      setError(error.message);
    }

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

                  showReminder(todo);

                  apiRequest(
                    `/api/todos/${todo.id}`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({
                        notified: true
                      })
                    }
                  ).catch((error) =>
                    setError(
                      error.message
                    )
                  );

                  return {
                    ...todo,
                    notified: true
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

  }, []);

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
          error && (
            <p className="app-error">
              {error}
            </p>
          )
        }

        {
          isLoading

            ? (
              <p className="app-status">
                Loading todos...
              </p>
            )

            : filteredTodos.length === 0

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
