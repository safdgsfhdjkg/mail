DROP TABLE `mailbox_origin`;--> statement-breakpoint
DROP TABLE `user_fingerprint`;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` DROP COLUMN `ip`;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` DROP COLUMN `user_agent`;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` DROP COLUMN `referer`;--> statement-breakpoint
ALTER TABLE `message` DROP COLUMN `deleted_ip`;--> statement-breakpoint
ALTER TABLE `message` DROP COLUMN `deleted_anon_id`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `user_agent`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `model`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `platform_version`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `ip`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `country`;