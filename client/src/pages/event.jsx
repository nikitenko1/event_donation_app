import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventDonor, deleteEvent } from './../redux/slices/eventSlice';
import Layout from './../components/admin/Layout';
import DeleteModal from './../components/modal/DeleteModal';
import EventDetailModal from './../components/modal/EventDetailModal';
import CreateEventModal from './../components/modal/CreateEventModal';
import Loader from './../components/global/Loader';
import NotFound from './../components/global/NotFound';
import EventRegistrationModal from './../components/modal/EventRegistrationModal';

const Event = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openCreateEventModal, setOpenCreateEventModal] = useState(false);
  const [openEventRegistrationModal, setOpenEventRegistrationModal] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState();

  const [events, setEvents] = useState([]);

  const dispatch = useDispatch();
  const { auth, alert, donor_event } = useSelector((state) => state);

  const handleClickCreate = () => {
    setSelectedItem();
    setOpenCreateEventModal(true);
  };

  const handleClickRegistrant = (item) => {
    setSelectedItem(item);
    setOpenEventRegistrationModal(true);
  };

  const handleClickUpdate = (item) => {
    setSelectedItem(item);
    setOpenCreateEventModal(true);
  };

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const handleDeleteEvent = () => {
    dispatch(
      deleteEvent({
        id: selectedItem._id,

        token: `${auth.accessToken}`,
      })
    );
    setOpenDeleteModal(false);
    setSelectedItem();
  };

  const handleClickDetail = (item) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  const deleteModalRef = useRef();
  const detailModalRef = useRef();
  const createEventModalRef = useRef();
  const eventRegistrationModalRef = useRef();

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
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
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openDeleteModal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDetailModal &&
        detailModalRef.current &&
        !detailModalRef.current.contains(e.target)
      ) {
        setOpenDetailModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDetailModal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openCreateEventModal &&
        createEventModalRef.current &&
        !createEventModalRef.current.contains(e.target)
      ) {
        setOpenCreateEventModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCreateEventModal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openEventRegistrationModal &&
        eventRegistrationModalRef.current &&
        !eventRegistrationModalRef.current.contains(e.target)
      ) {
        setOpenEventRegistrationModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openEventRegistrationModal]);

  useEffect(() => {
    const handleEventDonor = async () => {
      await dispatch(getEventDonor({ token: `${auth.accessToken}` }));
    };
    handleEventDonor();
  }, [auth.accessToken, dispatch]);

  useEffect(() => {
    setEvents(donor_event.data);
  }, [donor_event.data]);

  if (auth.user?.role !== 'donor') {
    return <NotFound />;
  }

  return (
    <>
      <Layout>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl text-sky-400 font-medium">Event List</h1>
          <button
            onClick={handleClickCreate}
            className=" hover:bg-sky-500 transition-[background] bg-sky-400 px-3 py-2 text-sm text-white rounded-md"
          >
            Add Event
          </button>
        </div>
        {alert.loading ? (
          <Loader size="xl" />
        ) : (
          <>
            {events.length === 0 ? (
              <div className="mt-6 bg-red-500 text-sm text-white w-fit rounded-md px-6 py-3">
                No data found
              </div>
            ) : (
              <div className="overflow-x-auto mt-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm bg-sky-400 text-white">
                      <th className="p-3">No</th>
                      <th>Name Event</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Capacity</th>
                      <th>Number of Registrants</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((item, idx) => (
                      <tr
                        key={item._id}
                        className="text-sm text-center bg-gray-100"
                      >
                        <td className="p-3">{idx + 1}</td>
                        <td>{item.name}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>
                          {item.timeStart} - {item.timesUp}
                        </td>
                        <td>{item.location}</td>
                        <td>{item.capacity}</td>
                        <td>{item.registrant?.length}</td>
                        <td>
                          <button
                            onClick={() => handleClickRegistrant(item)}
                            className="bg-orange-400 px-2 py-1 text-white text-xs rounded-md hover:bg-orange-500 transition-[background] mr-3"
                          >
                            Registrant
                          </button>
                          <button
                            onClick={() => handleClickUpdate(item)}
                            className="bg-yellow-500 px-2 py-1 text-white text-xs rounded-md hover:bg-yellow-600 transition-[background] mr-3"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleClickDetail(item)}
                            className="bg-blue-400 px-2 py-1 text-white text-xs rounded-md mr-3 hover:bg-blue-500 transition-[background]"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => handleClickDelete(item)}
                            className="bg-red-400 px-2 py-1 text-white text-xs rounded-md hover:bg-red-500 transition-[background]"
                          >
                            Wipe
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
      <EventRegistrationModal
        openModal={openEventRegistrationModal}
        setOpenModal={setOpenEventRegistrationModal}
        modalRef={eventRegistrationModalRef}
        registrant={selectedItem?.registrant}
      />

      <CreateEventModal
        openCreateEventModal={openCreateEventModal}
        setOpenCreateEventModal={setOpenCreateEventModal}
        createEventModalRef={createEventModalRef}
        selectedItem={selectedItem}
      />

      <EventDetailModal
        openEventDetailModal={openDetailModal}
        setOpenEventDetailModal={setOpenDetailModal}
        eventDetailModalRef={detailModalRef}
        selectedItem={selectedItem}
        hideButton={true}
      />

      <DeleteModal
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        deleteModalRef={deleteModalRef}
        onClick={handleDeleteEvent}
      />
    </>
  );
};

export default Event;
