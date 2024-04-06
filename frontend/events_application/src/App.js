import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/homePage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router basename="/">
        {/* Link Routing */}
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
