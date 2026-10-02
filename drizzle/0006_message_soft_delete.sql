ALTER TABLE `message` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `message` ADD `deleted_by` text;--> statement-breakpoint
ALTER TABLE `message` ADD `deleted_by_name` text;--> statement-breakpoint
ALTER TABLE `message` ADD `deleted_role` text;--> statement-breakpoint
ALTER TABLE `message` ADD `deleted_via` text;--> statement-breakpoint
ALTER TABLE `message` ADD `deleted_ip` text;--> statement-breakpoint
ALTER TABLE `message` ADD `deleted_anon_id` text;--> statement-breakpoint
CREATE INDEX `message_live_idx` ON `message` (`mailbox_id`,`received_at`,`seen`) WHERE `deleted_at` IS NULL;--> statement-breakpoint
CREATE INDEX `message_deleted_idx` ON `message` (`deleted_at`) WHERE `deleted_at` IS NOT NULL;