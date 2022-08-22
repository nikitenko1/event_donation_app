import { useState, useEffect, useRef } from 'react';
import NewsDetailModal from './../modal/NewsDetailModal';

const NewsCard = ({ item }) => {
  const [openNewsDetailModal, setOpenNewsDetailModal] = useState(false);

  const newsDetailModalRef = useRef();

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openNewsDetailModal &&
        newsDetailModalRef.current &&
        !newsDetailModalRef.current.contains(e.target)
      ) {
        setOpenNewsDetailModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openNewsDetailModal]);

  return (
    <>
      <div className="bg-orange-400 rounded-md shadow-lg">
        <div>
          <img
            src={item.picture}
            alt={item.title}
            className="w-full h-full rounded-t-md object-cover"
          />
        </div>
        <div className="p-5">
          <h1 className="text-white font-medium text-lg mb-2">{item.title}</h1>
          <button
            onClick={() => setOpenNewsDetailModal(true)}
            className="bg-white text-sky-500 rounded-md px-4 py-2 shadow-xl text-sm"
          >
            View Detail
          </button>
        </div>
      </div>
      <NewsDetailModal
        openNewsDetailModal={openNewsDetailModal}
        setOpenNewsDetailModal={setOpenNewsDetailModal}
        newsDetailModalRef={newsDetailModalRef}
        selectedItem={item}
      />
    </>
  );
};

export default NewsCard;
