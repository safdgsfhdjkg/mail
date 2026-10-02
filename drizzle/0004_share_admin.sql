ALTER TABLE `mailbox` ADD `share_locked` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` ADD `source` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` ADD `ip` text;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` ADD `country` text;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` ADD `city` text;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `mailbox_share_event` ADD `referer` text;--> statement-breakpoint
CREATE INDEX `share_event_at_idx` ON `mailbox_share_event` (`at`,`id`);--> statement-breakpoint
CREATE INDEX `share_event_action_idx` ON `mailbox_share_event` (`action`,`at`);--> statement-breakpoint
CREATE INDEX `share_event_actor_idx` ON `mailbox_share_event` (`actor_id`,`at`);--> statement-breakpoint
CREATE INDEX `share_event_target_idx` ON `mailbox_share_event` (`target_id`,`at`);--> statement-breakpoint
UPDATE `mailbox_share_event` SET `source` = 'system' WHERE `action` = 'expire';