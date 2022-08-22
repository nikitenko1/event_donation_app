import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from './../redux/slices/authSlice';
import Loader from './../components/global/Loader';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alert, auth } = useSelector((state) => state);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userData.username || !userData.password) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Please provide every field.',
        },
      });
    }

    dispatch(login(userData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    if (auth.accessToken) {
      navigate('/');
    }
  }, [navigate, auth.accessToken]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-200 hidden md:block">
        <img
          src={`${process.env.PUBLIC_URL}/images/auth.png`}
          alt="Foodonate"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 p-16">
        <h1 className="text-2xl font-medium">Login Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-8">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              autoComplete="off"
              className="border border-gray-300 rounded-md px-3 w-full h-10 outline-0 text-sm mt-3"
            />
          </div>
          <div className="mt-5">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              autoComplete="off"
              className="border border-gray-300 rounded-md px-3 w-full h-10 outline-0 text-sm mt-3"
            />
            {showPassword ? (
              <FaEyeSlash onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye onClick={() => setShowPassword(true)} />
            )}
          </div>
          <button
            disabled={alert.loading ? true : false}
            className={`${
              alert.loading
                ? 'bg-sky-200 hover:bg-sky-200 cursor-auto'
                : 'bg-sky-400 hover:bg-sky-500 cursor-pointer'
            } text-white px-3 py-2 rounded-md text-sm transition-[background] mt-7`}
          >
            {alert.loading ? <Loader /> : 'Login'}
          </button>
        </form>
        <p className="text-sm mt-6 text-gray-700">
          Don't have an account yet? Click{' '}
          <Link to="/register" className="text-blue-700 underline">
            here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
