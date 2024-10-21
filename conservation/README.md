# Conservation Smart Contract

## About

This smart contract implements a decentralized platform for managing and funding conservation projects. It allows users to create, fund, and vote on various environmental initiatives, track project milestones, and record environmental impact data.

## Features

1. Project Creation and Management
2. Milestone Tracking
3. Voting System
4. Environmental Impact Recording
5. Donation Tracking
6. Performance Metrics

## Contract Structure

### Constants and Data Maps

- `owner`: The contract owner's address
- `ERROR-*`: Various error constants for different scenarios
- `project-types`: List of valid project categories
- `ProjectDetails`: Main data structure for storing project information
- `DonorInfo`: Tracks donor contributions
- `ApproverList`: List of approved project evaluators
- `MilestoneInfo`: Stores milestone data for each project
- `VoteRecords`: Keeps track of votes cast by users
- `EnvironmentalMetrics`: Stores environmental impact data for projects

### State Variables

- `next-project-id`: Counter for generating unique project IDs
- `project-count`: Total number of projects
- `is-contract-active`: Indicates if the contract has been set up
- `stake-requirement`: Minimum stake required for certain actions
- `vote-duration`: Duration of the voting period in blocks

## Main Functions

### Administrative Functions

1. `setup-contract()`: Initializes the contract (owner only)
2. `set-min-stake(new-min-stake)`: Updates the minimum stake requirement (owner only)

### Project Management

1. `start-project(name, info, site, type, goal-amount, duration)`: Creates a new conservation project
2. `add-project-milestone(project-id, description, deadline)`: Adds a milestone to an existing project
3. `finish-milestone(project-id, milestone-id, proof)`: Marks a milestone as completed

### Voting and Participation

1. `cast-vote(project-id, stake-amount, choice)`: Allows users to vote on projects by staking tokens

### Impact Tracking

1. `record-impact(project-id, trees, area, carbon, species, community)`: Records environmental impact data for a project

### Read-only Functions

1. `get-impact-data(project-id)`: Retrieves environmental impact data for a project
2. `get-milestone-details(project-id, milestone-id)`: Gets details of a specific milestone
3. `get-vote-details(project-id, voter-address)`: Retrieves voting information for a specific user and project
4. `get-project-performance(project-id)`: Calculates and returns various performance metrics for a project
5. `get-project-timeline(project-id)`: Provides timeline-related statistics for a project

## Security Considerations

- The contract uses a permission system to ensure only authorized users can perform certain actions.
- Staking mechanisms are in place to prevent spam and encourage genuine participation.
- Error handling is implemented throughout the contract to manage various edge cases and invalid inputs.

## Future Improvements

1. Implement a more sophisticated voting mechanism
2. Add a reward system for successful project completion
3. Integrate with external oracles for verified impact data
4. Implement a dispute resolution mechanism for project approvals and milestone completions

## Author
Chukwudi Daniel Nwaneri