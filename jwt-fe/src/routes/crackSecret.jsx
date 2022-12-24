export default function CrackSecretPage() {
  const sendFile = async () => {
    const file = document.querySelector("input[type=file]").files[0];
    const secretKey = document.querySelector("input[type=text]").value;
    const token = localStorage.getItem("token");
    console.log(file, secretKey, token);
    const formData = new FormData();
    formData.append("wordlist", file);
    const response = await fetch("http://localhost:3000/crack-secret", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.text();
    console.log(data);
  };
  return (
    <div className="min-h-screen text-center">
      <input type={"file"} />
      <input type={"text"} placeholder={"Enter the secret key"} />
      <button onClick={sendFile}>SEND</button>
    </div>
  );
}
