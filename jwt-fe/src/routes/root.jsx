import { Link } from "react-router-dom";

export default function RootPage() {
  return (
    <div className="flex flex-col h-screen justify-items-center text-center w-full bg-slate-800 mx-auto text-gray-200">
      <p className="text-4xl mx-auto font-bold text-start py-32">JWT Attack</p>
      <div
        className="flex flex-col justify-center max-w-fit rounded-md shadow-sm mx-auto gap-y-2"
        role="group"
      >
        <div>
          <button
            type="button"
            className="py-2 px-4 text-2xl font-medium bg-transparent rounded border dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-green-900 dark:focus:bg-gray-700 transition-all"
          >
            <Link to={`login`}>Login</Link>
          </button>
        </div>
        <p className="font-semibold text-lg italic">ATTACK 1</p>
        <button
          type="button"
          className="py-2 px-4 text-2xl font-medium bg-transparent rounded border dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-green-700 dark:focus:bg-gray-700 transition-all"
        >
          <Link to={`verify-secure`}>Verify Decode Secure</Link>
        </button>
        <button
          type="button"
          className="py-2 px-4 text-2xl font-medium bg-transparent rounded border dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-red-700 dark:focus:bg-gray-700 transition-all"
        >
          <Link to={`verify-unsecure`}>Verify Decode Unsecure</Link>
        </button>
        <p className="font-semibold text-lg italic">ATTACK 2</p>
        <button
          type="button"
          className="py-2 px-4 text-2xl font-medium bg-transparent rounded border dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-orange-700 dark:focus:bg-gray-700 transition-all"
        >
          <Link to={`crack`}>Crack Secret</Link>
        </button>
        <p className="font-semibold text-lg italic  mt-8">DEBUGGER</p>
        <a href="https://jwt.io/#debugger-io" target="_blank" rel="noreferrer">
          <button
            type="button"
            className="py-2 px-4 text-2xl font-medium bg-transparent rounded border dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:focus:bg-gray-700 transition-all"
          >
            JWT IO
          </button>
        </a>
      </div>
      <p className="text-center mt-16 italic">
        19011047 - Cihat İslam Dede
        <br />
        19011009 - Özkan Özeşme
        <br />
        19011609 - Mehmet Celal Keleş 19011046
        <br />
        19011046 - Burak Erdilli
      </p>
    </div>
  );
}
