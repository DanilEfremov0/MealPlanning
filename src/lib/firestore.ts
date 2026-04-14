import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Recipe, AllergenKey } from '../types';

export async function fetchRecipes(excludeAllergens: AllergenKey[] = []): Promise<Recipe[]> {
  const col = collection(db, 'recipes');
  const snap = await getDocs(query(col));
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
  if (excludeAllergens.length === 0) return all;
  return all.filter(r =>
    !r.allergens.some(a => excludeAllergens.includes(a))
  );
}
