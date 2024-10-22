import { AppConfig, UserSession } from '@stacks/connect';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const CONTRACT_ADDRESS = 'SP000...'; // Your contract address
export const CONTRACT_NAME = 'conservation-contract';

export const PROJECT_TYPES = [
  'wildlife',
  'forest',
  'marine',
  'climate',
  'biodiversity'
];
