import "../styles/filterbuttons.css";

function FilterButtons({
  filter,
  setFilter
}) {

  return (

    <div className="filter-buttons">

      <button
        className={
          filter === "all"
            ? "active-filter"
            : ""
        }
        onClick={() => setFilter("all")}
      >
        All
      </button>

      <button
        className={
          filter === "completed"
            ? "active-filter"
            : ""
        }
        onClick={() => setFilter("completed")}
      >
        Completed
      </button>

      <button
        className={
          filter === "pending"
            ? "active-filter"
            : ""
        }
        onClick={() => setFilter("pending")}
      >
        Pending
      </button>

    </div>
  );
}

export default FilterButtons;