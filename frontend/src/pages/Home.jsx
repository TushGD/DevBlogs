import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../api";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const data = await apiRequest(`/posts${query}`);
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [search]);

  const handleSearch = (event) => {
    const value = event.target.value;
    if (!value) {
      setSearchParams({});
      return;
    }
    setSearchParams({ search: value });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-amber-300/20 p-8">
        <p className="mb-4 inline-block rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
          Blogs
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
          Publish stories that look sharp and feel fast.
        </h1>
        
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-white">Latest posts</h2>
        <input
          type="text"
          placeholder="Search by title, excerpt or tag"
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 sm:w-96"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading && <p className="text-slate-300">Loading posts...</p>}
      {error && <p className="text-rose-300">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-slate-300">
          No posts found.
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </section>
    </div>
  );
}
