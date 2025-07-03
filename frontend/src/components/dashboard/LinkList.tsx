"use client";
import Link from "next/link";
import NeonButton from "../NeonButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserLinks, deleteLink, reorderLinks } from "@/apis/linksApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLinkSTore } from "@/stores/linkStore";
import SortableLinkItem from "@/components/dashboard/SortableLinkItem";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useAuthTokenStore } from "@/stores/tokenStore";

export default function LinkList() {
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const { user } = useUserStore();
  const { accessToken } = useAuthTokenStore();
  const { setLinksLength, setAllLinks, allLinks } = useLinkSTore();
  const sensors = useSensors(useSensor(PointerSensor));
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-links", user?.id],
    queryFn: getUserLinks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-links", user?.id] });
      setSelectedLinkId(null);
    },
    onError: () => {
      toast.error("Failed to delete link. Please try again.");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderLinks,
    onSuccess: () => {
      toast.success("Link order updated");
    },
    onError: () => {
      toast.error("Failed to update link order");
    },
  });

  useEffect(() => {
    if (!data) return;
    setLinksLength(data.length);
    setAllLinks(data);
  }, [data, setLinksLength, setAllLinks]);

  const handleDelete = () => {
    if (selectedLinkId) deleteMutation.mutate(selectedLinkId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-cyan-400 border-white/10" />
      </div>
    );
  }

  if (isError) {
    let errMsg = "Something went wrong.";
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data &&
      "error" in error.response.data &&
      typeof error.response.data.error === "string"
    ) {
      errMsg = error.response.data.error;
    }

    return (
      <div
        data-testid="error-message"
        className="text-red-500 p-4 rounded-lg max-w-md mx-auto mb-6 mt-10"
      >
        <p className="font-semibold">Error: {errMsg}</p>
        <p className="text-sm mt-1">Something Went Wrong </p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 rounded-lg border border-white/10 sm:w-[60%]">
      <div className="flex flex-col gap-3 md:flex-row justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Your Links</h3>
        <div className="px-2">
          {user?.username && accessToken && (
            <Link className="mr-2" href={`/public-page/${user.username}`}>
              <NeonButton
                textSize="text-[8.5px] sm:text-[10px] lg:text-sm"
                text="View Public Page"
                color="cyan"
              />
            </Link>
          )}
          <Link href="/dashboard/create-link">
            <NeonButton
              textSize="text-[8.5px] sm:text-[10px]  lg:text-sm"
              text="Create New Link"
              color="cyan"
            />
          </Link>
        </div>
      </div>

      {allLinks.length === 0 ? (
        <p className="text-gray-400">You have no links yet.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => {
            setActiveLinkId(active.id as string);
          }}
          onDragEnd={({ active, over }) => {
            setActiveLinkId(null);

            if (!over || active.id === over.id) return;

            const oldIndex = allLinks.findIndex((l) => l.id === active.id);
            const newIndex = allLinks.findIndex((l) => l.id === over.id);

            const updated = arrayMove(allLinks, oldIndex, newIndex);
            setAllLinks(updated);

            const reorderedPayload = updated.map((link, index) => ({
              id: link.id,
              order: index + 1,
            }));

            reorderMutation.mutate(reorderedPayload);
          }}
        >
          <SortableContext
            items={allLinks.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <p className="text-sm text-gray-400 mb-4 flex items-center">
              Drag the handle{" "}
              <span className="inline-block align-middle mx-1">
                <GripVertical className="inline w-4 h-4" />
              </span>{" "}
              to reorder your links.
            </p>

            <ul className="space-y-4">
              {allLinks.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onDelete={() => setSelectedLinkId(link.id)}
                />
              ))}
            </ul>
          </SortableContext>

          {/* 👇 Drag Overlay to show item under cursor */}
          <DragOverlay>
            {activeLinkId ? (
              <SortableLinkItem
                link={allLinks.find((link) => link.id === activeLinkId)!}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modal */}
      {selectedLinkId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full border border-white/10 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4">
              Delete Link
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to delete this link? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedLinkId(null)}
                className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className={`px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white${
                  deleteMutation.isPending
                    ? " opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
