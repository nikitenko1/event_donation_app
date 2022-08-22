import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, deleteUser } from './../redux/slices/userSlice';
import Layout from './../components/admin/Layout';
import DeleteModal from './../components/modal/DeleteModal';
import NotFound from './../components/global/NotFound';
import Loader from './../components/global/Loader';

const User = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  const deleteModalRef = useRef();

  const dispatch = useDispatch();
  const { auth, alert, user } = useSelector((state) => state);

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDeleteModal &&
        /**
         * Alert if clicked on outside of element
         */
        deleteModalRef.current &&
        !deleteModalRef.current.contains(e.target)
      ) {
        setOpenDeleteModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openDeleteModal]);

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    await dispatch(
      deleteUser({
        id: selectedItem._id,

        token: `${auth.accessToken}`,
      })
    );
    setOpenDeleteModal(false);
    setSelectedItem();
  };

  useEffect(() => {
    dispatch(
      getUser({
        token: `${auth.accessToken}`,
      })
    );
  }, [dispatch, auth.accessToken]);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <Layout>
        <h1 className="text-xl text-sky-400 font-medium">User List</h1>
        {alert.loading ? (
          <Loader size="xl" />
        ) : (
          <>
            {user.length === 0 ? (
              <div className="mt-6 bg-red-500 text-sm text-white w-fit rounded-md px-6 py-3">
                No data found
              </div>
            ) : (
              <div className="overflow-x-auto mt-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm bg-sky-400 text-white">
                      <th className="p-3">No</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.map((item, idx) => (
                      <tr className="text-sm text-center bg-gray-100">
                        <td className="p-3">{idx + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.username}</td>
                        <td>
                          <button
                            onClick={() => handleClickDelete(item)}
                            className="bg-red-400 px-2 py-1 text-white text-xs rounded-md hover:bg-red-500 transition-[background]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Layout>
      <DeleteModal
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteModalRef={deleteModalRef}
        onClick={handleDeleteUser}
      />
    </>
  );
};

export default User;
