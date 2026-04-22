import axios from 'axios';

/**
 * ✅ PORT UPDATED: Changed from 5000 to 4000 to match backend logs
 * Host: 127.0.0.1 is used for maximum stability
 */
const BASE = process.env.REACT_APP_API || 'http://127.0.0.1:4000/api';

/**
 * Fetch all bins
 */
export const getBins = async () => {
  try {
    const res = await axios.get(`${BASE}/bins`);
    return Array.isArray(res.data) ? res.data : res.data.bins || [];
  } catch (error) {
    console.error("Error fetching bins:", error.message);
    return [];
  }
};

/**
 * Fetch optimized route for standard collection
 */
export const getOptimizedRoute = async () => {
  try {
    const res = await axios.get(`${BASE}/route`);
    // Returns { route, distance, duration }
    return res.data;
  } catch (error) {
    console.error("Error fetching optimized route:", error.message);
    return { route: [], distance: 0, duration: { formatted: "0m" } };
  }
};

/**
 * Fetch complaint history based on date range
 * Used by History.js
 */
export const getHistory = async (startDate, endDate) => {
  try {
    const res = await axios.get(`${BASE}/complaints/history`, {
      params: { 
        start: startDate, 
        end: endDate 
      }
    });
    return res.data; 
  } catch (error) {
    console.error("Error fetching history:", error.message);
    throw error;
  }
};

/**
 * Delete a specific complaint by ID
 */
export const deleteComplaint = async (id) => {
  try {
    const res = await axios.delete(`${BASE}/complaints/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting complaint:", error.message);
    throw error;
  }
};