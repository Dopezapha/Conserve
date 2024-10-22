import React, { useState, useEffect } from 'react';
import { useContract } from '../../context/contractcontext';
import { getMilestoneDetails } from '../../utils/contractHelpers';
import './MilestoneList.css';

export const MilestoneList = ({ projectId }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { network } = useContract();  // Include network from ContractContext

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        const details = await getMilestoneDetails(projectId, network);  // Pass network to getMilestoneDetails
        setMilestones(details);
        setLoading(false);
      } catch (error) {
        console.error('Error loading milestones:', error);
        setLoading(false);
      }
    };

    loadMilestones();
  }, [projectId, network]);  // Add network as a dependency to re-run when it changes

  if (loading) return <div className="loading">Loading milestones...</div>;

  return (
    <div className="milestones">
      <h2>Project Milestones</h2>
      <div className="milestone-list">
        {milestones.map((milestone, index) => (
          <div key={index} className={`milestone-card ${milestone.isComplete ? 'complete' : ''}`}>
            <div className="milestone-header">
              <span className="milestone-number">#{index + 1}</span>
              <span className={`milestone-status ${milestone.isComplete ? 'complete' : 'pending'}`}>
                {milestone.isComplete ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <h3>{milestone.milestoneDesc}</h3>
            <div className="milestone-details">
              <span>Due: {new Date(milestone.dueDate * 1000).toLocaleDateString()}</span>
              {milestone.isComplete && (
                <div className="milestone-proof">
                  <span>Proof Hash: {milestone.completionProof}</span>
                  <span>Verified by: {milestone.approver}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
