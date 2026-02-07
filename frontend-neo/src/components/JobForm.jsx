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
    <div className="max-w-2xl mx-auto bg-white border-4 border-black shadow-neo p-8">
      <h1 className="text-4xl font-black text-black mb-2 uppercase italic">Find Candidates</h1>
      <p className="font-bold text-gray-800 mb-6">Enter requirements. Let the swarm work.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-black text-black mb-2 uppercase">
            Role Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold"
            placeholder="e.g., Senior Full-Stack Engineer"
          />
        </div>

        <div>
          <label className="block text-lg font-black text-black mb-2 uppercase">
            Role Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold"
            placeholder="Describe what this person will do..."
          />
        </div>

        <div>
          <label className="block text-lg font-black text-black mb-2 uppercase">
            Required Skills
          </label>
          <input
            type="text"
            name="required_skills"
            value={formData.required_skills}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold"
            placeholder="React, Node.js, PostgreSQL, AWS"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-black text-black mb-2 uppercase">
              Experience Level
            </label>
            <select
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold appearance-none"
            >
              <option value="Junior">Junior (0-2 years)</option>
              <option value="Mid">Mid-Level (3-5 years)</option>
              <option value="Senior">Senior (6+ years)</option>
              <option value="Lead">Lead/Principal (10+ years)</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-black text-black mb-2 uppercase">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold"
              placeholder="e.g., Remote (US)"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full bg-neo-pink text-black font-black text-2xl py-4 px-6 border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:bg-gray-400 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none uppercase"
        >
          {creating ? 'Sourcing Candidates...' : '🤖 Find Candidates'}
        </button>
      </form>
    </div>
  );
};

export default JobForm;