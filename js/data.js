// Dream Data Store
const dreamData = {
    dreams: [
        {
            id: 1,
            title: "造时光机",
            description: "关于时间旅行的设想，最初源于那个夏夜看完霍金的《时间简史》。如果光速是不可逾越的鸿沟，那思维的速度呢？我想造一台时光机，不为了改变过去，只为了再看一眼那个已经消失在时间长河里的旧书店。它虽然不符合广义相对论，但它符合我的浪漫主义相对论。",
            author: {
                name: "爱因斯坦的猫",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASINkmpudePW0W6pdsTVAPd3BtzrHLjr6FQhhW3OqyUqlQVryDNpbqbqYS45c8873zvUvq0FlVVJ8l_RiFaEtwA1bb-olmAcl8jnIH2ya22L00BNSKHovsNaclbnPagLTI2lbP4_5NymbK0VDArGW38FhJUSuhxEOSuLUHAM8JPMemhyVms_ZIw1A1vetaj9-MFBKAh_WsZzTAJckAZYfBF5LN4qdIBtXO04vMu5NYyWDYcyfWUA_QMNVxxePZvQMmkIeNTUqOegM",
                verified: true
            },
            category: "科幻未来",
            emoji: "⏳",
            progress: 98,
            energy: 980,
            goal: 1000,
            isCompleted: false,
            supporters: 2345,
            likes: 1200,
            comments: 128,
            coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFYHHx1japTqyngTXjfnwRZ58g9dGRwcA91PpCfaLmE4EpxaQO-vnWfe9Pig3HS-hQoPbYK-36cHZYyjKoyA6JWqYMxLrvMn4kKbmw1NM5Ba-yWZVAqCKS4e5xthM6XnAGL7uZs1xQ5NqvO7w8qF6mD_tpgZCXpHFZVymJwWiKE1OCsIHignvHUeB7T2VzXsCXcUlUhnYLHFF-12pU617dJeRYs_kmGYQk4SQD72zxRSzr1C3kChDJPuDySrhwPvbztV2tpdCjyUU",
            featured: true,
            impossibleIndex: 98
        },
        {
            id: 2,
            title: "跨星际翻译器",
            description: "为了听懂家里猫在说什么，它最近眼神很奇怪...也许它能告诉我一些宇宙的秘密。",
            author: {
                name: "银河漫游者",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5sCzXtBejX0yCFvi6d6ppeQoCHyCkkjwr4FJVJuxdyPpZyrUaMTlv4HjDRiTS-HXni9zoALuVzJBX3vnT52vYJjpsLGZJCxKg25OMI19G_J7su5Q-h_Et7WNpuVqyeNn-xSqh5FD-97uSdFv9h5f_W0tLv7L8CGlqOxeKl2YPGUZpXfbbEif1PjxPecGjzSxDamCqVg6D-XveYAQ85Q72243NHMIfBv4lCTHn2UUynJKm7c2jTayR_L3RjTuSQzPR88oZN4uWcs",
                verified: false
            },
            category: "科幻未来",
            emoji: "👾",
            progress: 85,
            energy: 425,
            goal: 500,
            isCompleted: false,
            supporters: 856,
            likes: 3400,
            comments: 45,
            coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2trCuoIX7aPezJ2Xu2XcTQlhIKwf9Hb5-T7Ht4emASXIvaH_BZz9xoiDaZq-xNTUU8LcZHlTyQxGYAuWKLjwwagwxXcq40h9zMdQNgPoKbUvwQfzJg4S_JOTpyI8aCgytFT96uxjZVPD2Tz4iKopOPqvMhSPhyJtjfEVn8pDDm62gt3WwTD7BTJLPEkbkj_8OhnZsby2y8KgX7b3_DZhnvATaXyup95gt-SHW2aoGUndWV_I2qrsjVO2pVc3wFOznBV-n76Q7AI",
            featured: false,
            impossibleIndex: 85
        },
        {
            id: 3,
            title: "私人克隆岛",
            description: "一个只有我自己克隆体的岛屿，不再有社交焦虑...",
            author: {
                name: "克隆博士",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw9VMPP_SS_Zrf62BjKx_g5vO1NQXHug6CDeIR-Qu4r4X3bZl2Pj-PesqEWoH3uYDIvWrVfLD0KE9Tu2XhCBU3l__0mgui6k5ZOE-NwwERvPiuYrOdjVPRsxsga_PnO8Bx8AmmcqzTm-Z68QnWYl_RNE1cCspkuvntRb4ZVNFufnaWUz9B6n_-_BRiYOMivjVBI6hJbA5od2Gc9LqI4hDOGGMjvxT0vPkdqVra4CMvQ7D2meAXyeI9u3Prgy6XwpdD3I2zGmgzknQ",
                verified: false
            },
            category: "改变世界",
            emoji: "§",
            progress: 75,
            energy: 1575,
            goal: 2100,
            isCompleted: false,
            supporters: 2100,
            likes: 980,
            comments: 89,
            coverImage: null,
            featured: false,
            impossibleIndex: 75
        },
        {
            id: 4,
            title: "云朵城堡",
            description: "住在云上，随风飘荡，不用交房租...",
            author: {
                name: "天空捕手",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA90z9dSDKdmwPp6iUgzo0AMOdSvl1nDv9-FwGDXC73GrQVTslcitp1MyC0zP3fwvhM12Pmn6e4kd5McY5l-rrsAY5Vfw7SmdJMbU4Va3YtboI3nk-LPlkTiMeQFU_rowLxcPEjmyCETJWmw4cZFDAg6JlCJIX-xjwUFZam-64lvUDtMJyvkMrKVkHF3_rNoyQX9qbSzDdFevVoCuape5NZui--Hmf3ckaEMWVnZH_0ClxGsddddLXqPNvd2oRRK9nAQ_3Mz-Uc7Y",
                verified: false
            },
            category: "艺术创作",
            emoji: "▓",
            progress: 60,
            energy: 2700,
            goal: 4500,
            isCompleted: false,
            supporters: 4500,
            likes: 12000,
            comments: 156,
            coverImage: null,
            featured: false,
            impossibleIndex: 60
        },
        {
            id: 5,
            title: "发明任意门",
            description: "一扇可以通往任何回忆和未来的门，我想再次见到小时候的院子。",
            author: {
                name: "李雷",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaLMwbWZZ5ktDlJg_Yp0844qQC1t_xjPGaYbYoVjtjk4UFBp1MJ70wyYPQF2RpqFaLelhTyuibgWJSNYMGRAh3W4Z7qkXNA5PERd8C56B1IZxa9u2nM2rtmOyYYa1ccG2VZWUs_2okuXT1cy71zgR7PdXdsNvLc8vQjx4E1OkOMovmZmsVBZlMLPPZQdEnOClL5lXdySzs9oxWMFYnlu7JPYTg2exxTT7qBzwVX0ZCx7KvH_8m35OZkZgGC0jq27OgPvqDyNBUWiE",
                verified: true
            },
            category: "时空",
            emoji: "🚪",
            progress: 98,
            energy: 839,
            goal: 856,
            isCompleted: false,
            supporters: 856,
            likes: 1200,
            comments: 32,
            coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaHf1iMzDv5sX9XuQHTL3xMqXexwtCtNyrAgfvSZ7BBCUNTA8K_d0BtOHqsjern8bEXmlYNREGaZLK8Y_6O3Lbg3qrBTIElOo2f01fdkEl8eR-VwICL4wU0j2bf3koy2S5ZBWXIy2Y9OwIfHD-QTQBOVCOVN9_NEnV2AfiTIkQ5IjttRD2x9jGYp7ZJpk7s4Da3iLCxJObTizJqK0MfrkX7csP3-77G3KZml_MyEkJXZwudz_xSpxo7Qd4pQcHUEpWNgjBkmj_PmA",
            featured: true,
            impossibleIndex: 98
        },
        {
            id: 6,
            title: "火星第一座温室",
            description: "为了种出红色的玫瑰，我们需要先建立完整的生态循环系统。",
            author: {
                name: "David",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5c877kvO940oVQ30CEgfJPTNr1VRjhB68yBTLrg2CNlZYtxiYA7CYLkeUG_qq6UQ-jur4qjeuSxwxlI8dnwo7HKapJknTbAdxxIcGwJ_kbnQ_NDuJZ8dvYeP2IQmqLAUKd_a2fJlG475wZ64CdruMir3wZdNgaKU3jERFve77pXK71REYJ05KcP7lNL7r9E9lBwP0GuUTlDyCBbNbbn3twIhFzI4o_soGtTD3j7LXrtsNzG_oqLO7iE6AKloBECcg_3H1VNn9dmc",
                verified: false
            },
            category: "科幻未来",
            emoji: "🌹",
            progress: 45,
            energy: 555,
            goal: 1234,
            isCompleted: false,
            supporters: 1234,
            likes: 2100,
            comments: 67,
            coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPpm40FHsrcgLkIJg67WsOARkKkXhrwVF7SL9_JdJYRnVBGy7N_AbTDi54PFTgCdXnyiVo5pzuuo-z_Egwg3K3pAc2cK2YA_rtDOShAM3vO7pxwHOXOIYSXnSvZwRB3mNpI1yWUdPzGnQyTvs4nNj8W5YTHfgrL49XIQx7DTHHxCKao-fi2dGpA0NfGtXbQg8TgQmNb_wSyIbcgrR6TIhSezEeMTOrKqUraDnkemnHm-srU9QTxgaoWXeDgkmg4c7runX3z_warLE",
            featured: false,
            impossibleIndex: 70
        },
        {
            id: 7,
            title: "机械之心",
            description: "当最后一个自然心脏停止跳动，文明将由永动机重新定义。Forked from @Dr_Light",
            author: {
                name: "Kepler-22b",
                avatar: null,
                verified: false
            },
            category: "克隆",
            emoji: "🤖",
            progress: 100,
            energy: 454,
            goal: 567,
            isCompleted: true,
            supporters: 567,
            likes: 890,
            comments: 23,
            coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2trCuoIX7aPezJ2Xu2XcTQlhIKwf9Hb5-T7Ht4emASXIvaH_BZz9xoiDaZq-xNTUU8LcZHlTyQxGYAuWKLjwwagwxXcq40h9zMdQNgPoKbUvwQfzJg4S_JOTpyI8aCgytFT96uxjZVPD2Tz4iKopOPqvMhSPhyJtjfEVn8pDDm62gt3WwTD7BTJLPEkbkj_8OhnZsby2y8KgX7b3_DZhnvATaXyup95gt-SHW2aoGUndWV_I2qrsjVO2pVc3wFOznBV-n76Q7AI",
            featured: false,
            impossibleIndex: 95
        },
        {
            id: 8,
            title: "云端城堡计划",
            description: "生活在积雨层之上的可能性探索。",
            author: {
                name: "Sarah",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl_4UeOkX4eRiXak4TmcG72C8U-r9XEijYYfddNtSHUGCbHdx1qKcBOsdjvx3lG6xJQCm7tUPMP2v0fLbIWLKHOtxFlTi1cFAo8gHfTIgr22r2OmQM8X-BPFGwAWbnf2zZzF4V5KYSo4a7ko2sOaGkhWbJYsWoRtBuC3l_PTBcf2_fxMa_KyQFwadxa8AXQyA49gQx8EhCtb6OuA0_YmmlgxDEMCGAPdN9xVAI82ztQVsILQdLGJ1O6Rpb6bojo6b7Yi8XsR6IM5w",
                verified: false
            },
            category: "预言",
            emoji: "☁️",
            progress: 25,
            energy: 86,
            goal: 345,
            isCompleted: false,
            supporters: 345,
            likes: 567,
            comments: 18,
            coverImage: null,
            featured: false,
            impossibleIndex: 80
        }
    ],

    // Feed activities
    feed: [
        {
            id: 1,
            type: "sponsor",
            user: {
                name: "李雷",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaLMwbWZZ5ktDlJg_Yp0844qQC1t_xjPGaYbYoVjtjk4UFBp1MJ70wyYPQF2RpqFaLelhTyuibgWJSNYMGRAh3W4Z7qkXNA5PERd8C56B1IZxa9u2nM2rtmOyYYa1ccG2VZWUs_2okuXT1cy71zgR7PdXdsNvLc8vQjx4E1OkOMovmZmsVBZlMLPPZQdEnOClL5lXdySzs9oxWMFYnlu7JPYTg2exxTT7qBzwVX0ZCx7KvH_8m35OZkZgGC0jq27OgPvqDyNBUWiE"
            },
            targetDream: 5,
            timeAgo: "5 分钟前",
            actionColor: "primary"
        },
        {
            id: 2,
            type: "publish",
            user: {
                name: "Sarah",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl_4UeOkX4eRiXak4TmcG72C8U-r9XEijYYfddNtSHUGCbHdx1qKcBOsdjvx3lG6xJQCm7tUPMP2v0fLbIWLKHOtxFlTi1cFAo8gHfTIgr22r2OmQM8X-BPFGwAWbnf2zZzF4V5KYSo4a7ko2sOaGkhWbJYsWoRtBuC3l_PTBcf2_fxMa_KyQFwadxa8AXQyA49gQx8EhCtb6OuA0_YmmlgxDEMCGAPdN9xVAI82ztQVsILQdLGJ1O6Rpb6bojo6b7Yi8XsR6IM5w"
            },
            targetDream: 8,
            timeAgo: "12 分钟前",
            actionColor: "blue"
        },
        {
            id: 3,
            type: "fork",
            user: {
                name: "Kepler-22b",
                avatar: null
            },
            targetDream: 7,
            timeAgo: "32 分钟前",
            actionColor: "green"
        },
        {
            id: 4,
            type: "sponsor",
            user: {
                name: "David",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5c877kvO940oVQ30CEgfJPTNr1VRjhB68yBTLrg2CNlZYtxiYA7CYLkeUG_qq6UQ-jur4qjeuSxwxlI8dnwo7HKapJknTbAdxxIcGwJ_kbnQ_NDuJZ8dvYeP2IQmqLAUKd_a2fJlG475wZ64CdruMir3wZdNgaKU3jERFve77pXK71REYJ05KcP7lNL7r9E9lBwP0GuUTlDyCBbNbbn3twIhFzI4o_soGtTD3j7LXrtsNzG_oqLO7iE6AKloBECcg_3H1VNn9dmc"
            },
            targetDream: 6,
            timeAgo: "1 小时前",
            actionColor: "primary"
        }
    ],

    // Notifications
    notifications: [
        {
            id: 1,
            type: "like",
            user: {
                name: "银河漫游者",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5sCzXtBejX0yCFvi6d6ppeQoCHyCkkjwr4FJVJuxdyPpZyrUaMTlv4HjDRiTS-HXni9zoALuVzJBX3vnT52vYJjpsLGZJCxKg25OMI19G_J7su5Q-h_Et7WNpuVqyeNn-xSqh5FD-97uSdFv9h5f_W0tLv7L8CGlqOxeKl2YPGUZpXfbbEif1PjxPecGjzSxDamCqVg6D-XveYAQ85Q72243NHMIfBv4lCTHn2UUynJKm7c2jTayR_L3RjTuSQzPR88oZN4uWcs"
            },
            targetDream: 1,
            timeAgo: "5 分钟前",
            read: false
        },
        {
            id: 2,
            type: "comment",
            user: {
                name: "Sarah",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl_4UeOkX4eRiXak4TmcG72C8U-r9XEijYYfddNtSHUGCbHdx1qKcBOsdjvx3lG6xJQCm7tUPMP2v0fLbIWLKHOtxFlTi1cFAo8gHfTIgr22r2OmQM8X-BPFGwAWbnf2zZzF4V5KYSo4a7ko2sOaGkhWbJYsWoRtBuC3l_PTBcf2_fxMa_KyQFwadxa8AXQyA49gQx8EhCtb6OuA0_YmmlgxDEMCGAPdN9xVAI82ztQVsILQdLGJ1O6Rpb6bojo6b7Yi8XsR6IM5w"
            },
            targetDream: 1,
            timeAgo: "12 分钟前",
            read: false
        },
        {
            id: 3,
            type: "sponsor",
            user: {
                name: "李雷",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaLMwbWZZ5ktDlJg_Yp0844qQC1t_xjPGaYbYoVjtjk4UFBp1MJ70wyYPQF2RpqFaLelhTyuibgWJSNYMGRAh3W4Z7qkXNA5PERd8C56B1IZxa9u2nM2rtmOyYYa1ccG2VZWUs_2okuXT1cy71zgR7PdXdsNvLc8vQjx4E1OkOMovmZmsVBZlMLPPZQdEnOClL5lXdySzs9oxWMFYnlu7JPYTg2exxTT7qBzwVX0ZCx7KvH_8m35OZkZgGC0jq27OgPvqDyNBUWiE"
            },
            targetDream: 1,
            timeAgo: "1 小时前",
            read: false
        },
        {
            id: 4,
            type: "achievement",
            content: "恭喜！你的梦想「造时光机」已达成目标，获得 1000 能量奖励！",
            timeAgo: "2 小时前",
            read: false,
            reward: 1000
        },
        {
            id: 5,
            type: "achievement",
            content: "你的梦想「跨星际翻译器」已达成目标，获得 500 能量奖励！",
            timeAgo: "3 小时前",
            read: false,
            reward: 500
        },
        {
            id: 6,
            type: "like",
            user: {
                name: "克隆博士",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw9VMPP_SS_Zrf62BjKx_g5vO1NQXHug6CDeIR-Qu4r4X3bZl2Pj-PesqEWoH3uYDIvWrVfLD0KE9Tu2XhCBU3l__0mgui6k5ZOE-NwwERvPiuYrOdjVPRsxsga_PnO8Bx8AmmcqzTm-Z68QnWYl_RNE1cCspkuvntRb4ZVNFufnaWUz9B6n_-_BRiYOMivjVBI6hJbA5od2Gc9LqI4hDOGGMjvxT0vPkdqVra4CMvQ7D2meAXyeI9u3Prgy6XwpdD3I2zGmgzknQ"
            },
            targetDream: 3,
            timeAgo: "5 小时前",
            read: true
        }
    ],

    // Comments for dreams
    comments: {
        1: [
            {
                id: 1,
                user: {
                    name: "LostStar_99",
                    avatar: null,
                    initials: "L"
                },
                text: "虽然听起来很疯狂，但我愿意为了这个梦买单。算我一个！🚀",
                timeAgo: "1小时前"
            },
            {
                id: 2,
                user: {
                    name: "Neo_Matrix",
                    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuADqfg_qFcPc3pkSRbojloqRu3N3OzpfHZlN-CYcu17WISA_lW02xqpz6fd2ALX1texKXDt04ny6JRjXAiV0STwHNhlL6PxTCojxTJAibv3lm_7vvAi1ZyGd3CMCMHsh6ZbZoY2BfUHfoJJwm2EhlX7W8-Q1N4-qIa6NXuW88EZhA_7Gi1wsRYWpb2_AjJhZn8O7QnlShHXuwMKhu2rFexeslmnX2g3fEqvGCp-Q08QyjSCnMa2ldVzKQzvLofmtDjfMKN8W03h8Ks"
                },
                text: "霍金举办过一次面向未来的时间旅行者派对，没人参加。也许你的机器能带我们去那场派对？",
                timeAgo: "3小时前"
            }
        ]
    },
    
    // Categories
    categories: [
        { id: 1, name: "科幻未来", emoji: "🚀" },
        { id: 2, name: "艺术创作", emoji: "🎨" },
        { id: 3, name: "改变世界", emoji: "🌍" },
        { id: 4, name: "游戏开发", emoji: "🕹️" },
        { id: 5, name: "独立影视", emoji: "🎬" }
    ],
    
    // User profile
    userProfile: {
        name: "梦想家 小明",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKUsfpKRgdNyObSJQRMqETCkMaIZodX_SAqJXXT8Is-ZKfQwFrmxvdBbLVwzHdrbV6A0YSE6VjaFQZG2NTthZLZF19oZ44SNRTjRh3m_UFKH71S97n9-cgfnIFW5Dy8FNvUyAJlzW2fkFKjAahvNJ68MWmjemP0ax6tJb3WOyTecOQbeU6bHpSxfa9I97O_AYEdEHsZg83qPYPUP9ZlhD5pysIew_PRs8x02d_R4z1FM7k-vLmNg9L5aHEgmtWki3fooF_hXFM3OQ",
        verified: true,
        bio: "🌟 追逐星星的孩子，希望能造出一艘通往火星的飞船。",
        energy: 2850, // 能量积分
        stats: {
            dreams: 5,
            supported: 23,
            supportReceived: 1200
        },
        followers: 128,
        following: 56,
        lastLoginDate: null, // 上次登录日期
        todayClaimed: false // 今日是否已领取登录奖励
    }
};

// Helper functions
function getDreamById(id) {
    return dreamData.dreams.find(d => d.id === id);
}

function getFeaturedDreams() {
    return dreamData.dreams.filter(d => d.featured);
}

function getDreamsByCategory(category) {
    if (!category) return dreamData.dreams;
    return dreamData.dreams.filter(d => d.category === category);
}

function getDreamComments(dreamId) {
    return dreamData.comments[dreamId] || [];
}
