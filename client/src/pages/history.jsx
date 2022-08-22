import Navbar from './../components/global/Navbar';
import Footer from './../components/global/Footer';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './../components/global/Loader';
import TicketDetailModal from './../components/modal/TicketDetailModal';
import { getTicket } from './../redux/slices/ticketSlice';
import HeadInfo from '../utils/HeadInfo';

const History = () => {
  const [openTicketDetailModal, setOpenTicketDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const ticketDetailModalRef = useRef();

  const dispatch = useDispatch();
  const { auth, alert, ticket } = useSelector((state) => state);

  const handleClickDetail = (item) => {
    setOpenTicketDetailModal(true);
    setSelectedItem(item);
  };

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openTicketDetailModal &&
        ticketDetailModalRef.current &&
        !ticketDetailModalRef.current.contains(e.target)
      ) {
        setOpenTicketDetailModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openTicketDetailModal]);

  useEffect(() => {
    dispatch(
      getTicket({
        token: `${auth.accessToken}`,
      })
    );
  }, [dispatch, auth]);

  return (
    <>
      <HeadInfo title="History" />
      <div>
        <Navbar />
        <h1 className="px-10 py-8 font-medium text-2xl text-orange-400">
          Event Tickets
        </h1>
        {alert.loading ? (
          <Loader size="xl" />
        ) : (
          <>
            {ticket.length === 0 ? (
              <div className="mx-10 bg-red-500 text-sm text-white w-fit rounded-md px-6 py-3">
                No data found
              </div>
            ) : (
              <div className="px-10 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm bg-sky-400 text-white">
                      <th className="p-3">No</th>
                      <th>Event Name</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticket.map((item, idx) => (
                      <tr
                        key={item._id}
                        className="text-sm text-center bg-gray-100"
                      >
                        <td className="p-3">{idx + 1}</td>
                        <td>{item.event?.name}</td>
                        <td>{item.event?.location}</td>
                        <td>
                          {new Date(item.event?.date).toLocaleDateString()}
                        </td>
                        <td>
                          {item.event?.timeStart} - {item.event?.timesUp}
                        </td>
                        <td>
                          <button
                            onClick={() => handleClickDetail(item)}
                            className="bg-blue-400 px-2 py-1 text-white text-xs rounded-md mr-3 hover:bg-blue-500 transition-[background]"
                          >
                            Detail
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
        <Footer />
      </div>

      <TicketDetailModal
        openTicketDetailModal={openTicketDetailModal}
        setOpenTicketDetailModal={setOpenTicketDetailModal}
        ticketDetailModalRef={ticketDetailModalRef}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default History;
