import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Container } from 'react-bootstrap';

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

  useEffect(() => { setTasksRemaining(tasks.filter(task => !task.completed).length) }, [tasks]);

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
    setDraggedItem(tasks[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = tasks[index];
    if (!draggedItem || (draggedItem === draggedOverItem)) {
      return;
    }
    let items = tasks.filter((item) => item !== draggedItem);
    items.splice(index, 0, draggedItem);

    setTasks(items);
  };

  const onDragEnd = (e, index) => {
    setDraggedItem(null);
  };

  return (
    <Container className="vh-100 row">
      <div className="header align-self-end">Pending tasks ({tasksRemaining})</div>
      <div className="tasks align-self-center">
        <ListGroup 
          onDragOver={(e)=>e.preventDefault}
          style={{'listStyleType': 'none'}}
          className='shadow-sm'
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
      <div className="create-task align-self-start" >
        <CreateTask add={add} />
      </div>
    </Container>
  );
}

export default Todo;