import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './../components/admin/Layout';
import Loader from './../components/global/Loader';
import NotFound from './../components/global/NotFound';
import HeadInfo from '../utils/HeadInfo';
import {
  getUnverifiedDonor,
  verifyDonor,
  rejectDonor,
} from './../redux/slices/approvalSlice';
import DonorDetailModal from './../components/modal/DonorDetailModal';

const Approval = () => {
  const [openDonorDetailModal, setOpenDonorDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const donorDetailModalRef = useRef();
  const dispatch = useDispatch();
  const { auth, alert, approval } = useSelector((state) => state);

  const handleClickDetail = (item) => {
    setSelectedItem(item);
    setOpenDonorDetailModal(true);
  };

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDonorDetailModal &&
        donorDetailModalRef.current &&
        !donorDetailModalRef.current.contains(e.target)
      ) {
        setOpenDonorDetailModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openDonorDetailModal]);

  useEffect(() => {
    dispatch(getUnverifiedDonor({ token: `${auth.accessToken}` }));
  }, [dispatch, auth.accessToken]);

  if (auth.user?.role !== 'admin') {
    return <NotFound />;
  }

  return (
    <>
      <HeadInfo title="Approval" />
      <Layout>
        <h1 className="text-xl">Donor Confirmation</h1>
        {alert.loading ? (
          <Loader size="xl" />
        ) : (
          <>
            {approval.length === 0 ? (
              <div className="mt-6 bg-red-500 text-sm text-white w-fit rounded-md px-6 py-3">
                No data found
              </div>
            ) : (
              <div className="overflow-x-auto mt-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm bg-sky-400 text-white">
                      <th className="p-3">No</th>
                      <th>Organization Name</th>
                      <th>Name of the owner</th>
                      <th>Registration Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approval.map((item, idx) => (
                      <tr className="text-sm text-center bg-gray-100" key={idx}>
                        <td className="p-3">1</td>
                        <td>{item.name}</td>
                        <td>{item.owner}</td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="bg-blue-400 px-2 py-1 text-white text-xs rounded-md mr-3 hover:bg-blue-500 transition-[background]"
                            onClick={() => handleClickDetail(item)}
                          >
                            Detail
                          </button>
                          <button
                            className="bg-green-400 px-2 py-1 text-white text-xs rounded-md mr-3 hover:bg-green-500 transition-[background]"
                            onClick={() =>
                              dispatch(
                                verifyDonor({
                                  id: item._id,

                                  token: `${auth.accessToken}`,
                                })
                              )
                            }
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              dispatch(
                                rejectDonor({
                                  id: item._id,

                                  token: `${auth.accessToken}`,
                                })
                              )
                            }
                            className="bg-red-400 px-2 py-1 text-white text-xs rounded-md hover:bg-red-500 transition-[background]"
                          >
                            Reject
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
        openDonorDetailModal={openDonorDetailModal}
        setOpenDonorDetailModal={setOpenDonorDetailModal}
        donorDetailModalRef={donorDetailModalRef}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default Approval;
