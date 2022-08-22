import { useState, useEffect } from 'react';
import { getDataAPI } from './../../utils/fetchData';
import EventCard from './EventCard';

const LatestEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getDataAPI('event/home').then((res) => {
      setEvents(res.data.events);
    });
  }, []);

  return (
    <div className="p-14">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl text-sky-500">Latest Events</h1>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mt-7">
        {events.map((item) => (
          <EventCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default LatestEvents;
