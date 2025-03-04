import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDatabase } from '../hooks/useDatabase';
import { aiService } from '../services/ai.service';

const LabReportPage: React.FC = () => {
  const { user } = useAuth();
  const { useLabReports, useSaveLabReport } = useDatabase();
  const { data: labReports = [] } = useLabReports();
  const saveLabReportMutation = useSaveLabReport();

  const [newReport, setNewReport] = useState({
    title: '',
    content: '',
    data: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const data = newReport.data.split(',').map(Number);
      const analysis = await aiService.analyzeLabData(data);

      await saveLabReportMutation.mutateAsync({
        userId: user.id,
        title: newReport.title,
        content: newReport.content,
        data: JSON.stringify(analysis),
      });

      setNewReport({ title: '', content: '', data: '' });
    } catch (error) {
      console.error('Error saving lab report:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Lab Reports</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block mb-2">Report Title</label>
          <input
            type="text"
            value={newReport.title}
            onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Report Content</label>
          <textarea
            value={newReport.content}
            onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Data Points (comma-separated)</label>
          <input
            type="text"
            value={newReport.data}
            onChange={(e) => setNewReport({ ...newReport, data: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="1.2, 2.3, 3.4, 4.5"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saveLabReportMutation.isPending}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {saveLabReportMutation.isPending ? 'Generating...' : 'Generate Report'}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Reports</h2>
        {labReports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">{report.title}</h3>
            <p className="text-gray-600 mb-4">{report.content}</p>
            <div className="bg-gray-50 p-4 rounded">
              <pre>{report.data}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabReportPage;