CREATE TABLE `credit_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('initial','purchase','consumption','bonus','refund') NOT NULL,
	`amount` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`description` text,
	`relatedPackage` enum('light','premium','monthly_unlimited','annual_unlimited'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `credit_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `credits` int DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionType` enum('free','light','premium','monthly_unlimited','annual_unlimited') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpiresAt` timestamp;