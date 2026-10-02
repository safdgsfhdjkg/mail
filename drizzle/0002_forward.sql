CREATE TABLE `app_setting` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `forward_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`address` text NOT NULL,
	`from_address` text NOT NULL,
	`subject` text DEFAULT '' NOT NULL,
	`target` text NOT NULL,
	`ok` integer NOT NULL,
	`error` text,
	`ms` integer DEFAULT 0 NOT NULL,
	`at` integer NOT NULL
);
