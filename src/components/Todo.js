import React, { useState, useEffect } from 'react';

function Task({ task, index, complete, remove }) {
  return (
    <div
      className='task'
      draggable
      // style={{ textDecoration: task.completed ? "line-through" : "" }}
    >
      {task}
      <button onClick={() => remove(index)}>x</button>
      <button onClick={() => complete(index)}>Complete</button>
    </div>
  );
}

function CreateTask({ add }) {
  const [value, setValue] = useState();

  const submit = e => {
    e.preventDefault();
    if (!value) return;
    add(value);
    setValue();
  }

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        value={value}
        placeholder="Add a new task"
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

const Todo = () => {
  // const [tasksRemaining, setTasksRemaining] = useState(0);
  // const [tasks, setTasks] = useState([
  //   {
  //     title: "Grab some Pizza",
  //     completed: true
  //   },
  //   {
  //     title: "Do your workout",
  //     completed: true
  //   },
  //   {
  //     title: "Hangout with friends",
  //     completed: false
  //   }
  // ]);
  const [tasks, setTasks] = useState(['test1', 'test2', 'test3']);
  const [draggedItem, setDraggedItem] = useState();
  const [draggedOverItemIndex, setDraggedOverItemIndex] = useState();

  // useEffect(() => { setTasksRemaining(tasks.filter(task => !task.completed).length) }, [tasks]);


  const add = title => {
    const newTasks = [...tasks, { title, completed: false }];
    setTasks(newTasks);
  };

  const complete = index => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const remove = index => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const onDragStart = (e, index) => {
    console.log('DragStart: ', index)
    setDraggedItem(tasks[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    console.log('draggedItem: ', draggedItem)
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = tasks[index];
    console.log('draggedOverItem: ', draggedOverItem)
    console.log('draggedItem: ', draggedItem)
    if (!draggedItem || (draggedItem === draggedOverItem)) {
      return;
    }
    setDraggedOverItemIndex(index);
    console.log('draggedOverItemIndex: ', draggedOverItemIndex)
    let items = tasks.filter((item) => item !== draggedItem);
    items.splice(index, 0, draggedItem);

    setTasks(items);
    console.log(items)
  };

  const onDragEnd = (e, index) => {
    console.log('onDragEnd: ', draggedOverItemIndex)
    setDraggedItem(null);
  };

  return (
    <div className="todo-container">
      {/* <div className="header">Pending tasks ({tasksRemaining})</div> */}
      <div className="tasks">
        <ul 
          onDragOver={(e)=>e.preventDefault}
          style={{'list-style-type': 'none'}}
        >
        {tasks.map((task, index) => (
          <li 
            key={index}
            onDragOver={(e) => onDragOver(e, index)}
            >
               <div
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragEnd={e=>onDragEnd(e, index)}
                >{task}</div>
          </li>
        ))}
        </ul>
      </div>
      <div className="create-task" >
        <CreateTask add={add} />
      </div>
    </div>
  );
}

export default Todo;