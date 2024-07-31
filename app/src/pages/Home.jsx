import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/post/getposts?limit=9`);
        setPosts(res.data.posts);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchPost();
  }, []);

  return (
    <main>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-6 p-28 px-3">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-xs text-gray-500 sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="text-xs font-bold text-teal-500 hover:underline"
        >
          View all posts
        </Link>
      </div>

      <h2 className="mb-5 text-center text-2xl font-semibold">Recent Posts</h2>
      <div className="mx-auto grid w-full grid-cols-1 gap-8 p-3 py-7 md:max-w-3xl md:grid-cols-2 2xl:max-w-6xl 2xl:grid-cols-3">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => {
            return <PostCard key={post._id} post={post} />;
          })}
      </div>
      <div className="mb-7 text-center">
        <Link to="/search" className="text-lg text-teal-500 hover:underline">
          View All Posts
        </Link>
      </div>
    </main>
  );
}
