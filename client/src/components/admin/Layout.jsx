import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <div className="py-7 px-10">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
