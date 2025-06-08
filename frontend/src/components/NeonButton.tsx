import clsx from "clsx";

const COLOR_MAP = {
  emerald: {
    text: "text-emerald-300",
    border: "border-emerald-400",
    bg: "bg-emerald-400",
    shadow: "shadow-emerald-400/50",
    hover: "hover:bg-emerald-400 hover:shadow-emerald-400/50  hover:text-black",
  },
  fuchsia: {
    text: "text-fuchsia-300",
    border: "border-fuchsia-400",
    bg: "bg-fuchsia-400",
    shadow: "shadow-fuchsia-400/50",
    hover: "hover:bg-fuchsia-400 hover:shadow-fuchsia-400/50  hover:text-black",
  },
  cyan: {
    text: "text-cyan-300",
    border: "border-cyan-400",
    bg: "bg-cyan-400",
    shadow: "shadow-cyan-400/50",
    hover: "hover:bg-cyan-400 hover:shadow-cyan-400/50 hover:text-black",
  },
};

export default function NeonButton({
  text,
  color = "emerald",
  full = false,
  type = "button",
  onClick,
  disabled,
  pulse,
  width,
  textSize,
}: {
  text: string;
  color?: keyof typeof COLOR_MAP;
  full?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  pulse?: boolean;
  width?: string;
  textSize?: string;
}) {
  const baseColor = COLOR_MAP[color];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={clsx(
        "relative px-4 py-1 text-sm font-semibold rounded-md border transition-all duration-300 shadow-md overflow-hidden",
        baseColor.text,
        baseColor.border,
        baseColor.hover,
        full && "w-full",
        width && width,
        textSize && textSize,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={clsx(
          "absolute inset-0 blur-md opacity-30  rounded-md",
          baseColor.bg,
          pulse && "animate-pulse"
        )}
      />
      <span className="relative z-10">{text}</span>
    </button>
  );
}
