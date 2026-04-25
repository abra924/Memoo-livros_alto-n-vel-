# Configuração do Supabase para Memoo Livros

Para que a funcionalidade de perfil e gestão de conteúdo funcione corretamente, precisas de executar o seguinte código no **SQL Editor** do teu painel do Supabase.

## 1. Tabela de Perfis (Profiles)
Esta tabela guarda as informações adicionais dos utilizadores.

```sql
-- Criar a tabela de perfis
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  photo_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS (Row Level Security)
alter table profiles enable row level security;

-- Política: Utilizadores podem ver qualquer perfil (opcional, ou apenas o seu)
create policy "Perfis são visíveis por todos" on profiles
  for select using (true);

-- Política: Utilizadores podem atualizar o seu próprio perfil
create policy "Utilizadores podem atualizar o próprio perfil" on profiles
  for update using (auth.uid() = id);

-- Política: Utilizadores podem inserir o seu próprio perfil
create policy "Utilizadores podem inserir o próprio perfil" on profiles
  for insert with check (auth.uid() = id);

-- 1.1 Automação: Criar perfil automaticamente no registo
-- Executa isto para garantir que todos os utilizadores apareçam no painel admin
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, photo_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 2. Bucket de Armazenamento (Storage)
Certifica-te de que criaste um Bucket chamado **`content`** no teu Storage do Supabase e que ele é **Público**.

### Políticas de Storage para o bucket `content`:
Executa isto se quiseres permitir que utilizadores autenticados carreguem ficheiros (como fotos de perfil na pasta `avatars/`):

```sql
-- Permitir acesso público de leitura
create policy "Acesso público de leitura" on storage.objects
  for select using (bucket_id = 'content');

-- Permitir que utilizadores autenticados carreguem ficheiros para a pasta avatars/
create policy "Utilizadores podem carregar avatares" on storage.objects
  for insert with check (
    bucket_id = 'content' AND 
    (storage.foldername(name))[1] = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- Permitir que o Admin (tu) carregue qualquer conteúdo
create policy "Admin pode carregar tudo" on storage.objects
  for insert with check (
    bucket_id = 'content' AND 
    auth.email() = 'abraaomatondo118@gmail.com'
  );
```

## 3. Tabela de Configuração (Config)
Usada para o Google Analytics ID.

```sql
create table config (
  id text primary key,
  measurementId text,
  logo_url text,
  favicon_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS
alter table config enable row level security;

-- Permitir leitura pública
create policy "Config é pública" on config for select using (true);

-- Permitir que apenas o Admin atualize
create policy "Apenas admin atualiza config" on config
  for all using (auth.email() = 'abraaomatondo118@gmail.com');
```

## 4. Tabela de Produtos (Products)
```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  title text not null,
  author text,
  category text,
  price numeric default 0,
  currency text default 'AOA',
  description text,
  type text, -- 'ebook', 'music', 'image'
  cover_url text,
  file_url text,
  additional_images text[] default '{}'
);

alter table products enable row level security;
create policy "Produtos visíveis por todos" on products for select using (true);
create policy "Apenas admin gere produtos" on products for all using (auth.email() = 'abraaomatondo118@gmail.com');
```

## 5. Tabela de Biblioteca (Library)
```sql
create table library (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  product_id uuid references products on delete cascade,
  purchased_at timestamp with time zone default timezone('utc'::text, now())
);

alter table library enable row level security;
create policy "Utilizadores veem a própria biblioteca" on library for select using (auth.uid() = user_id);
create policy "Sistema/Admin gere biblioteca" on library for all using (auth.uid() = user_id OR auth.email() = 'abraaomatondo118@gmail.com');

-- 6. Tabela de Notificações (Notifications)
create table notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade, -- Nulo para notificações globais
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table notifications enable row level security;

-- Utilizadores podem ver as suas notificações e as globais
create policy "Utilizadores veem as suas notificações" on notifications
  for select using (user_id is null or auth.uid() = user_id);

-- Utilizadores podem marcar as suas notificações como lidas
create policy "Utilizadores podem atualizar as suas notificações" on notifications
  for update using (auth.uid() = user_id);

-- Apenas o Admin pode inserir notificações
create policy "Admin insere notificações" on notifications
  for insert with check (auth.email() = 'abraaomatondo118@gmail.com');

-- 7. Tabela de Newsletter
create table newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table newsletter_subscribers enable row level security;
create policy "Qualquer um pode subscrever" on newsletter_subscribers for insert with check (true);
create policy "Apenas admin vê subscritores" on newsletter_subscribers for select using (auth.email() = 'abraaomatondo118@gmail.com');

-- 8. Tabela de Lista de Desejos (Wishlist)
create table wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

alter table wishlist enable row level security;

-- Política: Utilizadores veem apenas a sua própria lista
create policy "Utilizadores veem a própria wishlist" on wishlist
  for select using (auth.uid() = user_id);

-- Política: Utilizadores podem adicionar à sua própria lista
create policy "Utilizadores podem adicionar à própria wishlist" on wishlist
  for insert with check (auth.uid() = user_id);

-- Política: Utilizadores podem apagar da sua própria lista
create policy "Utilizadores podem apagar da própria wishlist" on wishlist
  for delete using (auth.uid() = user_id);

-- 9. Tabela de Banners (Destaques da Homepage)
create table banners (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  image_url text not null,
  button_text text,
  button_link text,
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table banners enable row level security;
create policy "Banners são públicos" on banners for select using (true);
create policy "Apenas admin gere banners" on banners for all using (auth.email() = 'abraaomatondo118@gmail.com');

-- 10. Tabela de Afiliados e Referências
create table referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references profiles(id),
  referred_user_id uuid references profiles(id),
  status text default 'pending', -- 'pending', 'completed' (se comprou algo)
  reward_issued boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Adicionar coluna de referrer às ordens de WhatsApp para rastreio
alter table whatsapp_orders add column if not exists referrer_id uuid references profiles(id);

alter table referrals enable row level security;
create policy "Utilizadores veem os seus referidos" on referrals for select using (auth.uid() = referrer_id);
create policy "Qualquer um pode inserir referência" on referrals for insert with check (true);

-- 11. Tabela de Anúncios (Ads & Afiliados)
create table ads (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null, -- 'banner', 'affiliate', 'adsense'
  content text not null, -- URL da imagem ou código AdSense
  link_url text, -- URL de destino (apenas para banners)
  placement text default 'sidebar', -- 'sidebar', 'top', 'bottom', 'popup'
  page_target text default 'all', -- 'home', 'books', 'music', 'digital', 'audiobooks', 'product', 'all'
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table ads enable row level security;
create policy "Anúncios são públicos" on ads for select using (true);
create policy "Apenas admin gere anúncios" on ads for all using (auth.email() = 'abraaomatondo118@gmail.com');
```
