import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  onRate: (rating: number) => void;
  disabled?: boolean;
}

export function StarRating({ onRate, disabled = false }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    if (disabled) return;
    setRating(value);
    onRate(value);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          disabled={disabled}
          className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
        >
          <Star
            className={`w-8 h-8 ${
              star <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
