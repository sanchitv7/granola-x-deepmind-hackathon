import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AppContext = createContext();

const API_BASE_URL = 'http://localhost:8000';

export const AppProvider = ({ children }) => {
  const [jobId, setJobId] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    viewed: 0,
    accepted: 0,
    rejected: 0,
    contacted: 0
  });
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState(null);

  const createJob = async (jobData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/jobs`, jobData);
      setJobId(response.data.job_id);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchNextCandidate = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}/candidates`);
      if (response.data.candidate) {
        setCurrentCandidate(response.data);
        setStats(response.data.stats);
      } else {
        setCurrentCandidate(null);
      }
      setPitch(null); // Reset pitch when loading new candidate
    } catch (error) {
      console.error('Error fetching candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptCandidate = async (candidateId) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/candidates/${candidateId}/accept`);
      setPitch(response.data.pitch);
      // Update stats
      await fetchStats();
      return response.data;
    } catch (error) {
      console.error('Error accepting candidate:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectCandidate = async (candidateId) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/candidates/${candidateId}/reject`);
      if (response.data.next_candidate) {
        setCurrentCandidate(response.data.next_candidate);
      } else {
        setCurrentCandidate(null);
      }
      // Update stats
      await fetchStats();
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sourceMoreCandidates = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/jobs/${jobId}/source-more`);

      // Poll for new candidates (simple approach)
      setTimeout(async () => {
        await fetchNextCandidate();
      }, 30000); // Wait 30 seconds for generation

      return { message: 'Sourcing new candidates... This may take 30-60 seconds.' };
    } catch (error) {
      console.error('Error sourcing more candidates:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!jobId) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        jobId,
        currentCandidate,
        stats,
        loading,
        pitch,
        createJob,
        fetchNextCandidate,
        acceptCandidate,
        rejectCandidate,
        sourceMoreCandidates,
        fetchStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
