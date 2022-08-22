import React from 'react';
import Footer from './../components/global/Footer';
import Navbar from './../components/global/Navbar';
import Banner from './../components/home/Banner';
import Overview from './../components/home/Overview';
import LatestEvents from './../components/home/LatestEvents';
import LatestNews from './../components/home/LatestNews';
import HeadInfo from '../utils/HeadInfo';

const Home = () => {
  return (
    <>
      <HeadInfo title="Home" />
      <Navbar />
      <Banner />
      <Overview />
      <LatestEvents />
      <LatestNews />
      <Footer />
    </>
  );
};

export default Home;
