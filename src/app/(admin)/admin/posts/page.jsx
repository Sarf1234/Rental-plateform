"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiRequest("/api/posts/admin?page=1&limit=100");
        const data = res.data || [];
        if (!mounted) return;
        setPosts(data);
      } catch (err) {
        toast.error("Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this post permanently?")) return;
    try {
      await apiRequest(`/api/posts/${id}`, "DELETE");
      setPosts((p) => p.filter((x) => x._id !== id));
      toast.success("Post deleted");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-rose-600">Posts</h1>
          <p className="text-sm text-gray-500">
            Manage all published and draft posts
          </p>
        </div>

        <Link href="/admin/posts/create">
          <Button className="bg-rose-600 hover:bg-rose-700">
            + Create Post
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500">Loading posts…</div>
      )}

      {/* Empty */}
      {!loading && posts.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-rose-50">
          <h2 className="text-lg font-medium text-rose-600">
            No posts found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create your first blog post
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && posts.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">Title</th>
                {/* <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Trending</th> */}
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Title */}
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {post.title}  {post.isFeatured ? "Featured" : "—"} {post.isTrending ? "Trending" : "—"} {post.published ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  {/* <td className="px-4 py-3">
                    {post.published ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                        Draft
                      </span>
                    )}
                  </td> */}

                  {/* Featured */}
                  {/* <td className="px-4 py-3">
                    {post.isFeatured ? "Featured" : "—"}
                  </td> */}

                  {/* Trending */}
                  {/* <td className="px-4 py-3">
                    {post.isTrending ? "Trending" : "—"}
                  </td> */}

                  {/* Slug */}
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {post.slug}
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right flex justify-between gap-2">
                    <Link href={`/admin/posts/${post._id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-rose-600 hover:text-rose-600 cursor-pointer"
                      >
                        Edit
                      </Button>
                    </Link>

                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-green-600 hover:text-green-600 cursor-pointer"
                      >
                        view
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post._id)}
                      className="cursor-pointer"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
