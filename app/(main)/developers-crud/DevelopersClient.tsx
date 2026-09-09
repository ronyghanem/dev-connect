"use client";

import { FormEvent, useEffect, useState } from "react";

type Developer = {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  createdAt: string;
};

type GithubDeveloper = {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  skills: string[];
};

type DevelopersClientProps = {
  githubDevelopers: GithubDeveloper[];
};

const emptyForm = {
  name: "",
  role: "",
  bio: "",
  image: "",
};

export default function DevelopersClient({
  githubDevelopers,
}: DevelopersClientProps) {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function fetchDevelopers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/developers");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch developers.");
      }

      setDevelopers(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDevelopers();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startEditing(developer: Developer) {
    setEditingId(developer._id);

    setForm({
      name: developer.name,
      role: developer.role,
      bio: developer.bio,
      image: developer.image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        editingId
          ? `/api/developers/${editingId}`
          : "/api/developers",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save developer."
        );
      }

      if (editingId) {
        setDevelopers((current) =>
          current.map((developer) =>
            developer._id === editingId ? data : developer
          )
        );
      } else {
        setDevelopers((current) => [data, ...current]);
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this developer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`/api/developers/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete developer."
        );
      }

      setDevelopers((current) =>
        current.filter((developer) => developer._id !== id)
      );

      if (editingId === id) {
        cancelEditing();
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const totalDevelopers =
    githubDevelopers.length + developers.length;

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 sm:py-20">
      {/* Header */}
      <div className="reveal text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Developer Management
        </p>

        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          {editingId ? "Edit Developer" : "Manage Developers"}
        </h1>
      </div>

      {/* Form */}
      <div className="neon-card reveal reveal-delay-1 relative mt-10 overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px]" />

        <form onSubmit={handleSubmit} className="relative space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Role
              </label>

              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Full Stack Developer"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Bio
            </label>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about this developer..."
              rows={4}
              required
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.06]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Profile image URL
            </label>

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.06]"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="neon-button rounded-xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Developer"
                  : "Add Developer"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Developers */}
      <div className="mt-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-white">
            Developers
          </h2>

          <span className="text-sm text-gray-500">
            {totalDevelopers}{" "}
            {totalDevelopers === 1
              ? "developer"
              : "developers"}
          </span>
        </div>

        {loading ? (
          <div className="neon-card p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

            <p className="mt-4 text-sm text-gray-500">
              Loading developers...
            </p>
          </div>
        ) : totalDevelopers === 0 ? (
          <div className="neon-card p-10 text-center">
            <p className="text-gray-400">
              No developers found.
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Add your first developer using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {/* GitHub Developers */}
            {githubDevelopers.map((developer, index) => (
              <div
                key={`github-${developer._id}`}
                className={`neon-card group relative overflow-hidden p-6 reveal reveal-delay-${Math.min(
                  (index % 4) + 1,
                  4
                )}`}
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition group-hover:bg-cyan-400/10" />

                <div className="relative flex gap-4">
                  {/* Avatar */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-cyan-300/30 bg-white/[0.04]">
                    {developer.image ? (
                      <img
                        src={developer.image}
                        alt={developer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-bold text-cyan-300">
                        {developer.name
                          ?.charAt(0)
                          .toUpperCase() || "D"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {developer.name}
                    </h3>

                    <p className="mt-1 text-sm text-cyan-400">
                      {developer.role}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                      {developer.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {developer.skills?.length > 0 && (
                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {developer.skills
                      .slice(0, 4)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="neon-skill rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                )}

                <div className="relative mt-6 border-t border-white/5 pt-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                    GitHub Developer
                  </span>
                </div>
              </div>
            ))}

            {/* Assignment / MongoDB Developers */}
            {developers.map((developer, index) => (
              <div
                key={`mongodb-${developer._id}`}
                className={`neon-card group relative overflow-hidden p-6 reveal reveal-delay-${Math.min(
                  ((githubDevelopers.length + index) % 4) + 1,
                  4
                )}`}
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition group-hover:bg-cyan-400/10" />

                <div className="relative flex gap-4">
                  {/* Avatar */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-cyan-300/30 bg-white/[0.04]">
                    {developer.image ? (
                      <img
                        src={developer.image}
                        alt={developer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-bold text-cyan-300">
                        {developer.name
                          ?.charAt(0)
                          .toUpperCase() || "D"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {developer.name}
                    </h3>

                    <p className="mt-1 text-sm text-cyan-400">
                      {developer.role}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                      {developer.bio}
                    </p>
                  </div>
                </div>

                {/* CRUD Actions */}
                <div className="relative mt-6 flex gap-3 border-t border-white/5 pt-5">
                  <button
                    onClick={() => startEditing(developer)}
                    className="rounded-lg border border-violet-400/20 bg-violet-400/5 px-4 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-400/10"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(developer._id)
                    }
                    disabled={
                      deletingId === developer._id
                    }
                    className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    {deletingId === developer._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}