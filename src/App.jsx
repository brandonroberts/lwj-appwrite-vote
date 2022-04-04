import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import Vote from './components/Vote';

function App() {
  return (
    <Routes>
      <Route
        path="vote"
        element={
          <div className="app-container">
            <div className="content">
              <Vote />
            </div>
          </div>
        }
      />
      <Route
        path="/"
        element={
          <div className="app-container">
            <div className="content">
              <span className="lwj-title">Learn With Jason</span>
              <span className="appwrite-vote">Entry to Vote</span>
              <LoginForm />
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
