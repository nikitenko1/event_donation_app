import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { getDataAPI, postDataAPI } from './../../utils/fetchData';
import Loader from './../global/Loader';

const DonatorProfileModal = ({
  openDonatorProfileModal,
  setOpenDonatorProfileModal,
  donatorProfileModalRef,
}) => {
  const [profileData, setProfileData] = useState({
    name: '',
    owner: '',
    slogan: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !profileData.name ||
      !profileData.owner ||
      !profileData.slogan ||
      !profileData.email ||
      !profileData.address
    ) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors:
            "The fields for the organization name, owner's name, slogan, email, and also address are mandatory.",
        },
      });
    }

    setLoading(true);
    await postDataAPI('donator', profileData, auth.accessToken)
      .then((res) => {
        dispatch({
          type: 'alert/alert',
          payload: {
            success: res.data.msg,
          },
        });
        setOpenDonatorProfileModal(false);
      })
      .catch((err) => {
        dispatch({
          type: 'alert/alert',
          payload: {
            errors: err.response.data.msg,
          },
        });
      });
    setLoading(false);
  };

  useEffect(() => {
    const handleEvent = async (token) => {
      const res = await getDataAPI('donor/user', token);

      setProfileData({
        nama: res.data.donor.name,
        alamatEmail: auth.user?.email,
        pemilik: res.data.donor.owner,
        slogan: res.data.donor.slogan,
        address: res.data.donor.address,
      });

      if (res.data.donor.status !== 'verified') {
        setStatus('Waiting for verification');
      } else {
        setStatus('Verified');
      }
    };
    try {
      handleEvent(auth.accessToken);
    } catch (err) {
      dispatch({
        type: 'alert/alert',
        payload: { errors: err.response.data.msg },
      });
    }
  }, [dispatch, auth]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        openDonatorProfileModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-[opacity] flex z-[999] items-center justify-center p-4 bg-[rgba(0,0,0,.7)]`}
    >
      <div
        ref={donatorProfileModalRef}
        className={`bg-white w-full ${
          openDonatorProfileModal ? 'translate-y-0' : '-translate-y-12'
        } transition-[transform] max-w-[500px] rounded-md`}
      >
        <div className="border-b border-gray-300 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1>Lengkapi Profil Donatur</h1>
            <p
              className={`text-xs rounded-md p-1 text-white ${
                status === 'Verifikasi gagal'
                  ? 'bg-red-400'
                  : status === 'Belum terverifikasi' ||
                    status === 'Menunggu verifikasi'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            >
              {status}
            </p>
          </div>
          <AiOutlineClose
            onClick={() => setOpenDonatorProfileModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-5 h-[500px] overflow-auto hide-scrollbar">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nama" className="text-sm">
                Organization Name
              </label>
              <input
                disabled={
                  status !== 'Verified' && status !== 'Waiting for verification'
                    ? false
                    : true
                }
                type="text"
                name="name"
                id="name"
                value={profileData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 h-10 outline-0 mt-3 text-sm"
              />
            </div>
            <div className="mt-5">
              <label htmlFor="pemilik" className="text-sm">
                Nama Pemilik
              </label>
              <input
                disabled={
                  status !== 'Terverifikasi' && status !== 'Menunggu verifikasi'
                    ? false
                    : true
                }
                type="text"
                name="pemilik"
                id="pemilik"
                value={profileData.pemilik}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 h-10 outline-0 mt-3 text-sm"
              />
            </div>
            <div className="mt-5">
              <label htmlFor="nik" className="text-sm">
                NIK
              </label>
              <input
                disabled={
                  status !== 'Terverifikasi' && status !== 'Menunggu verifikasi'
                    ? false
                    : true
                }
                type="text"
                name="nik"
                id="nik"
                value={profileData.nik}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 h-10 outline-0 mt-3 text-sm"
              />
            </div>
            <div className="mt-5">
              <label htmlFor="alamatEmail" className="text-sm">
                Email
              </label>
              <input
                disabled={
                  status !== 'Terverifikasi' && status !== 'Menunggu verifikasi'
                    ? false
                    : true
                }
                type="text"
                name="alamatEmail"
                id="alamatEmail"
                value={profileData.alamatEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 h-10 outline-0 mt-3 text-sm"
              />
            </div>
            <div className="mt-5">
              <label htmlFor="alamat" className="text-sm">
                Alamat
              </label>
              <textarea
                disabled={
                  status !== 'Terverifikasi' && status !== 'Menunggu verifikasi'
                    ? false
                    : true
                }
                name="alamat"
                id="alamat"
                value={profileData.alamat}
                onChange={handleChange}
                className="w-full resize-none outline-0 border border-gray-300 h-24 rounded-md p-3 text-sm mt-3"
              />
            </div>
            {status !== 'Terverifikasi' && status !== 'Menunggu verifikasi' && (
              <button
                disabled={loading ? true : false}
                className={`${
                  loading
                    ? 'bg-orange-200 hover:bg-orange-200 cursor-auto'
                    : 'bg-orange-400 hover:bg-orange-500 cursor-pointer'
                } px-4 py-2 rounded-md text-white text-sm mt-3 transition-[background]`}
              >
                {loading ? <Loader /> : 'Simpan'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonatorProfileModal;
