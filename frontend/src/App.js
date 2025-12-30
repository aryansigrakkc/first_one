
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CategoryBlogs from './components/CategoryBlogs';
import Login from './components/Login';
import HomeBlog from './components/HomeBlog';
import Pillars from './components/Pillars';
import PillarsDetail from './components/PillarsDetail';

function App() {
  return (
 <>
    <BrowserRouter>
      <Routes>

      
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/homeblog" element={<HomeBlog />} />
        <Route path="/categoryblogs/:categoryId" element={<CategoryBlogs />} />
        <Route path="/pillars" element={<Pillars />} />
          <Route path="/pillars/:pillarId" element={<PillarsDetail />} />
          </Routes>
    </BrowserRouter>
 </>
  );
}

export default App;
