import { get } from "@/lib/api";

export type Profession = {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
};

export type ProfessionSub = {
  id: string;
  profession_id: string;
  name: string;
};

export type Dream = {
  id: string;
  name: string;
  cost: number;
  description?: string | null;
  icon?: string | null;
  profession_id?: string | null;
  min_pesa_points: number;
  is_active: boolean;
  sort_order: number;
};

export type AssetCard = {
  id: string;
  name: string;
  purchase_cost: number;
  profit_per_return: number;
  max_returns: number;
  description?: string | null;
  visual_url?: string | null;
};

export type SpendingCard = {
  id: string;
  name: string;
  total_cost: number;
  line_items: Record<string, number>;
};

export type SavingsCard = {
  id: string;
  name: string;
  description: string;
  save_threshold: number;
  bonus_if_met: number;
  bonus_condition?: string;
  threshold_operator?: "greater_than" | "equals" | "greater_than_or_equal";
  bonus_condition_value?: number | string;
  bonus_condition_text?: string;
};

export type PlayingCard = {
  id: string;
  label: string;
  delta: number;
  type: string;
  description?: string | null;
  weight: number;
};

export type QAItem = {
  id: string;
  profession_id?: string | null;
  question: string;
  options: { choices: string[]; answer: number };
  explanation?: string | null;
  points_reward: number;
  difficulty?: string | null;
};

export type ShopApiItem = {
  id: string;
  name: string;
  category: string;
  price_pesa: number;
  price_real?: string | null;
  rarity?: string | null;
  visual_url?: string | null;
  is_limited_edition?: boolean;
  expires_at?: string | null;
};

export function listProfessions(): Promise<Profession[]> {
  return get<Profession[]>("/api/professions");
}

export function listProfessionSubs(professionId: string): Promise<ProfessionSub[]> {
  return get<ProfessionSub[]>(`/api/professions/${professionId}/subs`);
}

export function listDreams(params?: { professionId?: string; minPoints?: number }): Promise<Dream[]> {
  const qs = new URLSearchParams();
  if (params?.professionId) qs.set("professionId", params.professionId);
  if (typeof params?.minPoints === "number") qs.set("minPoints", String(params.minPoints));
  const query = qs.toString();
  return get<Dream[]>(`/api/dreams${query ? `?${query}` : ""}`);
}

export function listAssets(): Promise<AssetCard[]> {
  return get<AssetCard[]>("/api/assets");
}

export function listSpendingCards(): Promise<SpendingCard[]> {
  return get<SpendingCard[]>("/api/cards/spending");
}

export function listSavingsCards(): Promise<SavingsCard[]> {
  return get<SavingsCard[]>("/api/cards/savings");
}

export function listPlayingCards(): Promise<PlayingCard[]> {
  return get<PlayingCard[]>("/api/cards/playing");
}

export function listQA(params?: { professionId?: string; difficulty?: string; limit?: number }): Promise<QAItem[]> {
  const qs = new URLSearchParams();
  if (params?.professionId) qs.set("professionId", params.professionId);
  if (params?.difficulty) qs.set("difficulty", params.difficulty);
  if (typeof params?.limit === "number") qs.set("limit", String(params.limit));
  const query = qs.toString();
  return get<QAItem[]>(`/api/qa${query ? `?${query}` : ""}`);
}

export function listShop(params?: { category?: string; rarity?: string }): Promise<ShopApiItem[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.rarity) qs.set("rarity", params.rarity);
  const query = qs.toString();
  return get<ShopApiItem[]>(`/api/shop${query ? `?${query}` : ""}`);
}
