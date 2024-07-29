import { useEffect, useState } from "react";
import axios from "../api/axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditng] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

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
  }, []);

  const handleEdit = () => {
    setIsEditng(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/comment/editComment/${comment._id}`, {
        content: editedContent,
      });
      setIsEditng(false);
      onEdit(comment, editedContent);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

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
        {isEditing ? (
          <>
            <Textarea
              className="mb-2 resize-none"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditng(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-gray-500">{comment.content}</p>
            <div className="flex max-w-fit items-center gap-2 pt-2 text-xs">
              <button
                onClick={() => onLike(comment._id)}
                type="button"
                className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && "!text-blue-500"}`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {currentUser &&
                  comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
