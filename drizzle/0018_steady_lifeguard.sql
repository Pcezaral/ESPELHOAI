CREATE TABLE `email_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('transformation_summary','trending_alert','promotional','account_activity') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`status` enum('sent','failed','bounced') NOT NULL DEFAULT 'sent',
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`openedAt` timestamp,
	`clickedAt` timestamp,
	CONSTRAINT `email_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trending_transformations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transformationId` int NOT NULL,
	`userId` int NOT NULL,
	`theme` enum('animals','monster','art','gender','epic','gangster','circus','natal','reveillon') NOT NULL,
	`imageUrl` text NOT NULL,
	`title` varchar(255),
	`description` text,
	`shareCount` int NOT NULL DEFAULT 0,
	`downloadCount` int NOT NULL DEFAULT 0,
	`ratingScore` int NOT NULL DEFAULT 0,
	`isPublic` int NOT NULL DEFAULT 1,
	`featuredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trending_transformations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transformationId` int NOT NULL,
	`phoneNumber` varchar(20),
	`message` text,
	`shareUrl` text,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`clickedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whatsapp_shares_id` PRIMARY KEY(`id`)
);
