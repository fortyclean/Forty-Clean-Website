# Brutal Review

تاريخ المراجعة: 2026-04-01  
بيئة التشغيل: `vite dev` على `http://127.0.0.1:5174`  
أسلوب المراجعة: تشغيل فعلي + لقطات شاشة + قراءة كود + نقد معماري ومنتجي

## التشغيل والاختبار الفعلي

تم تشغيل التطبيق محليًا بنجاح، ثم تنفيذ سكربت Playwright الموجود أصلًا في المشروع:

- `node scripts/ux-audit.mjs`

تم توليد لقطات شاشة جديدة داخل:

- [desktop-home.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/desktop-home.png)
- [desktop-home-after-primary-click.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/desktop-home-after-primary-click.png)
- [desktop-home-order-tracking-after-search.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/desktop-home-order-tracking-after-search.png)
- [desktop-booking.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/desktop-booking.png)
- [mobile-home.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/mobile-home.png)
- [mobile-admin-leads.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/mobile-admin-leads.png)

## Critical Flaws

### 1. الصفحة الرئيسية تبدو مكسورة بصريًا

هذه ليست ملاحظة تجميلية. الصفحة الرئيسية فعليًا فيها مساحات بيضاء ضخمة مع مؤشرات تحميل صغيرة، فتبدو وكأن المحتوى ناقص أو التطبيق تعطل.

الدليل:

- [desktop-home.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/desktop-home.png)
- [mobile-home.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/mobile-home.png)

السبب المباشر:

- [Home.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/pages/Home.tsx#L103) إلى [Home.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/pages/Home.tsx#L125) يلف أقسامًا كثيرة بـ `DeferredSection`
- [DeferredSection.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/DeferredSection.tsx#L40) إلى [DeferredSection.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/DeferredSection.tsx#L46) يحجز `minHeight` ثابتة حتى قبل ظهور المحتوى

هذا قرار أداء سيئ لأنه حسّن أرقام التحميل على الورق، لكنه خرب أول انطباع للمستخدم. باختصار: الصفحة "تبدو فارغة" قبل أن تبدو سريعة.

### 2. واجهة الإدارة فيها سلوك أمني غير ناضج

المشكلة ليست فقط في أن الرابط مخفي. المشكلة أن نموذج الدخول نفسه يهيئ سلوكًا غير مهني:

- البريد الافتراضي جاهز في [AdminLogin.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/AdminLogin.tsx#L4)
- كلمة المرور الافتراضية `123456` مكتوبة داخل الكود في [AdminLogin.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/AdminLogin.tsx#L8)

حتى لو لم تكن هذه هي كلمة المرور الحقيقية في Firebase، هذا يرسل إشارة سيئة جدًا:

- يدرّب على إدخال كلمة مرور ضعيفة
- يفضح نمط الدخول لأي شخص يفتح اللوحة
- يحول واجهة الإدارة إلى شيء "تجريبي" بدل نظام موثوق

هذا ليس اختراقًا مباشرًا، لكنه ضعف أمني/تشغيلي واضح.

### 3. تتبع الطلبات هش وتجربته ضعيفة

واجهة التتبع لا تعرض أخطاء مفيدة للمستخدم، وتتعامل مع أي فشل كأنه "لا توجد نتائج".

الدليل:

- [OrderTracking.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/OrderTracking.tsx#L55) إلى [OrderTracking.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/OrderTracking.tsx#L76)

المشكلة:

- `response.ok === false` ينتج `setOrders([])` فقط
- لا يوجد تمييز بين `400`, `429`, `500`
- المستخدم لا يعرف هل أخطأ في الإدخال أم الخادم معطل أم تم حظره مؤقتًا

النتيجة: تجربة "فشل صامت". هذه أسوأ تجربة ممكنة لميزة تتبع حساسة.

### 4. الحماية من الإساءة في API شكلية أكثر من كونها موثوقة

في [order-tracking.ts](e:/فورتي/TheWebsiteFiles25-02-2026/api/order-tracking.ts#L23) إلى [order-tracking.ts](e:/فورتي/TheWebsiteFiles25-02-2026/api/order-tracking.ts#L49) يوجد rate limit داخل `Map` في الذاكرة.

هذا عمليًا يعني:

- يضيع مع إعادة التشغيل
- لا يعمل بشكل صحيح في بيئة serverless متعددة النسخ
- يمكن تجاوزه بسهولة نسبيًا

هذا يصلح كرقعة مؤقتة، لا كحل إنتاج.

## UX/UI Roasts

### 1. الصفحة الرئيسية ليست "ناعمة"، بل مربكة

الجزء العلوي جيد بصريًا، ثم يهبط الموقع فجأة إلى فراغات طويلة جدًا. هذا يشعر المستخدم أن الصفحة لم تكتمل أو الإنترنت بطيء أو الموقع فيه مشكلة.

الدليل:

- [desktop-home-after-primary-click.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/desktop-home-after-primary-click.png)
- [desktop-home-order-tracking-after-search.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/desktop-home-order-tracking-after-search.png)

### 2. خلط لغات واضح وغير احترافي

المنتج عربي في الأساس، لكن الصفحة الرئيسية ما زالت تعرض عناصر ثقة وتسويق بالإنجليزية:

- [Home.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/pages/Home.tsx#L41) إلى [Home.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/pages/Home.tsx#L56)

مثل:

- `LICENSED & INSURED`
- `4.9 GOOGLE RATING`
- `24/7 AVAILABILITY`
- `ISO CERTIFIED`

هذا ليس "ستايل عالمي". هذا تناقض في اللغة والهوية.

### 3. 404 ما زالت مزدحمة ومربكة

صفحة الرابط الإداري القديم تعرض 404، لكن معها الأزرار العائمة والفوتر الكبير، فتبدو كأن المستخدم هبط في صفحة عادية مع خطأ طفيف، لا صفحة خطأ مقصودة.

الدليل:

- [mobile-admin-leads.png](e:/فورتي/TheWebsiteFiles25-02-2026/review-screenshots/mobile-admin-leads.png)

### 4. الاعتماد على صور `pravatar` في منطقة الثقة ساذج

في [Home.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/pages/Home.tsx#L88) إلى [Home.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/pages/Home.tsx#L97) توجد صور مستخدمين من خدمة خارجية عامة.

هذا يعطي انطباعًا رخيصًا جدًا:

- ليس دليلًا اجتماعيًا حقيقيًا
- يضيف طلبات شبكة خارجية غير ضرورية
- يبدو كعنصر placeholder نُسي في المنتج

### 5. أزرار واتساب/الهاتف العائمة تتطفل على المحتوى

في لقطات الموبايل والأقسام الطويلة، الأزرار العائمة تغطي جزءًا من المساحة البصرية وتظهر حتى في 404. هذا سلوك عدواني أكثر من اللازم.

## Codebase Smells

### 1. `CustomersList` مكوّن متضخم بشكل واضح

الملف [CustomersList.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/CustomersList.tsx#L40) إلى [CustomersList.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/CustomersList.tsx#L555) يجمع في مكوّن واحد:

- الجلب
- المزامنة مع `localStorage`
- البحث
- الفلترة
- الترتيب
- الإحصاءات
- الرسائل
- النسخ للحافظة
- التعديل
- الحذف
- تغيير الحالة

هذا ليس "مكوّن غني". هذا مكوّن متورم. صيانته ستصبح مزعجة بسرعة، واختباره أصعب من اللازم.

### 2. ترميز النصوص في السورس غير مطمئن

عدة ملفات عند قراءتها من الطرفية تظهر فيها نصوص عربية مشوهة داخل literals، مثل:

- [Home.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/pages/Home.tsx#L71)
- [AdminLogin.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/AdminLogin.tsx#L38)
- [CustomersList.tsx](e:/فورتي/TheWebsiteFiles25-02-2026/src/components/CustomersList.tsx#L18)

حتى لو بدا بعضها صحيحًا وقت التشغيل، هذا مؤشر أن الترميز غير منضبط بما يكفي. النتيجة لاحقًا:

- تعديلات صعبة
- diffs مزعجة
- خطر كسر نصوص عربية عند أي تعديل أو merge

### 3. الكود ما زال يحمل بقايا تجريبية

في [firebase.ts](e:/فورتي/TheWebsiteFiles25-02-2026/src/lib/firebase.ts#L85) إلى [firebase.ts](e:/فورتي/TheWebsiteFiles25-02-2026/src/lib/firebase.ts#L94) توجد دالة `addCustomer()` التجريبية ما زالت داخل المشروع.

هذا كود ميت تقريبًا. وجوده يعني أن طبقة Firebase لم تُنظف جيدًا بعد الانتقال من الاختبارات إلى المنتج.

### 4. تسريب بيانات إلى الـ console بلا داع

في [firebase.ts](e:/فورتي/TheWebsiteFiles25-02-2026/src/lib/firebase.ts#L88) و [firebase.ts](e:/فورتي/TheWebsiteFiles25-02-2026/src/lib/firebase.ts#L124) يوجد `console.log` لبيانات العملاء.

هذا سيء لسببين:

- يلوث console في الإنتاج
- يرفع احتمال كشف بيانات لا داعي لعرضها

### 5. `useLeads` اسم مضلل وتنفيذ غير صادق

في [useLeads.ts](e:/فورتي/TheWebsiteFiles25-02-2026/src/hooks/useLeads.ts#L17) إلى [useLeads.ts](e:/فورتي/TheWebsiteFiles25-02-2026/src/hooks/useLeads.ts#L55) يوجد خيار `subscribe`.

المشكلة:

- الاسم يوحي باشتراك حي
- التنفيذ الفعلي يفعل `loadLeads()` مرة واحدة فقط

هذه API كاذبة لغويًا. أسماء الواجهات يجب أن تقول الحقيقة.

### 6. الأداء تحسن جزئيًا لكن Firebase ما زال ثقيلًا

البناء الحالي ما زال يخرج chunk كبيرًا لـ Firebase:

- `vendor-firebase` حوالي `339.89 kB`

هذا ليس كارثة وحده، لكنه يعني أن المشروع لم يصل بعد إلى مستوى "خفيف" فعليًا، خصوصًا مع جمهور موبايل.

## Architecture Critique

### 1. هناك تضارب بين تحسين الأداء وتحسين التجربة

تم دفع lazy loading و`DeferredSection` إلى درجة أفسدت تجربة الاستخدام الأولى. هذا خطأ معماري شائع: تحسين القياس النظري على حساب الإحساس الحقيقي للمستخدم.

### 2. منطق العملاء داخل الواجهة أكثر من اللازم

بدل وجود طبقة خدمات واضحة ومقسمة، جزء كبير من منطق CRUD وواجهة الإدارة يعيش داخل React component نفسها. هذا يسرّع البداية، لكنه سيبطئ التطوير لاحقًا.

### 3. لا توجد طبقة تحقق موحدة

التحقق من الاسم/الهاتف/الحالة موزع بين الواجهة وFirestore Rules وبعض الأكواد الخدمية، بدون schema موحدة. هذا يرفع احتمال التناقض بمرور الوقت.

## Missing or Weak Pieces

- لا توجد اختبارات وحدة أو تكامل حقيقية للمسارات المهمة
- لا توجد Telemetry مفيدة للأخطاء الفعلية
- لا يوجد Empty/Error state محترم في بعض التدفقات الحساسة
- لا يوجد Export للعملاء
- لا توجد ملاحظات داخلية لكل عميل
- لا توجد صفحة تفاصيل عميل

## 5 High-Impact Feature Proposals

### 1. صفحة تفاصيل عميل مستقلة

بدل كل شيء داخل بطاقة، افتح صفحة لكل عميل فيها:

- بياناته
- حالته
- ملاحظات داخلية
- سجل التعديلات

هذا يحول اللوحة من CRUD صغير إلى CRM محترم.

### 2. ملاحظات داخلية وتاريخ متابعة

أهم شيء ناقص فعليًا في CRM هو القدرة على كتابة:

- تم الاتصال
- لم يرد
- يريد المتابعة غدًا
- مهتم بخدمة محددة

بدون هذا، اللوحة مجرد قائمة أسماء.

### 3. تصدير CSV/Excel

مفيد جدًا تشغيليًا، خاصة لفريق مبيعات أو متابعة. هذا من أسرع الميزات قيمة مقابل جهد.

### 4. فلترة زمنية ولوحة مؤشرات حقيقية

مثل:

- اليوم
- هذا الأسبوع
- هذا الشهر

مع مؤشرات:

- عدد العملاء الجدد
- عدد المكتمل
- معدل التحويل

### 5. إدارة صلاحيات متعددة

إذا كان المنتج سيكبر، ستحتاج لاحقًا:

- مشرف رئيسي
- موظف متابعة
- قارئ فقط

الحالي مناسب لشخص واحد فقط.

## Bottom Line

التطبيق ليس سيئًا، لكنه حاليًا غير ناضج بما يكفي ليُعتبر منتجًا polished.

الحقيقة المباشرة:

- الواجهة العامة فيها كسر بصري واضح
- لوحة الإدارة تعمل، لكن بنيتها ما زالت MVP جدًا
- الأمن أفضل من السابق، لكنه ما زال يحتوي سلوكيات تجريبية
- الكود قابل للعمل، لكنه ليس نظيفًا كما ينبغي لمشروع سيكبر

## Recommended Order of Fixes

1. إصلاح الصفحة الرئيسية فورًا بإزالة الفراغات القاتلة الناتجة عن `DeferredSection`
2. إزالة كلمة المرور الافتراضية وكل السلوكيات التجريبية من واجهة الإدارة
3. تفكيك `CustomersList` إلى hooks ومكوّنات فرعية
4. تحسين Error states لتتبع الطلبات والإدارة
5. إضافة اختبارات حقيقية للـ leads والعملاء
