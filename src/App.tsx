import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DynamicForm } from './components/DynamicForm';
import { FormResult } from './components/FormResult';

const App = () => (
  <div className="bg-gray-200 min-h-screen flex items-center justify-center md:p-5">
    <Router>
      <Routes>
        <Route path="/" element={<DynamicForm />} />
        <Route path="/results" element={<FormResult />} />
      </Routes>
    </Router>
  </div>
);

export default App;
