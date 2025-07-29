import PropTypes from "prop-types";
import { FaCircle } from "react-icons/fa6";

import { GroupChatAvatar } from "../image";
import { formatDate } from "../../../utils";

export default function ChatProfilePreview({ name, avatar, memberCount, createdAt, className }) {
  return (
    <div className={className}>
      <div
        className='grid flex-1 gap-5 border border-slate-900 p-2'
        data-testid='user-profile-preview'
      >
        <GroupChatAvatar
          asset={avatar}
          alt={`${name}'s avatar`}
          variant='avatar'
          className='w-20 rounded-full bg-black p-1'
        />

        <div>
          <div>
            <h3 className='font-bold'>{name}</h3>
            <div className='flex items-center-safe gap-2'>
              <FaCircle className='text-gray-500' />
              <p className='font-light'> {memberCount} members</p>
            </div>
          </div>

          <div className='font-light'>{formatDate(createdAt)}</div>
        </div>
      </div>
    </div>
  );
}

ChatProfilePreview.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.shape({
    url: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        size: PropTypes.number,
        format: PropTypes.string,
      })
    ),
  }),
  memberCount: PropTypes.number,
  createdAt: PropTypes.string,
  className: PropTypes.string,
};
