# Stage 05 — Backend Notes

## Status: ✅ Complete (Firebase config + seed script ready)

## Firebase Project Setup
1. Create project at https://console.firebase.google.com
2. Enable Firestore (Native mode)
3. Enable Firebase Analytics (GA4)
4. Copy config to .env (see .env.example)

## Firestore Collections

### recipes/{recipeId}
Read-only from clients. Schema:
```
{
  id: string           // e.g. "bk-01"
  name: string         // Russian name
  emoji: string
  mealType: "breakfast" | "lunch" | "dinner"
  accentColor: "green" | "orange" | "purple"
  allergens: string[]  // ["gluten","dairy",...]
  calories: number
  prepTime: number     // minutes
  ingredients: [{ name, amount, category }]
}
```

### userSettings/{sessionId}
Optional — reserved for future use (saved preferences, sync).
Currently not written by the app (schedule in localStorage).

## Security Rules
See firestore.rules:
- recipes: public read, no client writes
- userSettings: open read/write (no auth in MVP)

## Seeding 30 Recipes
```bash
npm install -g ts-node firebase-admin
npx ts-node scripts/seed.ts path/to/service-account.json
```

Recipe distribution:
- Breakfast (10): овсянка, яичница, творог, омлет, гречка, мюсли, сырники, тост с авокадо, смузи-боул, рисовая каша
- Lunch (10): борщ, куриный суп, цезарь, болоньезе, греческий салат, рис с курицей, пельмени, рыба, тортилья, чечевичный суп
- Dinner (10): курица, котлеты, лосось, свинина, вок, баклажаны, запеканка, стейк из тунца, карри, шашлык

## Allergen Coverage
Allergen → recipes excluded:
- gluten: bk-01,02,06,07,08 / ln-02,03,04,07,09 / dn-02,07
- dairy: bk-01,03,04,06,07,10 / ln-03,05,07,09 / dn-04,06,07  
- nuts: bk-06,09
- eggs: bk-02,04,07 / ln-03,07 / dn-02,07
- seafood: ln-08 / dn-03,08
- soy: dn-05,08

With all 6 allergens excluded: 9 recipes remain (safe for all)
