import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [tab, setTab] = useState("todo");
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [inputTask, setInputTask] = useState("");
  const [idIndex, setIdIndex] = useState(1);
  const [deleteModalId, setDeleteModalId] = useState(0);
  const [trashModalId, setTrashModalId] = useState(0);

  function addNewTask() {
    if (inputTask.length > 0) {
      const newTask = {
        id: idIndex,
        text: inputTask,
        isDone: false, // true
        isDeleted: false
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setIdIndex((prevIndex) => prevIndex + 1);
      setInputTask("");
    }
  }

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  function makeDone(id) {
    setTasks((prevTasks) => {
      const newList = prevTasks.map((task) => {
        if (task.id === id) {
          task.isDone = true;
        }
        return task;
      });
      return newList;
    });
  }

  function moveTodo(id) {
    setTasks((prevTasks) => {
      const newList = prevTasks.map((task) => {
        if (task.id === id) {
          task.isDone = false;
        }
        return task;
      });
      return newList;
    });
  }

  function openCloseModal(event) {
    if (event.target.className === "delete-icon") {
      setDeleteModalId(Number(event.target.id));
    } else {
      setDeleteModalId(0);
    }

    if (event.target.className === "trash-opener") {
      setTrashModalId(Number(event.target.id));
    } else {
      setTrashModalId(0);
    }
  }

  useEffect(() => {
    window.addEventListener("click", openCloseModal);
    return () => {
      window.removeEventListener("click", openCloseModal);
    };
  }, []);

  function moveToTrash(id) {
    setTasks((prevTasks) => {
      const newList = prevTasks.map((task) => {
        if (task.id === id) {
          task.isDeleted = true;
        }
        return task;
      });
      return newList;
    });
  }

  function undoDelete(id) {
    setTasks((prevTasks) => {
      const newList = prevTasks.map((task) => {
        if (task.id === id) {
          task.isDeleted = false;
        }
        return task;
      });
      return newList;
    });
  }

  function deleteForever(id) {
    setTasks((prevTasks) => {
      const newList = prevTasks.filter((task) => task.id != id);
      return newList;
    });
  }

  return (
    <div className="App">
      <h1>Simple To Do List</h1>
      <p className="description">
        Today is awesome day. The weather is awesome, you are awesome too!
      </p>
      <div className="action">
        <div className="buttons">
          <button
            onClick={() => setTab("todo")}
            className={tab === "todo" ? "button-active" : ""}
          >
            To Do
          </button>
          <button
            onClick={() => setTab("done")}
            className={tab === "done" ? "button-active" : ""}
          >
            Done
          </button>
          <button
            onClick={() => setTab("trash")}
            className={tab === "trash" ? "button-active" : ""}
          >
            Trash
          </button>
        </div>
        {isInputOpen ? (
          <div className="input-container">
            <p>Add New To Do</p>
            <textarea
              value={inputTask}
              onChange={(event) => setInputTask(event.target.value)}
              placeholder="Your text"
            ></textarea>
            <button onClick={addNewTask} className="add">
              Add
            </button>
          </div>
        ) : (
          ""
        )}

        <img
          onClick={() => setIsInputOpen((prevValue) => !prevValue)}
          src="Button Small 38 px.png"
          alt=""
        />
      </div>
      {tab === "todo" ? (
        <>
          <h2>To Do</h2>
          <div className="tasks">
            {tasks.length > 0
              ? tasks
                  .filter(
                    (task) => task.isDone === false && task.isDeleted === false
                  )
                  .map((task) => (
                    <div key={task.id} className="task">
                      <img
                        id={task.id}
                        className="delete-icon"
                        src="dots.svg"
                        alt=""
                      />
                      <img
                        onClick={() => makeDone(task.id)}
                        src="check-box-empty.svg"
                        alt=""
                      />

                      <p>{task.text}</p>
                      {deleteModalId === task.id ? (
                        <div
                          onClick={() => moveToTrash(task.id)}
                          className="delete-modal"
                        >
                          <img src="trash.svg" alt="" />
                          <span>Move to Trash</span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))
              : ""}
          </div>
        </>
      ) : (
        ""
      )}

      {tab === "done" ? (
        <>
          <h2>Done</h2>
          <div className="tasks">
            {tasks.length > 0
              ? tasks
                  .filter(
                    (task) => task.isDone === true && task.isDeleted === false
                  )
                  .map((task) => (
                    <div key={task.id} className="task">
                      <img
                        id={task.id}
                        className="delete-icon"
                        src="dots.svg"
                        alt=""
                      />
                      <img
                        onClick={() => moveTodo(task.id)}
                        src="check-box-filled.svg"
                        alt=""
                      />
                      <p className="task-done">{task.text}</p>
                      {deleteModalId === task.id ? (
                        <div
                          onClick={() => moveToTrash(task.id)}
                          className="delete-modal"
                        >
                          <img src="trash.svg" alt="" />
                          <span>Move to Trash</span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))
              : ""}
          </div>
        </>
      ) : (
        ""
      )}

      {tab === "trash" ? (
        <>
          <h2>Trash</h2>
          <div className="tasks">
            {tasks.length > 0
              ? tasks
                  .filter((task) => task.isDeleted === true)
                  .map((task) => (
                    <div key={task.id} className="task">
                      <img
                        id={task.id}
                        className="trash-opener"
                        src="dots.svg"
                        alt=""
                      />
                      <img
                        src={
                          task.isDone
                            ? "check-box-filled.svg"
                            : "check-box-empty.svg"
                        }
                        alt=""
                      />
                      <p className={task.isDone ? "task-done" : ""}>
                        {task.text}
                      </p>
                      {trashModalId === task.id ? (
                        <div className="trash-modal">
                          <div
                            onClick={() => deleteForever(task.id)}
                            className="delete-forever"
                          >
                            <img src="trash.svg" alt="" />
                            <span>Delete Forever</span>
                          </div>
                          <div
                            onClick={() => undoDelete(task.id)}
                            className="move-back"
                          >
                            <img src="library.svg" alt="" />
                            <span>Move Back To Do</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))
              : ""}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
