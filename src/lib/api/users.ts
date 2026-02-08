import { supabase } from "../supabase";
import type { Profile, UpdateProfileDTO } from "../types";

// ============================================
// PERFIL DO USUÁRIO
// ============================================

/**
 * Busca perfil do usuário
 */
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Atualiza perfil do usuário
 */
export async function updateProfile(userId: string, dto: UpdateProfileDTO) {
  const { data, error } = await supabase
    .from("profiles")
    .update(dto)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Busca usuário atual com perfil
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado");
  }

  const profile = await getProfile(user.id);

  return {
    ...user,
    profile,
  };
}
