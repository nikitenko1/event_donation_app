import { useState, useEffect, useRef } from 'react';
import { AiFillCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';
import EventDetailModal from './../modal/EventDetailModal';

const DetailedEventCard = ({ item }) => {
  const [openEventDetailModal, setOpenEventDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const eventDetailModalRef = useRef();

  const handleClickDetail = () => {
    setOpenEventDetailModal(true);
    setSelectedItem(item);
  };

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
      <div
        onClick={handleClickDetail}
        className="cursor-pointer mb-10 bg-cyan-400 rounded-md flex md:flex-row flex-col items-center gap-7 md:p-8 p-0"
      >
        <div className="md:h-[160px] h-[200px] bg-gray-300 md:rounded-md rounded-t-md md:w-[200px] w-full">
          <img
            src={item.picture}
            alt={item.name}
            className="rounded-md w-full h-full object-cover"
          />
        </div>
        <div className="text-white md:p-0 px-8 pb-8 w-full">
          <div className="flex md:flex-row flex-col md:items-center md:justify-between mb-5">
            <h1 className="text-2xl font-medium">{item.name}</h1>
            <p className="md:text-xl md:mt-0 mt-2 text-md">
              {item.donor?.name}
            </p>
          </div>
          <div className="mb-5">
            <p>{item.deskripsi}</p>
          </div>
          <div className="flex md:flex-row flex-col md:items-center gap-10">
            <p className="flex items-center gap-3">
              <GoLocation />
              {item.location}
            </p>
            <p className="flex items-center gap-3">
              <AiFillCalendar />
              {new Date(item.date).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-3">
              <AiOutlineClockCircle />
              {item.timeStart} - {item.timesUp}
            </p>
          </div>
        </div>
      </div>

      <EventDetailModal
        openEventDetailModal={openEventDetailModal}
        setOpenEventDetailModal={setOpenEventDetailModal}
        eventDetailModalRef={eventDetailModalRef}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default DetailedEventCard;
