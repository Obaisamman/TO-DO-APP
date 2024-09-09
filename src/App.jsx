import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

function App() {
  const [tasksByDay, setTasksByDay] = useState(() => {
    const savedTasks = localStorage.getItem('tasksByDay');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });
  const [selectedDay, setSelectedDay] = useState(new Date().getDate()); 
  const [inputValue, setInputValue] = useState('');

 
  useEffect(() => {
    localStorage.setItem('tasksByDay', JSON.stringify(tasksByDay));
  }, [tasksByDay]);

  const addTask = () => {
    if (inputValue.trim() === '') return; 

    const tasksForSelectedDay = tasksByDay[selectedDay] || [];
    const isTaskExist = tasksForSelectedDay.some(
      (task) => task.text.toLowerCase() === inputValue.toLowerCase()
    );

    if (isTaskExist) {
      alert('Task already exists for this day!');
      return;
    }

    const updatedTasks = [...tasksForSelectedDay, { text: inputValue, completed: false }];
    setTasksByDay({ ...tasksByDay, [selectedDay]: updatedTasks });
    setInputValue(''); 
  };

  const runConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const toggleTaskCompletion = (day, index) => {
    const tasksForSelectedDay = tasksByDay[day];
    const updatedTasks = tasksForSelectedDay.map((task, i) => {
      if (i === index) {
        const updatedTask = { ...task, completed: !task.completed };
        if (!task.completed) {
          runConfetti(); 
        }
        return updatedTask;
      }
      return task;
    });
    setTasksByDay({ ...tasksByDay, [day]: updatedTasks });
  };

  const deleteTask = (day, index) => {
    const tasksForSelectedDay = tasksByDay[day];
    const updatedTasks = tasksForSelectedDay.filter((_, i) => i !== index);
    setTasksByDay({ ...tasksByDay, [day]: updatedTasks });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="app-container">
      <h1>To-Do List for the Month</h1>
      <div className="calendar-container">
        {[...Array(31)].map((_, day) => {
          const tasksCount = tasksByDay[day + 1]?.length || 0; 
          return (
            <div
              key={day + 1}
              className={`calendar-day ${selectedDay === day + 1 ? 'selected' : ''}`}
              onClick={() => handleDayClick(day + 1)}
            >
              {day + 1}
              {tasksCount > 0 && (
                <div className="task-count">{tasksCount}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder={`Add a new task for day ${selectedDay}...`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {(tasksByDay[selectedDay] || []).map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''}>
            <span className="task-number">{index + 1}.</span>
            <span onClick={() => toggleTaskCompletion(selectedDay, index)}>{task.text}</span>
            <button onClick={() => deleteTask(selectedDay, index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
