/* 俄罗斯蓝冰极光 · 2026（v2：Jess日计划表数字化——四列原档：日期/城市/行程/住宿） */

TRIP_BANK.push(
{
    "id": "2026-russia",
    "title": "俄罗斯蓝冰极光",
    "destination": "伊尔库茨克 · 奥利洪岛 · 摩尔曼斯克",
    "country": "俄罗斯",
    "year": 2026,
    "startDate": "2026-02-01",
    "endDate": "2026-02-10",
    "cover": "images/covers/2026-russia.jpg",
    "type": "trip",
    "status": "completed",
    "memoryStatus": "partial",
    "description": "10天贝加尔湖+北极圈（2.11晨抵沪）：上海经北京到伊尔库茨克，奥利洪岛小木屋3晚追蓝冰冰洞，伊尔库茨克三大教堂city walk，两段飞抵摩尔曼斯克4晚——阿廖沙纪念碑看不冻港、列宁号破冰船、最北麦当劳，极光第一次扑空第二次跟团终于收获，捷里别尔卡看到北冰洋。",
    "guidePage": "guide/2026-russia.html",
    "memoryPage": "https://skyjessia.github.io/travel-bank/memory/2026-russia/"
}
);

/* —— D1 伊尔库茨克 —— */
PLACE_BANK.push(
{
    "tripId": "2026-russia", "country": "俄罗斯", "region": "伊尔库茨克州",
    "city": "伊尔库茨克", "lat": 52.287, "lng": 104.305, "day": 1,
    "status": "visited",
    "sites": ["Sovremennaya Kvartira公寓（Cholovsk Flat）"],
    "note": "D1·2-1·早8:55上海起飞10:55到北京·12:55转飞16:00抵伊尔库茨克"
}
);

/* —— D2-4 奥利洪岛（小木屋3晚） —— */
PLACE_BANK.push(
{
    "tripId": "2026-russia", "country": "俄罗斯", "region": "伊尔库茨克州",
    "city": "奥利洪岛", "lat": 53.0496, "lng": 107.3118, "day": 2,
    "status": "visited",
    "sites": ["萨满岩", "北岛蓝冰", "碎碎冰", "冰洞", "烤鱼餐", "星空万里"],
    "note": "D2-D4·2-2/4·小木屋3晚（Sovremennaya Kvartira Olkhon Lyubina Flat）·D2下午木屋边萨满岩（萨满教圣地）·晚上星空万里还看到卫星·D3北岛全日蓝冰碎碎冰·中午烤鱼餐·各角度冰洞·D4上午再下萨满岩湖面冰洞蓝冰·下午返回伊尔库茨克"
}
);

/* —— D5 伊尔库茨克 city walk —— */
PLACE_BANK.push(
{
    "tripId": "2026-russia", "country": "俄罗斯", "region": "伊尔库茨克州",
    "city": "伊尔库茨克", "lat": 52.287, "lng": 104.305, "day": 5,
    "status": "visited",
    "sites": ["喀山圣母大教堂（8:00-19:00免费）", "主显节教堂", "救世主教堂", "波兰大教堂", "情人桥", "亚戈夫雕像", "凯旋门", "州政府外观", "基洛夫广场", "中央市场"],
    "note": "D5·2-5·三大教堂+情人桥+凯旋门+基洛夫广场市内city walk一整天"
}
);

/* —— D6-9 摩尔曼斯克（4晚） —— */
PLACE_BANK.push(
{
    "tripId": "2026-russia", "country": "俄罗斯", "region": "摩尔曼斯克州",
    "city": "摩尔曼斯克", "lat": 68.9585, "lng": 33.0827, "day": 6,
    "status": "visited",
    "sites": ["阿廖沙纪念碑（北极保卫者雕像）", "不冻港山顶", "谢苗猫雕塑", "最北麦当劳", "列宁号核动力破冰船", "捷里别尔卡（北冰洋）", "北极光"],
    "note": "D6-D9·2-6/9·4晚（₽22,440·到店当场支付）·D6两段飞09:25-10:55到莫斯科·惊喜=票面本应在伏努科沃VKO转机·实际落谢列梅捷沃SVO同场中转（省去换机场）·18:10-20:50直落摩尔曼斯克机场（Murmashi·Jess记作希尔涅克）·D7阿廖沙纪念碑山顶看不冻港+谢苗猫+最北麦当劳+列宁号·晚上第一次追极光扑空·D8市内打卡超市买北极蟹鱼子酱在家做饭·D9捷里别尔卡一日游看到北冰洋（封路提早回）·晚上极光第二次跟团——终于收获极光"
}
);

/* —— D10 莫斯科中转 —— */
PLACE_BANK.push(
{
    "tripId": "2026-russia", "country": "俄罗斯", "region": "莫斯科市",
    "city": "莫斯科", "lat": 55.7558, "lng": 37.6173, "day": 10,
    "status": "passed",
    "note": "D10·2-10·一早飞机回莫斯科·19:10起飞2-11晨08:55抵沪·中转经谢列梅捷沃SVO（来程2-6亦SVO·票面本应VKO转·实际同场零换场）"
}
);
