import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full h-screen flex-col flex items-center justify-center">
      <p className="text-xl">404 | Not Found</p>
      <Link
        to="/"
        className="bg-sky-400 rounded-md px-4 py-3 transition-[background] hover:bg-sky-500 mt-5 text-white"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
