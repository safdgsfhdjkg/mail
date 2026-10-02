import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { DELETED_VIA, DELETER_ROLES } from "../lib/message-deletion";
import { SHARE_ROLES, type ShareRole } from "../lib/share-rules";

export const user = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  disabled: integer("disabled", { mode: "boolean" }).notNull().default(false),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid(24)),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    lastSeenAt: integer("last_seen_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("session_user_idx").on(t.userId, t.lastSeenAt)],
);

export const tag = sqliteTable("tag", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("blue"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const userTag = sqliteTable(
  "user_tag",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.tagId] }), index("user_tag_tag_idx").on(t.tagId)],
);

export const mailbox = sqliteTable(
  "mailbox",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    address: text("address").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    catchAll: integer("catch_all", { mode: "boolean" }).notNull().default(false),
    ownerId: text("owner_id").references(() => user.id, { onDelete: "cascade" }),
    note: text("note"),
    shareToken: text("share_token").unique(),
    shareLocked: integer("share_locked", { mode: "boolean" }).notNull().default(false),
    shareExpiresAt: integer("share_expires_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index("mailbox_expires_idx").on(t.expiresAt),
    index("mailbox_owner_idx").on(t.ownerId),
    index("mailbox_share_expires_idx").on(t.shareExpiresAt).where(sql`${t.shareExpiresAt} is not null`),
    index("mailbox_catch_all_idx").on(t.expiresAt).where(sql`${t.catchAll} = 1`),
  ],
);

export const message = sqliteTable(
  "message",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    mailboxId: text("mailbox_id")
      .notNull()
      .references(() => mailbox.id, { onDelete: "cascade" }),
    fromAddress: text("from_address").notNull(),
    fromName: text("from_name"),
    subject: text("subject").notNull().default(""),
    text: text("text"),
    html: text("html"),
    preview: text("preview").notNull().default(""),
    code: text("code"),
    size: integer("size").notNull().default(0),
    seen: integer("seen", { mode: "boolean" }).notNull().default(false),
    headers: text("headers", { mode: "json" }).$type<MailHeader[]>(),
    receivedAt: integer("received_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
    deletedBy: text("deleted_by"),
    deletedByName: text("deleted_by_name"),
    deletedRole: text("deleted_role", { enum: DELETER_ROLES }),
    deletedVia: text("deleted_via", { enum: DELETED_VIA }),
  },
  (t) => [
    index("message_list_idx").on(t.mailboxId, t.receivedAt, t.seen, t.code, t.preview),
    index("message_received_idx").on(t.receivedAt, t.id),
    index("message_live_idx").on(t.mailboxId, t.receivedAt, t.seen).where(sql`${t.deletedAt} is null`),
    index("message_unread_idx").on(t.mailboxId).where(sql`${t.deletedAt} is null and ${t.seen} = 0`),
    index("message_deleted_idx").on(t.deletedAt).where(sql`${t.deletedAt} is not null`),
  ],
);

export const attachment = sqliteTable(
  "attachment",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    messageId: text("message_id")
      .notNull()
      .references(() => message.id, { onDelete: "cascade" }),
    mailboxId: text("mailbox_id")
      .notNull()
      .references(() => mailbox.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    content: text("content"),
  },
  (t) => [index("attachment_message_idx").on(t.messageId), index("attachment_mailbox_idx").on(t.mailboxId)],
);

export type MailHeader = { key: string; value: string };

export const statHour = sqliteTable(
  "stat_hour",
  {
    hour: integer("hour").notNull(),
    metric: text("metric").notNull(),
    value: integer("value").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.hour, t.metric] })],
);

export const blogCategory = sqliteTable("blog_category", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  color: text("color").notNull().default("blue"),
  sort: integer("sort").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const blogPost = sqliteTable(
  "blog_post",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    contentHtml: text("content_html").notNull().default(""),
    toc: text("toc", { mode: "json" }).$type<{ id: string; text: string; level: number }[]>().notNull().default([]),
    minutes: integer("minutes").notNull().default(1),
    categoryId: text("category_id").references(() => blogCategory.id, { onDelete: "set null" }),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
    keywords: text("keywords", { mode: "json" }).$type<string[]>().notNull().default([]),
    coverUrl: text("cover_url"),
    pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
    status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    views: integer("views").notNull().default(0),
    likes: integer("likes").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("blog_post_published_idx").on(t.status, t.publishedAt), index("blog_post_category_idx").on(t.categoryId)],
);

export const appSetting = sqliteTable("app_setting", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).$type<unknown>().notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const forwardLog = sqliteTable("forward_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  address: text("address").notNull(),
  fromAddress: text("from_address").notNull(),
  subject: text("subject").notNull().default(""),
  target: text("target").notNull(),
  ok: integer("ok", { mode: "boolean" }).notNull(),
  error: text("error"),
  ms: integer("ms").notNull().default(0),
  at: integer("at", { mode: "timestamp_ms" }).notNull(),
});

export const mailboxMember = sqliteTable(
  "mailbox_member",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    mailboxId: text("mailbox_id")
      .notNull()
      .references(() => mailbox.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role", { enum: SHARE_ROLES }).notNull().default("viewer"),
    status: text("status", { enum: ["pending", "active"] }).notNull().default("pending"),
    invitedBy: text("invited_by"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    acceptedAt: integer("accepted_at", { mode: "timestamp_ms" }),
  },
  (t) => [
    uniqueIndex("member_mailbox_user_idx").on(t.mailboxId, t.userId),
    index("member_user_idx").on(t.userId, t.status),
    index("member_expires_idx").on(t.expiresAt).where(sql`${t.expiresAt} is not null`),
  ],
);

export const SHARE_ACTIONS = [
  "grant",
  "update",
  "revoke",
  "accept",
  "decline",
  "leave",
  "expire",
  "link_on",
  "link_reset",
  "link_off",
  "link_expiry",
  "link_expire",
  "link_view",
  "link_read",
  "lock",
  "unlock",
  "policy",
] as const;
export type ShareAction = (typeof SHARE_ACTIONS)[number];
export const SHARE_SOURCES = ["user", "admin", "system", "visitor"] as const;
export type ShareSource = (typeof SHARE_SOURCES)[number];
export type ShareEventDetail = {
  role?: ShareRole;
  from?: ShareRole;
  expiresAt?: number | null;
  previousExpiresAt?: number | null;
  messageId?: string;
  subject?: string;
  revoked?: number;
  links?: number;
  changes?: { key: string; from: string; to: string }[];
};

export const mailboxShareEvent = sqliteTable(
  "mailbox_share_event",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    mailboxId: text("mailbox_id").notNull(),
    address: text("address").notNull(),
    action: text("action", { enum: SHARE_ACTIONS }).notNull(),
    actorId: text("actor_id"),
    actorName: text("actor_name"),
    targetId: text("target_id"),
    targetName: text("target_name"),
    detail: text("detail", { mode: "json" }).$type<ShareEventDetail>(),
    source: text("source", { enum: SHARE_SOURCES }).notNull().default("user"),
    at: integer("at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index("share_event_mailbox_idx").on(t.mailboxId, t.at),
    index("share_event_at_idx").on(t.at, t.id),
    index("share_event_action_idx").on(t.action, t.at),
    index("share_event_actor_idx").on(t.actorId, t.at),
    index("share_event_target_idx").on(t.targetId, t.at),
  ],
);

export type User = typeof user.$inferSelect;
export type Mailbox = typeof mailbox.$inferSelect;
export type Message = typeof message.$inferSelect;
export type Attachment = typeof attachment.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Tag = typeof tag.$inferSelect;
export type BlogPost = typeof blogPost.$inferSelect;
export type BlogCategory = typeof blogCategory.$inferSelect;
export type MailboxMember = typeof mailboxMember.$inferSelect;
export type MailboxShareEvent = typeof mailboxShareEvent.$inferSelect;
