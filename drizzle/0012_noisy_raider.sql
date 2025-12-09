CREATE TABLE `analytics_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`theme` enum('animals','monster','art','gender','epic','gangster','circus','natal','reveillon') NOT NULL,
	`transformationCount` int NOT NULL DEFAULT 0,
	`uniqueUsers` int NOT NULL DEFAULT 0,
	`shareCount` int NOT NULL DEFAULT 0,
	`downloadCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oauth_providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('instagram','tiktok','twitter','youtube') NOT NULL,
	`providerUserId` varchar(255) NOT NULL,
	`providerUsername` varchar(255),
	`accessToken` text,
	`refreshToken` text,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `oauth_providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeType` enum('transformations_10','transformations_50','transformations_100','social_sharer','early_adopter','power_user','collector') NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`)
);
