# БудМат Кагарлик — Website

Комерційний сайт компанії з продажу будівельних матеріалів та послуг спецтехніки.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **ESLint + Prettier**

## Getting Started

### 1. Встановіть залежності

```bash
npm install
```

### 2. Запустіть dev-сервер

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) — автоматично перенаправить на `/uk`.

### 3. Build для продакшену

```bash
npm run build
npm start
```

## Структура проєкту

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Локалізовані маршрути (/uk, /ru)
│   └── globals.css
├── components/
│   ├── sections/           # Секції сторінки
│   ├── shared/             # Header, Footer, SearchBar, CatalogClient
│   └── ui/                 # Атомарні UI-компоненти
├── data/                   # TypeScript-файли з даними (без бекенду)
├── lib/
│   ├── i18n/               # Словники та конфіг локалізації
│   └── repositories/       # Шар доступу до даних (готовий до API)
├── types/                  # TypeScript типи
├── constants/              # Константи
└── utils/                  # Утиліти (cn, formatPrice)
```

## Мови

- **Українська** (`/uk`) — мова за замовчуванням
- **Російська** (`/ru`)

## Як додати товар

Відкрийте `src/data/products.ts` і додайте новий об'єкт у масив `products`:

```typescript
{
  id: 'unique-id',
  category: 'cement',          // з ProductCategory
  name: { uk: '...', ru: '...' },
  price: 200,
  unit: { uk: 'мішок 25 кг', ru: 'мешок 25 кг' },
  description: { uk: '...', ru: '...' },
  applications: { uk: ['...'], ru: ['...'] },
  features: { uk: ['...'], ru: ['...'] },
  image: 'https://...',
  status: 'available',         // 'available' | 'order' | 'hidden'
}
```

## Як додати техніку

Відкрийте `src/data/equipment.ts` і додайте новий об'єкт у масив `equipment`.

## Як додати мову (English)

1. Створіть `src/lib/i18n/dictionaries/en.ts` за зразком `uk.ts`
2. Додайте `'en'` до `locales` у `src/lib/i18n/config.ts`
3. Додайте `en` до `dictionaries` у `src/lib/i18n/getDictionary.ts`
4. Оновіть `LocaleSwitcher` при потребі

## Підключення бекенду в майбутньому

Всі запити до даних ізольовані у `src/lib/repositories/`. Щоб підключити API:

```typescript
// products.repository.ts — замінити імпорт
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch('https://api.yoursite.com/products')
  return res.json()
}
```

Компоненти не потребують жодних змін.

## Контакти для налаштування

- Телефони: редагуйте `src/data/contacts.ts`
- Адреса та графік: там же
- SEO метадані: `src/app/[locale]/layout.tsx`
- Назва сайту та домен: `src/app/sitemap.ts` + `public/robots.txt`
