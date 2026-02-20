import express from "express";
import Post from "../models/Post.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { excerpt: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } }
          ]
        }
      : {};

    const posts = await Post.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch post", error: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, tags } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ message: "Title, excerpt, and content are required" });
    }

    const post = await Post.create({
      title,
      excerpt,
      content,
      coverImage: coverImage || "",
      tags: Array.isArray(tags) ? tags : [],
      author: req.user.id
    });

    const populatedPost = await post.populate("author", "name email");

    return res.status(201).json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create post", error: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, tags } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    post.title = title ?? post.title;
    post.excerpt = excerpt ?? post.excerpt;
    post.content = content ?? post.content;
    post.coverImage = coverImage ?? post.coverImage;
    post.tags = Array.isArray(tags) ? tags : post.tags;

    await post.save();
    const populatedPost = await post.populate("author", "name email");

    return res.json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update post", error: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();

    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
});

export default router;
