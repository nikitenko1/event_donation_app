import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SelectRoleModal from './../components/modal/SelectRoleModal';
import HeadInfo from '../utils/HeadInfo';

const Register = () => {
  const [openSelectRoleModal, setOpenSelectRoleModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const modalRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !userData.name ||
      !userData.username ||
      !userData.password ||
      !userData.confirmPassword
    )
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Please provide every field.',
        },
      });

    if (userData.password.length < 8) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Password length should be at least 8 characters.',
        },
      });
    }

    if (userData.password !== userData.confirmPassword)
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: "Password confirmation doesn't match.",
        },
      });

    setOpenSelectRoleModal(true);
  };
  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openSelectRoleModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setOpenSelectRoleModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openSelectRoleModal]);

  useEffect(() => {
    if (auth.accessToken) {
      navigate('/');
    }
  }, [navigate, auth.accessToken]);

  return (
    <>
      <HeadInfo title="Register" />
      <div className="flex h-screen">
        <div className="flex-1 bg-gray-200 hidden md:block">
          <img
            src={`${process.env.PUBLIC_URL}/images/auth.png`}
            alt="auth png"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 py-14 px-16">
          <h1 className="text-2xl font-medium">Sign Up Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="mt-8">
              <label htmlFor="nama">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                autoComplete="off"
                className="border border-gray-300 rounded-md px-3 w-full h-10 outline-0 text-sm mt-3"
              />
            </div>
            <div className="mt-5">
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
              <label htmlFor="kataSandi">Password</label>
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
            <div className="mt-5">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
                className="border border-gray-300 rounded-md px-3 w-full h-10 outline-0 text-sm mt-3"
              />
              {showConfirmPassword ? (
                <FaEyeSlash onClick={() => setShowConfirmPassword(false)} />
              ) : (
                <FaEye onClick={() => setShowConfirmPassword(true)} />
              )}
            </div>
            <button className="bg-sky-400 text-white px-3 py-2 rounded-md text-sm hover:bg-sky-500 transition-[background] mt-7">
              Next
            </button>
          </form>
          <p className="text-sm mt-6 text-gray-700">
            Already have an account? Click{' '}
            <Link to="/login" className="text-sky-700 underline">
              here
            </Link>
          </p>
        </div>
      </div>
      <SelectRoleModal
        openSelectRoleModal={openSelectRoleModal}
        setOpenSelectRoleModal={setOpenSelectRoleModal}
        modalRef={modalRef}
        userData={userData}
      />
    </>
  );
};

export default Register;
