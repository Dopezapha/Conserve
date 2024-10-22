import React, { useState, useEffect, useContext } from 'react';
import { ConnectWallet } from './context/contractcontext';
import { ContractProvider } from './context/contractcontext';
import { ProjectList } from './components/project/ProjectList';
import { ProjectDetails } from './components/project/ProjectDetails';
import './App.css';

const App = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <ContractProvider>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1>Conservation Platform</h1>
            <ConnectWallet />
          </div>
        </header>

        <main className="container">
          {selectedProject ? (
            <ProjectDetails 
              projectId={selectedProject.projectId} 
              onBack={() => setSelectedProject(null)}
            />
          ) : (
            <ProjectList onSelectProject={setSelectedProject} />
          )}
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 Conservation Platform. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ContractProvider>
  );
};

export default App;
