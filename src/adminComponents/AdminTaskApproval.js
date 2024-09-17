import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

function AdminTaskApproval() {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const txContent = {
    background: '#4A4D61',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '8px',
  };

  useEffect(() => {
    const fetchAllPendingTasks = async () => {
      try {
        const response = await axios.get('https://mintingpro.onrender.com/api/allPendingTasks'); // Adjust this to get all pending tasks
        setPendingTasks(response.data.pendingTasks);
        setLoading(false);
      } catch (err) {
        setError('No pending tasks found.');
        setLoading(false);
      }
    };

    fetchAllPendingTasks();
  }, []);

  const handleTaskApproval = async (taskId, status) => {
    setLoading(true);
    try {
      await axios.post('https://mintingpro.onrender.com/api/updateTaskStatus', { taskID: taskId, status });
      setPendingTasks(pendingTasks.filter((task) => task._id !== taskId));
      setLoading(false);
      toast.success("Task updated successfully.", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      setLoading(false);
      toast.error("Failed to update task.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  if (loading) return <p>Loading pending tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <ToastContainer />
      <h2>Pending Task Approval</h2>
      <ul>
        {pendingTasks.map((task) => (
          <li key={task._id} style={txContent}>
            <h3>{task.description}</h3>
            <img src={task.imageSrc} alt="Proof of task completion" width={200} />
            <p>Submitted by: {task.userID}</p>
            <div className='d-flex justify-content-between align-items-center'>
              <button className='btn btn-success' onClick={() => handleTaskApproval(task._id, 'approved')}>Approve</button>
              <button className='btn btn-danger' onClick={() => handleTaskApproval(task._id, 'declined')}>Decline</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminTaskApproval;
