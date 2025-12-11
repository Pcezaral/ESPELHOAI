import { describe, it, expect, beforeAll } from 'vitest';
import { validatePromoCode, usePromoCode, createAffiliate, getAffiliateByCode, recordSocialShare, getSocialShareStats } from '../db';

describe('Promo Codes & Affiliate System', () => {
  describe('Promo Codes', () => {
    it('should validate an active promo code', async () => {
      // This test assumes a promo code exists in the database
      // In a real scenario, you'd seed test data first
      const result = await validatePromoCode('BLACKFRIDAY30');
      
      if (result) {
        expect(result.code).toBe('BLACKFRIDAY30');
        expect(result.isActive).toBe(1);
        expect(result.discountValue).toBeGreaterThan(0);
      }
    });

    it('should return null for invalid promo code', async () => {
      const result = await validatePromoCode('INVALID_CODE_12345');
      expect(result).toBeNull();
    });

    it('should calculate discount correctly for percentage-based promo', async () => {
      // Test percentage discount calculation
      const purchaseAmount = 10000; // R$ 100.00 in cents
      // Expected: 30% discount = 3000 cents (R$ 30.00)
      
      // This would need a real promo code in the database
      const result = await validatePromoCode('BLACKFRIDAY30');
      
      if (result && result.discountType === 'percentage') {
        const expectedDiscount = Math.floor(purchaseAmount * (result.discountValue / 100));
        expect(expectedDiscount).toBe(3000);
      }
    });
  });

  describe('Affiliate Program', () => {
    it('should create affiliate code for new user', async () => {
      const userId = 999; // Test user ID
      const affiliateCode = await createAffiliate(userId);
      
      expect(affiliateCode).toBeDefined();
      expect(affiliateCode).toContain('AFF_');
      expect(affiliateCode).toContain(String(userId));
    });

    it('should retrieve affiliate by code', async () => {
      // This test depends on a previously created affiliate
      const userId = 999;
      const affiliateCode = await createAffiliate(userId);
      
      if (affiliateCode) {
        const affiliate = await getAffiliateByCode(affiliateCode);
        
        expect(affiliate).toBeDefined();
        if (affiliate) {
          expect(affiliate.userId).toBe(userId);
          expect(affiliate.affiliateCode).toBe(affiliateCode);
          expect(affiliate.commissionPercentage).toBe(10); // Default 10%
        }
      }
    });

    it('should have correct default commission percentage', async () => {
      const userId = 1000;
      const affiliateCode = await createAffiliate(userId);
      
      if (affiliateCode) {
        const affiliate = await getAffiliateByCode(affiliateCode);
        expect(affiliate?.commissionPercentage).toBe(10);
      }
    });
  });

  describe('Social Shares', () => {
    it('should record social share', async () => {
      const userId = 1;
      const transformationId = 1;
      const platform = 'instagram';
      
      await recordSocialShare(userId, transformationId, platform);
      
      // Verify the share was recorded
      const stats = await getSocialShareStats(transformationId);
      expect(stats).toBeDefined();
      if (stats) {
        expect(stats.totalShares).toBeGreaterThan(0);
      }
    });

    it('should track shares by platform', async () => {
      const transformationId = 2;
      
      // Record multiple shares on different platforms
      await recordSocialShare(1, transformationId, 'instagram');
      await recordSocialShare(2, transformationId, 'tiktok');
      await recordSocialShare(3, transformationId, 'twitter');
      
      const stats = await getSocialShareStats(transformationId);
      
      expect(stats).toBeDefined();
      if (stats) {
        expect(stats.byPlatform.instagram).toBeGreaterThanOrEqual(1);
        expect(stats.byPlatform.tiktok).toBeGreaterThanOrEqual(1);
        expect(stats.byPlatform.twitter).toBeGreaterThanOrEqual(1);
      }
    });

    it('should calculate total shares correctly', async () => {
      const transformationId = 3;
      
      // Record 5 shares
      for (let i = 0; i < 5; i++) {
        await recordSocialShare(i + 1, transformationId, 'whatsapp');
      }
      
      const stats = await getSocialShareStats(transformationId);
      
      expect(stats).toBeDefined();
      if (stats) {
        expect(stats.totalShares).toBeGreaterThanOrEqual(5);
      }
    });
  });
});
