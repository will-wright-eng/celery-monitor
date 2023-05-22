import { WEBSOCKET_URL, BASE_WEBSOCKET } from '../config';

import React, { FC, useState } from 'react';
import axios from 'axios';

type Task = {
  id: any;
  status: string;
};

export const Celery: FC = () => {
  // const [tasks, setTasks] = useState([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const startTask = async () => {
    // const response = await axios.post('http://localhost:8000/start_task/');
    const response = await axios.post(`${WEBSOCKET_URL}/start_task/`);
    const task_id = response.data.task_id;

    setTasks([...tasks, { id: task_id, status: 'PENDING' }]);

    // Connect to the WebSocket for task status updates
    // const socket = new WebSocket(`ws://localhost:8000/api/v1/celery/ws/task_status/${task_id}`);
    const socket = new WebSocket(`${BASE_WEBSOCKET}/ws/task_status/${task_id}`);
    socket.onmessage = (event) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === task_id ? { ...task, status: event.data } : task))
      );
    };
  };

  return (
    <div>
      <button onClick={startTask}>Start Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.id}: {task.status}</li>
        ))}
      </ul>
    </div>
  );
};
