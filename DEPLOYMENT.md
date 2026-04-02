# دليل النشر (Production)

هذا المشروع يحتوي:

- واجهة Frontend بـ `Vite/React`
- Endpoint خلفي للتتبع الآمن في `api/order-tracking.ts`

لذلك يفضل نشره على منصة تدعم:

- Static frontend
- Serverless functions (مسار `/api/*`)

## الخيار الموصى به: Vercel

## 1) تجهيز المتغيرات

أضف المتغيرات التالية في إعدادات المشروع على Vercel:

### متغيرات الواجهة (Client)

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### متغيرات الخادم (Server/Admin SDK)

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

مهم: قيمة `FIREBASE_PRIVATE_KEY` يجب أن تكون النص الكامل للمفتاح الخاص من Firebase service account.

## 2) إعداد Firebase Service Account

من Firebase Console:

1. Project Settings
2. Service accounts
3. Generate new private key
4. استخدم القيم في متغيرات `FIREBASE_*`

## 3) النشر

- اربط المستودع بـ Vercel
- Build command: `npm run build`
- Output directory: `dist`

Vercel سيتعرف تلقائيًا على `api/order-tracking.ts` كـ Serverless Function.

## 4) التحقق بعد النشر

اختبر endpoint:

```bash
curl -X POST https://YOUR_DOMAIN/api/order-tracking \
  -H "Content-Type: application/json" \
  -d '{"phone":"69988979","trackingCode":"FT-ABC123"}'
```

النتيجة المتوقعة:

- `200` مع `orders: []` إذا لا يوجد تطابق
- `200` مع عنصر طلب واحد إذا البيانات صحيحة
- `429` عند تجاوز rate limit

## 5) ملاحظات أمنية مهمة

- لا تضع أي مفاتيح Firebase Admin في متغيرات `VITE_*`.
- لا تشارك ملف مفاتيح الخدمة داخل المستودع.
- راجع Firestore Rules بحيث تمنع قراءة `leads` مباشرة من العميل العام.
- endpoint الحالي يطبق rate limiting بسيط داخل الذاكرة؛ في الإنتاج الكبير يفضل نقل المعدّل إلى Redis/Upstash.

## تشغيل endpoint محليًا

`vite` وحده لا يشغل `api/*`.

للاختبار المحلي الكامل لطبقة API استخدم:

- `vercel dev` (إذا كان Vercel CLI متاحًا)

أو انشر على بيئة Staging واختبر هناك.

## ملف `vercel.json`

يوجد في جذر المشروع `vercel.json` لـ:

- توجيه مسارات SPA (مثل `/booking`) إلى `index.html` دون كسر مسارات `/api/*`.
- تحديد `outputDirectory: dist` و`framework: vite` صراحةً.

## قائمة تحقق سريعة قبل Go Live (~5 دقائق)

1. ربط المستودع بـ Vercel واختيار المشروع الصحيح.
2. تعبئة كل متغيرات `VITE_FIREBASE_*` و`FIREBASE_*` في Environment Variables.
3. التأكد أن `FIREBASE_PRIVATE_KEY` مُلصق كاملاً (مع أسطر جديدة إن لزم).
4. نشر Preview ثم فتح الموقع والتنقل بين `/` و`/booking` و`/blog` (لا يجب أن يظهر 404).
5. اختبار `POST /api/order-tracking` بـ `curl` أو من واجهة التتبع.
6. مراجعة Firestore Rules: منع قراءة `leads` من المستخدمين غير المصرّح لهم.
7. فتح الموقع على موبايل والتأكد من الحجز والواتساب.
