import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDatabase } from '../hooks/useDatabase';
import { ollamaService } from '../services/ollama.service';

const LabReportPage: React.FC = () => {
  const { user } = useAuth();
  const { useLabReports, useSaveLabReport } = useDatabase();
  const { data: labReports = [] } = useLabReports();
  const saveLabReportMutation = useSaveLabReport();

  const [newReport, setNewReport] = useState({
    title: '',
    observations: '',
    data: '',
    generatedReport: '',
    isGenerating: false,
    error: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setNewReport(prev => ({ ...prev, isGenerating: true, error: '' }));

    try {
      // Convert comma-separated data to numbers
      const numericalData = newReport.data.split(',').map(num => Number(num.trim()));

      // Get AI analysis of the data
      const analysis = await ollamaService.analyzeData(numericalData);

      // Generate full lab report
      const report = await ollamaService.generateLabReport(
        newReport.data,
        newReport.observations
      );

      // Save the report
      await saveLabReportMutation.mutateAsync({
        userId: user.id,
        title: newReport.title,
        content: report,
        data: JSON.stringify({
          rawData: newReport.data,
          observations: newReport.observations,
          analysis: analysis
        })
      });

      // Reset form
      setNewReport({
        title: '',
        observations: '',
        data: '',
        generatedReport: '',
        isGenerating: false,
        error: ''
      });
    } catch (error) {
      console.error('Error generating lab report:', error);
      setNewReport(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate report'
      }));
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Lab Reports</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {newReport.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded">
            {newReport.error}
          </div>
        )}

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
          <label className="block mb-2">Experimental Data (comma-separated numbers)</label>
          <input
            type="text"
            value={newReport.data}
            onChange={(e) => setNewReport({ ...newReport, data: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="1.2, 2.3, 3.4, 4.5"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Observations</label>
          <textarea
            value={newReport.observations}
            onChange={(e) => setNewReport({ ...newReport, observations: e.target.value })}
            className="w-full p-2 border rounded h-32"
            placeholder="Describe your experimental observations..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={newReport.isGenerating || saveLabReportMutation.isPending}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {newReport.isGenerating ? 'Generating Report...' : 'Generate Report'}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Reports</h2>
        {labReports.map((report) => {
          const reportData = JSON.parse(report.data);
          return (
            <div key={report.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{report.title}</h3>
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <h4 className="font-semibold mb-2">Raw Data</h4>
                  <p className="font-mono">{reportData.rawData}</p>

                  <h4 className="font-semibold mt-4 mb-2">Observations</h4>
                  <p>{reportData.observations}</p>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Generated Report</h4>
                  {report.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LabReportPage;