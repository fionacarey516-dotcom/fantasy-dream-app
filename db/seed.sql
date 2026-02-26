-- ============================================
-- 幻想梦想 App - Seed Data (Grounded & Realistic Version)
-- 请在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 先清空数据 (注意顺序，因为有外键关联)
TRUNCATE TABLE feed_activities, notifications, comments, dream_sponsors, dream_ratings, dreams, categories, users RESTART IDENTITY CASCADE;

-- 插入用户数据
INSERT INTO users (id, name, avatar, verified, bio, energy, followers, following, role) VALUES
(1, '老王杂货铺', 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=200&h=200', TRUE, '守在街角二十年的杂货铺老板。想给店门前的流浪狗搭个坚固的窝。', 1500, 320, 15, 'user'),
(2, '夜班出租司机', 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=200&h=200', TRUE, '跑了八年夜班。收集了无数个凌晨四点城市的故事。', 850, 642, 48, 'user'),
(3, '社区美术老师', 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=200&h=200', FALSE, '教社区里的退休老人和留守儿童画水彩，色彩是可以治愈人心的。', 1200, 890, 120, 'user'),
(4, '阳台园丁', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200', FALSE, '在五平米的阳台上种出了三十种香草，偶尔也种胡萝卜。', 2100, 150, 88, 'user'),
(5, '乡村放映员', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200&h=200', TRUE, '开着一辆旧面包车，带着幕布和投影仪，在各个山村放免费露天电影。', 450, 2300, 15, 'user'),
(6, '失眠的主厨', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200&h=200', FALSE, '在一家不怎么赚钱的深夜小馆子里，研究治愈深夜 emo 的浓汤。', 890, 5600, 50, 'user'),
(7, '退役消防员', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200', TRUE, '腿脚不太方便了，但还想继续为社区做点什么。', 600, 1200, 35, 'user'),
(8, '手账女孩小林', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200', FALSE, '用手账记录普通生活里的琐碎闪光点，相信笔尖的温度。', 3200, 480, 200, 'user');

-- 管理员账户 (密码: admin123456)
INSERT INTO users (id, name, password_hash, role, bio, energy, verified) VALUES
(9, 'admin', '$2b$10$rTIb47IRQaRp/IHi9uWBWuw9Kg8Uq.XG5n32pM.6lTC/P7R39iND.', 'admin', '🛡️ 系统管理员，维护梦境的秩序。', 99999, TRUE)
ON CONFLICT (name) DO NOTHING;

-- 重置序列
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 插入分类数据 (原分类，外加一个实际上由前端作为过滤器的"造梦完成"，类别保留现实向即可)
INSERT INTO categories (id, name, emoji) VALUES
(1, '社区改造', '🏘️'),
(2, '温暖传递', '☕'),
(3, '艺术创作', '�'),
(4, '自然生态', '🌱'),
(5, '独立影视', '🎬');
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 插入梦想数据
-- 注意：id 1, 3 是已完成的梦想 (is_completed=true 或 energy>=goal)
INSERT INTO dreams (id, title, description, author_id, category, emoji, progress, energy, goal, is_completed, supporters, likes, comments_count, cover_image, featured, impossible_index, rating_count) VALUES
(1, '给巷子口的流浪狗做个防雨木屋', '店门前那只叫“大黄”的流浪狗陪了我三年。马上要到梅雨季节了，我想在店旁边的巷角用防水木板给它搭一个坚固的狗窝。不需要太大，只要能遮风挡雨就好。能量主要用来购买厚实的防腐木材和防水油漆，我自己动手做。', 1, '社区改造', '🐕', 100, 1000, 1000, TRUE, 100, 890, 45, 'https://images.unsplash.com/photo-1544568100-847a95782782?auto=format&fit=crop&q=80&w=800&h=500', TRUE, 4.20, 156),
(2, '深夜回车族免费热汤点', '凌晨两三点下班的人，往往只能吃便利店冰冷的便当。我的出租车经常拉到半夜疲惫的打工人，我想和常去的老板娘合作，在某个固定的街角设一个通宵的免费热汤点（或者仅仅是白粥）。一杯热的，或许能让他们觉得这座城市没那么冷。', 2, '温暖传递', '🍲', 65, 1300, 2000, FALSE, 130, 2100, 89, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800&h=500', FALSE, 3.80, 89),
(3, '胡同弄堂墙绘计划', '我们社区的那面老墙斑驳脱落很久了，我想带着社区里喜欢画画的老人和孩子们，用一个周末的时间给那面墙画上一片向日葵花海。不仅仅是为了美化，更想让那些独居的爷爷奶奶们有个共同参与的活动。目前颜料和画笔已准备妥当！', 3, '艺术创作', '�', 100, 3000, 3000, TRUE, 300, 520, 32, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800&h=500', FALSE, 4.50, 65),
(4, '阳台种子漂流瓶', '我的阳台上收获了很多自己结种子的香草（罗勒、迷迭香、薄荷）。我想买一批漂亮的小玻璃瓶，把这些种子分装好，贴上手绘的种植指南，放在街角的免费分享箱里。希望城市的每个人都能在窗台上种出属于自己的一抹绿色和香气。', 4, '自然生态', '🌿', 20, 1000, 5000, FALSE, 100, 310, 12, 'https://images.unsplash.com/photo-1595856980646-976adfa57e62?auto=format&fit=crop&q=80&w=800&h=500', FALSE, 3.90, 204),
(5, '留守儿童露天星空影院', '在这个数字时代，电影院依然是某些偏远山区孩子们难以触及的梦想。我计划改造我的二手面包车，装上更好的便携抗光幕布和音响，带去五个没有村级影院的山口村落，为孩子们放一夏天的宫崎骏和科普纪录片。能量将用于油费和幕布升级。', 5, '独立影视', '📽️', 70, 2100, 3000, FALSE, 210, 4050, 240, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800&h=500', FALSE, 4.80, 180),
(6, '深夜失眠菜谱图鉴', '那些治愈不了的深夜焦虑，只能通过肠胃来缓解。我正在手绘一本《午夜碳水救赎指南》，里面记录了20道步骤极简、却能迅速带来幸福感的热水快手菜。希望筹集一笔资金将这本手绘小册子独立印刷出来，免费寄给同样受失眠困扰的人。', 6, '艺术创作', '�', 95, 3800, 4000, FALSE, 380, 5600, 310, 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=800&h=500', TRUE, 4.10, 420),
(7, '社区急救技能公益课', '很多悲剧原本可以在救护车赶到前的黄金五分钟内避免。作为退役消防员，我想在周末时间，在社区的空地开办公益急救课（海姆立克急救法、CPR心肺复苏）。筹集的能量完全用于购买三个练习用的医用假人模型和一些必要的消耗性绷带。', 7, '社区改造', '🚑', 45, 900, 2000, FALSE, 90, 120, 45, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800&h=500', FALSE, 4.60, 76),
(8, '手账边角料回收计划', '做手账总是会有很多好看的包装纸、贴纸边角料被扔掉，很可惜。我想做一个月度的“碎屑盲盒”交换漂流活动。收集大家平时不用但好看的小纸片，重新拼贴后作为礼物寄给全国各地的手账爱好者。传递陌生人之间微小的美好。', 8, '温暖传递', '✉️', 85, 850, 1000, FALSE, 85, 420, 88, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800&h=500', FALSE, 2.50, 34);

SELECT setval('dreams_id_seq', (SELECT MAX(id) FROM dreams));

-- 为已完成的项目（id=1, 3）插入赞助记录
INSERT INTO dream_sponsors (dream_id, user_id, sponsor_date)
SELECT 1, id, CURRENT_DATE FROM users WHERE id IN (2,3,4,5);
INSERT INTO dream_sponsors (dream_id, user_id, sponsor_date)
SELECT 3, id, CURRENT_DATE FROM users WHERE id IN (1,2,6,7,8);

-- 插入一些动态数据
INSERT INTO feed_activities (type, user_id, target_dream_id, time_ago, action_color) VALUES
('sponsor', 5, 2, '5 分钟前', 'primary'),
('publish', 1, 1, '12 分钟前', 'blue'),
('sponsor', 2, 4, '32 分钟前', 'primary'),
('publish', 4, 4, '1 小时前', 'blue'),
('sponsor', 8, 3, '2 小时前', 'primary');

-- 插入部分通知数据
INSERT INTO notifications (type, user_id, target_dream_id, content, time_ago, read, reward) VALUES
('like', 5, 1, NULL, '5 分钟前', FALSE, NULL),
('comment', 2, 1, NULL, '12 分钟前', FALSE, NULL),
('sponsor', 8, 3, NULL, '1 小时前', FALSE, NULL),
('achievement', 1, 1, '恭喜！你的梦想「给巷子口的流浪狗做个防雨木屋」已达成目标，获得 1000 能量奖励！', '2 小时前', FALSE, 1000),
('achievement', 3, 3, '恭喜！你的梦想「胡同弄堂墙绘计划」已达成目标，获得 3000 能量奖励！', '2 小时前', FALSE, 3000),
('like', 4, 6, NULL, '5 小时前', TRUE, NULL);

-- 插入评论数据
INSERT INTO comments (dream_id, user_name, user_avatar, user_initials, text, time_ago) VALUES
(1, '退役消防员', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200', NULL, '木材记得在底部垫高一点，下雨天容易积水。如果需要帮忙搬木头，周末随时叫我。', '1小时前'),
(1, '手账女孩小林', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200', NULL, '大黄有家了！太好了！老板可以把狗窝漆成黄色吗，跟它很搭～', '3小时前'),
(2, '失眠的主厨', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200&h=200', NULL, '好想法。如果你找不到合作的老板娘，可以来我店门口摆个保温桶，我免费帮你熬粥。', '5小时前'),
(4, '社区美术老师', 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=200&h=200', NULL, '玻璃瓶手刷标签太可爱了，我可以带画室里的孩子们帮你一起画指南卡片吗？', '半天前'),
(7, '夜班出租司机', 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=200&h=200', NULL, '这种课真的很有必要。我们开夜车的心里总是突突的，学点急救对自己对乘客负责。', '1天前');
