import React from 'react';
import { Router, Route } from 'wouter';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import LabReportPage from './pages/LabReportPage';
import ProjectIdeasPage from './pages/ProjectIdeasPage';
import ExamPrepPage from './pages/ExamPrepPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/lab-reports" component={LabReportPage} />
          <ProtectedRoute path="/project-ideas" component={ProjectIdeasPage} />
          <ProtectedRoute path="/exam-prep" component={ExamPrepPage} />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
