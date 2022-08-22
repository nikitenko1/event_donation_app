import { AiOutlineClose } from 'react-icons/ai';

const DonorDetailModal = ({
  openDonorDetailModal,
  setOpenDonorDetailModal,
  donorDetailModalRef,
  selectedItem,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        openDonorDetailModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-[opacity] flex items-center justify-center p-4 bg-[rgba(0,0,0,.7)]`}
    >
      <div
        ref={donorDetailModalRef}
        className={`bg-white w-full ${
          openDonorDetailModal ? 'translate-y-0' : '-translate-y-12'
        } transition-[transform] max-w-[500px] rounded-md`}
      >
        <div className="border-b border-gray-300 px-5 py-3 flex items-center justify-between">
          <h1 className="text-lg">Donor Information</h1>
          <AiOutlineClose
            onClick={() => setOpenDonorDetailModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-5 h-[550px] overflow-auto hide-scrollbar">
          <div>
            <h1 className="text-sm">Organization Name</h1>
            <p className="border border-gray-300 bg-gray-100 mt-3 text-sm rounded-md px-3 h-10 flex items-center">
              {selectedItem?.name}
            </p>
          </div>
          <div className="mt-5">
            <h1 className="text-sm">Name of the owner</h1>
            <p className="border border-gray-300 bg-gray-100 mt-3 text-sm rounded-md px-3 h-10 flex items-center">
              {selectedItem?.owner}
            </p>
          </div>
          <div className="mt-5">
            <h1 className="text-sm">Slogan</h1>
            <p className="border border-gray-300 bg-gray-100 mt-3 text-sm rounded-md px-3 h-10 flex items-center">
              {selectedItem?.slogan}
            </p>
          </div>
          <div className="mt-5">
            <h1 className="text-sm">Address</h1>
            <p className="border border-gray-300 bg-gray-100 mt-3 text-sm rounded-md px-3 h-10 flex items-center">
              {selectedItem?.address}
            </p>
          </div>
          <div className="mt-5">
            <h1 className="text-sm">Email</h1>
            <p className="border border-gray-300 bg-gray-100 mt-3 text-sm rounded-md px-3 h-10 flex items-center">
              {selectedItem?.user?.email}
            </p>
          </div>
          <div className="mt-5">
            <h1 className="text-sm">Username</h1>
            <p className="border border-gray-300 bg-gray-100 mt-3 text-sm rounded-md px-3 h-10 flex items-center">
              {selectedItem?.user?.username}
            </p>
          </div>
          <button
            onClick={() => setOpenDonorDetailModal(false)}
            className="float-right mt-4 bg-sky-400 px-4 py-2 rounded-md text-sm text-white hover:bg-orange-500 transition-[background]"
          >
            Closed
          </button>
          <div className="clear-both" />
        </div>
      </div>
    </div>
  );
};

export default DonorDetailModal;
