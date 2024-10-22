import React, { useState } from 'react';
import { useContract } from '../../context/contractcontext';
import './VoteForm.css';

export const VoteForm = ({ projectId }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [choice, setChoice] = useState('approve');
  const [submitting, setSubmitting] = useState(false);
  const { userData, network } = useContract();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Contract call would go here
      setStakeAmount('');
      setChoice('approve');
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!userData) {
    return (
      <div className="vote-form card">
        <h3>Vote on this Project</h3>
        <p>Please connect your wallet to vote.</p>
      </div>
    );
  }

  return (
    <div className="vote-form card">
      <h3>Vote on this Project</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="stakeAmount">Stake Amount (STX)</label>
          <input
            type="number"
            id="stakeAmount"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            min="0"
            step="0.1"
            required
          />
        </div>
        <div className="form-group">
          <label>Vote Choice</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="approve"
                checked={choice === 'approve'}
                onChange={(e) => setChoice(e.target.value)}
              />
              Approve
            </label>
            <label>
              <input
                type="radio"
                value="reject"
                checked={choice === 'reject'}
                onChange={(e) => setChoice(e.target.value)}
              />
              Reject
            </label>
          </div>
        </div>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Vote'}
        </button>
      </form>
    </div>
  );
};
