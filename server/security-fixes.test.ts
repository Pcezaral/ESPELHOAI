import { describe, it, expect } from "vitest";
import { THEMES, THEME_NAMES, THEME_IDS, getThemeName, getThemeCreditCost, type ThemeId } from "@shared/themes";

describe("Security & Performance Fixes", () => {
  describe("Theme Configuration (shared/themes.ts)", () => {
    it("should have all 8 themes defined", () => {
      expect(THEME_IDS.length).toBe(8);
      expect(THEME_IDS).toContain("animals");
      expect(THEME_IDS).toContain("monster");
      expect(THEME_IDS).toContain("art");
      expect(THEME_IDS).toContain("gender");
      expect(THEME_IDS).toContain("epic");
      expect(THEME_IDS).toContain("gangster");
      expect(THEME_IDS).toContain("circus");
      expect(THEME_IDS).toContain("pet");
    });

    it("should NOT contain seasonal themes", () => {
      expect(THEME_IDS).not.toContain("christmas");
      expect(THEME_IDS).not.toContain("newyear");
      expect(THEME_IDS).not.toContain("beach");
    });

    it("should have correct Portuguese names for all themes", () => {
      expect(THEME_NAMES.animals).toBe("Bichinho");
      expect(THEME_NAMES.monster).toBe("Monstro");
      expect(THEME_NAMES.art).toBe("Pintura");
      expect(THEME_NAMES.gender).toBe("Se tivesse nascido...");
      expect(THEME_NAMES.epic).toBe("Épico");
      expect(THEME_NAMES.gangster).toBe("Gangster");
      expect(THEME_NAMES.circus).toBe("Circo");
      expect(THEME_NAMES.pet).toBe("Você e Seu Pet");
    });

    it("getThemeName should return correct name", () => {
      expect(getThemeName("animals")).toBe("Bichinho");
      expect(getThemeName("pet")).toBe("Você e Seu Pet");
    });

    it("getThemeCreditCost should return 1 for all themes", () => {
      for (const themeId of THEME_IDS) {
        expect(getThemeCreditCost(themeId)).toBe(1);
      }
    });

    it("each theme should have required properties", () => {
      for (const themeId of THEME_IDS) {
        const theme = THEMES[themeId];
        expect(theme).toHaveProperty("id");
        expect(theme).toHaveProperty("name");
        expect(theme).toHaveProperty("emoji");
        expect(theme).toHaveProperty("description");
        expect(theme).toHaveProperty("creditCost");
        expect(theme.id).toBe(themeId);
        expect(typeof theme.name).toBe("string");
        expect(typeof theme.emoji).toBe("string");
        expect(typeof theme.description).toBe("string");
        expect(typeof theme.creditCost).toBe("number");
      }
    });
  });

  describe("Rate Limit Configuration", () => {
    it("rate limit module should be importable", async () => {
      const rateLimitModule = await import("../server/_core/rateLimit");
      expect(rateLimitModule.generationLimiter).toBeDefined();
      expect(rateLimitModule.apiLimiter).toBeDefined();
      expect(rateLimitModule.checkoutLimiter).toBeDefined();
    });
  });

  describe("Refund Credit Function", () => {
    it("refundCredit function should be exported from credits module", async () => {
      const creditsModule = await import("../server/credits");
      expect(creditsModule.refundCredit).toBeDefined();
      expect(typeof creditsModule.refundCredit).toBe("function");
    });
  });
});
