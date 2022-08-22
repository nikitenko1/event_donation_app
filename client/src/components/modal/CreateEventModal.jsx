import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { createEvent, updateEvent } from './../../redux/slices/eventSlice';
import Loader from './../global/Loader';

const CreateEventModal = ({
  openCreateEventModal,
  setOpenCreateEventModal,
  createEventModalRef,
  selectedItem,
}) => {
  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    date: '',
    expireRegistration: '',
    category: '',
    timeStart: '',
    timesUp: '',
    description: '',
    capacity: '',
  });
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setPicture(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !eventData.name ||
      !eventData.location ||
      !eventData.category ||
      !eventData.date ||
      !eventData.expireRegistration ||
      !eventData.timeStart ||
      !eventData.timesUp ||
      !eventData.description ||
      !eventData.capacity ||
      !picture
    ) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Data to add event is incomplete.',
        },
      });
    }

    if (eventData.expireRegistration >= eventData.date) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Invalid registration deadline.',
        },
      });
    }

    if (eventData.timeStart >= eventData.timesUp) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Invalid event time.',
        },
      });
    }

    if (eventData.capacity < 1) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Donation capacity cannot be less than 0.',
        },
      });
    }

    setLoading(true);
    if (selectedItem) {
      dispatch(
        updateEvent({
          ...eventData,
          picture,
          id: selectedItem._id,

          token: `${auth.accessToken}`,
        })
      );
    } else {
      dispatch(
        createEvent({ ...eventData, picture, token: `${auth.accessToken}` })
      );
    }
    setLoading(false);
    setOpenCreateEventModal(false);
    setEventData({
      name: '',
      location: '',
      date: '',
      expireRegistration: '',
      category: '',
      timeStart: '',
      timesUp: '',
      description: '',
      capacity: '',
    });
  };

  useEffect(() => {
    if (selectedItem) {
      setEventData({
        name: selectedItem.name,
        location: selectedItem.location,
        date: selectedItem.date,
        expireRegistration: selectedItem.expireRegistration,
        category: selectedItem.category,
        timeStart: selectedItem.timeStart,
        timesUp: selectedItem.timesUp,
        description: selectedItem.description,
        capacity: selectedItem.capacity,
      });

      setPicture(selectedItem.picture);
    }

    return () => {
      setEventData({
        name: '',
        location: '',
        date: '',
        expireRegistration: '',
        category: '',
        timeStart: '',
        timesUp: '',
        description: '',
        capacity: '',
      });

      setPicture();
    };
  }, [selectedItem]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        openCreateEventModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-[opacity] flex items-center justify-center p-4 bg-[rgba(0,0,0,.7)]`}
    >
      <div
        ref={createEventModalRef}
        className={`bg-white w-full ${
          openCreateEventModal ? 'translate-y-0' : '-translate-y-12'
        } transition-[transform] max-w-[500px] rounded-md`}
      >
        <div className="border-b border-gray-300 px-5 py-4 flex items-center justify-between">
          <h1 className="text-xl">Add Event</h1>
          <AiOutlineClose
            onClick={() => setOpenCreateEventModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-5 max-h-[500px] overflow-auto">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nama" className="text-sm">
                Event Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                autoComplete="off"
                className="w-full border border-gray-300 rounded-md px-3 text-sm outline-0 h-10 mt-3"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="category" className="text-sm">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={eventData.category.toLowerCase()}
                onChange={handleChange}
                autoComplete="off"
                className="w-full border border-gray-300 rounded-md px-3 text-sm outline-0 h-10 mt-3"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="location" className="text-sm">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventData.location.toLowerCase()}
                onChange={handleChange}
                autoComplete="off"
                className="w-full border border-gray-300 rounded-md px-3 text-sm outline-0 h-10 mt-3"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="date" className="text-sm">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 text-sm px-3 rounded-md h-10 mt-3 outline-0"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="expireRegistration" className="text-sm">
                Registration Expire
              </label>
              <input
                type="date"
                name="expireRegistration"
                id="expireRegistration"
                value={eventData.expireRegistration}
                onChange={handleChange}
                className="w-full border border-gray-300 text-sm px-3 rounded-md h-10 mt-3 outline-0"
              />
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div>
                <label htmlFor="timeStart" className="text-sm">
                  Time Start
                </label>
                <input
                  type="time"
                  name="timeStart"
                  id="timeStart"
                  value={eventData.timeStart}
                  onChange={handleChange}
                  className="text-sm w-full mt-3 border border-gray-300 outline-0 rounded-md h-10 px-3"
                />
              </div>
              <div>
                <label htmlFor="timesUp" className="text-sm">
                  Time's up
                </label>
                <input
                  type="time"
                  id="timesUp"
                  name="timesUp"
                  value={eventData.timesUp}
                  onChange={handleChange}
                  className="text-sm w-full mt-3 border border-gray-300 outline-0 rounded-md h-10 px-3"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="text-sm">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={eventData.description}
                onChange={handleChange}
                className="w-full mt-3 resize-none p-3 outline-0 border border-gray-300 rounded-md text-xs h-28 leading-relaxed"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="capacity" className="text-sm">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                id="capacity"
                value={eventData.capacity}
                onChange={handleChange}
                className="w-full mt-3 resize-none p-3 outline-0 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="picture" className="text-sm">
                Picture
              </label>
              <div className="flex gap-4">
                {picture && (
                  <div className="w-24 h-24 rounded-md border border-gray-300 flex-1">
                    <img
                      src={
                        picture
                          ? typeof picture === 'string'
                            ? picture
                            : URL.createObjectURL(picture)
                          : ''
                      }
                      alt={eventData.nama}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChangeImage}
                  className="w-full border border-gray-300 text-sm rounded-md h-10 px-3 py-1 flex-[4]"
                />
              </div>
            </div>
            <button
              disabled={loading ? true : false}
              className={`text-sm text-white rounded-md px-3 py-2 ${
                !loading
                  ? 'bg-sky-400 hover:bg-sky-500 cursor-pointer'
                  : 'bg-sky-200 hover:bg-sky-200 cursor-auto'
              } transition-[background] mt-5`}
            >
              {loading ? <Loader /> : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
