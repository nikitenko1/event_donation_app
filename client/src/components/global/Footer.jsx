import { AiOutlineInstagram } from 'react-icons/ai';
import { RiTwitterLine } from 'react-icons/ri';
import { FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <div className="md:px-32 md:py-12 bg-sky-400 p-8 mt-20 flex flex-col md:flex-row justify-between">
      <div className="text-white flex-1">
        <h1 className="text-2xl font-medium mb-4">Contact Us</h1>{' '}
        <p className="flex items-center gap-3 mb-2">
          <AiOutlineInstagram />
          Let&apos;s build | Kyiv
        </p>
        <p className="flex items-center gap-3 mb-2">
          <RiTwitterLine />
          Let&apos;s build | Kyiv
        </p>
        <p className="flex items-center gap-3 mb-5">
          <FiMail />
          no_reply@gmail.com
        </p>
        <p className="font-light text-sm">&copy; 2022. All rights reserved.</p>
      </div>
      <div className="text-white flex-1 mt-8 md:mt-0">
        <h1 className="text-2xl font-medium mb-4">About</h1>
        <div>
          <p>
            Food sharing platforms are becoming increasingly popular, but little
            is known about the key determinants of their success, in particular
            those based on the “sharing for the community” model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
