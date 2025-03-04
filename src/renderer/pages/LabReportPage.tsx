import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDatabase } from '../hooks/useDatabase';
import { ollamaService } from '../services/ollama.service';

const LabReportPage: React.FC = () => {
  const { user } = useAuth();
  const { useLabReports, useSaveLabReport } = useDatabase();
  const { data: labReports = [] } = useLabReports();
  const saveLabReportMutation = useSaveLabReport();

  const [serviceStatus, setServiceStatus] = useState({
    isChecking: true,
    isAvailable: false,
    error: ''
  });

  const [newReport, setNewReport] = useState({
    title: '',
    observations: '',
    data: '',
    generatedReport: '',
    isGenerating: false,
    error: ''
  });

  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    try {
      const status = await ollamaService.checkStatus();
      setServiceStatus({
        isChecking: false,
        isAvailable: status.isAvailable && status.modelLoaded,
        error: status.error || ''
      });
    } catch (error) {
      setServiceStatus({
        isChecking: false,
        isAvailable: false,
        error: 'Failed to connect to Ollama service'
      });
    }
  };

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

  if (serviceStatus.isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!serviceStatus.isAvailable) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Ollama Service Unavailable
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{serviceStatus.error}</p>
                <p className="mt-2">Please ensure Ollama is running with the following command:</p>
                <pre className="mt-2 bg-red-100 p-2 rounded">ollama run deepseek-r1:8b</pre>
                <button
                  onClick={checkOllamaStatus}
                  className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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