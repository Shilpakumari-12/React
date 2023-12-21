import React, {
    useState,
    useEffect,
    useReducer
  } from "https://cdn.skypack.dev/react";
  import ReactDOM from "https://cdn.skypack.dev/react-dom";
  
  console.clear();
  
  function StateAnimation({
    component = "div",
    state: stateProp,
    onComplete = () => {},
    ...props
  }) {
    const [state, setState] = useState(stateProp);
    const [prevState, setPrevState] = useState(null);
    const [animating, setAnimating] = useState(false);
  
    useEffect(() => {
      if (stateProp !== state) {
        setAnimating(true);
        setPrevState(state);
        setState(stateProp);
      }
    }, [stateProp]);
  
    function animationComplete() {
      setAnimating((animating) => {
        if (animating) {
          onComplete(state);
        }
        return false;
      });
    }
  
    const Component = component;
    return (
      <Component
        {...props}
        data-state={state}
        data-prev-state={prevState}
        onTransitionEnd={animationComplete}
        onAnimationEnd={animationComplete}
      />
    );
  }
  
  function Todo({ todo, onDelete, onDeleted }) {
    const [state, setState] = useState("unselected");
    useEffect(() => {
      if (todo.deleted) {
        setState("deleted");
      }
    }, [todo.deleted]);
  
    function onClick() {
      setState(state === "unselected" ? "selected" : "unselected");
    }
  
    return (
      <StateAnimation
        className="todo"
        state={state}
        onComplete={() => {
          if (todo.deleted) onDeleted();
        }}
      >
        <div className="todo-main" onClick={onClick}>
          {todo.message}
        </div>
        <button className="todo-delete" onClick={onDelete}>
          <svg viewBox="0 0 448 512" width="100" title="trash-alt">
            <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
          </svg>
        </button>
      </StateAnimation>
    );
  }
  
  const initialTodos = [
    { message: "Get started", deleted: false },
    { message: "Keep going", deleted: false },
    { message: "Finish strong", deleted: false }
  ];
  
  const todosReducer = (todos, event) => {
    switch (event.type) {
      case "delete": {
        const newTodos = [...todos];
        newTodos[event.index] = {
          ...newTodos[event.index],
          deleted: true
        };
        return newTodos;
      }
      case "deleted": {
        const newTodos = todos.filter((_, i) => i !== event.index);
        return newTodos;
      }
      case "restart": {
        return initialTodos;
      }
      default:
        break;
    }
  
    return todos;
  };
  
  function App() {
    const [todos, dispatch] = useReducer(todosReducer, initialTodos);
  
    return (
      <div>
        {todos.map((todo, i) => {
          return (
            <Todo
              key={`${i}${todo.message}`}
              todo={todo}
              onDelete={() => {
                dispatch({ type: "delete", index: i });
              }}
              onDeleted={() => {
                dispatch({ type: "deleted", index: i });
              }}
            />
          );
        })}
        {todos.length == 0 && (
          <button onClick={() => dispatch({ type: "restart" })}>Restart</button>
        )}
      </div>
    );
  }
  
  ReactDOM.render(<App />, document.querySelector("#app"));
  