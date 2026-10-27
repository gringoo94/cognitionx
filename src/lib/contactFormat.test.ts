import { describe, it, expect } from "vitest";
import { toContactEmailField } from "./contactFormat";

describe("toContactEmailField", () => {
  it("keeps a valid email, lowercased", () => {
    expect(toContactEmailField("User@Mail.com")).toBe("user@mail.com");
  });
  it("prefixes a Telegram nick", () => {
    expect(toContactEmailField("@gringoo94")).toBe("Telegram: @gringoo94");
  });
  it("treats an email with a one-letter zone as a messenger contact", () => {
    expect(toContactEmailField("a@b.c")).toBe("Telegram: a@b.c");
  });
});
