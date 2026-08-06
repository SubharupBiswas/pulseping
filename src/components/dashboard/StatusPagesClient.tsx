"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface StatusPageItem {
  id: string;
  slug: string;
  title: string;
  isPublic: boolean;
  createdAt: Date | string;
  monitorIds?: string[];
}

export interface UserMonitorItem {
  id: string;
  url: string;
}

interface Props {
  initialPages: StatusPageItem[];
  userMonitors?: UserMonitorItem[];
  plan: string;
}

export default function StatusPagesClient({ initialPages, userMonitors = [], plan }: Props) {
  const router = useRouter();
  const [pages, setPages] = useState<StatusPageItem[]>(initialPages);
  
  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit Modal State
  const [editingPage, setEditingPage] = useState<StatusPageItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);
  const [editMonitorIds, setEditMonitorIds] = useState<string[]>([]);
  const [editError, setEditError] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  // Populate edit modal fields when editingPage changes
  useEffect(() => {
    if (editingPage) {
      setEditTitle(editingPage.title);
      setEditSlug(editingPage.slug);
      setEditIsPublic(editingPage.isPublic);
      setEditMonitorIds(editingPage.monitorIds || []);
      setEditError(null);
    }
  }, [editingPage]);

  const handleCreate = () => {
    setError(null);
    if (!title.trim() || title.trim().length < 2) {
      setError("Title must be at least 2 characters.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/status-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), isPublic }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to create status page.");
          return;
        }

        const newPage: StatusPageItem = {
          id: data.statusPage.id,
          slug: data.statusPage.slug,
          title: data.statusPage.title,
          isPublic: data.statusPage.isPublic,
          createdAt: data.statusPage.createdAt,
          monitorIds: [],
        };

        setPages((prev) => [newPage, ...prev]);
        setTitle("");
        setIsPublic(true);
        setShowModal(false);
        router.refresh();
      } catch (err) {
        setError("Network error. Please try again.");
      }
    });
  };

  const handleUpdate = () => {
    if (!editingPage) return;
    setEditError(null);

    if (!editTitle.trim() || editTitle.trim().length < 2) {
      setEditError("Title must be at least 2 characters.");
      return;
    }

    if (!editSlug.trim()) {
      setEditError("Slug cannot be empty.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/status-pages/${editingPage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editTitle.trim(),
            slug: editSlug.trim(),
            isPublic: editIsPublic,
            monitorIds: editMonitorIds,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setEditError(data.error || "Failed to update status page.");
          return;
        }

        const updated = data.statusPage;
        const updatedMonIds: string[] = updated.monitors
          ? updated.monitors.map((m: any) => m.monitorId)
          : editMonitorIds;

        setPages((prev) =>
          prev.map((p) =>
            p.id === editingPage.id
              ? {
                  ...p,
                  title: updated.title,
                  slug: updated.slug,
                  isPublic: updated.isPublic,
                  monitorIds: updatedMonIds,
                }
              : p
          )
        );

        setEditingPage(null);
        router.refresh();
      } catch (err) {
        setEditError("Network error. Please try again.");
      }
    });
  };

  const handleDelete = () => {
    if (!editingPage) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete status board "${editingPage.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setEditError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/status-pages/${editingPage.id}`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok) {
          setEditError(data.error || "Failed to delete status page.");
          return;
        }

        setPages((prev) => prev.filter((p) => p.id !== editingPage.id));
        setEditingPage(null);
        router.refresh();
      } catch (err) {
        setEditError("Network error. Please try again.");
      }
    });
  };

  const toggleMonitorCheck = (mId: string) => {
    setEditMonitorIds((prev) =>
      prev.includes(mId) ? prev.filter((id) => id !== mId) : [...prev, mId]
    );
  };

  return (
    <>
      {/* Status page listing */}
      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <button
            id="create-status-page-btn"
            onClick={() => {
              setShowModal(true);
              setError(null);
            }}
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            + Create Status Page
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-12 text-center backdrop-blur-md">
            <span className="text-xl">🌐</span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2">
              No public status boards created
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Create operational dashboards to keep users informed during outages.
            </p>
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="bg-white/90 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm backdrop-blur-md transition-all hover:border-emerald-500/20 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{page.title}</h4>
                <a
                  href={`/status/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-1"
                >
                  {typeof window !== "undefined" ? window.location.host : "pulseping.example.com"}/status/{page.slug} ↗
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                    page.isPublic
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {page.isPublic ? "Public" : "Private"}
                </span>
                <button
                  onClick={() => setEditingPage(page)}
                  className="text-xs font-semibold border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg hover:bg-sky-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Status Page Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Create Status Page</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition text-lg leading-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Page Title
                </label>
                <input
                  id="status-page-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. API Status · Production Status"
                  maxLength={80}
                  className="w-full bg-sky-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  role="switch"
                  aria-checked={isPublic}
                  onClick={() => setIsPublic((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    isPublic ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      isPublic ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {isPublic ? "Public — visible to anyone with the link" : "Private — hidden from public"}
                </span>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-semibold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 text-sm font-semibold border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                id="submit-create-status-page-btn"
                onClick={handleCreate}
                disabled={isPending}
                className="flex-1 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl shadow transition active:scale-95"
              >
                {isPending ? "Creating…" : "Create Page"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Configure Status Page Modal */}
      {editingPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingPage(null);
          }}
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Configure Status Page
              </h2>
              <button
                onClick={() => setEditingPage(null)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition text-lg leading-none"
                aria-label="Close edit modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Page Title
                </label>
                <input
                  id="edit-status-page-title-input"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. System Health Board"
                  maxLength={80}
                  className="w-full bg-sky-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
                  URL Slug
                </label>
                <div className="flex items-center bg-sky-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm">
                  <span className="text-zinc-400 dark:text-zinc-500 font-mono select-none mr-1">
                    /status/
                  </span>
                  <input
                    id="edit-status-page-slug-input"
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder="my-status-board"
                    className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none"
                  />
                </div>
                <div className="mt-1.5 text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-1 overflow-x-auto">
                  <span className="text-zinc-400">Public Link:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {typeof window !== "undefined" ? window.location.origin : "https://pulseping.example.com"}/status/{editSlug || "your-slug"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  role="switch"
                  aria-checked={editIsPublic}
                  onClick={() => setEditIsPublic((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    editIsPublic ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      editIsPublic ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {editIsPublic ? "Public — accessible to anyone" : "Private — draft / unlisted"}
                </span>
              </div>

              {/* Linked Monitored Streams Checkboxes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                  Linked Monitored Streams
                </label>
                {userMonitors.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No monitors available to attach.</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-sky-50/40 dark:bg-zinc-950/40">
                    {userMonitors.map((m) => {
                      const checked = editMonitorIds.includes(m.id);
                      return (
                        <label
                          key={m.id}
                          className="flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleMonitorCheck(m.id)}
                            className="rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500/40"
                          />
                          <span className="font-mono truncate">{m.url}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {editError && (
                <p className="text-xs text-red-500 font-semibold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {editError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                Delete Board
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="text-xs font-semibold border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-xl hover:bg-sky-50 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isPending}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow transition active:scale-95 disabled:opacity-50"
                >
                  {isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
