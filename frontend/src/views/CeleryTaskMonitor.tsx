import { WEBSOCKET_URL } from '../config';

import React, { FC, useState } from 'react';
import axios from 'axios';

export const CeleryTaskMonitor: FC = () => {
  const [taskId, setTaskId] = useState('');
  const [taskStatus, setTaskStatus] = useState('');

  const createTask = async () => {
    try {
      const response = await axios.post(`${WEBSOCKET_URL}/create_task`);
      setTaskId(response.data.task_id);
      setTaskStatus('PENDING');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const checkTaskStatus = async () => {
    try {
      const response = await axios.get(`${WEBSOCKET_URL}/task_status/${taskId}`);
      setTaskStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching task status:', error);
    }
  };

  return (
    <div>
      <button onClick={createTask}>Create Task</button>
      {taskId && (
        <div>
          <p>Task ID: {taskId}</p>
          <p>Task Status: {taskStatus}</p>
          <button onClick={checkTaskStatus}>Check Task Status</button>
        </div>
      )}
    </div>
  );
};
