import { useEffect, useState } from "react";

export default function VerifyDecodeUnsecurePage() {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const sendRequest = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3000/verify-decode/unsecure/posts",
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
          console.log("You are an admin");
        } else {
          setIsAdmin(false);
          console.log("You are not an admin");
        }
        console.log(data);
      } catch (error) {
        console.log(error);
        alert("You are not authorized to view this page");
      }
    };
    sendRequest();
  }, []);
  return (
    <div className="flex min-h-screen text-center mx-auto">
      <div className="flex-1 flex flex-col my-auto">
        {
          //display posts id title description image
          posts.map((post) => (
            <div key={post.id} className="my-2">
              <h1>{post.title}</h1>
              <p>{post.description}</p>
              <img
                className="w-64 h-64 rounded-md"
                src={post.image}
                alt={post.title}
              />
              {
                //display delete button if user is admin
                isAdmin && (
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(
                          `http://localhost:3000/verify-decode/unsecure/posts/${post.id}`,
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
      </div>
    </div>
  );
}
