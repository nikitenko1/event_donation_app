import React from 'react';

const DeleteModal = ({
  openDeleteModal,
  setOpenDeleteModal,
  deleteModalRef,
  onClick,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        openDeleteModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-[opacity] flex items-center justify-center p-4 bg-[rgba(0,0,0,.7)]`}
    >
      <div
        ref={deleteModalRef}
        className={`bg-white w-full ${
          openDeleteModal ? 'translate-y-0' : '-translate-y-12'
        } transition-[transform] max-w-[600px] rounded-md text-center p-5`}
      >
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/images/delete.svg`}
            alt="Delete"
            width={300}
            className="m-auto"
          />
        </div>
        <h1 className="text-lg my-6">Are you sure you want to delete?</h1>
        <div className="flex items-center justify-center gap-16">
          <button
            onClick={onClick}
            className="bg-red-500 hover:bg-red-600 transition-[background] rounded-md px-4 py-2 text-white"
          >
            Delete
          </button>
          <button
            className="bg-sky-200 hover:bg-sky-600 hover:text-white transition-[background] rounded-md px-4 py-2"
            onClick={() => setOpenDeleteModal(false)}
          >
            Cancelled
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
