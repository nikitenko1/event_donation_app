import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './../components/admin/Layout';
import DeleteModal from './../components/modal/DeleteModal';
import DonorDetailModal from './../components/modal/DonorDetailModal';
import NotFound from './../components/global/NotFound';
import Loader from './../components/global/Loader';
import { deleteDonor, getDonor } from '../redux/slices/donorSlice';
import HeadInfo from '../utils/HeadInfo';

const Donor = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  const deleteModalRef = useRef();
  const detailModalRef = useRef();

  const dispatch = useDispatch();
  const { auth, alert, donor } = useSelector((state) => state);

  const handleClickDetail = (item) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const handleDeleteDonor = (item) => {
    dispatch(
      deleteDonor({
        id: selectedItem._id,

        token: `${auth.accessToken}`,
      })
    );
    setOpenDeleteModal(false);
    setSelectedItem();
  };

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDeleteModal &&
        detailModalRef.current &&
        !detailModalRef.current.contains(e.target)
      ) {
        setOpenDetailModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openDeleteModal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDeleteModal &&
        deleteModalRef.current &&
        !deleteModalRef.current.contains(e.target)
      ) {
        setOpenDeleteModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDeleteModal]);

  useEffect(() => {
    dispatch(getDonor(auth.accessToken));
  }, [dispatch, auth.accessToken]);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="Event List" />
      <Layout>
        <h1 className="text-xl text-cyan-400 font-medium">Donor List</h1>
        {alert.loading ? (
          <Loader size="xl" />
        ) : (
          <>
            {donor.length === 0 ? (
              <div className="mt-6 bg-red-500 text-sm text-white w-fit rounded-md px-6 py-3">
                No data found
              </div>
            ) : (
              <div className="overflow-x-auto mt-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm bg-cyan-400 text-white">
                      <th className="p-3">No</th>
                      <th>Donor Name</th>
                      <th>Name of the owner</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donor.map((item, idx) => (
                      <tr className="text-sm text-center bg-gray-100" key={idx}>
                        <td className="p-3">{idx + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.owner}</td>
                        <td>{item.address}</td>

                        <td>
                          <button
                            onClick={() => handleClickDetail(item)}
                            className="bg-blue-400 px-2 py-1 text-white text-xs rounded-md mr-3 hover:bg-blue-500 transition-[background]"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => handleClickDelete(item)}
                            className="bg-red-400 px-2 py-1 text-white text-xs rounded-md mr-3 hover:bg-red-500 transition-[background]"
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
      <DonorDetailModal
        openDonorDetailModal={openDetailModal}
        setOpenDonorDetailModal={setOpenDetailModal}
        donorDetailModalRef={detailModalRef}
        selectedItem={selectedItem}
      />
      <DeleteModal
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteModalRef={deleteModalRef}
        onClick={handleDeleteDonor}
      />
    </>
  );
};

export default Donor;
