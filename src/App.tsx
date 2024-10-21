import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DynamicForm } from './components/DynamicForm';
import { FormResult } from './components/FormResult';

const App = () => (
  <main className="min-h-screen px-4 py-6 sm:px-6 md:py-10">
    <Router>
      <Routes>
        <Route path="/" element={<DynamicForm />} />
        <Route path="/results" element={<FormResult />} />
      </Routes>
    </Router>
  </main>
);

export default App;
