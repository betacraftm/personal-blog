import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div
      className="group relative h-[340px] w-full overflow-hidden rounded-lg border border-teal-500 hover:border-2 sm:w-[350px]"
      title={post.title}
    >
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="z-20 h-[260px] w-full object-cover transition-all duration-300 group-hover:h-[200px]"
        />
      </Link>
      <div className="flex-col gap-2 p-3">
        <p className="line-clamp-2 text-lg font-semibold">{post.title}</p>
        <span className="text-sm italic">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="absolute bottom-[-200px] left-0 right-0 z-10 m-2 rounded-md !rounded-tl-none border border-teal-500 py-2 text-center text-teal-500 transition-all duration-300 group-hover:bottom-0 hover:bg-teal-500 hover:text-white"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
