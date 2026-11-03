import { cn } from "@/shared/lib/utils";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "outline" | "ghost";
  full?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent-500 text-white hover:bg-accent-600",
  outline: "border border-ink-900 text-ink-900 hover:bg-paper-200",
  ghost: "text-ink-600 hover:bg-paper-200",
};

export function Button({
  variant = "primary",
  full,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors disabled:opacity-40",
        variants[variant],
        full && "w-full",
        className,
      )}
      {...rest}
    />
  );
}
