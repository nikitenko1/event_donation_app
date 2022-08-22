import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineChevronDown, HiSortDescending } from 'react-icons/hi';
import { IoRefreshOutline, IoTodayOutline } from 'react-icons/io5';
import { MdFilterAlt } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';

const Filter = ({ handleFilter }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [sort, setSort] = useState('');

  const filterRef = useRef();

  const { event } = useSelector((state) => state);

  const handleResetFilter = () => {
    setSelectedCategory([]);
    setSelectedLocation([]);
    setSort('');
    handleFilter([], [], 'latest');
  };

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target)
      ) {
        setOpenFilter(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilter]);

  const getCategoryAndLocation = useCallback(() => {
    const locationTemp = [];
    const categoryTemp = [];

    event.data.forEach((item) => {
      if (!locationTemp.includes(item.location)) {
        locationTemp.push(item.location);
      }

      if (!categoryTemp.includes(item.category)) {
        categoryTemp.push(item.category);
      }
    });
    setLocationList(locationTemp);
    setCategoryList(categoryTemp);
  }, [event.data]);

  const handleChangeCategory = (e) => {
    if (!selectedCategory.includes(e.target.value)) {
      setSelectedCategory([...selectedCategory, e.target.value]);
    } else {
      const newCategory = selectedCategory.filter(
        (item) => item !== e.target.value
      );
      setSelectedCategory(newCategory);
    }
  };

  const handleChangeLocation = (e) => {
    if (!selectedLocation.includes(e.target.value)) {
      setSelectedLocation([...selectedLocation, e.target.value]);
    } else {
      const newLocation = selectedLocation.filter(
        (item) => item !== e.target.value
      );
      setSelectedLocation(newLocation);
    }
  };

  useEffect(() => {
    getCategoryAndLocation();
  }, [getCategoryAndLocation]);
  return (
    <>
      <div
        onClick={() => setOpenFilter(true)}
        className="flex items-center w-fit bg-orange-400 text-white rounded-md mb-6 shadow-xl px-3 py-2 md:hidden"
      >
        <MdFilterAlt />
        Filter
      </div>
      <div
        ref={filterRef}
        className={`flex-1 pb-10 bg-orange-400 text-white md:static fixed top-0 ${
          openFilter ? 'left-0 z-[999]' : '-left-[350px] -z-[999]'
        } md:z-[9] transition-all shadow-xl bottom-0`}
      >
        <AiOutlineClose
          onClick={() => setOpenFilter(false)}
          className="md:hidden block text-white my-6 float-right mr-5 text-xl cursor-pointer"
        />
        <div className="clear-both" />
        <div className="border-b border-white p-4 flex items-center gap-3">
          <MdFilterAlt className="text-white text-xl -translate-y-[1px]" />
          <h1 className="text-xl">Filter</h1>
        </div>
        <div className="p-4 border-b border-white">
          <div className="flex items-center gap-3">
            <HiOutlineChevronDown />
            <p>Category</p>
          </div>
          <div className="px-7">
            {categoryList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 mt-3">
                <input
                  type="checkbox"
                  checked={selectedCategory.includes(item) ? true : false}
                  id={item}
                  onChange={handleChangeCategory}
                  value={item}
                />
                <label htmlFor={item} className="capitalize">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-b border-white">
          <div className="flex items-center gap-3">
            <HiOutlineChevronDown />
            <p>Location</p>
          </div>
          <div className="px-7">
            {locationList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 mt-3">
                <input
                  type="checkbox"
                  id={item}
                  checked={selectedLocation.includes(item) ? true : false}
                  onChange={handleChangeLocation}
                  value={item}
                />
                <label htmlFor={item} className="capitalize">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <HiOutlineChevronDown />
            <p>Sort</p>
          </div>
          <div className="px-7">
            {' '}
            <div
              onClick={() => setSort('latest')}
              className="flex items-center gap-3 mt-3 cursor-pointer w-fit"
            >
              <HiSortDescending />
              <label
                htmlFor="latest"
                className={`${
                  sort === 'latest' ? 'underline' : undefined
                } cursor-pointer`}
              >
                Latest
              </label>
            </div>
            <div
              onClick={() => setSort('today')}
              className="flex items-center gap-3 mt-3 cursor-pointer w-fit"
            >
              <IoTodayOutline />
              <label
                htmlFor="today"
                className={`${
                  sort === 'today' ? 'underline' : undefined
                } cursor-pointer`}
              >
                Today
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-7 px-10 mt-4">
          <button
            onClick={() =>
              handleFilter(selectedCategory, selectedLocation, sort)
            }
            className="px-4 py-2 bg-white text-orange-500 rounded-md shadow-xl text-sm"
          >
            Apply Filter
          </button>
          <IoRefreshOutline
            onClick={handleResetFilter}
            className="text-2xl cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default Filter;
