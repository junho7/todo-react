import React, { useState, useEffect, useRef } from 'react';
import { Button, ListGroup, Container, ButtonGroup, Form, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import useKeyPress from './useKeyPress';
import useOnClickOutside from './useOnClickOutside';

import './Todo.css';

function Task({ task, index, onDragStart, onDragEnd, remove, complete, onEditEnd }) {
  const [buttonShow, setButtonShow] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const [inputValue, setInputValue] = useState(task.title)

  const inputRef = useRef(null);
  const wrapperRef = useRef(null)
  const enter = useKeyPress('Enter');
  const esc = useKeyPress('Escape');

  useOnClickOutside(wrapperRef, () => setIsInputActive(false));
  useEffect(() => {
    if (isInputActive) {
      inputRef.current.focus();
      if (enter) {
        onEditEnd(index, inputValue);
        setIsInputActive(false);
      }
      if (esc) {
        setIsInputActive(false);
      }
    }
    else {
      setInputValue(task.title);
    }
  }, [isInputActive, enter, esc, task, index, inputValue, onEditEnd]);

  return (
    <div
      className='row p-0'
      onMouseEnter={(e) => setButtonShow(true)}
      onMouseLeave={(e) => setButtonShow(false)}
      >
      <div 
        className='title'
        ref={wrapperRef}
        onClick={() => setIsInputActive(true)}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
          style={{ textDecoration: task.completed ? "line-through" : "", border: 0 }}
        >

      { isInputActive ?
      <Form.Control
      ref={inputRef}
      as='input'
      value={inputValue}
      onChange={e=>{setInputValue(e.target.value)}}
      />
      : inputValue
        }
        </div>
      <div className='button p-0'>
      {buttonShow?
      <ButtonGroup className='float-right'>
        <Button variant="outline-primary" size='sm' onClick={complete}>
          <FontAwesomeIcon icon={faCheck} />
        </Button>
        <Button variant="outline-primary" size='sm' onClick={remove}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </ButtonGroup>
      : ''
      }
      </div>
    </div>
  );
}
function CreateTask({ add }) {
  const [value, setValue] = useState();

  const submit = e => {
    e.preventDefault();
    if (!value) return;
    add(value);
    setValue('');
  }

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        className='form-control border border-primary mb-3'
        value={value}
        placeholder="Add a new task"
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

const Todo = () => {
  const [tasksRemaining, setTasksRemaining] = useState(0);
  const [tasks, setTasks] = useState([{title: 'Eat', completed: false},{title: 'Pray', completed: false}, {title: 'Love', completed: false}]);
  const [draggedItem, setDraggedItem] = useState();

  const progress = Math.round((tasks.length-tasksRemaining)/tasks.length * 100, 0)
  
  useEffect(() => { 
    setTasksRemaining(tasks.filter(task => !task.completed).length) 
  }, [tasks, setTasks]);

  const add = title => {
    const newTasks = [...tasks];
    newTasks.splice(tasksRemaining, 0, { title, complete: false });
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

  const onEditEnd = (index, newTask) => {
    let items = tasks;
    items[index].title = newTask;

    setTasks(items);
  };

  return (
    <Container className="vh-100 row mx-auto">
      <div className="header align-self-end">
      </div>
      <div className="tasks align-self-center">
        <CreateTask add={add} />
        <ProgressBar now={progress} label={`${progress}%`} 
          className="mb-3"/>
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
                  index={index}
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragEnd={e=>onDragEnd(e, index)}
                  remove={()=>remove(index)}
                  complete={()=>complete(index)}
                  onEditEnd={(index, newTask)=>onEditEnd(index, newTask)}
                />
          </ListGroup.Item>
        ))}
        </ListGroup>
      </div>
      <div className="create-task align-self-start" >
      </div>
    </Container>
  );
}

export default Todo;