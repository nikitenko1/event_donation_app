import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoLocation } from 'react-icons/go';
import {
  AiFillCalendar,
  AiOutlineClockCircle,
  AiOutlineClose,
} from 'react-icons/ai';
import { registerEvent } from './../../redux/slices/eventSlice';
import Loader from './../global/Loader';

const EventDetailModal = ({
  openEventDetailModal,
  setOpenEventDetailModal,
  eventDetailModalRef,
  selectedItem,
  hideButton,
}) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleRegisterEvent = () => {
    if (!auth.accessToken) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Please login to register for the event.',
        },
      });
    }
    setLoading(true);
    dispatch(
      registerEvent({
        id: selectedItem._id,

        token: `${auth.accessToken}`,
      })
    );

    setLoading(false);
    setOpenEventDetailModal(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        openEventDetailModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-[opacity] flex items-center z-[999] justify-center p-4 bg-[rgba(0,0,0,.7)]`}
    >
      <div
        ref={eventDetailModalRef}
        className={`bg-white w-full ${
          openEventDetailModal ? 'translate-y-0' : '-translate-y-12'
        } transition-[transform] max-w-[550px] rounded-md`}
      >
        <div className="flex items-center justify-between border-b border-gray-300 px-5 py-3">
          <h1>
            Detail Event:{' '}
            <span className="font-medium text-sky-600">
              {selectedItem?.name}
            </span>
          </h1>
          <AiOutlineClose
            onClick={() => setOpenEventDetailModal(false)}
            className="cursor-pointer text-lg"
          />
        </div>
        <div className="p-5">
          <div className="w-full h-[200px] bg-gray-300 rounded-md">
            <img
              src={selectedItem?.picture}
              alt={selectedItem?.name}
              className="rounded-md w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-justify text-sm text-gray-800 mt-3 leading-loose">
              {selectedItem?.description}
            </p>
            <div className="flex items-center justify-between">
              <p className=" flex items-center gap-3 mt-3 text-sm text-gray-700 capitalize">
                <GoLocation />
                {selectedItem?.location}
              </p>
            </div>
            <div className="flex text-sm text-gray-700 mt-3 font-medium gap-3">
              <p>Registration Expire</p>
              <p>
                {new Date(
                  selectedItem?.expireRegistration
                ).toLocaleDateString()}
              </p>
            </div>
            <p className="flex items-center gap-3 mt-3 text-sm text-gray-700">
              <AiFillCalendar />
              {new Date(selectedItem?.date).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-3 mt-3 text-sm text-gray-700">
              <AiOutlineClockCircle />
              {selectedItem?.timeStart} - {selectedItem?.timesUp}
            </p>
            {!hideButton && (
              <button
                onClick={handleRegisterEvent}
                disabled={loading ? true : false}
                className={`${
                  loading
                    ? 'bg-orange-200 hover:bg-orange-200 cursor-auto'
                    : 'bg-orange-400 hover:bg-orange-500 cursor-pointer'
                } text-sm text-white w-full py-3 rounded-md transition-[background] mt-4`}
              >
                {loading ? (
                  <Loader />
                ) : (
                  `Register (${
                    selectedItem?.capacity - selectedItem?.registrant?.length
                  } Slot Left)`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
