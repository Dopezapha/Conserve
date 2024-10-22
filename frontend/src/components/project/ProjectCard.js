import React from 'react';
import './ProjectCard.css';
import { formatSTX, formatDate } from '../../utils/formatters';

export const ProjectCard = ({ project, onClick }) => {
  const {
    projectName,
    projectInfo,
    fundingGoal,
    currentFunds,
    projectType,
    startBlock,
    endBlock
  } = project;

  const progress = (currentFunds / fundingGoal) * 100;

  return (
    <div className="project-card" onClick={() => onClick(project)}>
      <div className="project-card__type">{projectType}</div>
      <h3 className="project-card__title">{projectName}</h3>
      <p className="project-card__description">{projectInfo}</p>
      <div className="project-card__progress">
        <div className="progress-bar">
          <div 
            className="progress-bar__fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="project-card__stats">
          <span>{formatSTX(currentFunds)} STX raised</span>
          <span>of {formatSTX(fundingGoal)} STX</span>
        </div>
      </div>
      <div className="project-card__footer">
        <span>Started: {formatDate(startBlock)}</span>
        <span>Ends: {formatDate(endBlock)}</span>
      </div>
    </div>
  );
};
