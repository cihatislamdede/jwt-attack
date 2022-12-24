import { useState } from "react";

export default function CrackSecretPage() {
  const [response, setResponse] = useState("");
  const sendFile = async () => {
    try {
      const file = document.querySelector("input[type=file]").files[0];
      const secretKey = document.getElementById("secretkey").value;
      console.log(file, secretKey);
      const formData = new FormData();
      formData.append("wordlist", file);
      formData.append("token", secretKey);
      const response = await fetch("http://localhost:3000/crack-secret", {
        method: "POST",
        body: formData,
      });
      const data = await response.text();
      console.log(data);
      setResponse(data);
    } catch (error) {
      console.log(error);
      setResponse("error on cracking secret");
    }
  };
  return (
    <div className="min-h-screen text-center">
      <input type={"file"} />
      <input
        type={"text"}
        id="secretkey"
        placeholder={"Enter the secret key"}
      />
      <button className="mx-4" onClick={sendFile}>
        SEND
      </button>
      <p>{response}</p>
    </div>
  );
}
