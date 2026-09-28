import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({ value = 5, max = 5, className, size = 16 }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? "fill-amber text-amber" : "fill-none text-ink-600"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}