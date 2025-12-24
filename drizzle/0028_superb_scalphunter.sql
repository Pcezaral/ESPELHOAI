CREATE TABLE `transformation_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`theme` enum('animals','monster','art','gender','epic','gangster','circus','natal','reveillon','beach') NOT NULL,
	`originalImageUrl` text NOT NULL,
	`transformedImageUrl` text NOT NULL,
	`watermarkedImageUrl` text,
	`beforeAfterImageUrl` text,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transformation_history_id` PRIMARY KEY(`id`)
);
