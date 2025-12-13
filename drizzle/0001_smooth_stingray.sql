CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`theme` enum('creature','monster','art','gender','epic') NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`)
);
