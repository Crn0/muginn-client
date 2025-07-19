import PropTypes from "prop-types";

export default function ChatLayout({ title, children }) {
  return (
    <div className='flex flex-1 flex-col gap-2'>
      <header className='flex justify-between border border-slate-900 p-5'>
        <h2>{title}</h2>
      </header>

      <section className='flex flex-1'>{children}</section>
    </div>
  );
}

ChatLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
