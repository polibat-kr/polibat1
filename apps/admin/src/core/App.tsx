import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router basename="/backoffice">
      <Routes>
        <Route path="/" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                정치방망이 Admin Dashboard
              </h1>
              <p className="text-gray-600">
                모노레포 구조 생성 완료
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Vite + React 19 + TypeScript + Tailwind CSS 3.4
              </p>
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
