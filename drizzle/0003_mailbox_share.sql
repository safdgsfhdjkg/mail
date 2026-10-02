CREATE TABLE `mailbox_member` (
	`id` text PRIMARY KEY NOT NULL,
	`mailbox_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'viewer' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`invited_by` text,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`accepted_at` integer,
	FOREIGN KEY (`mailbox_id`) REFERENCES `mailbox`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_mailbox_user_idx` ON `mailbox_member` (`mailbox_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `member_user_idx` ON `mailbox_member` (`user_id`,`status`);--> statement-breakpoint
CREATE TABLE `mailbox_share_event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mailbox_id` text NOT NULL,
	`address` text NOT NULL,
	`action` text NOT NULL,
	`actor_id` text,
	`actor_name` text,
	`target_id` text,
	`target_name` text,
	`detail` text,
	`at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `share_event_mailbox_idx` ON `mailbox_share_event` (`mailbox_id`,`at`);