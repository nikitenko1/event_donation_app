import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { BsPatchCheckFill } from 'react-icons/bs';
import { FaBuilding, FaTachometerAlt, FaUser } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BiNews } from 'react-icons/bi';

const Sidebar = () => {
  const { page } = useParams();

  const { auth } = useSelector((state) => state);

  return (
    <div className="bg-sky-400 pt-[72px]">
      {auth.user?.role === 'admin' ? (
        <>
          <Link
            to="/approval"
            className={`block p-5 ${
              page === 'approval' ? 'bg-sky-600' : undefined
            } hover:bg-sky-800 transition-[background] cursor-pointer`}
          >
            <BsPatchCheckFill className="text-xl text-white" />
          </Link>
          <Link
            to="/donor"
            className={`block p-5 ${
              page === 'donor' ? 'bg-sky-600' : undefined
            } hover:bg-sky-800 transition-[background] cursor-pointer`}
          >
            <FaBuilding className="text-xl text-white" />
          </Link>
          <Link
            to="/user"
            className={`block p-5 ${
              page === 'user' ? 'bg-sky-600' : undefined
            } hover:bg-sky-800 transition-[background] cursor-pointer`}
          >
            <FaUser className="text-xl text-white" />
          </Link>
          <Link
            to="/news"
            className={`block p-5 ${
              page === 'news' ? 'bg-sky-600' : undefined
            } hover:bg-sky-800 transition-[background] cursor-pointer`}
          >
            <BiNews className="text-xl text-white" />
          </Link>
          <Link
            to="/all_event"
            className={`block p-5 ${
              page === 'all_event' ? 'bg-sky-600' : undefined
            } hover:bg-sky-800 transition-[background] cursor-pointer`}
          >
            <AiOutlineClockCircle className="text-xl text-white" />
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/overview"
            className={`block p-5 ${
              page === 'overview' ? 'bg-sky-600' : undefined
            } hover:bg-sky-600 cursor-pointer transition-[background]`}
          >
            <FaTachometerAlt className="text-xl text-white" />
          </Link>
          <Link
            to="/event"
            className={`block p-5 ${
              page === 'event' ? 'bg-sky-600' : undefined
            } hover:bg-sky-600 cursor-pointer transition-[background]`}
          >
            <AiOutlineClockCircle className="text-xl text-white" />
          </Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;
