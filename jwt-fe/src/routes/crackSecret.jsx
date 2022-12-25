import { useState } from "react";
import { Link } from "react-router-dom";
export default function CrackSecretPage() {
  const [response, setResponse] = useState("");

  const sendFile = async () => {
    try {
      const file = document.querySelector("input[type=file]").files[0];
      const jwt_token = document.getElementById("jwt_token").value;
      const formData = new FormData();
      formData.append("wordlist", file);
      formData.append("token", jwt_token);
      const response = await fetch("http://localhost:3000/crack-secret", {
        method: "POST",
        body: formData,
      });
      const data = await response.text();
      setResponse(data);
    } catch (error) {
      console.log(error);
      setResponse("error on cracking secret");
    }
  };

  return (
    <div className="flex flex-col h-screen  w-full bg-slate-800 mx-auto text-gray-200">
      <div className="flex flex-col justify-center items-center mx-auto my-auto">
        <label className="text-gray-200 mb-2 italic font-semibold">
          Select a wordlist file to crack the secret
        </label>
        <input
          className="placeholder:text-center w-fit text-white mb-3 shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          type="file"
        />
        <input
          type={"text"}
          id="jwt_token"
          placeholder={"Enter the JWT token"}
          className="w-fit placeholder:text-center text-black placeholder:text-black shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          className="m-3 w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={sendFile}
        >
          SEND
        </button>
        {response && (
          <p className="text-white font-bold">
            Secret key:{" "}
            <span className="font-normal italic text-xl">{response}</span>
          </p>
        )}
        <Link to={`/`} className="mt-14">
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
}
