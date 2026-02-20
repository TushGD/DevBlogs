import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiRequest(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const canManage = useMemo(() => {
    if (!post || !isAuthenticated || !user) return false;
    const userId = user.id || user._id;
    return post.author?._id === userId;
  }, [post, isAuthenticated, user]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this post permanently?");
    if (!confirmed) return;

    try {
      await apiRequest(`/posts/${id}`, { method: "DELETE" }, token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-slate-300">Loading article...</p>;
  if (error) return <p className="text-rose-300">{error}</p>;
  if (!post) return null;

  return (
    <article className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span>{post.author?.name}</span>
          <span className="text-slate-500">|</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>

        <h1 className="text-4xl font-bold text-white">{post.title}</h1>
        <p className="text-lg text-slate-300">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2">
          {(post.tags || []).map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-cyan-200">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="max-h-[460px] w-full rounded-2xl object-cover" />
      )}

      <div className="whitespace-pre-wrap leading-8 text-slate-100">{post.content}</div>

      {canManage && (
        <div className="flex gap-3 border-t border-white/10 pt-6">
          <Link
            to={`/edit/${post._id}`}
            className="rounded-full border border-cyan-300/80 px-5 py-2 text-cyan-200 transition hover:bg-cyan-300 hover:text-slate-900"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="rounded-full border border-rose-300/80 px-5 py-2 text-rose-200 transition hover:bg-rose-300 hover:text-slate-900"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
