"use client";
import Link from "next/link";
import { ExternalLink, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MouseEventHandler } from "react";
import { useMutation } from "@tanstack/react-query";
import { trackClicks } from "@/apis/linksApi";

type SortableLinkItemProps = {
  link: {
    id: string;
    title: string;
    url: string;
  };
  onDelete: MouseEventHandler<HTMLButtonElement>;
};

export default function SortableLinkItem({
  link,
  onDelete,
}: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const clickMutation = useMutation({
    mutationFn: () => trackClicks(link.id),
  });

  const handleExternalClick = () => {
    clickMutation.mutate();
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-gray-800 px-4 py-3 rounded-md border border-white/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0"
    >
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <button
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-white"
          aria-label="Drag Handle"
        >
          <GripVertical
            className="w-4 h-4 .transition-transform hover:scale-110 hover:text-white
"
          />
        </button>

        {/* Link title + URL */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm sm:text-base font-medium truncate">
            {link.title}
          </p>
          <Link
            onClick={handleExternalClick}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-cyan-400 hover:underline break-words sm:break-normal"
          >
            {link.url}
          </Link>
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 sm:ml-4 flex items-center gap-2">
        <Link
          onClick={handleExternalClick}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300"
        >
          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>

        <Link
          href={`/dashboard/edit-link/${link.id}`}
          className="text-fuchsia-400 hover:text-fuchsia-300"
          aria-label="Edit Link"
        >
          <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>

        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-400"
          aria-label="Delete Link"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </li>
  );
}
