import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../api/axios";
import { Button, Spinner } from "flowbite-react";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`api/post/getposts?slug=${postSlug}`);
        if (res.status !== 200) {
          setError(true);
          setLoading(false);
        }

        const filterPost = res.data.posts.filter(
          (post) => post.slug === postSlug,
        );

        setPost(filterPost[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await axios(`api/post/getposts?limit=3`);
        setRecentPosts(res.data.posts);
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-3">
      {error ? (
        <h1 className="mx-auto mt-10 max-w-2xl py-3 text-center font-serif text-3xl lg:text-4xl">
          Post didn't exsist (404 Not Found)
        </h1>
      ) : (
        <>
          <h1 className="mx-auto mt-10 max-w-2xl py-3 text-center font-serif text-3xl lg:text-4xl">
            {post?.title}
          </h1>
          <Link
            className="mt-5 self-center"
            to={`/search?category=${post?.category.toLowerCase()}`}
          >
            <Button color="gray" pill size="xs">
              {post?.category}
            </Button>
          </Link>
          <img
            src={post?.image}
            alt={post?.title}
            className="mt-10 max-h-[600px] w-full object-cover py-3"
          />
          <span className="pb-3 text-xs italic">
            Published at {new Date(post?.createdAt).toLocaleDateString()}
          </span>
          <div className="mx-auto w-full border-b border-slate-500"></div>
          <div
            className="post-content mx-auto w-full max-w-3xl py-3"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></div>
          <CommentSection postId={post._id} />

          <div className="mb-5 flex flex-col items-center justify-center">
            <h1 className="mt-5 text-xl">Recent articles</h1>
            <div className="mt-5 flex flex-wrap justify-center gap-5">
              {recentPosts &&
                recentPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
