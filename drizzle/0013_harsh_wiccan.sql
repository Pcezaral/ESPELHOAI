CREATE TABLE `premium_downloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`resolution` enum('hd','4k') NOT NULL,
	`product` enum('camiseta','caneca','poster') NOT NULL,
	`theme` varchar(64) NOT NULL,
	`creditsCost` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `premium_downloads_id` PRIMARY KEY(`id`)
);
