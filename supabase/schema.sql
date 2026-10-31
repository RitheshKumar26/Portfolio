-- ========================================================
-- CYBERSECURITY PORTFOLIO DATABASE SCHEMA (SUPABASE POSTGRES)
-- ========================================================

-- 1. Create Certificates Table
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  code text not null,
  issuer text not null,
  issue_date text not null,
  expiry_date text not null default 'Non-Expiring',
  credential_id text not null,
  verification_url text not null,
  sha256 text,
  skills text[] default '{}',
  badge_image_url text,
  display_order int default 0,
  is_active boolean default true
);

-- 2. Create Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  category text default 'Offensive Security',
  image_url text,
  github_url text,
  demo_url text,
  technologies text[] default '{}',
  display_order int default 0,
  is_published boolean default true
);

-- 3. Create Contact Messages Table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  message text not null,
  status text default 'unread'
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

alter table public.certificates enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;

-- Certificates Policies:
-- Anyone can view active certificates
create policy "Public can read active certificates"
  on public.certificates for select
  using (is_active = true);

-- Authenticated admins have full CRUD access to certificates
create policy "Admin full access to certificates"
  on public.certificates for all
  using (auth.role() = 'authenticated');

-- Projects Policies:
-- Anyone can view published projects
create policy "Public can read published projects"
  on public.projects for select
  using (is_published = true);

-- Authenticated admins have full CRUD access to projects
create policy "Admin full access to projects"
  on public.projects for all
  using (auth.role() = 'authenticated');

-- Contact Messages Policies:
-- Public can submit messages via contact form
create policy "Anyone can submit contact message"
  on public.contact_messages for insert
  with check (true);

-- Only authenticated admin can view and delete messages
create policy "Admin can read contact messages"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');

create policy "Admin can delete contact messages"
  on public.contact_messages for delete
  using (auth.role() = 'authenticated');

-- ========================================================
-- STORAGE BUCKET FOR ASSETS
-- ========================================================

-- Insert storage bucket for public portfolio assets (if not exists)
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- Public can view/read uploaded images
create policy "Public read bucket assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

-- Admin can upload, update, delete images
create policy "Admin can upload assets"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "Admin can update assets"
  on storage.objects for update
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "Admin can delete assets"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

-- ========================================================
-- SEED INITIAL DATA
-- ========================================================

insert into public.certificates (name, code, issuer, issue_date, expiry_date, credential_id, verification_url, sha256, skills, display_order)
values
  ('CompTIA Security+', 'SY0-701', 'CompTIA', '2024', '2027', 'COMP001021948', 'https://www.credly.com/', '9a3f7b2c0184e921d782bc4e5f019a28c34512e088ba7610', array['Network Security', 'Threat Hunting', 'Vulnerability Mgmt', 'Cryptography'], 1),
  ('eJPTv2 - Junior Penetration Tester', 'eJPTv2', 'INE Security', '2024', 'Non-Expiring', 'INE-EJPT-849201', 'https://www.ine.com/', '8b12f734a991c0e8234db0299f1283e7456bc91001dfa234', array['Network Reconnaissance', 'Host Auditing', 'Exploitation', 'Web App Pentesting'], 2),
  ('Certified Ethical Hacker (CEH)', 'v12', 'EC-Council', '2024', '2027', 'ECC-91823746', 'https://aspen.eccouncil.org/Verify', 'c4981d0092fa8b12e45609312bc88190de4568912301fa77', array['Attack Surface Analysis', 'Malware Analysis', 'Sniffing & Evasion', 'System Hacking'], 3),
  ('Google Cybersecurity Professional', 'GCP-SEC', 'Google', '2023', 'Non-Expiring', 'GCP-SEC-582910', 'https://www.coursera.org/verify/', '14f09238bc8901de78234bc5678912ef0129384756abcdef', array['SIEM & Packet Analysis', 'Python & Bash', 'Linux Security', 'Incident Response'], 4)
on conflict do nothing;

insert into public.projects (title, description, category, github_url, demo_url, technologies, display_order, is_published)
values
  ('Web Application Security Assessment', 'Simulated black-box penetration test against vulnerable web environment identifying critical OWASP Top 10 vulnerabilities.', 'Penetration Testing', 'https://github.com/Najmudeen-cs', 'https://project1-demo.com', array['Burp Suite', 'SQLmap', 'Nmap', 'OWASP ZAP'], 1, true),
  ('Encrypted File Vault', 'Secure file storage solution implementing AES-256-GCM encryption with zero-knowledge key derivation and integrity validation.', 'Cryptography & Defense', 'https://github.com/Najmudeen-cs', 'https://project2-demo.com', array['Python', 'AES-256', 'PBKDF2', 'OpenSSL'], 2, true)
on conflict do nothing;
