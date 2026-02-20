import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

const initialState = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: ""
};

export default function PostEditor({ mode = "create" }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadPost = async () => {
      try {
        const post = await apiRequest(`/posts/${id}`);
        const userId = user?.id || user?._id;
        if (post.author?._id !== userId) {
          setError("You can only edit your own post");
          return;
        }
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || "",
          tags: (post.tags || []).join(", ")
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [isEdit, id, user]);

  const pageTitle = useMemo(() => (isEdit ? "Edit post" : "Create a new post"), [isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    try {
      setSubmitting(true);
      if (isEdit) {
        await apiRequest(`/posts/${id}`, { method: "PUT", body: JSON.stringify(payload) }, token);
      } else {
        await apiRequest("/posts", { method: "POST", body: JSON.stringify(payload) }, token);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-slate-300">Loading editor...</p>;

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          name="title"
          placeholder="Post title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-cyan-300"
          required
        />

        <textarea
          name="excerpt"
          placeholder="Short excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          className="h-24 w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-cyan-300"
          required
        />

        <textarea
          name="content"
          placeholder="Write your post content..."
          value={formData.content}
          onChange={handleChange}
          className="h-60 w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-cyan-300"
          required
        />

        <input
          name="coverImage"
          placeholder="Cover image URL"
          value={formData.coverImage}
          onChange={handleChange}
          className="w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-cyan-300"
        />

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-cyan-300"
        />

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <button
          disabled={submitting}
          className="rounded-2xl bg-amber-300 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-200 disabled:opacity-70"
        >
          {submitting ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
        </button>
      </form>
    </section>
  );
}
