import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineUser } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { logout } from './../../redux/slices/authSlice';
import EditProfileModal from './../modal/EditProfileModal';

const Navbar = () => {
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const avatarRef = useRef();
  const editProfileModalRef = useRef();

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpenDropdown &&
        /**
         * Alert if clicked on outside of element
         */
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setIsOpenDropdown(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenDropdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openEditProfileModal &&
        editProfileModalRef.current &&
        !editProfileModalRef.current.contains(e.target)
      ) {
        setOpenEditProfileModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openEditProfileModal]);

  return (
    <>
      <div className="flex items-center justify-between flex-1 pl-6 pr-14 py-4 bg-sky-400">
        <h1 className="text-xl font-medium text-white">
          Let&apos;s build | Kyiv |{' '}
          {auth.user?.role === 'admin' ? 'Admin' : 'Donor'}
        </h1>
        <div ref={avatarRef} className="relative">
          <div
            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
            className="w-10 h-10 rounded-full cursor-pointer outline outline-2 outline-offset-2 outline-gray-300"
          >
            <img
              src={auth.user?.avatar}
              alt={auth.user?.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div
            className={`${
              isOpenDropdown ? 'scale-y-1' : 'scale-y-0'
            } origin-top transition-[transform] absolute top-[100%] right-0 w-[170px] bg-white rounded-t-md flex flex-col shadow-xl border border-gray-200 mt-3`}
          >
            <p
              onClick={() => setOpenEditProfileModal(true)}
              className="cursor-pointer flex items-center gap-3 border-b border-gray-300 rounded-t-md p-3 hover:bg-gray-100 transition-[background]"
            >
              <AiOutlineUser />
              Edit Profile
            </p>
            <p
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-3 border-b border-gray-300 rounded-b-md p-3 hover:bg-gray-100 transition-[background]"
            >
              <MdLogout />
              Logout
            </p>
          </div>
        </div>
      </div>
      <EditProfileModal
        openEditProfileModal={openEditProfileModal}
        setOpenEditProfileModal={setOpenEditProfileModal}
        editProfileModalRef={editProfileModalRef}
      />
    </>
  );
};

export default Navbar;
