import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { ImUsers } from 'react-icons/im';
import { BiDonateHeart } from 'react-icons/bi';
import { register } from './../../redux/slices/authSlice';
import Loader from './../../components/global/Loader';

const SelectRoleModal = ({
  openSelectRoleModal,
  setOpenSelectRoleModal,
  modalRef,
  userData,
}) => {
  const [selectedRole, setSelectedRole] = useState('');

  const dispatch = useDispatch();
  const { alert } = useSelector((state) => state);

  const handleSubmit = () => {
    if (!selectedRole) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          errors: 'Account type must be selected here.',
        },
      });
    }

    dispatch(register({ ...userData, role: selectedRole }));
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,.7)] ${
        openSelectRoleModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-[opacity] flex items-center justify-center p-4 bg-[rgba(0,0,0,.7)]`}
    >
      <div
        ref={modalRef}
        className={`bg-white w-full ${
          openSelectRoleModal ? 'translate-y-0' : '-translate-y-12'
        } transition-[transform] max-w-[500px] rounded-md`}
      >
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-300">
          <h1 className="text-lg">Choose Your Role</h1>
          <AiOutlineClose
            className="text-lg cursor-pointer"
            onClick={() => setOpenSelectRoleModal(false)}
          />
        </div>
        <div className="text-center pb-7">
          <div className="flex items-center gap-20 justify-center p-5">
            <div
              onClick={() => setSelectedRole('user')}
              className={`${
                selectedRole === 'user'
                  ? 'border-sky-400 border-4'
                  : 'border-gray-300'
              } border border-gray-300 rounded-md p-4 flex items-center justify-center flex-col cursor-pointer hover:scale-105 transition-[transform]`}
            >
              <div>
                <ImUsers className="text-8xl text-sky-400" />
              </div>
              <p className="mt-3">User</p>
            </div>
            <div
              onClick={() => setSelectedRole('donor')}
              className={`${
                selectedRole === 'donor'
                  ? 'border-sky-400 border-4'
                  : 'border-gray-300'
              } border border-gray-300 rounded-md p-4 flex items-center justify-center flex-col cursor-pointer hover:scale-105 transition-[transform]`}
            >
              <div>
                <BiDonateHeart className="text-8xl text-sky-400" />
              </div>
              <p className="mt-3">Donor</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={alert.loading ? true : false}
            className={`${
              alert.loading
                ? 'bg-sky-200 hover:bg-sky-200 cursor-auto'
                : 'bg-sky-400 hover:bg-sky-500 cursor-pointer'
            } mt-4 px-5 py-2 m-auto text-white text-sm rounded-md transition-[background]`}
          >
            {alert.loading ? <Loader /> : 'Choose'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRoleModal;
