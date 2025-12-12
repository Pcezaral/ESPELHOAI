DROP TABLE `access_logs`;--> statement-breakpoint
DROP TABLE `admin_alerts`;--> statement-breakpoint
DROP TABLE `affiliate_clicks`;--> statement-breakpoint
DROP TABLE `affiliate_payouts`;--> statement-breakpoint
DROP TABLE `affiliates`;--> statement-breakpoint
DROP TABLE `analytics_data`;--> statement-breakpoint
DROP TABLE `download_history`;--> statement-breakpoint
DROP TABLE `email_history`;--> statement-breakpoint
DROP TABLE `oauth_providers`;--> statement-breakpoint
DROP TABLE `premium_downloads`;--> statement-breakpoint
DROP TABLE `promo_code_usage`;--> statement-breakpoint
DROP TABLE `promo_codes`;--> statement-breakpoint
DROP TABLE `push_notifications`;--> statement-breakpoint
DROP TABLE `pwa_installs`;--> statement-breakpoint
DROP TABLE `referrals`;--> statement-breakpoint
DROP TABLE `social_shares`;--> statement-breakpoint
DROP TABLE `support_tickets`;--> statement-breakpoint
DROP TABLE `transformation_cache`;--> statement-breakpoint
DROP TABLE `transformations`;--> statement-breakpoint
DROP TABLE `trending_transformations`;--> statement-breakpoint
DROP TABLE `user_badges`;--> statement-breakpoint
DROP TABLE `user_push_subscriptions`;--> statement-breakpoint
DROP TABLE `whatsapp_shares`;--> statement-breakpoint
ALTER TABLE `credit_transactions` MODIFY COLUMN `relatedPackage` enum('light','premium','monthly_unlimited','annual_unlimited');--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `subscriptionType` enum('free','light','premium','monthly_unlimited','annual_unlimited') NOT NULL DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `instagramHandle`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `tiktokHandle`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `twitterHandle`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `youtubeChannel`;