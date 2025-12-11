CREATE TABLE `download_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transformationId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`resolution` enum('hd','4k') NOT NULL,
	`product` enum('camiseta','caneca','poster') NOT NULL,
	`theme` varchar(64) NOT NULL,
	`creditsCost` int NOT NULL,
	`downloadedAt` timestamp NOT NULL DEFAULT (now()),
	`fileSize` int,
	`downloadStatus` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	CONSTRAINT `download_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('trending','download_ready','promotion','general') NOT NULL,
	`relatedTransformationId` int,
	`read` boolean NOT NULL DEFAULT false,
	`clickedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_push_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`endpoint` text NOT NULL,
	`auth` varchar(255) NOT NULL,
	`p256dh` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_push_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_push_subscriptions_endpoint_unique` UNIQUE(`endpoint`)
);
