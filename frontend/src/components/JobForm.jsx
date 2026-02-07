import { useState } from 'react';
import { useApp } from '../context/AppContext';

const JobForm = ({ onJobCreated }) => {
  const { createJob } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    experience_level: 'Mid',
    location: ''
  });
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const jobData = {
        ...formData,
        required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      const response = await createJob(jobData);
      onJobCreated();
    } catch (error) {
      alert('Error sourcing candidates: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Candidates</h1>
      <p className="text-gray-600 mb-6">Enter the role requirements and let AI source qualified candidates for you</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Senior Full-Stack Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what this person will do and the ideal background..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills (comma-separated)
          </label>
          <input
            type="text"
            name="required_skills"
            value={formData.required_skills}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., React, Node.js, PostgreSQL, AWS"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Junior">Junior (0-2 years)</option>
            <option value="Mid">Mid-Level (3-5 years)</option>
            <option value="Senior">Senior (6+ years)</option>
            <option value="Lead">Lead/Principal (10+ years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Remote (US), San Francisco, CA"
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {creating ? 'AI is Sourcing Candidates...' : '🤖 Find Candidates with AI'}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
