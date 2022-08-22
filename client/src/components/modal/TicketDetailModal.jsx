import {
  AiOutlineClockCircle,
  AiOutlineClose,
  AiFillCalendar,
} from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';

const TicketDetailModal = ({
  openTicketDetailModal,
  setOpenTicketDetailModal,
  ticketDetailModalRef,
  selectedItem,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        openTicketDetailModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-[opacity] z-[999] flex items-center justify-center p-4 bg-[rgba(0,0,0,.7)]`}
    >
      <div
        ref={ticketDetailModalRef}
        className={`bg-white w-full ${
          openTicketDetailModal ? 'translate-y-0' : '-translate-y-12'
        } transition-[transform] max-w-[500px] rounded-md`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-300">
          <h1>{selectedItem?.event?.name} Ticket Details</h1>
          <AiOutlineClose
            onClick={() => setOpenTicketDetailModal(false)}
            className="text-lg cursor-pointer"
          />
        </div>
        <div className="p-5">
          <div className="w-full h-[200px] bg-gray-300 rounded-md">
            <img
              src={selectedItem?.event?.picture}
              alt={selectedItem?.name}
              className="rounded-md w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-justify text-sm text-gray-800 mt-3 leading-loose">
              {selectedItem?.event?.description}
            </p>
            <p className="flex items-center gap-3 mt-3 text-sm text-gray-700 capitalize">
              <GoLocation />
              {selectedItem?.event?.location}
            </p>
            <p className="flex items-center gap-3 mt-3 text-sm text-gray-700">
              <AiFillCalendar />
              {new Date(selectedItem?.event?.date).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-3 mt-3 text-sm text-gray-700">
              <AiOutlineClockCircle />
              {selectedItem?.event?.timeStart} - {selectedItem?.event?.timesUp}
            </p>
          </div>
          <div className="bg-green-500 rounded-md mt-5 text-white text-sm text-center p-3">
            <p>ID Registration: {selectedItem._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
