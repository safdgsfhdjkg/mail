CREATE TABLE `attachment` (
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`mailbox_id` text NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`content` text,
	FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mailbox_id`) REFERENCES `mailbox`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `attachment_message_idx` ON `attachment` (`message_id`);--> statement-breakpoint
CREATE INDEX `attachment_mailbox_idx` ON `attachment` (`mailbox_id`);--> statement-breakpoint
CREATE TABLE `blog_category` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT 'blue' NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_category_slug_unique` ON `blog_category` (`slug`);--> statement-breakpoint
CREATE TABLE `blog_post` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`content_html` text DEFAULT '' NOT NULL,
	`toc` text DEFAULT '[]' NOT NULL,
	`minutes` integer DEFAULT 1 NOT NULL,
	`category_id` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`keywords` text DEFAULT '[]' NOT NULL,
	`cover_url` text,
	`pinned` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`views` integer DEFAULT 0 NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `blog_category`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_post_slug_unique` ON `blog_post` (`slug`);--> statement-breakpoint
CREATE INDEX `blog_post_published_idx` ON `blog_post` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `blog_post_category_idx` ON `blog_post` (`category_id`);--> statement-breakpoint
CREATE TABLE `mailbox` (
	`id` text PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`expires_at` integer NOT NULL,
	`catch_all` integer DEFAULT false NOT NULL,
	`owner_id` text,
	`note` text,
	`share_token` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mailbox_address_unique` ON `mailbox` (`address`);--> statement-breakpoint
CREATE UNIQUE INDEX `mailbox_share_token_unique` ON `mailbox` (`share_token`);--> statement-breakpoint
CREATE INDEX `mailbox_expires_idx` ON `mailbox` (`expires_at`);--> statement-breakpoint
CREATE INDEX `mailbox_owner_idx` ON `mailbox` (`owner_id`);--> statement-breakpoint
CREATE TABLE `mailbox_origin` (
	`id` text PRIMARY KEY NOT NULL,
	`mailbox_id` text,
	`address` text NOT NULL,
	`domain` text NOT NULL,
	`kind` text NOT NULL,
	`custom` integer DEFAULT false NOT NULL,
	`expiry` text,
	`user_id` text,
	`username` text,
	`anon_id` text,
	`visitor_id` text,
	`fingerprint` text,
	`ip` text,
	`user_agent` text,
	`model` text,
	`platform` text,
	`platform_version` text,
	`brands` text,
	`accept_language` text,
	`referer` text,
	`country` text,
	`region` text,
	`city` text,
	`postal_code` text,
	`timezone` text,
	`latitude` text,
	`longitude` text,
	`asn` integer,
	`as_organization` text,
	`colo` text,
	`client_tz` text,
	`client_lang` text,
	`screen` text,
	`cores` integer,
	`memory` integer,
	`touch` integer,
	`standalone` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `origin_created_idx` ON `mailbox_origin` (`created_at`,`id`);--> statement-breakpoint
CREATE INDEX `origin_address_idx` ON `mailbox_origin` (`address`);--> statement-breakpoint
CREATE INDEX `origin_mailbox_idx` ON `mailbox_origin` (`mailbox_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `origin_user_idx` ON `mailbox_origin` (`user_id`);--> statement-breakpoint
CREATE INDEX `origin_anon_idx` ON `mailbox_origin` (`anon_id`);--> statement-breakpoint
CREATE INDEX `origin_ip_idx` ON `mailbox_origin` (`ip`);--> statement-breakpoint
CREATE INDEX `origin_visitor_idx` ON `mailbox_origin` (`visitor_id`);--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`mailbox_id` text NOT NULL,
	`from_address` text NOT NULL,
	`from_name` text,
	`subject` text DEFAULT '' NOT NULL,
	`text` text,
	`html` text,
	`preview` text DEFAULT '' NOT NULL,
	`code` text,
	`size` integer DEFAULT 0 NOT NULL,
	`seen` integer DEFAULT false NOT NULL,
	`headers` text,
	`received_at` integer NOT NULL,
	FOREIGN KEY (`mailbox_id`) REFERENCES `mailbox`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `message_list_idx` ON `message` (`mailbox_id`,`received_at`,`seen`,`code`,`preview`);--> statement-breakpoint
CREATE INDEX `message_received_idx` ON `message` (`received_at`,`id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_agent` text DEFAULT '' NOT NULL,
	`model` text,
	`platform_version` text,
	`ip` text,
	`city` text,
	`country` text,
	`created_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `session_user_idx` ON `session` (`user_id`,`last_seen_at`);--> statement-breakpoint
CREATE TABLE `stat_hour` (
	`hour` integer NOT NULL,
	`metric` text NOT NULL,
	`value` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`hour`, `metric`)
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT 'blue' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_name_unique` ON `tag` (`name`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`disabled` integer DEFAULT false NOT NULL,
	`last_seen_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE TABLE `user_fingerprint` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`visitor_id` text NOT NULL,
	`anon_id` text,
	`components` text NOT NULL,
	`last_event` text NOT NULL,
	`seen_count` integer DEFAULT 1 NOT NULL,
	`ip` text,
	`ips` text DEFAULT '[]' NOT NULL,
	`user_agent` text,
	`model` text,
	`platform_version` text,
	`accept_language` text,
	`country` text,
	`region` text,
	`city` text,
	`timezone` text,
	`asn` integer,
	`as_organization` text,
	`first_seen_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fingerprint_user_visitor_idx` ON `user_fingerprint` (`user_id`,`visitor_id`);--> statement-breakpoint
CREATE INDEX `fingerprint_visitor_idx` ON `user_fingerprint` (`visitor_id`);--> statement-breakpoint
CREATE TABLE `user_tag` (
	`user_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `tag_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_tag_tag_idx` ON `user_tag` (`tag_id`);