import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [token, setToken] = useState("");
  
  const login = async () => {
    if (
      !document.getElementById("username").value ||
      !document.getElementById("password").value
    ) {
      alert("Please enter a username and password");
      return;
    }
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        is_secure: document.getElementById("issecure").checked,
      }),
    });
    const text = await response.text();
    setToken(text);
    localStorage.setItem("token", text);
  };
  return (
    <div className="flex flex-col h-screen justify-items-center text-center w-full bg-slate-800 mx-auto text-gray-200">
      <div className="my-auto">
        <div className="justify-center align-middle my-auto">
          <h1 className="text-5xl font-bold">Login</h1>
          <form className="mt-4 w-36 md:w-64 mx-auto text-2xl">
            <div>
              <input
                className="placeholder:text-center text-center mb-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Username"
                id="username"
              />

              <input
                className="placeholder:text-center text-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Password"
                id="password"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
              />
              <div className="flex flex-row justify-center align-middle">
                <input className="w-4" type={"checkbox"} id={"issecure"} defaultChecked={true} />
                <label className="text-2xl mx-2" htmlFor={"issecure"}>
                  Secure
                </label>
              </div>
              <button
                className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={login}
              >
                Login
              </button>
              {token ? (
                <div className="max-w-md">
                  <p className="text-sm break-all">Token: {token}</p>
                </div>
              ) : null}
            </div>
          </form>
          <Link to={`/`}>
            <button
              className="m-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Go Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
