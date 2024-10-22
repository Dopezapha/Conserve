import React, { useEffect, useState } from 'react';
import { useContract } from '../../context/contractcontext';
import './ProjectMetrics.css';

export const ProjectMetrics = ({ projectId }) => {
  const { contract } = useContract();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const impactData = await contract.getImpactData(projectId);
        const performance = await contract.getProjectPerformance(projectId);
        setMetrics({ ...impactData, ...performance });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [projectId, contract]);

  if (loading) return <div className="loading">Loading metrics...</div>;
  if (!metrics) return null;

  return (
    <div className="project-metrics">
      <h3>Project Impact</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Trees Planted</h4>
          <span className="metric-value">{metrics.treeCount}</span>
        </div>
        <div className="metric-card">
          <h4>Protected Area (ha)</h4>
          <span className="metric-value">{metrics.protectedArea}</span>
        </div>
        <div className="metric-card">
          <h4>Carbon Reduced (tons)</h4>
          <span className="metric-value">{metrics.carbonReduced}</span>
        </div>
        <div className="metric-card">
          <h4>Species Protected</h4>
          <span className="metric-value">{metrics.speciesCount}</span>
        </div>
      </div>

      <div className="performance-metrics">
        <h3>Project Performance</h3>
        <div className="progress-bars">
          <div className="progress-item">
            <label>Funding Progress</label>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${metrics.fundingPercent}%` }}
              />
            </div>
            <span>{metrics.fundingPercent}%</span>
          </div>
          <div className="progress-item">
            <label>Milestone Completion</label>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${metrics.milestonePercent}%` }}
              />
            </div>
            <span>{metrics.milestonePercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
