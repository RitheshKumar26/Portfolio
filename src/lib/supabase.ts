import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Fallback dummy URL so createClient doesn't throw on startup if env isn't filled yet
const safeUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const safeKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(safeUrl, safeKey);

export interface DBCertificate {
  id: string;
  name: string;
  code: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  credential_id: string;
  verification_url: string;
  sha256?: string;
  skills: string[];
  badge_image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface DBProject {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
  technologies: string[];
  display_order: number;
  is_published: boolean;
  created_at?: string;
}

export interface DBContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}

// ==========================================
// CERTIFICATE CRUD
// ==========================================

export async function fetchCertificates(): Promise<DBCertificate[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.warn('Supabase fetch certificates error:', error.message);
    return [];
  }
  return data || [];
}

export async function saveCertificate(cert: Partial<DBCertificate>): Promise<{ data: any; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  if (cert.id) {
    return await supabase
      .from('certificates')
      .update(cert)
      .eq('id', cert.id)
      .select()
      .single();
  } else {
    return await supabase
      .from('certificates')
      .insert([cert])
      .select()
      .single();
  }
}

export async function deleteCertificate(id: string): Promise<{ error: any }> {
  if (!isSupabaseConfigured) return { error: null };
  return await supabase
    .from('certificates')
    .delete()
    .eq('id', id);
}

// ==========================================
// PROJECT CRUD
// ==========================================

export async function fetchProjects(): Promise<DBProject[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.warn('Supabase fetch projects error:', error.message);
    return [];
  }
  return data || [];
}

export async function saveProject(project: Partial<DBProject>): Promise<{ data: any; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  if (project.id) {
    return await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id)
      .select()
      .single();
  } else {
    return await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
  }
}

export async function deleteProject(id: string): Promise<{ error: any }> {
  if (!isSupabaseConfigured) return { error: null };
  return await supabase
    .from('projects')
    .delete()
    .eq('id', id);
}

// ==========================================
// CONTACT MESSAGES
// ==========================================

export async function fetchContactMessages(): Promise<DBContactMessage[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase fetch messages error:', error.message);
    return [];
  }
  return data || [];
}

export async function deleteContactMessage(id: string): Promise<{ error: any }> {
  if (!isSupabaseConfigured) return { error: null };
  return await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);
}

export async function recordContactMessage(name: string, email: string, message: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('contact_messages').insert([{ name, email, message }]);
  } catch (err) {
    console.warn('Could not record message in Supabase:', err);
  }
}

// ==========================================
// ASSET UPLOAD
// ==========================================

export async function uploadAsset(file: File, folder = 'uploads'): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio-assets')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Storage upload error:', uploadError.message);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('portfolio-assets')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
