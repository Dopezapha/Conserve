import React, { useState, useEffect } from 'react';
import { useContract } from '../../context/contractcontext';
import './VoteStats.css';

export const VoteStats = ({ projectId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { network } = useContract();

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Contract call would go here
        setStats({
          totalVotes: 0,
          approvalPercentage: 0,
          totalStaked: 0
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading vote stats:', error);
        setLoading(false);
      }
    };

    loadStats();
  }, [projectId, network]);

  if (loading) return <div className="loading">Loading vote statistics...</div>;
  if (!stats) return null;

  return (
    <div className="vote-stats">
      <h3>Voting Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Total Votes</span>
          <span className="stat-value">{stats.totalVotes}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Approval Rate</span>
          <span className="stat-value">{stats.approvalPercentage}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Staked</span>
          <span className="stat-value">{stats.totalStaked} STX</span>
        </div>
      </div>
    </div>
  );
};
