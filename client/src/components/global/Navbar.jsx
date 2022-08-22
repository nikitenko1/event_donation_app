import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineHistory,
  AiOutlineUser,
} from 'react-icons/ai';
import { FaTachometerAlt } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import { getDataAPI } from './../../utils/fetchData';
import { logout } from './../../redux/slices/authSlice';
import DonorProfileModal from './../modal/DonorProfileModal';
import EditProfileModal from './../modal/EditProfileModal';
import EventDetailModal from './../modal/EventDetailModal';

const Navbar = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [openDonorProfileModal, setOpenDonorProfileModal] = useState(false);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openEventDetailModal, setOpenEventDetailModal] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const sidebarRef = useRef();
  const dropdownRef = useRef();
  const donorProfileModalRef = useRef();
  const editProfileModalRef = useRef();
  const eventDetailModalRef = useRef();

  const handleClickDetail = (item) => {
    setSelectedItem(item);
    setOpenEventDetailModal(true);
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!search) return setSearchResult([]);

      if (search.length > 2) {
        getDataAPI(`event/search?event=${search}`).then((res) => {
          setSearchResult(res.data.events);
        });
      }
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpenSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsOpenSidebar(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenSidebar]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpenDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
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
        openDonorProfileModal &&
        donorProfileModalRef.current &&
        !donorProfileModalRef.current.contains(e.target)
      ) {
        setOpenDonorProfileModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openDonorProfileModal]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openEventDetailModal &&
        eventDetailModalRef.current &&
        !eventDetailModalRef.current.contains(e.target)
      ) {
        setOpenEventDetailModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openEventDetailModal]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openEditProfileModal &&
        editProfileModalRef.current &&
        !editProfileModalRef.current.contains(e.target)
      ) {
        setOpenEditProfileModal(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openEditProfileModal]);

  return (
    <>
      <div className="sticky top-0 z-[99] shadow-lg flex items-center justify-between px-8 py-6 bg-white gap-8">
        <Link to="/">
          <h1 className="text-cyan-500 text-2xl font-medium underline">
            Let&apos;s build | Kyiv
          </h1>
        </Link>
        <div className="flex-1 md:block flex justify-end">
          <div className="rounded-full bg-orange-500 p-2 cursor-pointer block md:hidden w-fit">
            <GiHamburgerMenu
              className="block md:hidden text-white text-xl"
              onClick={() => setIsOpenSidebar(true)}
            />
          </div>
          <div
            ref={sidebarRef}
            className={`md:static fixed top-0 ${
              isOpenSidebar ? 'right-0' : '-right-[2450px]'
            } z-[99] transition-all md:h-fit h-screen md:w-full w-full bg-white md:shadow-none shadow-xl md:flex md:gap-8 md:pt-0 pt-8 px-5`}
          >
            <AiOutlineClose
              onClick={() => setIsOpenSidebar(false)}
              className="text-sky-400 font-bold text-2xl cursor-pointer float-right md:hidden block"
            />
            <div className="clear-both" />
            <div className="md:flex-1 flex md:gap-16 gap-4 items-center">
              <div className="relative flex-1 md:mt-0 mt-4">
                <div className="relative">
                  <input
                    placeholder="case-sensitive --> keep that in mind"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-gray-700 border border-gray-300 rounded-md w-full h-10 outline-0 px-3 text-sm"
                  />
                  {!search && (
                    <div className="flex items-center gap-2 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-gray-400 text-sm pointer-events-none">
                      <AiOutlineSearch />
                      <p>Find Donations</p>
                    </div>
                  )}
                </div>
                {searchResult.length > 0 && (
                  <div className="absolute top-[100%] w-full shadow-xl border border-gray-200 bg-white mt-3 rounded-md">
                    {searchResult.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleClickDetail(item)}
                        className="p-7 flex items-center gap-7 w-full cursor-pointer hover:bg-gray-100"
                      >
                        <div className="w-24 h-24 bg-gray-300 rounded-md">
                          <img
                            src={item.picture}
                            alt={item.name}
                            className="w-full h-full rounded-md"
                          />
                        </div>
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-600 mt-3">
                            {item.donor?.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {search.length > 2 && searchResult.length === 0 && (
                  <div className="absolute top-[100%] w-full shadow-xl border border-gray-200 bg-white mt-3 rounded-md p-5">
                    <p className="bg-red-500 p-3 text-white text-sm rounded-md text-center">
                      No data found
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-center items-center gap-4 md:mt-0 mt-5">
                {auth.accessToken ? (
                  <div className="relative">
                    <div
                      onClick={() => setIsOpenDropdown(true)}
                      className="w-10 h-10 rounded-full bg-gray-300 cursor-pointer outline-2 outline outline-offset-2 outline-gray-300"
                    >
                      <img
                        src={auth.user?.avatar}
                        alt={auth.user?.name}
                        className="w-full h-full rounded-full object-cover"
                      />{' '}
                    </div>

                    <div
                      ref={dropdownRef}
                      className={`${
                        isOpenDropdown ? 'scale-y-1' : 'scale-y-0'
                      } origin-top transition-[transform] absolute top-[100%] right-0 w-[260px] bg-white rounded-t-md flex flex-col shadow-xl border border-gray-200 mt-3`}
                    >
                      <p
                        onClick={() => setOpenEditProfileModal(true)}
                        className="cursor-pointer flex items-center gap-3 border-b border-gray-300 p-3 hover:bg-gray-100 transition-[background] rounded-t-md"
                      >
                        <AiOutlineUser />
                        Edit Profile
                      </p>
                      {auth.user.role === 'user' ? (
                        <Link
                          to="/history"
                          className="flex items-center gap-3 border-b border-gray-300 p-3 hover:bg-gray-100 transition-[background] rounded-tl-md rounded-tr-md"
                        >
                          <AiOutlineHistory />
                          History
                        </Link>
                      ) : (
                        <>
                          <Link
                            to={`${
                              auth.user?.role === 'admin'
                                ? '/approval'
                                : '/overview'
                            }`}
                            className="flex items-center gap-3 border-b border-gray-300 p-3 hover:bg-gray-100 transition-[background]"
                          >
                            <FaTachometerAlt />
                            Dashboard
                          </Link>
                          {auth.user.role === 'donor' && (
                            <p
                              onClick={() => setOpenDonorProfileModal(true)}
                              className="flex cursor-pointer items-center gap-3 border-b border-gray-300 p-3 hover:bg-gray-100 transition-[background]"
                            >
                              <AiOutlineUser />
                              Fill Out Donor Account
                            </p>
                          )}
                        </>
                      )}
                      <p
                        onClick={handleLogout}
                        className="cursor-pointer flex items-center gap-3 border-b border-gray-300 p-3 hover:bg-gray-100 transition-[background] rounded-b-md"
                      >
                        <MdLogout />
                        Logout
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="bg-sky-400 hover:bg-sky-500 transition-[background] text-sm rounded-md px-3 py-2 text-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-orange-400 hover:bg-orange-500 transition-[background] text-sm rounded-md px-3 py-2 text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonorProfileModal
        openDonorProfileModal={openDonorProfileModal}
        setOpenDonorProfileModal={setOpenDonorProfileModal}
        donorProfileModalRef={donorProfileModalRef}
      />

      <EditProfileModal
        openEditProfileModal={openEditProfileModal}
        setOpenEditProfileModal={setOpenEditProfileModal}
        editProfileModalRef={editProfileModalRef}
      />

      <EventDetailModal
        openEventDetailModal={openEventDetailModal}
        setOpenEventDetailModal={setOpenEventDetailModal}
        eventDetailModalRef={eventDetailModalRef}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default Navbar;
