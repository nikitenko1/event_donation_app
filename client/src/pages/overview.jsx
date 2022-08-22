import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDataAPI } from './../utils/fetchData';
import NotFound from './../components/global/NotFound';
import Layout from './../components/admin/Layout';
import HeadInfo from '../utils/HeadInfo';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// A short registration format is also available to quickly register everything.
Chart.register(...registerables);

const Overview = () => {
  const [monthlyEvent, setMonthlyEvent] = useState([]);

  const { auth } = useSelector((state) => state);

  useEffect(() => {
    getDataAPI('dashboard/donor', `${auth.accessToken}`).then((res) => {
      setMonthlyEvent(res.data.monthlyEvent);
    });
  }, [auth.accessToken]);

  if (auth.user?.role !== 'donor') {
    return <NotFound />;
  }
  return (
    <>
      <HeadInfo title="Donor Dashboard" />
      <Layout>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl text-sky-400 font-medium">Donor Summary</h1>
        </div>
        <div className="mt-8">
          <div className="w-[750px]">
            {/* Primitive[] */}
            {/* type: 'bar',
                data: {
                datasets: [{
                   data: [20, 10],
                }],
             labels: ['a', 'b']  The values for the labels have to be provided in an array. */}
            <Bar
              data={{
                labels: monthlyEvent.map((item) => item.month),
                datasets: [
                  {
                    label: 'Event Growth',
                    data: monthlyEvent.map((item) => item.count),
                    backgroundColor: ['skyblue'],
                  },
                ],
              }}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Overview;
