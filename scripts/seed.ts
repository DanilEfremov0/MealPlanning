import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Usage: npx ts-node scripts/seed.ts <path-to-service-account.json>
const serviceAccountPath = process.argv[2];
if (!serviceAccountPath) {
  console.error('Usage: npx ts-node scripts/seed.ts <service-account.json>');
  process.exit(1);
}

const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(serviceAccountPath), 'utf8')
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const recipes = [
  {
    "id": "bk-01",
    "name": "Овсянка с ягодами",
    "emoji": "🥣",
    "mealType": "breakfast",
    "accentColor": "green",
    "allergens": [
      "gluten",
      "dairy"
    ],
    "calories": 320,
    "prepTime": 10,
    "ingredients": [
      {
        "name": "Овсяные хлопья",
        "amount": "80г",
        "category": "grains"
      },
      {
        "name": "Молоко",
        "amount": "200мл",
        "category": "dairy"
      },
      {
        "name": "Черника",
        "amount": "80г",
        "category": "produce"
      },
      {
        "name": "Мёд",
        "amount": "1 ч.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "bk-02",
    "name": "Яичница с тостами",
    "emoji": "🍳",
    "mealType": "breakfast",
    "accentColor": "orange",
    "allergens": [
      "eggs",
      "gluten"
    ],
    "calories": 380,
    "prepTime": 10,
    "ingredients": [
      {
        "name": "Яйца",
        "amount": "2 шт",
        "category": "protein"
      },
      {
        "name": "Хлеб цельнозерновой",
        "amount": "2 ломтика",
        "category": "grains"
      },
      {
        "name": "Помидор",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Оливковое масло",
        "amount": "1 ч.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "bk-03",
    "name": "Творог с фруктами",
    "emoji": "🧀",
    "mealType": "breakfast",
    "accentColor": "green",
    "allergens": [
      "dairy"
    ],
    "calories": 290,
    "prepTime": 5,
    "ingredients": [
      {
        "name": "Творог 5%",
        "amount": "200г",
        "category": "dairy"
      },
      {
        "name": "Банан",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Мёд",
        "amount": "1 ч.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "bk-04",
    "name": "Омлет с овощами",
    "emoji": "🥚",
    "mealType": "breakfast",
    "accentColor": "orange",
    "allergens": [
      "eggs",
      "dairy"
    ],
    "calories": 340,
    "prepTime": 15,
    "ingredients": [
      {
        "name": "Яйца",
        "amount": "3 шт",
        "category": "protein"
      },
      {
        "name": "Молоко",
        "amount": "50мл",
        "category": "dairy"
      },
      {
        "name": "Болгарский перец",
        "amount": "1/2 шт",
        "category": "produce"
      },
      {
        "name": "Шпинат",
        "amount": "30г",
        "category": "produce"
      }
    ]
  },
  {
    "id": "bk-05",
    "name": "Гречневая каша с маслом",
    "emoji": "🌾",
    "mealType": "breakfast",
    "accentColor": "green",
    "allergens": [],
    "calories": 310,
    "prepTime": 20,
    "ingredients": [
      {
        "name": "Гречневая крупа",
        "amount": "100г",
        "category": "grains"
      },
      {
        "name": "Сливочное масло",
        "amount": "10г",
        "category": "dairy"
      },
      {
        "name": "Соль",
        "amount": "по вкусу",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "bk-06",
    "name": "Мюсли с йогуртом",
    "emoji": "🥗",
    "mealType": "breakfast",
    "accentColor": "purple",
    "allergens": [
      "gluten",
      "dairy",
      "nuts"
    ],
    "calories": 350,
    "prepTime": 5,
    "ingredients": [
      {
        "name": "Мюсли",
        "amount": "60г",
        "category": "grains"
      },
      {
        "name": "Греческий йогурт",
        "amount": "150г",
        "category": "dairy"
      },
      {
        "name": "Клубника",
        "amount": "80г",
        "category": "produce"
      }
    ]
  },
  {
    "id": "bk-07",
    "name": "Сырники со сметаной",
    "emoji": "🥞",
    "mealType": "breakfast",
    "accentColor": "orange",
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "calories": 400,
    "prepTime": 25,
    "ingredients": [
      {
        "name": "Творог",
        "amount": "250г",
        "category": "dairy"
      },
      {
        "name": "Яйцо",
        "amount": "1 шт",
        "category": "protein"
      },
      {
        "name": "Мука",
        "amount": "3 ст.л.",
        "category": "grains"
      },
      {
        "name": "Сметана",
        "amount": "2 ст.л.",
        "category": "dairy"
      }
    ]
  },
  {
    "id": "bk-08",
    "name": "Тост с авокадо",
    "emoji": "🥑",
    "mealType": "breakfast",
    "accentColor": "green",
    "allergens": [
      "gluten"
    ],
    "calories": 330,
    "prepTime": 10,
    "ingredients": [
      {
        "name": "Хлеб ржаной",
        "amount": "2 ломтика",
        "category": "grains"
      },
      {
        "name": "Авокадо",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Лимонный сок",
        "amount": "1 ч.л.",
        "category": "produce"
      },
      {
        "name": "Соль, перец",
        "amount": "по вкусу",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "bk-09",
    "name": "Смузи-боул",
    "emoji": "🫐",
    "mealType": "breakfast",
    "accentColor": "purple",
    "allergens": [
      "nuts"
    ],
    "calories": 280,
    "prepTime": 10,
    "ingredients": [
      {
        "name": "Замороженная черника",
        "amount": "150г",
        "category": "produce"
      },
      {
        "name": "Банан",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Миндальные хлопья",
        "amount": "20г",
        "category": "pantry"
      },
      {
        "name": "Кокосовое молоко",
        "amount": "50мл",
        "category": "dairy"
      }
    ]
  },
  {
    "id": "bk-10",
    "name": "Рисовая каша с тыквой",
    "emoji": "🎃",
    "mealType": "breakfast",
    "accentColor": "orange",
    "allergens": [
      "dairy"
    ],
    "calories": 295,
    "prepTime": 25,
    "ingredients": [
      {
        "name": "Рис круглозернистый",
        "amount": "80г",
        "category": "grains"
      },
      {
        "name": "Тыква",
        "amount": "150г",
        "category": "produce"
      },
      {
        "name": "Молоко",
        "amount": "300мл",
        "category": "dairy"
      },
      {
        "name": "Сахар",
        "amount": "1 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "ln-01",
    "name": "Борщ с говядиной",
    "emoji": "🍲",
    "mealType": "lunch",
    "accentColor": "orange",
    "allergens": [],
    "calories": 450,
    "prepTime": 60,
    "ingredients": [
      {
        "name": "Говядина",
        "amount": "300г",
        "category": "protein"
      },
      {
        "name": "Свёкла",
        "amount": "200г",
        "category": "produce"
      },
      {
        "name": "Капуста",
        "amount": "200г",
        "category": "produce"
      },
      {
        "name": "Картофель",
        "amount": "2 шт",
        "category": "produce"
      },
      {
        "name": "Томатная паста",
        "amount": "2 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "ln-02",
    "name": "Куриный суп с лапшой",
    "emoji": "🍜",
    "mealType": "lunch",
    "accentColor": "green",
    "allergens": [
      "gluten"
    ],
    "calories": 380,
    "prepTime": 40,
    "ingredients": [
      {
        "name": "Куриное филе",
        "amount": "250г",
        "category": "protein"
      },
      {
        "name": "Лапша яичная",
        "amount": "80г",
        "category": "grains"
      },
      {
        "name": "Морковь",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Лук",
        "amount": "1 шт",
        "category": "produce"
      }
    ]
  },
  {
    "id": "ln-03",
    "name": "Салат Цезарь",
    "emoji": "🥗",
    "mealType": "lunch",
    "accentColor": "green",
    "allergens": [
      "gluten",
      "dairy",
      "eggs"
    ],
    "calories": 420,
    "prepTime": 20,
    "ingredients": [
      {
        "name": "Куриное филе",
        "amount": "200г",
        "category": "protein"
      },
      {
        "name": "Романо салат",
        "amount": "150г",
        "category": "produce"
      },
      {
        "name": "Пармезан",
        "amount": "30г",
        "category": "dairy"
      },
      {
        "name": "Сухарики",
        "amount": "40г",
        "category": "grains"
      }
    ]
  },
  {
    "id": "ln-04",
    "name": "Паста Болоньезе",
    "emoji": "🍝",
    "mealType": "lunch",
    "accentColor": "orange",
    "allergens": [
      "gluten"
    ],
    "calories": 520,
    "prepTime": 35,
    "ingredients": [
      {
        "name": "Паста спагетти",
        "amount": "120г",
        "category": "grains"
      },
      {
        "name": "Фарш говяжий",
        "amount": "200г",
        "category": "protein"
      },
      {
        "name": "Томаты в с.с.",
        "amount": "400г",
        "category": "pantry"
      },
      {
        "name": "Лук",
        "amount": "1 шт",
        "category": "produce"
      }
    ]
  },
  {
    "id": "ln-05",
    "name": "Греческий салат",
    "emoji": "🫒",
    "mealType": "lunch",
    "accentColor": "green",
    "allergens": [
      "dairy"
    ],
    "calories": 310,
    "prepTime": 10,
    "ingredients": [
      {
        "name": "Огурцы",
        "amount": "2 шт",
        "category": "produce"
      },
      {
        "name": "Помидоры черри",
        "amount": "150г",
        "category": "produce"
      },
      {
        "name": "Сыр Фета",
        "amount": "80г",
        "category": "dairy"
      },
      {
        "name": "Оливки",
        "amount": "50г",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "ln-06",
    "name": "Рис с курицей и овощами",
    "emoji": "🍛",
    "mealType": "lunch",
    "accentColor": "orange",
    "allergens": [],
    "calories": 480,
    "prepTime": 30,
    "ingredients": [
      {
        "name": "Куриное бедро",
        "amount": "250г",
        "category": "protein"
      },
      {
        "name": "Рис",
        "amount": "100г",
        "category": "grains"
      },
      {
        "name": "Брокколи",
        "amount": "150г",
        "category": "produce"
      },
      {
        "name": "Соевый соус",
        "amount": "2 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "ln-07",
    "name": "Пельмени домашние",
    "emoji": "🥟",
    "mealType": "lunch",
    "accentColor": "purple",
    "allergens": [
      "gluten",
      "eggs"
    ],
    "calories": 490,
    "prepTime": 15,
    "ingredients": [
      {
        "name": "Пельмени",
        "amount": "300г",
        "category": "protein"
      },
      {
        "name": "Сметана",
        "amount": "50г",
        "category": "dairy"
      },
      {
        "name": "Масло сливочное",
        "amount": "10г",
        "category": "dairy"
      }
    ]
  },
  {
    "id": "ln-08",
    "name": "Запечённая рыба с рисом",
    "emoji": "🐟",
    "mealType": "lunch",
    "accentColor": "green",
    "allergens": [
      "seafood"
    ],
    "calories": 410,
    "prepTime": 30,
    "ingredients": [
      {
        "name": "Треска",
        "amount": "250г",
        "category": "protein"
      },
      {
        "name": "Рис",
        "amount": "100г",
        "category": "grains"
      },
      {
        "name": "Лимон",
        "amount": "1/2 шт",
        "category": "produce"
      },
      {
        "name": "Розмарин",
        "amount": "1 веточка",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "ln-09",
    "name": "Тортилья с курицей",
    "emoji": "🌯",
    "mealType": "lunch",
    "accentColor": "orange",
    "allergens": [
      "gluten",
      "dairy"
    ],
    "calories": 460,
    "prepTime": 15,
    "ingredients": [
      {
        "name": "Тортилья",
        "amount": "2 шт",
        "category": "grains"
      },
      {
        "name": "Куриное филе",
        "amount": "200г",
        "category": "protein"
      },
      {
        "name": "Авокадо",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Сметана",
        "amount": "30г",
        "category": "dairy"
      }
    ]
  },
  {
    "id": "ln-10",
    "name": "Чечевичный суп",
    "emoji": "🥣",
    "mealType": "lunch",
    "accentColor": "purple",
    "allergens": [],
    "calories": 360,
    "prepTime": 35,
    "ingredients": [
      {
        "name": "Красная чечевица",
        "amount": "150г",
        "category": "grains"
      },
      {
        "name": "Морковь",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Лук",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Зира",
        "amount": "1/2 ч.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "dn-01",
    "name": "Запечённая курица с картофелем",
    "emoji": "🍗",
    "mealType": "dinner",
    "accentColor": "orange",
    "allergens": [],
    "calories": 540,
    "prepTime": 50,
    "ingredients": [
      {
        "name": "Куриные бёдра",
        "amount": "400г",
        "category": "protein"
      },
      {
        "name": "Картофель",
        "amount": "400г",
        "category": "produce"
      },
      {
        "name": "Чеснок",
        "amount": "3 зубч.",
        "category": "produce"
      },
      {
        "name": "Оливковое масло",
        "amount": "2 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "dn-02",
    "name": "Котлеты с гречкой",
    "emoji": "🍖",
    "mealType": "dinner",
    "accentColor": "orange",
    "allergens": [
      "gluten",
      "eggs"
    ],
    "calories": 510,
    "prepTime": 40,
    "ingredients": [
      {
        "name": "Свиной фарш",
        "amount": "300г",
        "category": "protein"
      },
      {
        "name": "Лук",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Яйцо",
        "amount": "1 шт",
        "category": "protein"
      },
      {
        "name": "Гречневая крупа",
        "amount": "100г",
        "category": "grains"
      }
    ]
  },
  {
    "id": "dn-03",
    "name": "Лосось на гриле",
    "emoji": "🐠",
    "mealType": "dinner",
    "accentColor": "green",
    "allergens": [
      "seafood"
    ],
    "calories": 470,
    "prepTime": 20,
    "ingredients": [
      {
        "name": "Лосось",
        "amount": "250г",
        "category": "protein"
      },
      {
        "name": "Спаржа",
        "amount": "150г",
        "category": "produce"
      },
      {
        "name": "Лимон",
        "amount": "1/2 шт",
        "category": "produce"
      },
      {
        "name": "Оливковое масло",
        "amount": "1 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "dn-04",
    "name": "Тушёная свинина с овощами",
    "emoji": "🥩",
    "mealType": "dinner",
    "accentColor": "orange",
    "allergens": [],
    "calories": 560,
    "prepTime": 55,
    "ingredients": [
      {
        "name": "Свиная шея",
        "amount": "350г",
        "category": "protein"
      },
      {
        "name": "Лук",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Болгарский перец",
        "amount": "2 шт",
        "category": "produce"
      },
      {
        "name": "Томатная паста",
        "amount": "2 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "dn-05",
    "name": "Вок с говядиной",
    "emoji": "🥢",
    "mealType": "dinner",
    "accentColor": "purple",
    "allergens": [
      "soy"
    ],
    "calories": 490,
    "prepTime": 25,
    "ingredients": [
      {
        "name": "Говяжья вырезка",
        "amount": "250г",
        "category": "protein"
      },
      {
        "name": "Лапша рисовая",
        "amount": "100г",
        "category": "grains"
      },
      {
        "name": "Брокколи",
        "amount": "150г",
        "category": "produce"
      },
      {
        "name": "Соевый соус",
        "amount": "3 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "dn-06",
    "name": "Баклажаны с сыром",
    "emoji": "🍆",
    "mealType": "dinner",
    "accentColor": "purple",
    "allergens": [
      "dairy"
    ],
    "calories": 380,
    "prepTime": 35,
    "ingredients": [
      {
        "name": "Баклажан",
        "amount": "2 шт",
        "category": "produce"
      },
      {
        "name": "Сыр Моцарелла",
        "amount": "150г",
        "category": "dairy"
      },
      {
        "name": "Помидоры",
        "amount": "2 шт",
        "category": "produce"
      },
      {
        "name": "Базилик",
        "amount": "10г",
        "category": "produce"
      }
    ]
  },
  {
    "id": "dn-07",
    "name": "Творожная запеканка",
    "emoji": "🥮",
    "mealType": "dinner",
    "accentColor": "green",
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "calories": 390,
    "prepTime": 45,
    "ingredients": [
      {
        "name": "Творог",
        "amount": "400г",
        "category": "dairy"
      },
      {
        "name": "Яйца",
        "amount": "2 шт",
        "category": "protein"
      },
      {
        "name": "Манная крупа",
        "amount": "3 ст.л.",
        "category": "grains"
      },
      {
        "name": "Сахар",
        "amount": "3 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "dn-08",
    "name": "Стейк из тунца",
    "emoji": "🐟",
    "mealType": "dinner",
    "accentColor": "green",
    "allergens": [
      "seafood"
    ],
    "calories": 420,
    "prepTime": 15,
    "ingredients": [
      {
        "name": "Тунец стейк",
        "amount": "250г",
        "category": "protein"
      },
      {
        "name": "Авокадо",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Руккола",
        "amount": "50г",
        "category": "produce"
      },
      {
        "name": "Соевый соус",
        "amount": "1 ст.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "dn-09",
    "name": "Овощное карри с нутом",
    "emoji": "🍛",
    "mealType": "dinner",
    "accentColor": "orange",
    "allergens": [],
    "calories": 410,
    "prepTime": 30,
    "ingredients": [
      {
        "name": "Нут консервированный",
        "amount": "400г",
        "category": "pantry"
      },
      {
        "name": "Кокосовое молоко",
        "amount": "200мл",
        "category": "pantry"
      },
      {
        "name": "Шпинат",
        "amount": "100г",
        "category": "produce"
      },
      {
        "name": "Карри-порошок",
        "amount": "2 ч.л.",
        "category": "pantry"
      }
    ]
  },
  {
    "id": "dn-10",
    "name": "Куриный шашлык с овощами",
    "emoji": "🍢",
    "mealType": "dinner",
    "accentColor": "green",
    "allergens": [],
    "calories": 430,
    "prepTime": 30,
    "ingredients": [
      {
        "name": "Куриное филе",
        "amount": "300г",
        "category": "protein"
      },
      {
        "name": "Цукини",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Болгарский перец",
        "amount": "1 шт",
        "category": "produce"
      },
      {
        "name": "Лимонный сок",
        "amount": "2 ст.л.",
        "category": "produce"
      }
    ]
  }
];

async function seed() {
  console.log(`Seeding ${recipes.length} recipes...`);
  const batch = db.batch();
  for (const r of recipes) {
    const ref = db.collection('recipes').doc(r.id);
    batch.set(ref, r);
  }
  await batch.commit();
  console.log('Done! Recipes seeded successfully.');
}

seed().catch(console.error);
