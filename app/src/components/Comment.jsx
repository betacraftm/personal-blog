import { useEffect, useState } from "react";
import axios from "../api/axios";
import moment from "moment";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/user/${comment.userId}`);
        setUser(res.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex border-b p-4 text-sm dark:border-gray-600">
      <div className="mr-3 flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center">
          <span className="mr-1 truncate text-xs font-bold">
            {user ? `${user.username}` : "Anonymous user"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="mb-2 text-gray-500">{comment.content}</p>
      </div>
    </div>
  );
}
