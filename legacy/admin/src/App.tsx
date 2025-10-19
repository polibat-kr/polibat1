import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AllMembersPage from './pages/AllMembersPage';
import PoliticiansPage from './pages/PoliticiansPage';
import MemberStatusHistoryPage from './pages/MemberStatusHistoryPage';
import LikesHistoryPage from './pages/LikesHistoryPage';
import VotesHistoryPage from './pages/VotesHistoryPage';
import PostsManagementPage from './pages/PostsManagementPage';
import CommentsManagementPage from './pages/CommentsManagementPage';
import ReportsHistoryPage from './pages/ReportsHistoryPage';
import VotesManagementPage from './pages/VotesManagementPage';
import SuggestionsManagementPage from './pages/SuggestionsManagementPage';
import NoticesManagementPage from './pages/NoticesManagementPage';
import PopupsManagementPage from './pages/PopupsManagementPage';
import BannersManagementPage from './pages/BannersManagementPage';
import PolicyTemplatesPage from './pages/PolicyTemplatesPage';
import PolicyContentPage from './pages/PolicyContentPage';

function App() {
  return (
    <Router basename="/backoffice">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="members/all" element={<AllMembersPage />} />
          <Route path="members/politicians" element={<PoliticiansPage />} />
          <Route path="members/status-history" element={<MemberStatusHistoryPage />} />
          <Route path="likes-history" element={<LikesHistoryPage />} />
          <Route path="votes-history" element={<VotesHistoryPage />} />
          <Route path="posts" element={<PostsManagementPage />} />
          <Route path="comments" element={<CommentsManagementPage />} />
          <Route path="reports" element={<ReportsHistoryPage />} />
          <Route path="votes" element={<VotesManagementPage />} />
          <Route path="suggestions" element={<SuggestionsManagementPage />} />
          <Route path="notices" element={<NoticesManagementPage />} />
          <Route path="popups" element={<PopupsManagementPage />} />
          <Route path="banners" element={<BannersManagementPage />} />
          <Route path="policies/templates" element={<PolicyTemplatesPage />} />
          <Route path="policies/content" element={<PolicyContentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
