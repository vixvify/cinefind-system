import assert from "node:assert/strict";
import test from "node:test";
import { parseSelection, type Movie } from "../src/lib/movies.ts";
import { createRecommendationService } from "../src/core/service/recommendation.service.ts";
import { createAiClient } from "../src/infrastructure/clients/ai.client.ts";
import { createRecommendationHandler } from "../src/infrastructure/http/recommendation.handler.ts";
import { RecommendationError } from "../src/core/errors/recommendation.error.ts";

const movies: Movie[] = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  title: `Film ${index + 1}`,
  year: 2000 + index,
  rating: "7.5",
  genres: index % 2 ? ["Animation", "Comedy"] : ["Sci-Fi", "Drama"],
  poster: null,
}));

test("selection rejects duplicates, unknown and malformed IDs", () => {
  assert.deepEqual(parseSelection("3,3,999,bad,1,,2,1e1", movies).map(movie => movie.id), [3, 1, 2]);
  assert.deepEqual(parseSelection(null, movies), []);
});

test("selection is limited to five films", () => {
  assert.equal(parseSelection("1,2,3,4,5,6", movies).length, 5);
});

test("service sends all five IDs to AI once and keeps ranked unseen movies", async () => {
  const calls: number[][] = [];
  const service = createRecommendationService({
    loadCatalog: async () => movies,
    source: {
      async recommend(movieIds, limit) {
        calls.push(movieIds);
        assert.equal(limit, 6);
        return [
          { movieId: 7, title: "Film 7", score: 0.9 },
          { movieId: 1, title: "Film 1", score: 0.8 },
          { movieId: 6, title: "Film 6", score: 0.7 },
        ];
      },
    },
  });

  const result = await service.recommend([1, 2, 3, 4, 5], new AbortController().signal);
  assert.deepEqual(calls, [[1, 2, 3, 4, 5]]);
  assert.deepEqual(result.map(movie => movie.id), [7, 6]);
  assert.equal(result[0].score, 0.9);
});

test("AI client posts one five-movie payload", async () => {
  let requests = 0;
  const request: typeof fetch = async (input, init) => {
    requests += 1;
    assert.equal(String(input), "http://ai:8000/recommendations");
    assert.equal(init?.method, "POST");
    assert.deepEqual(JSON.parse(String(init?.body)), {
      movie_ids: [1, 2, 3, 4, 5], limit: 6,
    });
    return Response.json({ recommendations: [{ movie_id: 6, title: "Film 6", score: 0.8 }] });
  };

  const client = createAiClient({ baseUrl: "http://ai:8000" }, request);
  const result = await client.recommend([1, 2, 3, 4, 5], 6, new AbortController().signal);
  assert.equal(requests, 1);
  assert.deepEqual(result, [{ movieId: 6, title: "Film 6", score: 0.8 }]);
});

test("route accepts one five-movie request and rejects incomplete selections", async () => {
  const calls: number[][] = [];
  const handler = createRecommendationHandler(() => ({
    async recommend(ids) {
      calls.push(ids);
      return [];
    },
  }));
  const send = (movieIds: number[]) => handler(new Request("http://localhost/api/recommendations", {
    method: "POST", body: JSON.stringify({ movieIds }),
  }));

  const valid = await send([1, 2, 3, 4, 5]);
  const invalid = await send([1, 2, 3, 4]);
  assert.equal(valid.status, 200);
  assert.equal(invalid.status, 400);
  assert.deepEqual(calls, [[1, 2, 3, 4, 5]]);
});

test("AI client maps unsupported movies to a controlled error", async () => {
  const client = createAiClient(
    { baseUrl: "http://ai:8000" },
    async () => new Response(null, { status: 422 }),
  );
  await assert.rejects(
    client.recommend([1, 2, 3, 4, 5], 6, new AbortController().signal),
    (error: unknown) => error instanceof RecommendationError && error.code === "MOVIE_NOT_SUPPORTED",
  );
});
