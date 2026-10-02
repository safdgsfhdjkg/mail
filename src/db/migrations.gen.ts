// 由 scripts/bundle-migrations.mjs 生成，不要手动修改
export const migrations: { name: string; statements: string[] }[] = [
  {
    "name": "0000_init.sql",
    "statements": [
      "CREATE TABLE `attachment` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`message_id` text NOT NULL,\n\t`mailbox_id` text NOT NULL,\n\t`filename` text NOT NULL,\n\t`mime_type` text NOT NULL,\n\t`size` integer NOT NULL,\n\t`content` text,\n\tFOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE cascade,\n\tFOREIGN KEY (`mailbox_id`) REFERENCES `mailbox`(`id`) ON UPDATE no action ON DELETE cascade\n);",
      "CREATE INDEX `attachment_message_idx` ON `attachment` (`message_id`);",
      "CREATE INDEX `attachment_mailbox_idx` ON `attachment` (`mailbox_id`);",
      "CREATE TABLE `blog_category` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`slug` text NOT NULL,\n\t`name` text NOT NULL,\n\t`color` text DEFAULT 'blue' NOT NULL,\n\t`sort` integer DEFAULT 0 NOT NULL,\n\t`created_at` integer NOT NULL\n);",
      "CREATE UNIQUE INDEX `blog_category_slug_unique` ON `blog_category` (`slug`);",
      "CREATE TABLE `blog_post` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`slug` text NOT NULL,\n\t`title` text NOT NULL,\n\t`excerpt` text DEFAULT '' NOT NULL,\n\t`content` text DEFAULT '' NOT NULL,\n\t`content_html` text DEFAULT '' NOT NULL,\n\t`toc` text DEFAULT '[]' NOT NULL,\n\t`minutes` integer DEFAULT 1 NOT NULL,\n\t`category_id` text,\n\t`tags` text DEFAULT '[]' NOT NULL,\n\t`keywords` text DEFAULT '[]' NOT NULL,\n\t`cover_url` text,\n\t`pinned` integer DEFAULT false NOT NULL,\n\t`status` text DEFAULT 'draft' NOT NULL,\n\t`published_at` integer,\n\t`views` integer DEFAULT 0 NOT NULL,\n\t`likes` integer DEFAULT 0 NOT NULL,\n\t`created_at` integer NOT NULL,\n\t`updated_at` integer NOT NULL,\n\tFOREIGN KEY (`category_id`) REFERENCES `blog_category`(`id`) ON UPDATE no action ON DELETE set null\n);",
      "CREATE UNIQUE INDEX `blog_post_slug_unique` ON `blog_post` (`slug`);",
      "CREATE INDEX `blog_post_published_idx` ON `blog_post` (`status`,`published_at`);",
      "CREATE INDEX `blog_post_category_idx` ON `blog_post` (`category_id`);",
      "CREATE TABLE `mailbox` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`address` text NOT NULL,\n\t`expires_at` integer NOT NULL,\n\t`catch_all` integer DEFAULT false NOT NULL,\n\t`owner_id` text,\n\t`note` text,\n\t`share_token` text,\n\t`created_at` integer NOT NULL,\n\tFOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade\n);",
      "CREATE UNIQUE INDEX `mailbox_address_unique` ON `mailbox` (`address`);",
      "CREATE UNIQUE INDEX `mailbox_share_token_unique` ON `mailbox` (`share_token`);",
      "CREATE INDEX `mailbox_expires_idx` ON `mailbox` (`expires_at`);",
      "CREATE INDEX `mailbox_owner_idx` ON `mailbox` (`owner_id`);",
      "CREATE TABLE `mailbox_origin` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`mailbox_id` text,\n\t`address` text NOT NULL,\n\t`domain` text NOT NULL,\n\t`kind` text NOT NULL,\n\t`custom` integer DEFAULT false NOT NULL,\n\t`expiry` text,\n\t`user_id` text,\n\t`username` text,\n\t`anon_id` text,\n\t`visitor_id` text,\n\t`fingerprint` text,\n\t`ip` text,\n\t`user_agent` text,\n\t`model` text,\n\t`platform` text,\n\t`platform_version` text,\n\t`brands` text,\n\t`accept_language` text,\n\t`referer` text,\n\t`country` text,\n\t`region` text,\n\t`city` text,\n\t`postal_code` text,\n\t`timezone` text,\n\t`latitude` text,\n\t`longitude` text,\n\t`asn` integer,\n\t`as_organization` text,\n\t`colo` text,\n\t`client_tz` text,\n\t`client_lang` text,\n\t`screen` text,\n\t`cores` integer,\n\t`memory` integer,\n\t`touch` integer,\n\t`standalone` integer,\n\t`created_at` integer NOT NULL\n);",
      "CREATE INDEX `origin_created_idx` ON `mailbox_origin` (`created_at`,`id`);",
      "CREATE INDEX `origin_address_idx` ON `mailbox_origin` (`address`);",
      "CREATE INDEX `origin_mailbox_idx` ON `mailbox_origin` (`mailbox_id`,`created_at`);",
      "CREATE INDEX `origin_user_idx` ON `mailbox_origin` (`user_id`);",
      "CREATE INDEX `origin_anon_idx` ON `mailbox_origin` (`anon_id`);",
      "CREATE INDEX `origin_ip_idx` ON `mailbox_origin` (`ip`);",
      "CREATE INDEX `origin_visitor_idx` ON `mailbox_origin` (`visitor_id`);",
      "CREATE TABLE `message` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`mailbox_id` text NOT NULL,\n\t`from_address` text NOT NULL,\n\t`from_name` text,\n\t`subject` text DEFAULT '' NOT NULL,\n\t`text` text,\n\t`html` text,\n\t`preview` text DEFAULT '' NOT NULL,\n\t`code` text,\n\t`size` integer DEFAULT 0 NOT NULL,\n\t`seen` integer DEFAULT false NOT NULL,\n\t`headers` text,\n\t`received_at` integer NOT NULL,\n\tFOREIGN KEY (`mailbox_id`) REFERENCES `mailbox`(`id`) ON UPDATE no action ON DELETE cascade\n);",
      "CREATE INDEX `message_list_idx` ON `message` (`mailbox_id`,`received_at`,`seen`,`code`,`preview`);",
      "CREATE INDEX `message_received_idx` ON `message` (`received_at`,`id`);",
      "CREATE TABLE `session` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`user_id` text NOT NULL,\n\t`user_agent` text DEFAULT '' NOT NULL,\n\t`model` text,\n\t`platform_version` text,\n\t`ip` text,\n\t`city` text,\n\t`country` text,\n\t`created_at` integer NOT NULL,\n\t`last_seen_at` integer NOT NULL,\n\tFOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade\n);",
      "CREATE INDEX `session_user_idx` ON `session` (`user_id`,`last_seen_at`);",
      "CREATE TABLE `stat_hour` (\n\t`hour` integer NOT NULL,\n\t`metric` text NOT NULL,\n\t`value` integer DEFAULT 0 NOT NULL,\n\tPRIMARY KEY(`hour`, `metric`)\n);",
      "CREATE TABLE `tag` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`name` text NOT NULL,\n\t`color` text DEFAULT 'blue' NOT NULL,\n\t`created_at` integer NOT NULL\n);",
      "CREATE UNIQUE INDEX `tag_name_unique` ON `tag` (`name`);",
      "CREATE TABLE `user` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`username` text NOT NULL,\n\t`password_hash` text NOT NULL,\n\t`password_salt` text NOT NULL,\n\t`disabled` integer DEFAULT false NOT NULL,\n\t`last_seen_at` integer,\n\t`created_at` integer NOT NULL\n);",
      "CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);",
      "CREATE TABLE `user_fingerprint` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`user_id` text NOT NULL,\n\t`visitor_id` text NOT NULL,\n\t`anon_id` text,\n\t`components` text NOT NULL,\n\t`last_event` text NOT NULL,\n\t`seen_count` integer DEFAULT 1 NOT NULL,\n\t`ip` text,\n\t`ips` text DEFAULT '[]' NOT NULL,\n\t`user_agent` text,\n\t`model` text,\n\t`platform_version` text,\n\t`accept_language` text,\n\t`country` text,\n\t`region` text,\n\t`city` text,\n\t`timezone` text,\n\t`asn` integer,\n\t`as_organization` text,\n\t`first_seen_at` integer NOT NULL,\n\t`last_seen_at` integer NOT NULL,\n\tFOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade\n);",
      "CREATE UNIQUE INDEX `fingerprint_user_visitor_idx` ON `user_fingerprint` (`user_id`,`visitor_id`);",
      "CREATE INDEX `fingerprint_visitor_idx` ON `user_fingerprint` (`visitor_id`);",
      "CREATE TABLE `user_tag` (\n\t`user_id` text NOT NULL,\n\t`tag_id` text NOT NULL,\n\tPRIMARY KEY(`user_id`, `tag_id`),\n\tFOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,\n\tFOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade\n);",
      "CREATE INDEX `user_tag_tag_idx` ON `user_tag` (`tag_id`);"
    ]
  },
  {
    "name": "0001_seed.sql",
    "statements": [
      "-- 博客的示例分类和文章，新部署的站点开箱就有内容；可以在管理后台删除或修改\nINSERT OR IGNORE INTO `blog_category` (`id`, `slug`, `name`, `color`, `sort`, `created_at`) VALUES ('cat-guide', 'guide', '入门指南', 'blue', 0, 1790640000000);",
      "INSERT OR IGNORE INTO `blog_category` (`id`, `slug`, `name`, `color`, `sort`, `created_at`) VALUES ('cat-privacy', 'privacy', '隐私安全', 'red', 1, 1790640000000);",
      "INSERT OR IGNORE INTO `blog_category` (`id`, `slug`, `name`, `color`, `sort`, `created_at`) VALUES ('cat-tips', 'tips', '使用技巧', 'orange', 2, 1790640000000);",
      "INSERT OR IGNORE INTO `blog_post` (`id`, `slug`, `title`, `excerpt`, `content`, `content_html`, `toc`, `minutes`, `category_id`, `tags`, `keywords`, `cover_url`, `pinned`, `status`, `published_at`, `views`, `likes`, `created_at`, `updated_at`) VALUES ('post-seed-1', 'what-is-temp-mail', '临时邮箱是什么？一次性邮箱的原理与 6 个使用场景', '一文看懂临时邮箱（一次性邮箱、10 分钟邮箱）的工作原理、适用场景和注意事项，学会用它接收验证码、保护真实邮箱隐私。', '临时邮箱（也叫一次性邮箱、10 分钟邮箱、匿名邮箱）是一种**不需要注册、打开就能用、用完即弃**的邮箱地址。它只负责收信，专门用来接收注册验证码、激活链接、下载链接这类“只看一次”的邮件。\n\n## 临时邮箱是怎么工作的？\n\n服务商拥有一批收信域名，并把这些域名下**所有地址**的邮件都接收下来。你在[临时邮箱首页](/)点一下“一键新建”，系统就会生成一个随机地址，例如 `k7x2m9@example.com`。别人往这个地址发信，邮件会实时推送到你的页面上，验证码会被自动识别出来，一键就能复制。\n\n到了你设定的有效期（1 小时、1 天或 7 天），邮箱和里面的邮件、附件都会被自动删除，不留痕迹。\n\n## 最常见的 6 个使用场景\n\n1. **注册只用一次的网站**：下载资料、看一篇文章、试用一个工具，却被要求填写邮箱。\n2. **领取优惠券和试用**：避免之后被营销邮件轰炸。\n3. **开发和测试**：测试注册流程、邮件模板、找回密码功能时，需要大量不同的邮箱。\n4. **论坛、Wi-Fi 门户和问卷**：只需要一次邮箱验证。\n5. **保护隐私**：不想让陌生平台知道你的真实邮箱，减少数据泄露后的连带风险。\n6. **隔离垃圾邮件**：把不信任的服务和真实收件箱隔开。\n\n## 什么时候不应该用临时邮箱？\n\n临时邮箱的特点是“公开、短期”。未登录时创建的地址，**任何知道地址的人都能打开收件箱**，所以不要用它接收银行、支付、工作、身份证明等重要邮件，也不要用它注册你打算长期使用、需要找回密码的账号。\n\n如果某个账号你想长期保留，可以登录本站账号，把邮箱加入账号并[设为永久邮箱](/blog/permanent-mailbox-guide)，这样只有你能查看，地址也不会被别人抢走。\n\n## 和普通邮箱有什么区别？\n\n- 不需要手机号、密码或实名信息；\n- 只能收信，不能发信；\n- 有有效期，到期自动销毁；\n- 验证码自动识别，一键复制，比在普通邮箱里翻找更快。\n\n## 小结\n\n临时邮箱是保护真实邮箱最简单的办法：遇到“只用一次”的验证场景就用它，重要账号则用真实邮箱或登录后的永久邮箱。收不到验证码？看看这篇[收不到验证码的排查指南](/blog/verification-code-not-received)。\n', '<p>临时邮箱（也叫一次性邮箱、10 分钟邮箱、匿名邮箱）是一种<strong>不需要注册、打开就能用、用完即弃</strong>的邮箱地址。它只负责收信，专门用来接收注册验证码、激活链接、下载链接这类“只看一次”的邮件。</p>\n<h2 id=\"临时邮箱是怎么工作的\">临时邮箱是怎么工作的？</h2>\n<p>服务商拥有一批收信域名，并把这些域名下<strong>所有地址</strong>的邮件都接收下来。你在<a href=\"/\">临时邮箱首页</a>点一下“一键新建”，系统就会生成一个随机地址，例如 <code>k7x2m9@example.com</code>。别人往这个地址发信，邮件会实时推送到你的页面上，验证码会被自动识别出来，一键就能复制。</p>\n<p>到了你设定的有效期（1 小时、1 天或 7 天），邮箱和里面的邮件、附件都会被自动删除，不留痕迹。</p>\n<h2 id=\"最常见的-6-个使用场景\">最常见的 6 个使用场景</h2>\n<ol>\n<li><strong>注册只用一次的网站</strong>：下载资料、看一篇文章、试用一个工具，却被要求填写邮箱。</li>\n<li><strong>领取优惠券和试用</strong>：避免之后被营销邮件轰炸。</li>\n<li><strong>开发和测试</strong>：测试注册流程、邮件模板、找回密码功能时，需要大量不同的邮箱。</li>\n<li><strong>论坛、Wi-Fi 门户和问卷</strong>：只需要一次邮箱验证。</li>\n<li><strong>保护隐私</strong>：不想让陌生平台知道你的真实邮箱，减少数据泄露后的连带风险。</li>\n<li><strong>隔离垃圾邮件</strong>：把不信任的服务和真实收件箱隔开。</li>\n</ol>\n<h2 id=\"什么时候不应该用临时邮箱\">什么时候不应该用临时邮箱？</h2>\n<p>临时邮箱的特点是“公开、短期”。未登录时创建的地址，<strong>任何知道地址的人都能打开收件箱</strong>，所以不要用它接收银行、支付、工作、身份证明等重要邮件，也不要用它注册你打算长期使用、需要找回密码的账号。</p>\n<p>如果某个账号你想长期保留，可以登录本站账号，把邮箱加入账号并<a href=\"/blog/permanent-mailbox-guide\">设为永久邮箱</a>，这样只有你能查看，地址也不会被别人抢走。</p>\n<h2 id=\"和普通邮箱有什么区别\">和普通邮箱有什么区别？</h2>\n<ul>\n<li>不需要手机号、密码或实名信息；</li>\n<li>只能收信，不能发信；</li>\n<li>有有效期，到期自动销毁；</li>\n<li>验证码自动识别，一键复制，比在普通邮箱里翻找更快。</li>\n</ul>\n<h2 id=\"小结\">小结</h2>\n<p>临时邮箱是保护真实邮箱最简单的办法：遇到“只用一次”的验证场景就用它，重要账号则用真实邮箱或登录后的永久邮箱。收不到验证码？看看这篇<a href=\"/blog/verification-code-not-received\">收不到验证码的排查指南</a>。</p>\n', '[{\"id\":\"临时邮箱是怎么工作的\",\"text\":\"临时邮箱是怎么工作的？\",\"level\":2},{\"id\":\"最常见的-6-个使用场景\",\"text\":\"最常见的 6 个使用场景\",\"level\":2},{\"id\":\"什么时候不应该用临时邮箱\",\"text\":\"什么时候不应该用临时邮箱？\",\"level\":2},{\"id\":\"和普通邮箱有什么区别\",\"text\":\"和普通邮箱有什么区别？\",\"level\":2},{\"id\":\"小结\",\"text\":\"小结\",\"level\":2}]', 2, 'cat-guide', '[\"临时邮箱\",\"一次性邮箱\",\"入门\"]', '[\"临时邮箱\",\"一次性邮箱\",\"10分钟邮箱\",\"匿名邮箱\",\"临时邮箱是什么\"]', NULL, 0, 'published', 1789869600000, 0, 0, 1789869600000, 1789869600000);",
      "INSERT OR IGNORE INTO `blog_post` (`id`, `slug`, `title`, `excerpt`, `content`, `content_html`, `toc`, `minutes`, `category_id`, `tags`, `keywords`, `cover_url`, `pinned`, `status`, `published_at`, `views`, `likes`, `created_at`, `updated_at`) VALUES ('post-seed-2', 'verification-code-not-received', '临时邮箱收不到验证码怎么办？6 个排查方法', '临时邮箱接收验证码失败的常见原因与解决办法：检查地址、等待刷新、更换域名和前缀、避免频率限制，快速收到注册验证码。', '用临时邮箱注册时，偶尔会遇到“验证码迟迟不来”的情况。大多数时候问题不在收信端，而在发信网站的策略上。按下面的顺序排查，通常 1 分钟内就能解决。\n\n## 1. 先确认地址没有填错\n\n最常见的原因是复制时多了空格，或者输错了一个字符。在本站点一下“复制地址”，直接粘贴到注册表单里，不要手动输入。发送后回到收件箱，页面顶部显示“实时接收中”说明连接正常，邮件到达会立刻出现。\n\n## 2. 等 30～90 秒，再下拉刷新\n\n很多网站的发信队列有延迟，高峰期可能要一两分钟。本站会实时推送新邮件；如果网络切换过（例如从 Wi-Fi 切到流量），可以在收件箱里**下拉刷新**一次。\n\n## 3. 换一个域名\n\n部分网站会屏蔽常见的临时邮箱域名。本站提供多个收信域名：在[首页](/)点“自定义”，在“域名”里换一个，再重新发送验证码。换域名是解决“收不到”最有效的方法。\n\n## 4. 换一个更像真人的前缀\n\n一些风控系统会拦截看起来随机的地址。自定义前缀时用类似 `lin.chen2026` 这样的名字，比 `x8k2q` 更容易通过。\n\n## 5. 检查是否触发了发信频率限制\n\n短时间内多次点击“重新发送”，网站可能会暂停向这个地址发信。等 5 分钟后再试一次，或者换一个新地址。\n\n## 6. 确认网站真的会发邮件\n\n有些平台只支持手机号验证，或者要求企业邮箱；这种情况下任何临时邮箱都收不到，需要换用其他方式。\n\n## 收到后怎么最快复制验证码？\n\n本站会自动识别邮件里的 4～8 位验证码，在邮箱列表和收件箱顶部直接显示，点一下即可复制，不用打开邮件。\n\n## 常见问题\n\n### 邮件到了但看不到验证码？\n\n有些验证码是图片或链接形式，打开邮件正文即可看到；激活链接可以直接点击。\n\n### 过期的邮箱还能收信吗？\n\n不能。邮箱到期后会被删除，建议在长按菜单里延长有效期；登录后还可以把常用邮箱[设为永久](/blog/permanent-mailbox-guide)。\n', '<p>用临时邮箱注册时，偶尔会遇到“验证码迟迟不来”的情况。大多数时候问题不在收信端，而在发信网站的策略上。按下面的顺序排查，通常 1 分钟内就能解决。</p>\n<h2 id=\"1-先确认地址没有填错\">1. 先确认地址没有填错</h2>\n<p>最常见的原因是复制时多了空格，或者输错了一个字符。在本站点一下“复制地址”，直接粘贴到注册表单里，不要手动输入。发送后回到收件箱，页面顶部显示“实时接收中”说明连接正常，邮件到达会立刻出现。</p>\n<h2 id=\"2-等-30-90-秒-再下拉刷新\">2. 等 30～90 秒，再下拉刷新</h2>\n<p>很多网站的发信队列有延迟，高峰期可能要一两分钟。本站会实时推送新邮件；如果网络切换过（例如从 Wi-Fi 切到流量），可以在收件箱里<strong>下拉刷新</strong>一次。</p>\n<h2 id=\"3-换一个域名\">3. 换一个域名</h2>\n<p>部分网站会屏蔽常见的临时邮箱域名。本站提供多个收信域名：在<a href=\"/\">首页</a>点“自定义”，在“域名”里换一个，再重新发送验证码。换域名是解决“收不到”最有效的方法。</p>\n<h2 id=\"4-换一个更像真人的前缀\">4. 换一个更像真人的前缀</h2>\n<p>一些风控系统会拦截看起来随机的地址。自定义前缀时用类似 <code>lin.chen2026</code> 这样的名字，比 <code>x8k2q</code> 更容易通过。</p>\n<h2 id=\"5-检查是否触发了发信频率限制\">5. 检查是否触发了发信频率限制</h2>\n<p>短时间内多次点击“重新发送”，网站可能会暂停向这个地址发信。等 5 分钟后再试一次，或者换一个新地址。</p>\n<h2 id=\"6-确认网站真的会发邮件\">6. 确认网站真的会发邮件</h2>\n<p>有些平台只支持手机号验证，或者要求企业邮箱；这种情况下任何临时邮箱都收不到，需要换用其他方式。</p>\n<h2 id=\"收到后怎么最快复制验证码\">收到后怎么最快复制验证码？</h2>\n<p>本站会自动识别邮件里的 4～8 位验证码，在邮箱列表和收件箱顶部直接显示，点一下即可复制，不用打开邮件。</p>\n<h2 id=\"常见问题\">常见问题</h2>\n<h3 id=\"邮件到了但看不到验证码\">邮件到了但看不到验证码？</h3>\n<p>有些验证码是图片或链接形式，打开邮件正文即可看到；激活链接可以直接点击。</p>\n<h3 id=\"过期的邮箱还能收信吗\">过期的邮箱还能收信吗？</h3>\n<p>不能。邮箱到期后会被删除，建议在长按菜单里延长有效期；登录后还可以把常用邮箱<a href=\"/blog/permanent-mailbox-guide\">设为永久</a>。</p>\n', '[{\"id\":\"1-先确认地址没有填错\",\"text\":\"1. 先确认地址没有填错\",\"level\":2},{\"id\":\"2-等-30-90-秒-再下拉刷新\",\"text\":\"2. 等 30～90 秒，再下拉刷新\",\"level\":2},{\"id\":\"3-换一个域名\",\"text\":\"3. 换一个域名\",\"level\":2},{\"id\":\"4-换一个更像真人的前缀\",\"text\":\"4. 换一个更像真人的前缀\",\"level\":2},{\"id\":\"5-检查是否触发了发信频率限制\",\"text\":\"5. 检查是否触发了发信频率限制\",\"level\":2},{\"id\":\"6-确认网站真的会发邮件\",\"text\":\"6. 确认网站真的会发邮件\",\"level\":2},{\"id\":\"收到后怎么最快复制验证码\",\"text\":\"收到后怎么最快复制验证码？\",\"level\":2},{\"id\":\"常见问题\",\"text\":\"常见问题\",\"level\":2},{\"id\":\"邮件到了但看不到验证码\",\"text\":\"邮件到了但看不到验证码？\",\"level\":3},{\"id\":\"过期的邮箱还能收信吗\",\"text\":\"过期的邮箱还能收信吗？\",\"level\":3}]', 2, 'cat-tips', '[\"验证码\",\"排查\",\"临时邮箱\"]', '[\"临时邮箱收不到验证码\",\"临时邮箱接收验证码\",\"接码邮箱\",\"验证码收不到\",\"一次性邮箱验证码\"]', NULL, 0, 'published', 1790042400000, 0, 0, 1790042400000, 1790042400000);",
      "INSERT OR IGNORE INTO `blog_post` (`id`, `slug`, `title`, `excerpt`, `content`, `content_html`, `toc`, `minutes`, `category_id`, `tags`, `keywords`, `cover_url`, `pinned`, `status`, `published_at`, `views`, `likes`, `created_at`, `updated_at`) VALUES ('post-seed-3', 'temp-mail-vs-alias', '一次性邮箱 vs 邮箱别名：哪种更能保护隐私？', '对比一次性邮箱（临时邮箱）和邮箱别名在注册门槛、匿名程度、有效期和适用场景上的区别，帮你选择合适的隐私邮箱方案。', '想保护真实邮箱，常见的做法有两种：**一次性邮箱**（临时邮箱）和**邮箱别名**（转发地址）。它们看起来相似，适合的场景却完全不同。\n\n## 一次性邮箱：用完即弃\n\n一次性邮箱是一个独立的收件箱，不需要注册，打开网页就能收信，到期自动销毁。它和你的真实邮箱**没有任何关联**，即使网站泄露数据，也追溯不到你本人。\n\n- 优点：零注册、秒级可用、完全匿名、验证码自动识别；\n- 缺点：默认公开、有有效期，不适合需要长期找回密码的账号。\n\n## 邮箱别名：长期转发\n\n别名服务会给你一个新地址，收到的邮件**转发到真实邮箱**。你可以随时关闭某个别名来屏蔽垃圾邮件。\n\n- 优点：长期可用，邮件集中在真实收件箱；\n- 缺点：需要注册并绑定真实邮箱，服务商知道你的身份；转发链路多一环，也多一分泄露风险。\n\n## 对比一览\n\n| 维度 | 一次性邮箱 | 邮箱别名 |\n| --- | --- | --- |\n| 需要注册 | 否 | 是 |\n| 与真实身份关联 | 无 | 绑定真实邮箱 |\n| 有效期 | 1 小时～7 天，登录后可永久 | 长期 |\n| 最适合 | 一次性验证、测试、领优惠 | 长期订阅、常用账号 |\n\n## 怎么选？\n\n一个简单的判断标准：**这个账号以后还需要找回密码吗？**不需要，就用[临时邮箱](/)；需要，就用真实邮箱或别名。\n\n本站也提供了折中方案：登录账号后，把邮箱加入账号，它就只有你能看到；再手动设为永久，就能长期使用，既不暴露真实邮箱，又不会过期。详细步骤见[账号与永久邮箱使用指南](/blog/permanent-mailbox-guide)。\n', '<p>想保护真实邮箱，常见的做法有两种：<strong>一次性邮箱</strong>（临时邮箱）和<strong>邮箱别名</strong>（转发地址）。它们看起来相似，适合的场景却完全不同。</p>\n<h2 id=\"一次性邮箱-用完即弃\">一次性邮箱：用完即弃</h2>\n<p>一次性邮箱是一个独立的收件箱，不需要注册，打开网页就能收信，到期自动销毁。它和你的真实邮箱<strong>没有任何关联</strong>，即使网站泄露数据，也追溯不到你本人。</p>\n<ul>\n<li>优点：零注册、秒级可用、完全匿名、验证码自动识别；</li>\n<li>缺点：默认公开、有有效期，不适合需要长期找回密码的账号。</li>\n</ul>\n<h2 id=\"邮箱别名-长期转发\">邮箱别名：长期转发</h2>\n<p>别名服务会给你一个新地址，收到的邮件<strong>转发到真实邮箱</strong>。你可以随时关闭某个别名来屏蔽垃圾邮件。</p>\n<ul>\n<li>优点：长期可用，邮件集中在真实收件箱；</li>\n<li>缺点：需要注册并绑定真实邮箱，服务商知道你的身份；转发链路多一环，也多一分泄露风险。</li>\n</ul>\n<h2 id=\"对比一览\">对比一览</h2>\n<div class=\"table-scroll\"><table><thead><tr><th>维度</th><th>一次性邮箱</th><th>邮箱别名</th></tr></thead><tbody><tr><td>需要注册</td><td>否</td><td>是</td></tr><tr><td>与真实身份关联</td><td>无</td><td>绑定真实邮箱</td></tr><tr><td>有效期</td><td>1 小时～7 天，登录后可永久</td><td>长期</td></tr><tr><td>最适合</td><td>一次性验证、测试、领优惠</td><td>长期订阅、常用账号</td></tr></tbody></table></div>\n<h2 id=\"怎么选\">怎么选？</h2>\n<p>一个简单的判断标准：**这个账号以后还需要找回密码吗？**不需要，就用<a href=\"/\">临时邮箱</a>；需要，就用真实邮箱或别名。</p>\n<p>本站也提供了折中方案：登录账号后，把邮箱加入账号，它就只有你能看到；再手动设为永久，就能长期使用，既不暴露真实邮箱，又不会过期。详细步骤见<a href=\"/blog/permanent-mailbox-guide\">账号与永久邮箱使用指南</a>。</p>\n', '[{\"id\":\"一次性邮箱-用完即弃\",\"text\":\"一次性邮箱：用完即弃\",\"level\":2},{\"id\":\"邮箱别名-长期转发\",\"text\":\"邮箱别名：长期转发\",\"level\":2},{\"id\":\"对比一览\",\"text\":\"对比一览\",\"level\":2},{\"id\":\"怎么选\",\"text\":\"怎么选？\",\"level\":2}]', 1, 'cat-privacy', '[\"隐私\",\"邮箱别名\",\"对比\"]', '[\"一次性邮箱\",\"邮箱别名\",\"隐私邮箱\",\"匿名邮箱\",\"临时邮箱和别名区别\"]', NULL, 0, 'published', 1790215200000, 0, 0, 1790215200000, 1790215200000);",
      "INSERT OR IGNORE INTO `blog_post` (`id`, `slug`, `title`, `excerpt`, `content`, `content_html`, `toc`, `minutes`, `category_id`, `tags`, `keywords`, `cover_url`, `pinned`, `status`, `published_at`, `views`, `likes`, `created_at`, `updated_at`) VALUES ('post-seed-4', 'stop-spam-protect-email', '如何防止真实邮箱被泄露？7 个远离垃圾邮件的习惯', '真实邮箱被泄露后会招来垃圾邮件和钓鱼诈骗。学会邮箱分级、使用临时邮箱、添加备注追踪来源、检查登录设备等 7 个实用习惯。', '垃圾邮件和诈骗邮件的源头，往往是你在某个不起眼的网站留下的邮箱。一旦这个网站被拖库，你的地址就会被卖给营销公司和诈骗团伙。下面 7 个习惯，可以大幅降低真实邮箱被泄露的风险。\n\n## 1. 给邮箱分级\n\n把邮箱分成三类：**核心邮箱**（银行、工作、Apple/Google 账号）、**日常邮箱**（购物、社交）、**一次性邮箱**（只验证一次的网站）。核心邮箱不要在任何可疑网站出现。\n\n## 2. 不信任的网站一律用临时邮箱\n\n下载资料、领优惠、看一次文章，都用[临时邮箱](/)。即使对方泄露或滥发邮件，影响的也只是一个到期就销毁的地址。\n\n## 3. 给临时邮箱加备注\n\n在本站长按邮箱，选择“添加备注”，写上“某某网站注册”。以后收到奇怪的邮件，一眼就能看出是哪个网站泄露了地址。未登录时备注只保存在本机；登录后备注会同步到你的所有设备。\n\n## 4. 不要点击邮件里的“退订”链接\n\n对来路不明的垃圾邮件点击退订，反而会向对方确认“这个地址有人在用”。直接标记为垃圾邮件更安全。\n\n## 5. 警惕钓鱼邮件\n\n- 发件人地址和显示名称不一致；\n- 催促你“立即验证”“账号将被冻结”；\n- 链接域名和官网不同。\n\n本站会先净化 HTML 邮件，再放在禁止脚本的沙盒里显示，但依然建议不要在邮件链接里输入密码。\n\n## 6. 定期检查登录设备\n\n不只是邮箱，任何账号都应该定期查看登录设备。本站登录后，在“个人中心 → 登录设备”里可以看到每台设备的型号、系统和最近活跃时间，发现陌生设备可以一键让它退出。\n\n## 7. 用长而独特的密码\n\n每个网站用不同的密码，并开启两步验证。一个网站被拖库，不会连累其他账号。\n\n## 总结\n\n保护邮箱的核心思路是“少暴露、可追踪、能隔离”。临时邮箱负责隔离，备注负责追踪，核心邮箱只给真正重要的服务。想进一步了解两种隐私方案，可以看看[一次性邮箱和邮箱别名的对比](/blog/temp-mail-vs-alias)。\n', '<p>垃圾邮件和诈骗邮件的源头，往往是你在某个不起眼的网站留下的邮箱。一旦这个网站被拖库，你的地址就会被卖给营销公司和诈骗团伙。下面 7 个习惯，可以大幅降低真实邮箱被泄露的风险。</p>\n<h2 id=\"1-给邮箱分级\">1. 给邮箱分级</h2>\n<p>把邮箱分成三类：<strong>核心邮箱</strong>（银行、工作、Apple/Google 账号）、<strong>日常邮箱</strong>（购物、社交）、<strong>一次性邮箱</strong>（只验证一次的网站）。核心邮箱不要在任何可疑网站出现。</p>\n<h2 id=\"2-不信任的网站一律用临时邮箱\">2. 不信任的网站一律用临时邮箱</h2>\n<p>下载资料、领优惠、看一次文章，都用<a href=\"/\">临时邮箱</a>。即使对方泄露或滥发邮件，影响的也只是一个到期就销毁的地址。</p>\n<h2 id=\"3-给临时邮箱加备注\">3. 给临时邮箱加备注</h2>\n<p>在本站长按邮箱，选择“添加备注”，写上“某某网站注册”。以后收到奇怪的邮件，一眼就能看出是哪个网站泄露了地址。未登录时备注只保存在本机；登录后备注会同步到你的所有设备。</p>\n<h2 id=\"4-不要点击邮件里的-退订-链接\">4. 不要点击邮件里的“退订”链接</h2>\n<p>对来路不明的垃圾邮件点击退订，反而会向对方确认“这个地址有人在用”。直接标记为垃圾邮件更安全。</p>\n<h2 id=\"5-警惕钓鱼邮件\">5. 警惕钓鱼邮件</h2>\n<ul>\n<li>发件人地址和显示名称不一致；</li>\n<li>催促你“立即验证”“账号将被冻结”；</li>\n<li>链接域名和官网不同。</li>\n</ul>\n<p>本站会先净化 HTML 邮件，再放在禁止脚本的沙盒里显示，但依然建议不要在邮件链接里输入密码。</p>\n<h2 id=\"6-定期检查登录设备\">6. 定期检查登录设备</h2>\n<p>不只是邮箱，任何账号都应该定期查看登录设备。本站登录后，在“个人中心 → 登录设备”里可以看到每台设备的型号、系统和最近活跃时间，发现陌生设备可以一键让它退出。</p>\n<h2 id=\"7-用长而独特的密码\">7. 用长而独特的密码</h2>\n<p>每个网站用不同的密码，并开启两步验证。一个网站被拖库，不会连累其他账号。</p>\n<h2 id=\"总结\">总结</h2>\n<p>保护邮箱的核心思路是“少暴露、可追踪、能隔离”。临时邮箱负责隔离，备注负责追踪，核心邮箱只给真正重要的服务。想进一步了解两种隐私方案，可以看看<a href=\"/blog/temp-mail-vs-alias\">一次性邮箱和邮箱别名的对比</a>。</p>\n', '[{\"id\":\"1-给邮箱分级\",\"text\":\"1. 给邮箱分级\",\"level\":2},{\"id\":\"2-不信任的网站一律用临时邮箱\",\"text\":\"2. 不信任的网站一律用临时邮箱\",\"level\":2},{\"id\":\"3-给临时邮箱加备注\",\"text\":\"3. 给临时邮箱加备注\",\"level\":2},{\"id\":\"4-不要点击邮件里的-退订-链接\",\"text\":\"4. 不要点击邮件里的“退订”链接\",\"level\":2},{\"id\":\"5-警惕钓鱼邮件\",\"text\":\"5. 警惕钓鱼邮件\",\"level\":2},{\"id\":\"6-定期检查登录设备\",\"text\":\"6. 定期检查登录设备\",\"level\":2},{\"id\":\"7-用长而独特的密码\",\"text\":\"7. 用长而独特的密码\",\"level\":2},{\"id\":\"总结\",\"text\":\"总结\",\"level\":2}]', 2, 'cat-privacy', '[\"隐私\",\"垃圾邮件\",\"安全\"]', '[\"防止邮箱泄露\",\"垃圾邮件\",\"邮箱隐私\",\"临时邮箱\",\"钓鱼邮件\"]', NULL, 0, 'published', 1790388000000, 0, 0, 1790388000000, 1790388000000);",
      "INSERT OR IGNORE INTO `blog_post` (`id`, `slug`, `title`, `excerpt`, `content`, `content_html`, `toc`, `minutes`, `category_id`, `tags`, `keywords`, `cover_url`, `pinned`, `status`, `published_at`, `views`, `likes`, `created_at`, `updated_at`) VALUES ('post-seed-5', 'permanent-mailbox-guide', '临时邮箱也能永久使用：账号、永久邮箱与备注功能指南', '登录临时邮箱账号后，可以让邮箱私有、多设备同步，并手动设置永久邮箱。本文介绍地址归属规则、永久邮箱设置步骤、个人中心和备注功能。', '本站不登录也能正常使用。登录账号是可选的，它主要解决三个问题：**多设备同步**、**邮箱私有**和**永久邮箱**。\n\n## 未登录 vs 登录：地址归属有什么不同？\n\n- **未登录时创建的邮箱是公共地址**：任何人输入同一个地址都能打开同一个收件箱，也可以“再次创建”它并一起使用。\n- **登录后创建的邮箱属于你的账号**：只有你能查看，其他人无法再创建或打开这个地址。\n- **从未登录状态同步到账号的邮箱**，同样变为私有，别人也无法再创建。\n\n## 如何注册和登录\n\n1. 打开“设置 → 账号 → 登录 / 注册”；\n2. 输入 3～20 位用户名和至少 8 位的密码，不需要手机号或邮箱；\n3. 登录成功后，会询问是否把这台设备上的邮箱加入账号，选择“加入账号”即可同步。\n\n## 如何设置永久邮箱\n\n永久邮箱不会自动过期，需要你手动设置：\n\n1. 确认已经登录，并且邮箱带有**锁形图标**（表示属于你的账号）；\n2. 在邮箱列表里长按这个邮箱，或者进入收件箱点右上角的“…”；\n3. 选择**“设为永久”**。之后列表里会显示 ∞ 永久。\n\n想取消时，在同一个菜单选择“取消永久”，邮箱会改为 7 天后过期。\n\n## 把收件箱分享给别人\n\n账号里的邮箱可以生成**只读分享链接**：拿到链接的人不用登录就能查看收件箱，没有链接的人依然打不开。随时可以重新生成或停止分享，旧链接会立即失效。\n\n## 个人中心能做什么？\n\n- **修改头像**：头像只保存在当前设备，不会上传到服务器；\n- **修改密码**：修改后其他设备会自动退出登录；\n- **查看登录设备**：显示手机型号、系统版本、浏览器、大致位置和最近活跃时间，可以让任意一台设备退出；\n- **查看标签**：管理员为你添加的标签（如“VIP”“内测”）会显示在个人中心和首页。\n\n## 给每个邮箱写备注\n\n长按邮箱选择“添加备注”，列表会优先显示备注而不是一串随机字母。账号里的邮箱备注会同步到所有设备；公共邮箱的备注只保存在本机，别人看不到。\n\n## 安全建议\n\n永久邮箱适合长期接收某个网站的通知，但仍然不建议用于银行和工作邮件。更多隐私技巧见[防止邮箱泄露的 7 个习惯](/blog/stop-spam-protect-email)，或者直接去[首页](/)创建一个邮箱试试。\n', '<p>本站不登录也能正常使用。登录账号是可选的，它主要解决三个问题：<strong>多设备同步</strong>、<strong>邮箱私有</strong>和<strong>永久邮箱</strong>。</p>\n<h2 id=\"未登录-vs-登录-地址归属有什么不同\">未登录 vs 登录：地址归属有什么不同？</h2>\n<ul>\n<li><strong>未登录时创建的邮箱是公共地址</strong>：任何人输入同一个地址都能打开同一个收件箱，也可以“再次创建”它并一起使用。</li>\n<li><strong>登录后创建的邮箱属于你的账号</strong>：只有你能查看，其他人无法再创建或打开这个地址。</li>\n<li><strong>从未登录状态同步到账号的邮箱</strong>，同样变为私有，别人也无法再创建。</li>\n</ul>\n<h2 id=\"如何注册和登录\">如何注册和登录</h2>\n<ol>\n<li>打开“设置 → 账号 → 登录 / 注册”；</li>\n<li>输入 3～20 位用户名和至少 8 位的密码，不需要手机号或邮箱；</li>\n<li>登录成功后，会询问是否把这台设备上的邮箱加入账号，选择“加入账号”即可同步。</li>\n</ol>\n<h2 id=\"如何设置永久邮箱\">如何设置永久邮箱</h2>\n<p>永久邮箱不会自动过期，需要你手动设置：</p>\n<ol>\n<li>确认已经登录，并且邮箱带有<strong>锁形图标</strong>（表示属于你的账号）；</li>\n<li>在邮箱列表里长按这个邮箱，或者进入收件箱点右上角的“…”；</li>\n<li>选择**“设为永久”**。之后列表里会显示 ∞ 永久。</li>\n</ol>\n<p>想取消时，在同一个菜单选择“取消永久”，邮箱会改为 7 天后过期。</p>\n<h2 id=\"把收件箱分享给别人\">把收件箱分享给别人</h2>\n<p>账号里的邮箱可以生成<strong>只读分享链接</strong>：拿到链接的人不用登录就能查看收件箱，没有链接的人依然打不开。随时可以重新生成或停止分享，旧链接会立即失效。</p>\n<h2 id=\"个人中心能做什么\">个人中心能做什么？</h2>\n<ul>\n<li><strong>修改头像</strong>：头像只保存在当前设备，不会上传到服务器；</li>\n<li><strong>修改密码</strong>：修改后其他设备会自动退出登录；</li>\n<li><strong>查看登录设备</strong>：显示手机型号、系统版本、浏览器、大致位置和最近活跃时间，可以让任意一台设备退出；</li>\n<li><strong>查看标签</strong>：管理员为你添加的标签（如“VIP”“内测”）会显示在个人中心和首页。</li>\n</ul>\n<h2 id=\"给每个邮箱写备注\">给每个邮箱写备注</h2>\n<p>长按邮箱选择“添加备注”，列表会优先显示备注而不是一串随机字母。账号里的邮箱备注会同步到所有设备；公共邮箱的备注只保存在本机，别人看不到。</p>\n<h2 id=\"安全建议\">安全建议</h2>\n<p>永久邮箱适合长期接收某个网站的通知，但仍然不建议用于银行和工作邮件。更多隐私技巧见<a href=\"/blog/stop-spam-protect-email\">防止邮箱泄露的 7 个习惯</a>，或者直接去<a href=\"/\">首页</a>创建一个邮箱试试。</p>\n', '[{\"id\":\"未登录-vs-登录-地址归属有什么不同\",\"text\":\"未登录 vs 登录：地址归属有什么不同？\",\"level\":2},{\"id\":\"如何注册和登录\",\"text\":\"如何注册和登录\",\"level\":2},{\"id\":\"如何设置永久邮箱\",\"text\":\"如何设置永久邮箱\",\"level\":2},{\"id\":\"把收件箱分享给别人\",\"text\":\"把收件箱分享给别人\",\"level\":2},{\"id\":\"个人中心能做什么\",\"text\":\"个人中心能做什么？\",\"level\":2},{\"id\":\"给每个邮箱写备注\",\"text\":\"给每个邮箱写备注\",\"level\":2},{\"id\":\"安全建议\",\"text\":\"安全建议\",\"level\":2}]', 2, 'cat-guide', '[\"永久邮箱\",\"账号\",\"备注\"]', '[\"永久邮箱\",\"临时邮箱永久\",\"临时邮箱账号\",\"邮箱备注\",\"私有邮箱\"]', NULL, 0, 'published', 1790560800000, 0, 0, 1790560800000, 1790560800000);"
    ]
  },
  {
    "name": "0002_forward.sql",
    "statements": [
      "CREATE TABLE `app_setting` (\n\t`key` text PRIMARY KEY NOT NULL,\n\t`value` text NOT NULL,\n\t`updated_at` integer NOT NULL\n);",
      "CREATE TABLE `forward_log` (\n\t`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,\n\t`address` text NOT NULL,\n\t`from_address` text NOT NULL,\n\t`subject` text DEFAULT '' NOT NULL,\n\t`target` text NOT NULL,\n\t`ok` integer NOT NULL,\n\t`error` text,\n\t`ms` integer DEFAULT 0 NOT NULL,\n\t`at` integer NOT NULL\n);"
    ]
  },
  {
    "name": "0003_mailbox_share.sql",
    "statements": [
      "CREATE TABLE `mailbox_member` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`mailbox_id` text NOT NULL,\n\t`user_id` text NOT NULL,\n\t`role` text DEFAULT 'viewer' NOT NULL,\n\t`status` text DEFAULT 'pending' NOT NULL,\n\t`invited_by` text,\n\t`expires_at` integer,\n\t`created_at` integer NOT NULL,\n\t`updated_at` integer NOT NULL,\n\t`accepted_at` integer,\n\tFOREIGN KEY (`mailbox_id`) REFERENCES `mailbox`(`id`) ON UPDATE no action ON DELETE cascade,\n\tFOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade\n);",
      "CREATE UNIQUE INDEX `member_mailbox_user_idx` ON `mailbox_member` (`mailbox_id`,`user_id`);",
      "CREATE INDEX `member_user_idx` ON `mailbox_member` (`user_id`,`status`);",
      "CREATE TABLE `mailbox_share_event` (\n\t`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,\n\t`mailbox_id` text NOT NULL,\n\t`address` text NOT NULL,\n\t`action` text NOT NULL,\n\t`actor_id` text,\n\t`actor_name` text,\n\t`target_id` text,\n\t`target_name` text,\n\t`detail` text,\n\t`at` integer NOT NULL\n);",
      "CREATE INDEX `share_event_mailbox_idx` ON `mailbox_share_event` (`mailbox_id`,`at`);"
    ]
  },
  {
    "name": "0004_share_admin.sql",
    "statements": [
      "ALTER TABLE `mailbox` ADD `share_locked` integer DEFAULT false NOT NULL;",
      "ALTER TABLE `mailbox_share_event` ADD `source` text DEFAULT 'user' NOT NULL;",
      "ALTER TABLE `mailbox_share_event` ADD `ip` text;",
      "ALTER TABLE `mailbox_share_event` ADD `country` text;",
      "ALTER TABLE `mailbox_share_event` ADD `city` text;",
      "ALTER TABLE `mailbox_share_event` ADD `user_agent` text;",
      "ALTER TABLE `mailbox_share_event` ADD `referer` text;",
      "CREATE INDEX `share_event_at_idx` ON `mailbox_share_event` (`at`,`id`);",
      "CREATE INDEX `share_event_action_idx` ON `mailbox_share_event` (`action`,`at`);",
      "CREATE INDEX `share_event_actor_idx` ON `mailbox_share_event` (`actor_id`,`at`);",
      "CREATE INDEX `share_event_target_idx` ON `mailbox_share_event` (`target_id`,`at`);",
      "UPDATE `mailbox_share_event` SET `source` = 'system' WHERE `action` = 'expire';"
    ]
  },
  {
    "name": "0005_share_link_expiry.sql",
    "statements": [
      "ALTER TABLE `mailbox` ADD `share_expires_at` integer;"
    ]
  },
  {
    "name": "0006_message_soft_delete.sql",
    "statements": [
      "ALTER TABLE `message` ADD `deleted_at` integer;",
      "ALTER TABLE `message` ADD `deleted_by` text;",
      "ALTER TABLE `message` ADD `deleted_by_name` text;",
      "ALTER TABLE `message` ADD `deleted_role` text;",
      "ALTER TABLE `message` ADD `deleted_via` text;",
      "ALTER TABLE `message` ADD `deleted_ip` text;",
      "ALTER TABLE `message` ADD `deleted_anon_id` text;",
      "CREATE INDEX `message_live_idx` ON `message` (`mailbox_id`,`received_at`,`seen`) WHERE `deleted_at` IS NULL;",
      "CREATE INDEX `message_deleted_idx` ON `message` (`deleted_at`) WHERE `deleted_at` IS NOT NULL;"
    ]
  },
  {
    "name": "0007_cleanup_indexes.sql",
    "statements": [
      "CREATE INDEX `mailbox_share_expires_idx` ON `mailbox` (`share_expires_at`) WHERE \"mailbox\".\"share_expires_at\" is not null;",
      "CREATE INDEX `member_expires_idx` ON `mailbox_member` (`expires_at`) WHERE \"mailbox_member\".\"expires_at\" is not null;"
    ]
  },
  {
    "name": "0008_unread_index.sql",
    "statements": [
      "CREATE INDEX `message_unread_idx` ON `message` (`mailbox_id`) WHERE \"message\".\"deleted_at\" is null and \"message\".\"seen\" = 0;"
    ]
  },
  {
    "name": "0009_catch_all_index.sql",
    "statements": [
      "CREATE INDEX `mailbox_catch_all_idx` ON `mailbox` (`expires_at`) WHERE \"mailbox\".\"catch_all\" = 1;"
    ]
  },
  {
    "name": "0010_drop_device_tracking.sql",
    "statements": [
      "DROP TABLE `mailbox_origin`;",
      "DROP TABLE `user_fingerprint`;",
      "ALTER TABLE `mailbox_share_event` DROP COLUMN `ip`;",
      "ALTER TABLE `mailbox_share_event` DROP COLUMN `country`;",
      "ALTER TABLE `mailbox_share_event` DROP COLUMN `city`;",
      "ALTER TABLE `mailbox_share_event` DROP COLUMN `user_agent`;",
      "ALTER TABLE `mailbox_share_event` DROP COLUMN `referer`;",
      "ALTER TABLE `message` DROP COLUMN `deleted_ip`;",
      "ALTER TABLE `message` DROP COLUMN `deleted_anon_id`;",
      "ALTER TABLE `session` DROP COLUMN `user_agent`;",
      "ALTER TABLE `session` DROP COLUMN `model`;",
      "ALTER TABLE `session` DROP COLUMN `platform_version`;",
      "ALTER TABLE `session` DROP COLUMN `ip`;",
      "ALTER TABLE `session` DROP COLUMN `city`;",
      "ALTER TABLE `session` DROP COLUMN `country`;"
    ]
  }
];
