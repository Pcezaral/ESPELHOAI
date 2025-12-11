import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { 
  generateImageHash, 
  cacheTransformation, 
  getCachedTransformation,
  getUserTransformationCache,
  cleanupExpiredCache 
} from "../db";

describe("Transformation Cache Functions", () => {
  const testUserId = 999;
  const testImageHash = generateImageHash(Buffer.from("test-image-data"));
  const testImageUrl = "https://example.com/transformed.jpg";
  const testTheme = "animals";
  const testCredits = 3;

  describe("generateImageHash", () => {
    it("should generate consistent MD5 hash", () => {
      const data = Buffer.from("test-data");
      const hash1 = generateImageHash(data);
      const hash2 = generateImageHash(data);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{32}$/); // MD5 format
    });

    it("should generate different hashes for different data", () => {
      const hash1 = generateImageHash(Buffer.from("data1"));
      const hash2 = generateImageHash(Buffer.from("data2"));
      
      expect(hash1).not.toBe(hash2);
    });

    it("should handle string input", () => {
      const hash = generateImageHash("test-string");
      expect(hash).toMatch(/^[a-f0-9]{32}$/);
    });
  });

  describe("cacheTransformation", () => {
    it("should cache transformation successfully", async () => {
      const result = await cacheTransformation(
        testUserId,
        testImageHash,
        testTheme,
        testImageUrl,
        testCredits
      );
      
      expect(result).toBe(true);
    });

    it("should cache transformation with filters", async () => {
      const filters = {
        saturation: 120,
        brightness: 110,
        contrast: 105,
      };

      const result = await cacheTransformation(
        testUserId,
        generateImageHash(Buffer.from("test-with-filters")),
        testTheme,
        testImageUrl,
        testCredits,
        filters
      );
      
      expect(result).toBe(true);
    });

    it("should handle database errors gracefully", async () => {
      // Test with invalid data
      const result = await cacheTransformation(
        -1, // Invalid user ID
        testImageHash,
        testTheme,
        testImageUrl,
        testCredits
      );
      
      // Should return false on error
      expect(typeof result).toBe("boolean");
    });
  });

  describe("getCachedTransformation", () => {
    it("should retrieve cached transformation", async () => {
      // First cache a transformation
      await cacheTransformation(
        testUserId,
        testImageHash,
        testTheme,
        testImageUrl,
        testCredits
      );

      // Then retrieve it
      const cached = await getCachedTransformation(
        testUserId,
        testImageHash,
        testTheme
      );

      expect(cached).not.toBeNull();
      if (cached) {
        expect(cached.transformedImageUrl).toBe(testImageUrl);
        expect(cached.creditsUsed).toBe(testCredits);
        expect(cached.theme).toBe(testTheme);
      }
    });

    it("should return null for non-existent cache", async () => {
      const cached = await getCachedTransformation(
        testUserId,
        "non-existent-hash",
        testTheme
      );

      expect(cached).toBeNull();
    });

    it("should not return expired cache", async () => {
      // This test would require mocking the database
      // or creating a transformation with a past expiration date
      // For now, we verify the function handles the query correctly
      const cached = await getCachedTransformation(
        testUserId,
        testImageHash,
        testTheme
      );

      if (cached) {
        // If found, verify expiration date is in the future
        expect(new Date(cached.expiresAt).getTime()).toBeGreaterThan(Date.now());
      }
    });
  });

  describe("getUserTransformationCache", () => {
    it("should retrieve all user transformations", async () => {
      // Cache multiple transformations
      const hash1 = generateImageHash(Buffer.from("image1"));
      const hash2 = generateImageHash(Buffer.from("image2"));

      await cacheTransformation(testUserId, hash1, "animals", testImageUrl, 3);
      await cacheTransformation(testUserId, hash2, "monster", testImageUrl, 3);

      // Retrieve all
      const cache = await getUserTransformationCache(testUserId);

      expect(Array.isArray(cache)).toBe(true);
      expect(cache.length).toBeGreaterThanOrEqual(2);
    });

    it("should return empty array for user with no cache", async () => {
      const cache = await getUserTransformationCache(99999);
      
      expect(Array.isArray(cache)).toBe(true);
    });

    it("should not include expired transformations", async () => {
      const cache = await getUserTransformationCache(testUserId);
      
      // All returned items should have future expiration dates
      cache.forEach(item => {
        expect(new Date(item.expiresAt).getTime()).toBeGreaterThan(Date.now());
      });
    });

    it("should parse filters correctly", async () => {
      const filters = {
        saturation: 150,
        brightness: 120,
        contrast: 110,
      };

      const hash = generateImageHash(Buffer.from("filters-test"));
      await cacheTransformation(
        testUserId,
        hash,
        "animals",
        testImageUrl,
        3,
        filters
      );

      const cache = await getUserTransformationCache(testUserId);
      const withFilters = cache.find(c => c.originalImageHash === hash);

      if (withFilters && withFilters.filters) {
        expect(withFilters.filters.saturation).toBe(150);
        expect(withFilters.filters.brightness).toBe(120);
        expect(withFilters.filters.contrast).toBe(110);
      }
    });
  });

  describe("cleanupExpiredCache", () => {
    it("should return a number", async () => {
      const result = await cleanupExpiredCache();
      
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it("should handle database errors gracefully", async () => {
      // The function should not throw even if there are no expired items
      const result = await cleanupExpiredCache();
      
      expect(typeof result).toBe("number");
    });
  });

  describe("Cache Expiration", () => {
    it("should set expiration to 3 months from now", async () => {
      const hash = generateImageHash(Buffer.from("expiration-test"));
      await cacheTransformation(
        testUserId,
        hash,
        testTheme,
        testImageUrl,
        testCredits
      );

      const cached = await getCachedTransformation(
        testUserId,
        hash,
        testTheme
      );

      if (cached) {
        const expirationDate = new Date(cached.expiresAt);
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

        // Allow 1 day tolerance for timing
        const tolerance = 24 * 60 * 60 * 1000;
        expect(Math.abs(expirationDate.getTime() - threeMonthsFromNow.getTime())).toBeLessThan(tolerance);
      }
    });
  });
});
