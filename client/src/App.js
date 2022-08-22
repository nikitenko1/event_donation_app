import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { refreshToken } from './redux/slices/authSlice';
import PageRender from './utils/PageRender';
import Home from './pages/home';
import Alert from './components/global/Alert';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  // Initializing AOS
  useEffect(() => {
    AOS.init({
      easing: 'ease-out-cubic',
      once: false,
      offset: 50,
      delay: 50,
    });
  }, []);

  return (
    <Router>
      <Alert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:page" element={<PageRender />} />
        <Route path="/:page/:id" element={<PageRender />} />
      </Routes>
    </Router>
  );
};

export default App;
