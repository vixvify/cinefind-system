import assert from "node:assert/strict";
import test from "node:test";
import { parseMovieDataset } from "../src/lib/dataset.ts";

const cell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
function fixture() {
  const rows = Array.from({ length: 12 }, (_, index) => [index + 1, index === 0 ? 'Film, "quoted"\nsecond line' : `Film ${index}`, '[{"id":878,"name":"Science Fiction"}]', index === 1 ? "" : "2014-11-05", "8.6", 100 - index]);
  return "\uFEFFid,title,genres,release_date,vote_average,popularity\r\n" + rows.map(row => row.map(cell).join(",")).join("\r\n");
}
test("CSV handles BOM, quoted JSON, embedded commas, quotes and newlines", () => {
  const movies = parseMovieDataset(fixture());
  assert.equal(movies.length, 12);
  assert.equal(movies[0].title, 'Film, "quoted"\nsecond line');
  assert.deepEqual(movies[0].genres, ["Sci-Fi"]);
  assert.equal(movies[0].year, 2014);
  assert.equal(movies[0].rating, "8.6");
  assert.equal(movies[0].poster, null);
  assert.equal(movies[1].year, null);
});
test("invalid genre JSON has a fallback and duplicate IDs are removed", () => {
  const csv = fixture() + '\r\n13,Unknown,invalid,,bad,0\r\n1,Duplicate,[],2000-01-01,2,0';
  const movies = parseMovieDataset(csv);
  assert.equal(movies.length, 13);
  assert.deepEqual(movies.at(-1)?.genres, ["Unknown"]);
  assert.equal(movies.at(-1)?.rating, "—");
});
test("wrong schema and undersized datasets produce actionable errors", () => {
  assert.throws(() => parseMovieDataset("movie_id,cast\n1,[]"), /requires/);
  assert.throws(() => parseMovieDataset("id,title,genres,release_date,vote_average\n1,Test,[],,7"), /at least 11/);
});
