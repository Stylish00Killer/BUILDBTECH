import React, { useState } from 'react';
import { aiService } from '../services/ai.service';

const ProjectIdeasPage: React.FC = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [projectIdea, setProjectIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddKeyword = () => {
    if (currentKeyword.trim()) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleGenerateIdea = async () => {
    setIsLoading(true);
    try {
      const idea = await aiService.generateProjectIdea(keywords);
      setProjectIdea(idea);
    } catch (error) {
      console.error('Error generating project idea:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Project Ideas Generator</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">Add Keywords</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Enter a keyword"
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <button
              onClick={handleAddKeyword}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-2"
            >
              <span>{keyword}</span>
              <button
                onClick={() => handleRemoveKeyword(index)}
                className="text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={handleGenerateIdea}
          disabled={keywords.length === 0 || isLoading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Generating...' : 'Generate Project Idea'}
        </button>
      </div>

      {projectIdea && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Generated Project Idea</h2>
          <p className="text-gray-600">{projectIdea}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectIdeasPage;
