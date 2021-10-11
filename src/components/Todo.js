import React, { useState, useEffect } from 'react';
import { Button, ListGroup } from 'react-bootstrap';

function Task({ task, onDragStart, onDragEnd, remove, complete }) {
  return (
    <div
      className='task'
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}

      style={{ textDecoration: task.completed ? "line-through" : "" }}
    >
      {task.title}
      <Button variant="primary" onClick={remove}>x</Button>
      <Button onClick={complete}>Complete</Button>
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
  const [tasksRemaining, setTasksRemaining] = useState(0);
  const [tasks, setTasks] = useState([{title: 'test1', completed: false},{title: 'test2', completed: false}, {title: 'test3', completed: false}]);
  const [draggedItem, setDraggedItem] = useState();
  const [draggedOverItemIndex, setDraggedOverItemIndex] = useState();

  useEffect(() => { setTasksRemaining(tasks.filter(task => !task.completed).length) }, [tasks]);

  const add = title => {
    const newTasks = [...tasks, { title, completed: false }];
    setTasks(newTasks);
  };

  const complete = index => {
    const newTasks = [...tasks];
    console.log('newTasks: ', newTasks)
    console.log('indxe: ', index)
    console.log('adsf', newTasks[index])
    console.log('adsf', newTasks[index].completed)
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
      <div className="header">Pending tasks ({tasksRemaining})</div>
      <div className="tasks">
        <ListGroup 
          onDragOver={(e)=>e.preventDefault}
          style={{'listStyleType': 'none'}}
        >
        {tasks.map((task, index) => (
          <ListGroup.Item 
            key={index}
            onDragOver={(e) => onDragOver(e, index)}
            >
               <Task
                  task={task}
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragEnd={e=>onDragEnd(e, index)}
                  remove={()=>remove(index)}
                  complete={()=>complete(index)}
                />
          </ListGroup.Item>
        ))}
        </ListGroup>
      </div>
      <div className="create-task" >
        <CreateTask add={add} />
      </div>
    </div>
  );
}

export default Todo;