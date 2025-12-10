CREATE TABLE `abuse_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`abuseScore` int NOT NULL,
	`indicators` text NOT NULL,
	`riskLevel` enum('low','medium','high') NOT NULL,
	`status` enum('active','warned','suspended','resolved') NOT NULL DEFAULT 'active',
	`actionTaken` varchar(100),
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `abuse_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `high_resolution_downloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`theme` varchar(64) NOT NULL,
	`resolution` enum('hd','4k') NOT NULL,
	`creditsUsed` int NOT NULL,
	`downloadUrl` text,
	`fileName` varchar(255),
	`fileSize` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `high_resolution_downloads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`displayName` varchar(100) NOT NULL,
	`monthlyPrice` int NOT NULL,
	`transformationsPerMonth` int NOT NULL,
	`maxExtraCredits` int NOT NULL,
	`extraCreditPrice` int NOT NULL,
	`includesHDDownload` int NOT NULL DEFAULT 0,
	`includes4KDownload` int NOT NULL DEFAULT 0,
	`supportLevel` enum('email','priority','vip') NOT NULL DEFAULT 'email',
	`hasAPI` int NOT NULL DEFAULT 0,
	`hasWebhooks` int NOT NULL DEFAULT 0,
	`renewalBonus` int NOT NULL DEFAULT 0,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_behavior_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`transformationsCount` int NOT NULL DEFAULT 0,
	`uniqueStylesUsed` int NOT NULL DEFAULT 0,
	`downloadCount` int NOT NULL DEFAULT 0,
	`downloadRatio` int NOT NULL DEFAULT 0,
	`ipAddresses` text,
	`userAgents` text,
	`suspiciousKeywordsInBio` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_behavior_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` int NOT NULL,
	`status` enum('active','paused','cancelled','expired') NOT NULL DEFAULT 'active',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`renewalDate` timestamp NOT NULL,
	`transformationsUsedThisMonth` int NOT NULL DEFAULT 0,
	`extraCreditsUsed` int NOT NULL DEFAULT 0,
	`autoRenew` int NOT NULL DEFAULT 1,
	`cancellationReason` text,
	`cancelledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_subscriptions_id` PRIMARY KEY(`id`)
);
