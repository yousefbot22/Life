# إعداد النسخة المركزية

هذه النسخة مضبوطة على مشروع Supabase الخاص بـ Life، وتم وضع Publishable Key داخل `cloud.js`.

## 1) قاعدة البيانات
نفّذ `supabase-schema.sql` في Supabase SQL Editor.

## 2) صلاحية Admin
لأن حساب `admin@gmail.com` قد يكون موجودًا قبل إنشاء جدول `profiles`، نفّذ `MAKE_ADMIN.sql` مرة واحدة.

## 3) تسجيل الدخول
استخدم نفس البريد وكلمة المرور الموجودة في Supabase Authentication. إذا كان Confirm Email مفعّلًا، يجب تأكيد البريد أولًا.

## 4) المزامنة
بعد نجاح تسجيل الدخول من Admin، أي تعديل يتم حفظه في Supabase ويظهر للأجهزة الأخرى عند إعادة فتح الموقع، والأجهزة المفتوحة تتلقى التحديثات عبر المزامنة الدورية.

> لا تضع Service Role Key في ملفات الموقع. استخدم Publishable/Anon Key فقط في الواجهة.
