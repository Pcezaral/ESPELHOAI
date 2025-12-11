CREATE TABLE `affiliate_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`clickedUserId` int,
	`referralUrl` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`converted` int NOT NULL DEFAULT 0,
	`conversionAmount` int,
	`commissionEarned` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`convertedAt` timestamp,
	CONSTRAINT `affiliate_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`payoutMethod` enum('pix','bank_transfer','paypal') NOT NULL,
	`transactionId` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	CONSTRAINT `affiliate_payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`affiliateCode` varchar(50) NOT NULL,
	`commissionPercentage` int NOT NULL DEFAULT 10,
	`totalEarnings` int NOT NULL DEFAULT 0,
	`totalReferrals` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`bankAccount` varchar(255),
	`bankCode` varchar(10),
	`cpf` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliates_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliates_affiliateCode_unique` UNIQUE(`affiliateCode`)
);
--> statement-breakpoint
CREATE TABLE `promo_code_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`promoCodeId` int NOT NULL,
	`discountAmount` int NOT NULL,
	`purchaseAmount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promo_code_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promo_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`discountType` enum('percentage','fixed_credits') NOT NULL,
	`discountValue` int NOT NULL,
	`maxUses` int,
	`currentUses` int NOT NULL DEFAULT 0,
	`minPurchaseAmount` int NOT NULL DEFAULT 0,
	`validFrom` timestamp NOT NULL,
	`validUntil` timestamp NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promo_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `promo_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `social_shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transformationId` int NOT NULL,
	`platform` enum('instagram','tiktok','twitter','facebook','whatsapp','telegram') NOT NULL,
	`shareUrl` text,
	`clickCount` int NOT NULL DEFAULT 0,
	`conversionCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_shares_id` PRIMARY KEY(`id`)
);
