"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import type { Movie } from "@/lib/movies";

interface PosterProps {
  movie: Movie;
  eager?: boolean;
}

export function Poster({ movie, eager = false }: PosterProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const posterHue = (movie.id * 37) % 360;

  return (
    <div
      className="poster-art"
      style={{ "--poster-hue": `${posterHue}` } as React.CSSProperties}
    >
      <div className="poster-fallback">
        <Film size={36} strokeWidth={1} />
        <span>{movie.title}</span>
        {movie.year && <small>{movie.year}</small>}
      </div>

      {!hasImageError && movie.poster && (
        <img
          src={movie.poster}
          alt={`โปสเตอร์ ${movie.title}`}
          width={500}
          height={750}
          loading={eager ? "eager" : "lazy"}
          onError={() => setHasImageError(true)}
        />
      )}
    </div>
  );
}
