import logo from "../assets/logo_white.svg";

export default function Form(props: {
  email: string;
  passWord: string;
  setEmail: any;
  setPassWord: any;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <form className="bg-card p-8 rounded-lg shadow-md flex flex-col gap-4 w-80 items-center">
          <img src={logo} alt="Logo" className="w-30 h-28 mb-4" />
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-main">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={props.email}
                onChange={(e) => props.setEmail(e.target.value)}
                className="bg-page border border-gray-300 rounded-full px-4 py-1 focus:outline-none text-main"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-main">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={props.passWord}
                onChange={(e) => props.setPassWord(e.target.value)}
                className="bg-page border border-gray-300 rounded-full px-4 py-1 focus:outline-none text-main"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-primary text-white rounded-full px-4 py-2 hover:bg-primary-dark focus:outline-none cursor-pointer transition-colors duration-300"
              >
                Entrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
