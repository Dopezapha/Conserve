import React, { useState } from 'react';
import { useContract } from '../../context/contractcontext';
import './MilestoneForm.css';

export const MilestoneForm = ({ projectId, onSuccess }) => {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { userData, network } = useContract();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const deadlineBlock = Math.floor(new Date(deadline).getTime() / (10 * 60 * 1000));
      // Contract call would go here
      onSuccess();
      setDescription('');
      setDeadline('');
    } catch (error) {
      console.error('Error adding milestone:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="milestone-form">
      <h3>Add New Milestone</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Milestone'}
        </button>
      </form>
    </div>
  );
};
