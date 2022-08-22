import { useState, useEffect, useRef } from 'react';
import { AiFillCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';
import EventDetailModal from './../modal/EventDetailModal';

const EventCard = ({ item }) => {
  const [openEventDetailModal, setOpenEventDetailModal] = useState(false);

  const eventDetailModalRef = useRef();

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openEventDetailModal &&
        eventDetailModalRef.current &&
        !eventDetailModalRef.current.contains(e.target)
      ) {
        setOpenEventDetailModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openEventDetailModal]);
  return (
    <>
      <div className="bg-orange-400 rounded-md flex items-center md:p-4 p-0 gap-5 flex-col md:flex-row">
        <div className="bg-gray-300 md:w-[150px] h-[150px] w-full md:rounded-md rounded-tl-md rounded-tr-md">
          <img
            src={item.picture}
            alt={item.name}
            className="w-full h-full rounded-md object-cover"
          />
        </div>
        <div className="flex-[2] text-white pb-7 md:pb-0">
          <div className="flex mb-3 items-center justify-between">
            <h1 className="font-medium text-lg">{item.name}</h1>
            <p>{item.donor.name}</p>
          </div>
          <p className="flex items-center gap-2 mb-3 capitalize">
            <GoLocation />
            {item.location}
          </p>
          <div className="flex items-center gap-5 mb-4">
            <p className="flex items-center gap-2">
              <AiFillCalendar />
              {new Date(item.date).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2">
              <AiOutlineClockCircle />
              {item.timeStart} - {item.timesUp}
            </p>
          </div>
          <button
            onClick={() => setOpenEventDetailModal(true)}
            className="bg-white text-sky-500 text-sm px-4 py-2 rounded-md shadow-xl"
          >
            View Detail
          </button>
        </div>
      </div>
      <EventDetailModal
        openEventDetailModal={openEventDetailModal}
        setOpenEventDetailModal={setOpenEventDetailModal}
        eventDetailModalRef={eventDetailModalRef}
        selectedItem={item}
      />
    </>
  );
};

export default EventCard;
