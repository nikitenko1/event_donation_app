import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { createNews, updateNews } from './../../redux/slices/newsSlice';
import Loader from './../global/Loader';

const CreateNewsModal = ({
  openCreateNewsModal,
  setOpenCreateNewsModal,
  createNewsModalRef,
  selectedItem,
}) => {
  const [newsData, setNewsData] = useState({
    title: '',
    content: '',
  });

  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewsData({ ...newsData, [name]: value });
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setPicture(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newsData.title || !newsData.content || !picture) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors:
            'All necessary information for adding news was not provided correctly.',
        },
      });
    }
    if (selectedItem) {
      dispatch(
        updateNews({
          ...newsData,
          picture,
          _id: selectedItem._id,

          token: `${auth.accessToken}`,
        })
      );
    } else {
      dispatch(
        createNews({ ...newsData, picture, token: `${auth.accessToken}` })
      );
    }

    setLoading(true);
    setLoading(false);
    setOpenCreateNewsModal(false);
    setNewsData({ title: '', content: '' });
    setPicture();
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        openCreateNewsModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-[opacity] flex items-center justify-center p-4 bg-[rgba(0,0,0,.7)]`}
    >
      <div
        ref={createNewsModalRef}
        className={`bg-white w-full max-w-[500px] rounded-md transition-[transform]  ${
          openCreateNewsModal ? 'translate-y-0' : '-translate-y-12'
        }`}
      >
        <div className="border-b border-gray-300 px-5 py-4 flex items-center justify-between">
          <h1>Add News</h1>
          <AiOutlineClose
            onClick={() => setOpenCreateNewsModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="text-sm" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                autoComplete="off"
                value={newsData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md h-10 px-2 outline-0 mt-3 text-sm"
              />
            </div>
            <div className="mt-5">
              <label className="text-sm" htmlFor="picture">
                Picture
              </label>
              <div className="flex mt-3 gap-3 rounded-md">
                {picture && (
                  <div className="bg-gray-300 shrink-0 w-24 h-24 rounded-md">
                    <img
                      src={
                        picture
                          ? typeof picture === 'string'
                            ? picture
                            : URL.createObjectURL(picture)
                          : ''
                      }
                      alt={newsData.title}
                      className="rounded-md w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  name="picture"
                  id="picture"
                  onChange={handleChangeImage}
                  className="w-full border border-gray-300 rounded-md h-10 px-2 outline-0 text-sm"
                />
              </div>
            </div>
            <div className="mt-5">
              <label className="text-sm" htmlFor="content">
                Content
              </label>
              <textarea
                name="content"
                id="content"
                value={newsData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md h-24 px-2 outline-0 mt-3 resize-none text-xs py-2 leading-relaxed"
              />
            </div>
            <button
              disabled={loading ? true : false}
              className={`${
                loading
                  ? 'bg-sky-200 hover:bg-sky-200 cursor-auto'
                  : 'bg-sky-400 hover:bg-sky-500 cursor-pointer'
              } transition-[background] px-4 py-2 text-sm rounded-md text-white mt-3`}
            >
              {loading ? <Loader /> : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewsModal;
