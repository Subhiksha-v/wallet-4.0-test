// Simple utility to manage data mode
const DATA_MODE_KEY = 'procurementDataMode';

export const setDataMode = (mode) => {
  localStorage.setItem(DATA_MODE_KEY, mode);
};

export const getDataMode = () => {
  return localStorage.getItem(DATA_MODE_KEY) || 'demo'; // Default to demo mode
};

export const isDemoMode = () => {
  return getDataMode() === 'demo';
};

export const isApiMode = () => {
  return getDataMode() === 'api';
}; 