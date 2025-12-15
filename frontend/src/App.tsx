import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Trends from './pages/Trends';
import Content from './pages/Content';
import Distribution from './pages/Distribution';
import Analytics from './pages/Analytics';
import Optimization from './pages/Optimization';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="trends" element={<Trends />} />
          <Route path="content" element={<Content />} />
          <Route path="distribution" element={<Distribution />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="optimization" element={<Optimization />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;