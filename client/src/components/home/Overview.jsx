import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI } from './../../utils/fetchData';
import { getEvent } from './../../redux/slices/eventSlice';

const Overview = () => {
  const [donor, setDonor] = useState(0);
  const [registry, setRegistry] = useState(0);
  const [events, setEvents] = useState(0);
  const [location, setLocation] = useState(0);

  const dispatch = useDispatch();
  const { event } = useSelector((state) => state);

  const getLocation = useCallback(() => {
    const locationTemp = [];

    event.data &&
      event.data.forEach((item) => {
        if (!locationTemp.includes(item.category)) {
          locationTemp.push(item.category);
        }
      });

    setLocation(locationTemp.length);
  }, [event.data]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    const handleEvent = async () => {
      await dispatch(getEvent());
    };
    handleEvent();
  }, [dispatch]);

  useEffect(() => {
    getDataAPI('dashboard/home').then((res) => {
      setDonor(res.data.donorActive);
      setRegistry(res.data.registryDonation);
      setEvents(res.data.numberEvent);
    });
  }, []);

  return (
    <div className="mx-14 my-10">
      <h1
        data-aos="fade-down"
        className="text-sky-400 text-center text-2xl font-medium"
      >
        Let&apos;s build | Kyiv Overview
      </h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-20 mt-10">
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="shadow-xl rounded-md bg-cyan-500	text-white text-center font-medium pt-20 pb-16"
        >
          <p className="mb-4 text-4xl">{donor}</p>
          <p className="text-lg">Number of active donors</p>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="shadow-xl rounded-md bg-cyan-500	text-white text-center font-medium pt-20 pb-16"
        >
          <p className="mb-4 text-4xl">{registry}</p>
          <p className="text-lg">Number of registrants for donation</p>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="shadow-xl rounded-md bg-cyan-500	text-white text-center font-medium pt-20 pb-16"
        >
          <p className="mb-4 text-4xl">{events}</p>
          <p className="text-lg">Number of donation events</p>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="500"
          className="shadow-xl rounded-md bg-cyan-500	text-white text-center font-medium pt-20 pb-16"
        >
          <p className="mb-4 text-4xl">{location}</p>
          <p className="text-lg">Number of locations</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
