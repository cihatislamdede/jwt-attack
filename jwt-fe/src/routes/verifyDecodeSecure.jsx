import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function VerifyDecodeSecurePage() {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const sendRequest = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authorized to view this page");
          return;
        }
        const res = await fetch(
          "http://localhost:3000/verify-decode/secure/posts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setPosts(data);
        //decode token
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const decodedToken = JSON.parse(window.atob(base64));
        //check if user is admin
        if (decodedToken.isAdmin === 1) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.log(error);
        alert("You are not authorized to view this page");
      }
    };
    sendRequest();
  }, []);
  return (
    <div className="flex flex-col h-screen justify-items-center text-center w-full bg-slate-800 mx-auto text-gray-200">
      <div className="flex flex-row my-auto gap-x-4 mx-auto py-2">
        {
          //display posts id title description image
          posts.map((post) => (
            <div key={post.id} className="my-2">
              <h1>{post.title}</h1>
              <p>{post.description}</p>
              <img
                className="rounded-2xl aspect-square max-h-96 px-2"
                src={post.image}
                alt={post.title}
              />
              {
                //display delete button if user is admin
                isAdmin && (
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(
                          `http://localhost:3000/verify-decode/secure/posts/${post.id}`,
                          {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        const data = await res.text();
                        console.log(data);
                        alert("Post deleted");
                        window.location.reload();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    Delete
                  </button>
                )
              }
            </div>
          ))
        }
      </div>{" "}
      <Link to={`/`}>
        <button
          className="m-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Go Back
        </button>
      </Link>
    </div>
  );
}
