import React, { useState, useEffect } from 'react';
import { useContract } from '../../context/contractcontext';
import { getProjectDetails } from '../../utils/contractHelpers';
import { MilestoneList } from '../milestones/MilestoneList';
import { VoteForm } from '../voting/VoteForm';
import { ProjectMetrics } from './ProjectMetrics';
import './ProjectDetails.css';

export const ProjectDetails = ({ projectId }) => {
  const { network } = useContract();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const details = await getProjectDetails(projectId, network);
        setProject(details);
        setLoading(false);
      } catch (error) {
        console.error('Error loading project:', error);
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, network]);

  if (loading) return <div className="loading">Loading project details...</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="project-details">
      <header className="project-details__header">
        <h1>{project.projectName}</h1>
        <span className="project-type">{project.projectType}</span>
      </header>

      <div className="project-details__content">
        <div className="project-details__main">
          <section className="project-info">
            <h2>About this Project</h2>
            <p>{project.projectInfo}</p>
            <a 
              href={project.projectSite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
            >
              Visit Project Website
            </a>
          </section>

          <ProjectMetrics project={project} />
          <MilestoneList projectId={projectId} />
        </div>

        <div className="project-details__sidebar">
          <VoteForm projectId={projectId} />
        </div>
      </div>
    </div>
  );
};
