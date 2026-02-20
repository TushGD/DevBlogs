import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString();

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-slate-950/40 backdrop-blur transition hover:-translate-y-1 hover:border-amber-300/50">
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-cyan-500/25 via-slate-800 to-amber-400/30">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-200">No cover image</p>
        </div>
      )}

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          <span>{post.author?.name || "Unknown"}</span>
          <span>{date}</span>
        </div>

        <h3 className="line-clamp-2 text-2xl font-semibold text-white">{post.title}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2">
          {(post.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-cyan-200">
              #{tag}
            </span>
          ))}
        </div>

        <Link
          to={`/posts/${post._id}`}
          className="inline-flex items-center rounded-full border border-amber-300/70 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-300 hover:text-slate-900"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
