ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `instagramHandle` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `tiktokHandle` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `twitterHandle` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `youtubeChannel` varchar(64);