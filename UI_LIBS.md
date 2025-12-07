# UI kütüphaneleri (kurulu)

- Radix UI çekirdeği: `@radix-ui/react-slot`, `react-dialog`, `react-popover`, `react-tooltip`, `react-separator`, `react-label`, `react-toast`
- Yardımcılar: `class-variance-authority`, `tailwind-merge`
- İkonlar: `lucide-react` (mevcut)
- Hareket: `framer-motion` (mevcut)

Kullanım başlangıcı:
- Sınıf birleştirme: `cn` helper → `src/lib/cn.ts`
- Dialog/Popover/Tooltip bileşenleri için Radix API’lerini kullanabilirsiniz; istersen shadcn stilindeki sarmalayıcıları ekleyebiliriz.

Ek not:
- Preview için: `npm run build` ardından `npm run preview -- --host --port 4173`

