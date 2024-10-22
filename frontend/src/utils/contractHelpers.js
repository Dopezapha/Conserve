import { fetchCallReadOnlyFunction } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './constants';

export const getProjectDetails = async (projectId, network) => {
  const functionArgs = [projectId];
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-project-details',
      functionArgs,
      network,
    });
    return result;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

// Add getMilestoneDetails function
export const getMilestoneDetails = async (projectId, network) => {
  const functionArgs = [projectId];
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-milestone-details', // Make sure the function name matches the one in your smart contract
      functionArgs,
      network,
    });
    return result;
  } catch (error) {
    console.error('Error fetching milestone details:', error);
    throw error;
  }
};
