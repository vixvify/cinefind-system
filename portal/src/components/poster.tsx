"use client";
import { useState } from "react";
import { Film } from "lucide-react";
import type { Movie } from "@/lib/movies";

export function Poster({
  movie,
  eager = false,
}: {
  movie: Movie;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="poster-art"
      style={
        { "--poster-hue": `${(movie.id * 37) % 360}` } as React.CSSProperties
      }
    >
      <div className="poster-fallback">
        <Film size={36} strokeWidth={1} />
        <span>{movie.title}</span>
        <small>{movie.year}</small>
      </div>
      {!failed && movie.poster && (
        <img
          src={movie.poster}
          alt={`โปสเตอร์ ${movie.title}`}
          width={500}
          height={750}
          loading={eager ? "eager" : "lazy"}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
