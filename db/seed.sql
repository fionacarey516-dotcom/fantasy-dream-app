-- ============================================
-- 幻想梦想 App - Seed Data
-- ============================================

-- 插入用户数据
INSERT INTO users (id, name, avatar, verified, bio, energy, followers, following, today_claimed) VALUES
(1, '梦想家 小明', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKUsfpKRgdNyObSJQRMqETCkMaIZodX_SAqJXXT8Is-ZKfQwFrmxvdBbLVwzHdrbV6A0YSE6VjaFQZG2NTthZLZF19oZ44SNRTjRh3m_UFKH71S97n9-cgfnIFW5Dy8FNvUyAJlzW2fkFKjAahvNJ68MWmjemP0ax6tJb3WOyTecOQbeU6bHpSxfa9I97O_AYEdEHsZg83qPYPUP9ZlhD5pysIew_PRs8x02d_R4z1FM7k-vLmNg9L5aHEgmtWki3fooF_hXFM3OQ', TRUE, '🌟 追逐星星的孩子，希望能造出一艘通往火星的飞船。', 2850, 128, 56, FALSE),
(2, '爱因斯坦的猫', 'https://lh3.googleusercontent.com/aida-public/AB6AXuASINkmpudePW0W6pdsTVAPd3BtzrHLjr6FQhhW3OqyUqlQVryDNpbqbqYS45c8873zvUvq0FlVVJ8l_RiFaEtwA1bb-olmAcl8jnIH2ya22L00BNSKHovsNaclbnPagLTI2lbP4_5NymbK0VDArGW38FhJUSuhxEOSuLUHAM8JPMemhyVms_ZIw1A1vetaj9-MFBKAh_WsZzTAJckAZYfBF5LN4qdIBtXO04vMu5NYyWDYcyfWUA_QMNVxxePZvQMmkIeNTUqOegM', TRUE, NULL, 0, 0, 0, FALSE),
(3, '银河漫游者', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5sCzXtBejX0yCFvi6d6ppeQoCHyCkkjwr4FJVJuxdyPpZyrUaMTlv4HjDRiTS-HXni9zoALuVzJBX3vnT52vYJjpsLGZJCxKg25OMI19G_J7su5Q-h_Et7WNpuVqyeNn-xSqh5FD-97uSdFv9h5f_W0tLv7L8CGlqOxeKl2YPGUZpXfbbEif1PjxPecGjzSxDamCqVg6D-XveYAQ85Q72243NHMIfBv4lCTHn2UUynJKm7c2jTayR_L3RjTuSQzPR88oZN4uWcs', FALSE, NULL, 0, 0, 0, FALSE),
(4, '克隆博士', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw9VMPP_SS_Zrf62BjKx_g5vO1NQXHug6CDeIR-Qu4r4X3bZl2Pj-PesqEWoH3uYDIvWrVfLD0KE9Tu2XhCBU3l__0mgui6k5ZOE-NwwERvPiuYrOdjVPRsxsga_PnO8Bx8AmmcqzTm-Z68QnWYl_RNE1cCspkuvntRb4ZVNFufnaWUz9B6n_-_BRiYOMivjVBI6hJbA5od2Gc9LqI4hDOGGMjvxT0vPkdqVra4CMvQ7D2meAXyeI9u3Prgy6XwpdD3I2zGmgzknQ', FALSE, NULL, 0, 0, 0, FALSE),
(5, '天空捕手', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA90z9dSDKdmwPp6iUgzo0AMOdSvl1nDv9-FwGDXC73GrQVTslcitp1MyC0zP3fwvhM12Pmn6e4kd5McY5l-rrsAY5Vfw7SmdJMbU4Va3YtboI3nk-LPlkTiMeQFU_rowLxcPEjmyCETJWmw4cZFDAg6JlCJIX-xjwUFZam-64lvUDtMJyvkMrKVkHF3_rNoyQX9qbSzDdFevVoCuape5NZui--Hmf3ckaEMWVnZH_0ClxGsddddLXqPNvd2oRRK9nAQ_3Mz-Uc7Y', FALSE, NULL, 0, 0, 0, FALSE),
(6, '李雷', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaLMwbWZZ5ktDlJg_Yp0844qQC1t_xjPGaYbYoVjtjk4UFBp1MJ70wyYPQF2RpqFaLelhTyuibgWJSNYMGRAh3W4Z7qkXNA5PERd8C56B1IZxa9u2nM2rtmOyYYa1ccG2VZWUs_2okuXT1cy71zgR7PdXdsNvLc8vQjx4E1OkOMovmZmsVBZlMLPPZQdEnOClL5lXdySzs9oxWMFYnlu7JPYTg2exxTT7qBzwVX0ZCx7KvH_8m35OZkZgGC0jq27OgPvqDyNBUWiE', TRUE, NULL, 0, 0, 0, FALSE),
(7, 'David', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5c877kvO940oVQ30CEgfJPTNr1VRjhB68yBTLrg2CNlZYtxiYA7CYLkeUG_qq6UQ-jur4qjeuSxwxlI8dnwo7HKapJknTbAdxxIcGwJ_kbnQ_NDuJZ8dvYeP2IQmqLAUKd_a2fJlG475wZ64CdruMir3wZdNgaKU3jERFve77pXK71REYJ05KcP7lNL7r9E9lBwP0GuUTlDyCBbNbbn3twIhFzI4o_soGtTD3j7LXrtsNzG_oqLO7iE6AKloBECcg_3H1VNn9dmc', FALSE, NULL, 0, 0, 0, FALSE),
(8, 'Kepler-22b', NULL, FALSE, NULL, 0, 0, 0, FALSE),
(9, 'Sarah', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl_4UeOkX4eRiXak4TmcG72C8U-r9XEijYYfddNtSHUGCbHdx1qKcBOsdjvx3lG6xJQCm7tUPMP2v0fLbIWLKHOtxFlTi1cFAo8gHfTIgr22r2OmQM8X-BPFGwAWbnf2zZzF4V5KYSo4a7ko2sOaGkhWbJYsWoRtBuC3l_PTBcf2_fxMa_KyQFwadxa8AXQyA49gQx8EhCtb6OuA0_YmmlgxDEMCGAPdN9xVAI82ztQVsILQdLGJ1O6Rpb6bojo6b7Yi8XsR6IM5w', FALSE, NULL, 0, 0, 0, FALSE);

-- 重置序列
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 插入分类数据
INSERT INTO categories (id, name, emoji) VALUES
(1, '科幻未来', '🚀'),
(2, '艺术创作', '🎨'),
(3, '改变世界', '🌍'),
(4, '游戏开发', '🕹️'),
(5, '独立影视', '🎬');

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 插入梦想数据
INSERT INTO dreams (id, title, description, author_id, category, emoji, progress, energy, goal, is_completed, supporters, likes, comments_count, cover_image, featured, impossible_index) VALUES
(1, '造时光机', '关于时间旅行的设想，最初源于那个夏夜看完霍金的《时间简史》。如果光速是不可逾越的鸿沟，那思维的速度呢？我想造一台时光机，不为了改变过去，只为了再看一眼那个已经消失在时间长河里的旧书店。它虽然不符合广义相对论，但它符合我的浪漫主义相对论。', 2, '科幻未来', '⏳', 98, 980, 1000, FALSE, 2345, 1200, 128, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFYHHx1japTqyngTXjfnwRZ58g9dGRwcA91PpCfaLmE4EpxaQO-vnWfe9Pig3HS-hQoPbYK-36cHZYyjKoyA6JWqYMxLrvMn4kKbmw1NM5Ba-yWZVAqCKS4e5xthM6XnAGL7uZs1xQ5NqvO7w8qF6mD_tpgZCXpHFZVymJwWiKE1OCsIHignvHUeB7T2VzXsCXcUlUhnYLHFF-12pU617dJeRYs_kmGYQk4SQD72zxRSzr1C3kChDJPuDySrhwPvbztV2tpdCjyUU', TRUE, 98),
(2, '跨星际翻译器', '为了听懂家里猫在说什么，它最近眼神很奇怪...也许它能告诉我一些宇宙的秘密。', 3, '科幻未来', '👾', 85, 425, 500, FALSE, 856, 3400, 45, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2trCuoIX7aPezJ2Xu2XcTQlhIKwf9Hb5-T7Ht4emASXIvaH_BZz9xoiDaZq-xNTUU8LcZHlTyQxGYAuWKLjwwagwxXcq40h9zMdQNgPoKbUvwQfzJg4S_JOTpyI8aCgytFT96uxjZVPD2Tz4iKopOPqvMhSPhyJtjfEVn8pDDm62gt3WwTD7BTJLPEkbkj_8OhnZsby2y8KgX7b3_DZhnvATaXyup95gt-SHW2aoGUndWV_I2qrsjVO2pVc3wFOznBV-n76Q7AI', FALSE, 85),
(3, '私人克隆岛', '一个只有我自己克隆体的岛屿，不再有社交焦虑...', 4, '改变世界', '§', 75, 1575, 2100, FALSE, 2100, 980, 89, NULL, FALSE, 75),
(4, '云朵城堡', '住在云上，随风飘荡，不用交房租...', 5, '艺术创作', '▓', 60, 2700, 4500, FALSE, 4500, 12000, 156, NULL, FALSE, 60),
(5, '发明任意门', '一扇可以通往任何回忆和未来的门，我想再次见到小时候的院子。', 6, '时空', '🚪', 98, 839, 856, FALSE, 856, 1200, 32, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaHf1iMzDv5sX9XuQHTL3xMqXexwtCtNyrAgfvSZ7BBCUNTA8K_d0BtOHqsjern8bEXmlYNREGaZLK8Y_6O3Lbg3qrBTIElOo2f01fdkEl8eR-VwICL4wU0j2bf3koy2S5ZBWXIy2Y9OwIfHD-QTQBOVCOVN9_NEnV2AfiTIkQ5IjttRD2x9jGYp7ZJpk7s4Da3iLCxJObTizJqK0MfrkX7csP3-77G3KZml_MyEkJXZwudz_xSpxo7Qd4pQcHUEpWNgjBkmj_PmA', TRUE, 98),
(6, '火星第一座温室', '为了种出红色的玫瑰，我们需要先建立完整的生态循环系统。', 7, '科幻未来', '🌹', 45, 555, 1234, FALSE, 1234, 2100, 67, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPpm40FHsrcgLkIJg67WsOARkKkXhrwVF7SL9_JdJYRnVBGy7N_AbTDi54PFTgCdXnyiVo5pzuuo-z_Egwg3K3pAc2cK2YA_rtDOShAM3vO7pxwHOXOIYSXnSvZwRB3mNpI1yWUdPzGnQyTvs4nNj8W5YTHfgrL49XIQx7DTHHxCKao-fi2dGpA0NfGtXbQg8TgQmNb_wSyIbcgrR6TIhSezEeMTOrKqUraDnkemnHm-srU9QTxgaoWXeDgkmg4c7runX3z_warLE', FALSE, 70),
(7, '机械之心', '当最后一个自然心脏停止跳动，文明将由永动机重新定义。Forked from @Dr_Light', 8, '克隆', '🤖', 100, 454, 567, TRUE, 567, 890, 23, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2trCuoIX7aPezJ2Xu2XcTQlhIKwf9Hb5-T7Ht4emASXIvaH_BZz9xoiDaZq-xNTUU8LcZHlTyQxGYAuWKLjwwagwxXcq40h9zMdQNgPoKbUvwQfzJg4S_JOTpyI8aCgytFT96uxjZVPD2Tz4iKopOPqvMhSPhyJtjfEVn8pDDm62gt3WwTD7BTJLPEkbkj_8OhnZsby2y8KgX7b3_DZhnvATaXyup95gt-SHW2aoGUndWV_I2qrsjVO2pVc3wFOznBV-n76Q7AI', FALSE, 95),
(8, '云端城堡计划', '生活在积雨层之上的可能性探索。', 9, '预言', '☁️', 25, 86, 345, FALSE, 345, 567, 18, NULL, FALSE, 80);

SELECT setval('dreams_id_seq', (SELECT MAX(id) FROM dreams));

-- 插入动态数据
INSERT INTO feed_activities (id, type, user_id, target_dream_id, time_ago, action_color) VALUES
(1, 'sponsor', 6, 5, '5 分钟前', 'primary'),
(2, 'publish', 9, 8, '12 分钟前', 'blue'),
(3, 'fork', 8, 7, '32 分钟前', 'green'),
(4, 'sponsor', 7, 6, '1 小时前', 'primary');

SELECT setval('feed_activities_id_seq', (SELECT MAX(id) FROM feed_activities));

-- 插入通知数据
INSERT INTO notifications (id, type, user_id, target_dream_id, content, time_ago, read, reward) VALUES
(1, 'like', 3, 1, NULL, '5 分钟前', FALSE, NULL),
(2, 'comment', 9, 1, NULL, '12 分钟前', FALSE, NULL),
(3, 'sponsor', 6, 1, NULL, '1 小时前', FALSE, NULL),
(4, 'achievement', NULL, NULL, '恭喜！你的梦想「造时光机」已达成目标，获得 1000 能量奖励！', '2 小时前', FALSE, 1000),
(5, 'achievement', NULL, NULL, '你的梦想「跨星际翻译器」已达成目标，获得 500 能量奖励！', '3 小时前', FALSE, 500),
(6, 'like', 4, 3, NULL, '5 小时前', TRUE, NULL);

SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));

-- 插入评论数据
INSERT INTO comments (id, dream_id, user_name, user_avatar, user_initials, text, time_ago) VALUES
(1, 1, 'LostStar_99', NULL, 'L', '虽然听起来很疯狂，但我愿意为了这个梦买单。算我一个！🚀', '1小时前'),
(2, 1, 'Neo_Matrix', 'https://lh3.googleusercontent.com/aida-public/AB6AXuADqfg_qFcPc3pkSRbojloqRu3N3OzpfHZlN-CYcu17WISA_lW02xqpz6fd2ALX1texKXDt04ny6JRjXAiV0STwHNhlL6PxTCojxTJAibv3lm_7vvAi1ZyGd3CMCMHsh6ZbZoY2BfUHfoJJwm2EhlX7W8-Q1N4-qIa6NXuW88EZhA_7Gi1wsRYWpb2_AjJhZn8O7QnlShHXuwMKhu2rFexeslmnX2g3fEqvGCp-Q08QyjSCnMa2ldVzKQzvLofmtDjfMKN8W03h8Ks', NULL, '霍金举办过一次面向未来的时间旅行者派对，没人参加。也许你的机器能带我们去那场派对？', '3小时前');

SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));
