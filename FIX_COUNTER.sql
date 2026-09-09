-- إصلاح تاريخ بداية العداد في Supabase
-- نفّذ هذا الملف مرة واحدة في SQL Editor.

-- يجعل الموقع يأخذ أحدث سجل إعدادات فقط.
UPDATE public.site_settings
SET start_date = '2026-09-04T00:00:00+03:00',
    updated_at = now();

-- تحقق من القيمة الفعلية بعد التعديل
SELECT id, start_date, updated_at
FROM public.site_settings
ORDER BY updated_at DESC;
