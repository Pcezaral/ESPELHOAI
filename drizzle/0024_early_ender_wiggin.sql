CREATE TABLE `transformation_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`originalImageHash` varchar(255) NOT NULL,
	`theme` enum('animals','monster','art','gender','epic','gangster','circus','natal','reveillon') NOT NULL,
	`transformedImageUrl` text NOT NULL,
	`filters` text,
	`creditsUsed` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transformation_cache_id` PRIMARY KEY(`id`)
);
