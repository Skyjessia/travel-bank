/* 2025 埃及尼罗河之旅（v2：Jess手排14天行程表+实际执行19天——计划稿数字化） */

TRIP_BANK.push({
    "id": "2025-egypt",
    "title": "埃及尼罗河之旅",
    "destination": "开罗 · 阿布辛贝 · 阿斯旺 · 卢克索 · 赫尔格达",
    "country": "埃及",
    "year": 2025,
    "startDate": "2025-01-20",
    "endDate": "2025-02-07",
    "cover": "images/covers/2025-egypt.jpg",
    "type": "trip",
    "status": "completed",
    "memoryStatus": "partial",
    "description": "三大一小，手排14天执行19天：开罗4日（金字塔前民宿·国家博物馆请向导·尼罗河游船夜与埃及伙伴共舞·哈利利市集）→夜火车南下→阿布辛贝双神庙→阿斯旺3日（三角帆船·努比亚村落·菲莱神庙·尼罗河惨案酒店看日落）→卢克索5日（丹德拉·帝王谷·哈布城·卡纳克）→计划2.2回沪实际改道赫尔格达红海发呆4天，2.7归。",
    "guidePage": "guide/2025-egypt.html",
    "memoryPage": "https://skyjessia.github.io/travel-bank/memory/2025-egypt/"
});

PLACE_BANK.push(
    { "tripId": "2025-egypt", "country": "阿联酋", "region": "迪拜", "city": "迪拜", "lat": 25.2048, "lng": 55.2708, "day": 1, "status": "passed",
      "sites": [], "note": "1-20机场中转·上海-迪拜-开罗·EK305/EK923" },
    { "tripId": "2025-egypt", "country": "埃及", "region": "开罗省", "city": "开罗", "lat": 30.0444, "lng": 31.2357, "day": 1,
      "status": "visited",
      "sites": ["金字塔前民宿", "埃及国家博物馆（请向导）", "尼罗河游船夜景", "吉萨大金字塔群", "狮身人面像", "萨拉丁城堡", "默罕默德阿里大清真寺", "哈利利市集", "洞穴教堂", "垃圾城市", "埃及民俗博物馆（法老木乃伊）"],
      "note": "D1-D4·1-20/23·宿金字塔前民宿3晚（非常推荐·Jess原话）·D2游船上和埃及伙伴一起跳舞·D4晚夜火车去阿斯旺" },
    { "tripId": "2025-egypt", "country": "埃及", "region": "阿斯旺省", "city": "阿布辛贝", "lat": 22.3372, "lng": 31.6258, "day": 5,
      "status": "visited",
      "sites": ["拉美西斯二世大神庙", "奈菲尔塔利小神庙"],
      "note": "D5-D6·1-24/25·阿斯旺包车前往抵时已夜·宿阿布辛贝·一早双神庙再回阿斯旺" },
    { "tripId": "2025-egypt", "country": "埃及", "region": "阿斯旺省", "city": "阿斯旺", "lat": 24.0889, "lng": 32.8998, "day": 6,
      "status": "visited",
      "sites": ["尼罗河三角帆船", "未完成的方尖碑（采石场）", "努比亚村落", "菲莱神庙", "费里亚尔花园小公园日落（尼罗河惨案酒店）"],
      "note": "D6-D8·1-25/27·宿3晚·包车一日游菲莱·晚上逛市场买了香水" },
    { "tripId": "2025-egypt", "country": "埃及", "region": "卢克索省", "city": "卢克索", "lat": 25.6872, "lng": 32.6396, "day": 9,
      "status": "visited",
      "sites": ["丹德拉神庙", "卢克索神庙", "帝王谷一日游", "哈布城", "卡纳克神庙"],
      "note": "D9-D13·1-28/2-1·宿卢克索酒店5晚·D10路线列'游轮-卢克索'存疑待Jess确认·D12'丹德兰神庙'疑为D10丹德拉重复·两岸神庙连成三千年的走廊" },
    { "tripId": "2025-egypt", "country": "埃及", "region": "红海省", "city": "赫尔格达", "lat": 27.2579, "lng": 33.8116, "day": 14,
      "status": "visited",
      "sites": ["红海", "沙漠冲沙"],
      "note": "计划2-2回沪实际改道·红海发呆四天·2-7归——计划之外的神来之笔" }
);
