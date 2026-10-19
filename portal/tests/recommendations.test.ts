import assert from "node:assert/strict";
import test from "node:test";
import { parseSelection, recommend, type Movie } from "../src/lib/movies.ts";

const movies: Movie[] = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1, title: `Film ${index + 1}`, year: 2000 + index, rating: "7.5",
  genres: index % 2 ? ["Animation", "Comedy"] : ["Sci-Fi", "Drama"], poster: null,
}));
test("selection rejects duplicates, unknown and malformed IDs", () => {
  assert.deepEqual(parseSelection("3,3,999,bad,1,,2,1e1", movies).map(movie => movie.id), [3, 1, 2]);
  assert.deepEqual(parseSelection(null, movies), []);
});
test("selection is limited to five films", () => {
  assert.equal(parseSelection("1,2,3,4,5,6", movies).length, 5);
});
test("results contain six unique unseen movies", () => {
  const selected = movies.slice(0, 5);
  const results = recommend(selected, movies);
  assert.equal(results.length, 6);
  assert.equal(new Set(results.map(movie => movie.id)).size, 6);
  assert.ok(results.every(movie => !selected.some(choice => choice.id === movie.id)));
});
test("recommendations respond to taste and are deterministic", () => {
  const sciFi = parseSelection("1,3,5,7,9", movies);
  const animation = parseSelection("2,4,6,8,10", movies);
  assert.deepEqual(recommend(sciFi, movies), recommend([...sciFi].reverse(), movies));
  assert.notDeepEqual(recommend(sciFi, movies), recommend(animation, movies));
  assert.ok(recommend(sciFi, movies)[0].genres.includes("Sci-Fi"));
});
