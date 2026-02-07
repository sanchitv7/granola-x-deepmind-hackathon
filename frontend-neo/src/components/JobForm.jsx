import { useState } from 'react';
import { useApp } from '../context/AppContext';

const JobForm = ({ onJobCreated }) => {
  const { createJob } = useApp();
  const [formData, setFormData] = useState({
    title: 'Senior Full-Stack Engineer',
    company: 'Vercel',
    company_website: 'https://vercel.com',
    description: 'We are looking for a Senior Full-Stack Engineer to help us build the future of the web. You will work on our core platform, focusing on performance, scalability, and developer experience. Ideally, you have experience with Next.js, React, and high-traffic distributed systems.',
    required_skills: 'React, Next.js, TypeScript, Node.js, AWS',
    experience_level: 'Senior',
    location: 'Remote (Global)'
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
      <h1 className="text-3xl font-black text-black mb-2 uppercase italic tracking-tight">Find Candidates</h1>
      <p className="font-bold text-gray-800 mb-6 text-sm tracking-wide">Enter requirements. Let the swarm work.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
            Role Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold text-xs"
            placeholder="e.g., Senior Full-Stack Engineer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold text-xs"
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
              Website
            </label>
            <input
              type="url"
              name="company_website"
              value={formData.company_website}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold text-xs"
              placeholder="https://acme.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
            Role Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold text-xs leading-relaxed"
            placeholder="Describe what this person will do..."
          />
        </div>

        <div>
          <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
            Required Skills
          </label>
          <input
            type="text"
            name="required_skills"
            value={formData.required_skills}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold text-xs"
            placeholder="React, Node.js, PostgreSQL, AWS"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
              Experience Level
            </label>
            <select
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold text-xs appearance-none"
            >
              <option value="Junior">Junior (0-2 years)</option>
              <option value="Mid">Mid-Level (3-5 years)</option>
              <option value="Senior">Senior (6+ years)</option>
              <option value="Lead">Lead/Principal (10+ years)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-4 border-black bg-white focus:bg-neo-yellow outline-none font-bold text-xs"
              placeholder="e.g., Remote (US)"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full bg-neo-pink text-black font-black text-xl py-4 px-6 border-4 border-black shadow-neo hover:border-red-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:bg-gray-400 disabled:shadow-none uppercase tracking-wide"
        >
          {creating ? 'Sourcing Candidates...' : '🤖 Find Candidates'}
        </button>
      </form>
    </div>
  );
};

export default JobForm;