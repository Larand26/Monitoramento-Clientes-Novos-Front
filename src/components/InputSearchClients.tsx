export default function InputSearchClients() {
  return (
    <div>
      <div className="flex items-center gap-2 relative">
        <input className="w-full bg-card rounded-full p-2 text-main min-w-[500px]" />
        <button className="bg-page rounded-full p-2 text-main absolute right-2 cursor-pointer hover:bg-card transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
      <div></div>
    </div>
  );
}
