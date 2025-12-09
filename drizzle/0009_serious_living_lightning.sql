CREATE TABLE `transformations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`theme` enum('animals','monster','art','gender','epic','gangster','circus','natal','reveillon') NOT NULL,
	`imageUrl` text NOT NULL,
	`averageRating` int DEFAULT 0,
	`ratingCount` int DEFAULT 0,
	`isPublic` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transformations_id` PRIMARY KEY(`id`)
);
