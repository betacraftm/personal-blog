import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await axios.post("api/comment/create", {
        content: comment,
        postId,
        userId: currentUser._id,
      });
      if (res.status === 201) {
        setComment("");
        setCommentError(null);
        setComments([res.data, ...comments]);
      }
    } catch (error) {
      console.log(error);
      setComment("");
      setCommentError(error.response.data.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        return navigate("/sign-in");
      }
      const res = await axios.put(`/api/comment/likeComment/${commentId}`);
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: res.data.likes,
                numberOfLikes: res.data.numberOfLikes,
              }
            : comment,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getPostComments/${postId}`);
        setComments(res.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getComments();
  }, [postId]);

  return (
    <div className="mx-auto w-full max-w-2xl p-3">
      {currentUser ? (
        <div className="my-5 flex items-center gap-1 text-sm text-gray-500">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 rounded-full object-cover"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="my-5 flex gap-1 text-sm text-teal-500">
          You must be signed in to comment
          <Link className="text-blue-500 hover:underline" to="/sign-in">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-teal-500 p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {200 - comment.length} character remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="my-5 text-sm">No comments yet!</p>
      ) : (
        <>
          <div className="my-5 flex items-center gap-1 text-sm">
            <p>Comments</p>
            <div className="rounded-sm border border-gray-400 px-2 py-1">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((c) => {
            return <Comment key={c._id} comment={c} onLike={handleLike} />;
          })}
        </>
      )}
    </div>
  );
}
