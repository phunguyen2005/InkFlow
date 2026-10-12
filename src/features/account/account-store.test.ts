import { describe, expect, it } from "vitest";
import { emptyDeviceLibrary, parseDeviceLibrary } from "./account-store";

describe("device library storage", () => {
  it("rejects malformed and unsupported versions", () => {
    expect(parseDeviceLibrary("broken")).toEqual(emptyDeviceLibrary);
    expect(parseDeviceLibrary('{"version":1}')).toEqual(emptyDeviceLibrary);
  });

  it("deduplicates collection ids and keeps a valid profile", () => {
    expect(
      parseDeviceLibrary(
        JSON.stringify({
          version: 2,
          profile: { name: "Avery", email: "avery@example.com" },
          savedStoryIds: ["story-1", "story-1", 42],
          followedStoryIds: [],
          followedAuthorIds: [],
          progress: {},
          reviews: {},
        }),
      ),
    ).toMatchObject({
      profile: { name: "Avery", email: "avery@example.com" },
      savedStoryIds: ["story-1"],
    });
  });
});
