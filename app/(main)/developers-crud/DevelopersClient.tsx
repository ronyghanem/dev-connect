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

type FormState = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

const emptyForm: FormState = {
  name: "",
  role: "",
  bio: "",
  image: "",
};

export default function DevelopersClient({
  githubDevelopers,
}: DevelopersClientProps) {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteTarget, setDeleteTarget] =
    useState<Developer | null>(null);

  async function fetchDevelopers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/developers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch developers."
        );
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
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function startEditing(developer: Developer) {
    setEditingId(developer._id);

    setForm({
      name: developer.name,
      role: developer.role,
      bio: developer.bio,
      image: developer.image || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  }

  function validateForm() {
    const name = form.name.trim();
    const role = form.role.trim();
    const bio = form.bio.trim();
    const image = form.image.trim();

    if (!name) {
      return "Name cannot be empty or contain only spaces.";
    }

    if (name.length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (name.length > 100) {
      return "Name cannot exceed 100 characters.";
    }

    if (!role) {
      return "Role cannot be empty or contain only spaces.";
    }

    if (role.length > 100) {
      return "Role cannot exceed 100 characters.";
    }

    if (!bio) {
      return "Bio cannot be empty or contain only spaces.";
    }

    if (bio.length > 1000) {
      return "Bio cannot exceed 1000 characters.";
    }

    if (image.length > 500) {
      return "Image URL cannot exceed 500 characters.";
    }

    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
        image: form.image.trim(),
      };

      const response = await fetch(
        editingId
          ? `/api/developers/${editingId}`
          : "/api/developers",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
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
            developer._id === editingId
              ? data
              : developer
          )
        );

        setSuccess(
          `${data.name} was updated successfully.`
        );
      } else {
        setDevelopers((current) => [data, ...current]);

        setSuccess(
          `${data.name} was added successfully.`
        );
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

  function requestDelete(developer: Developer) {
    setDeleteTarget(developer);
    setError("");
    setSuccess("");
  }

  function cancelDelete() {
    if (deletingId) {
      return;
    }

    setDeleteTarget(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    const id = deleteTarget._id;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/developers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete developer."
        );
      }

      setDevelopers((current) =>
        current.filter(
          (developer) => developer._id !== id
        )
      );

      if (editingId === id) {
        cancelEditing();
      }

      setDeleteTarget(null);
      setSuccess(
        `${deleteTarget.name} was deleted successfully.`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setDeleteTarget(null);
    } finally {
      setDeletingId(null);
    }
  }

  const totalDevelopers =
    githubDevelopers.length + developers.length;

  const isEditing = editingId !== null;

  return (
    <>
      <section className="relative mx-auto max-w-6xl px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="reveal text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Developer Management
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            {isEditing
              ? "Edit Developer"
              : "Manage Developers"}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            {isEditing
              ? "Update the developer information below and save your changes."
              : "Create, edit, and manage developer profiles from one place."}
          </p>
        </div>

        {/* Form */}
        <div
          className={`neon-card reveal reveal-delay-1 relative mt-10 overflow-hidden p-6 sm:p-8 ${
            isEditing
              ? "border-violet-400/20"
              : ""
          }`}
        >
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px]" />

          {/* Edit indicator */}
          {isEditing && (
            <div className="relative mb-6 flex items-center justify-between gap-4 rounded-xl border border-violet-400/20 bg-violet-400/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                  ✎
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Editing developer
                  </p>

                  <p className="text-xs text-gray-500">
                    Changes will be saved to the database.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={cancelEditing}
                className="text-xs font-medium text-gray-500 transition hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="relative space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="developer-name"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Name
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <input
                  id="developer-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  maxLength={100}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="mt-1.5 flex justify-end">
                  <span className="text-[11px] text-gray-600">
                    {form.name.length}/100
                  </span>
                </div>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="developer-role"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Role
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                </label>

                <input
                  id="developer-role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="Full Stack Developer"
                  maxLength={100}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="mt-1.5 flex justify-end">
                  <span className="text-[11px] text-gray-600">
                    {form.role.length}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="developer-bio"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Bio
                <span className="ml-1 text-red-400">
                  *
                </span>
              </label>

              <textarea
                id="developer-bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about this developer..."
                rows={4}
                maxLength={1000}
                required
                disabled={submitting}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
              />

              <div className="mt-1.5 flex justify-end">
                <span className="text-[11px] text-gray-600">
                  {form.bio.length}/1000
                </span>
              </div>
            </div>

            {/* Image */}
            <div>
              <label
                htmlFor="developer-image"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Profile image URL
                <span className="ml-2 text-xs font-normal text-gray-600">
                  optional
                </span>
              </label>

              <input
                id="developer-image"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
                maxLength={500}
                disabled={submitting}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Messages */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
              >
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300"
              >
                <span className="mt-0.5">✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Form actions */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="neon-button rounded-xl px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {isEditing
                      ? "Updating..."
                      : "Adding..."}
                  </span>
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Add Developer"
                )}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={submitting}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Developers */}
        <div className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Developers
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                GitHub and manually managed profiles
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-500">
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-gray-500">
                ◇
              </div>

              <p className="mt-4 text-gray-400">
                No developers found.
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Add your first developer using the form
                above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {/* GitHub Developers */}
              {githubDevelopers.map(
                (developer, index) => (
                  <div
                    key={`github-${developer._id}`}
                    className={`neon-card group relative overflow-hidden p-6 reveal reveal-delay-${Math.min(
                      (index % 4) + 1,
                      4
                    )}`}
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/10" />

                    <div className="relative flex gap-4">
                      {/* Avatar */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-cyan-300/30 bg-white/[0.04]">
                        {developer.image ? (
                          <img
                            src={developer.image}
                            alt={`${developer.name} profile`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl font-bold text-cyan-300">
                            {developer.name
                              ?.charAt(0)
                              .toUpperCase() ||
                              "D"}
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
                          {developer.bio ||
                            "No bio added yet."}
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
                )
              )}

              {/* MongoDB Developers */}
              {developers.map(
                (developer, index) => (
                  <div
                    key={`mongodb-${developer._id}`}
                    className={`neon-card group relative overflow-hidden p-6 reveal reveal-delay-${Math.min(
                      ((githubDevelopers.length +
                        index) %
                        4) +
                        1,
                      4
                    )}`}
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/10" />

                    <div className="relative flex gap-4">
                      {/* Avatar */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-cyan-300/30 bg-white/[0.04]">
                        {developer.image ? (
                          <img
                            src={developer.image}
                            alt={`${developer.name} profile`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl font-bold text-cyan-300">
                            {developer.name
                              ?.charAt(0)
                              .toUpperCase() ||
                              "D"}
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
                    <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-white/5 pt-5">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                        Managed Profile
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(developer)
                          }
                          disabled={
                            deletingId ===
                            developer._id
                          }
                          aria-label={`Edit ${developer.name}`}
                          className="rounded-lg border border-violet-400/20 bg-violet-400/5 px-4 py-2 text-sm font-medium text-violet-300 transition hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            requestDelete(developer)
                          }
                          disabled={
                            deletingId ===
                            developer._id
                          }
                          aria-label={`Delete ${developer.name}`}
                          className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-2 text-sm font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="neon-card w-full max-w-md overflow-hidden border border-red-400/20 p-6 shadow-2xl shadow-red-950/20">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-xl text-red-300">
              !
            </div>

            <h2
              id="delete-dialog-title"
              className="mt-5 text-xl font-bold text-white"
            >
              Delete developer?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              You are about to permanently delete{" "}
              <span className="font-semibold text-white">
                {deleteTarget.name}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={!!deletingId}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={!!deletingId}
                className="rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/20 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300/20 border-t-red-300" />
                    Deleting...
                  </span>
                ) : (
                  "Delete Developer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}