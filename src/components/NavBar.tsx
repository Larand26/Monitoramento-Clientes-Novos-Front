import isoLogo from "../assets/logo-isologo_white.svg";

export default function NavBar() {
  return (
    <>
      <nav className="bg-card py-2 px-4 flex justify-between items-center">
        <div>
          <img src={isoLogo} alt="Logo" className="w-15" />
        </div>
        <div>
          <ul className="flex gap-10">
            <li>
              <a href="" className="text-main hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="" className="text-main hover:text-gray-300">
                Dashboard
              </a>
            </li>
            <li>
              <a href="" className="text-main hover:text-gray-300">
                Clientes
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="user"></div>
        </div>
      </nav>
    </>
  );
}
