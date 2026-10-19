import assert from "node:assert/strict";
import test from "node:test";
import { resolvePosterUrl } from "../src/lib/tmdb.ts";

test("missing credentials and invalid IDs do not call TMDB", async () => {
  const noRequest: typeof fetch = async () => { throw new Error("Unexpected request"); };
  assert.equal(await resolvePosterUrl(19995, {}, noRequest), null);
  assert.equal(await resolvePosterUrl(-1, { token: "test" }, noRequest), null);
});
test("read token uses authorization header, returning a credential-free image URL", async () => {
  let called = false;
  const request: typeof fetch = async (input, init) => {
    called = true;
    assert.equal(String(input), "https://api.themoviedb.org/3/movie/19995");
    assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer test-token");
    return Response.json({ poster_path: "/poster123.jpg" });
  };
  assert.equal(await resolvePosterUrl(19995, { token: "test-token" }, request), "https://image.tmdb.org/t/p/w500/poster123.jpg");
  assert.ok(called);
});
test("v3 key is supported only in the server-to-TMDB request", async () => {
  const request: typeof fetch = async (input) => {
    assert.equal(new URL(String(input)).searchParams.get("api_key"), "test-key");
    return Response.json({ poster_path: "/image.png" });
  };
  assert.equal(await resolvePosterUrl(19995, { apiKey: "test-key" }, request), "https://image.tmdb.org/t/p/w500/image.png");
});
test("bad credentials, missing posters and rate limits fall back without throwing", async () => {
  for (const status of [401, 404, 429, 500]) {
    assert.equal(await resolvePosterUrl(19995, { token: "test" }, async () => new Response(null, { status })), null);
  }
  for (const poster_path of [null, "https://example.com/image.jpg", "/../../secret.jpg"]) {
    assert.equal(await resolvePosterUrl(19995, { token: "test" }, async () => Response.json({ poster_path })), null);
  }
});
test("network failures and malformed JSON safely return no poster", async () => {
  assert.equal(await resolvePosterUrl(19995, { token: "test" }, async () => { throw new Error("timeout"); }), null);
  assert.equal(await resolvePosterUrl(19995, { token: "test" }, async () => new Response("bad json")), null);
});
