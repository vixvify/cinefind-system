import assert from "node:assert/strict";
import test from "node:test";
import { movies, parseSelection, recommend } from "../src/lib/movies.ts";

test("selection rejects unknown IDs and duplicates while preserving order", () => {
  assert.deepEqual(parseSelection("3,3,999,garbage,1,,2").map(movie => movie.id), [3, 1, 2]);
  assert.deepEqual(parseSelection(null), []);
});

test("selection cannot exceed five distinct movies", () => {
  assert.deepEqual(parseSelection("1,2,3,4,5,6,7").map(movie => movie.id), [1, 2, 3, 4, 5]);
});

test("recommendations provide six unique unseen films", () => {
  const selected = parseSelection("1,2,3,4,5");
  const results = recommend(selected);
  assert.equal(results.length, 6);
  assert.equal(new Set(results.map(movie => movie.id)).size, 6);
  assert.ok(results.every(movie => !selected.some(choice => choice.id === movie.id)));
  assert.ok(results.every(movie => movie.reason.length > 0));
});

test("recommendations change with taste and are stable across reloads", () => {
  const scienceFiction = parseSelection("1,2,7,13,14");
  const animation = parseSelection("6,11,16,18,21");
  assert.deepEqual(recommend(scienceFiction), recommend([...scienceFiction].reverse()));
  assert.notDeepEqual(recommend(scienceFiction).map(movie => movie.id), recommend(animation).map(movie => movie.id));
  assert.ok(recommend(scienceFiction)[0].genres.includes("Sci-Fi"));
});

test("every five-movie window produces valid unseen recommendations", () => {
  for (let index = 0; index <= movies.length - 5; index++) {
    const selected = movies.slice(index, index + 5);
    const results = recommend(selected);
    assert.equal(results.length, 6);
    assert.ok(results.every(movie => !selected.some(choice => choice.id === movie.id)));
    assert.ok(results.every((movie, position) => position === 0 || results[position - 1].score >= movie.score));
  }
});
