import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="bg-sky-400 p-20 flex flex-col md:flex-row marker:items-center justify-between">
      <div>
        <h1
          data-aos="fade-right"
          className="md:text-2xl text-md mt-8 md:mt-0 text-white mb-8 leading-10 font-medium"
        >
          Calls for greater food democracy in Europe have emerged as the
          limitations of urban food systems dominated by commercial
          organisations are documented, but little attention has been paid to
          how policy arrangements affect attempts to transition to more
          democratic food futures.
        </h1>
        <div data-aos="fade-right" data-aos-delay="100">
          <Link
            to="/events"
            className="bg-white shadow-xl text-sky-500 rounded-md text-sm px-4 py-3"
          >
            Find Donations
          </Link>
        </div>
      </div>
      <div data-aos="fade-left">
        <img
          src={`${process.env.PUBLIC_URL}/images/banner.png`}
          alt="Let's build | Kyiv"
          className="w-[500px]"
        />
      </div>
    </div>
  );
};

export default Banner;
