# ImobApp - Sistema de Gestão Imobiliária

Sistema completo para gestão de leads e imóveis para corretores e imobiliárias.

## 🚀 Configuração Rápida

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em Settings > API e copie:
   - Project URL
   - Anon public key

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`
2. Preencha com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Criar Tabelas no Supabase

Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT CHECK (role IN ('agent', 'agency')) NOT NULL,
  photo_url TEXT,
  agency_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de leads
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT CHECK (source IN ('manual', 'whatsapp', 'referral', 'website', 'other')) NOT NULL,
  status TEXT CHECK (status IN ('cold', 'warm', 'hot')) NOT NULL,
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de imóveis
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sale_price NUMERIC NOT NULL,
  appraisal_value NUMERIC,
  address TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  parking_spaces INTEGER NOT NULL,
  built_area NUMERIC NOT NULL,
  total_area NUMERIC NOT NULL,
  benefits TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('available', 'reserved', 'sold')) NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabelas para logs de publicação (opcional)
CREATE TABLE publishing_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  platforms TEXT[] NOT NULL,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE publishing_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  message TEXT NOT NULL,
  ad_id TEXT,
  ad_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_results ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas de segurança para leads
CREATE POLICY "Agents can view own leads" ON leads
  FOR SELECT USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own leads" ON leads
  FOR UPDATE USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete own leads" ON leads
  FOR DELETE USING (auth.uid() = agent_id);

-- Políticas de segurança para properties
CREATE POLICY "Owners can view own properties" ON properties
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own properties" ON properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own properties" ON properties
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own properties" ON properties
  FOR DELETE USING (auth.uid() = owner_id);

-- Políticas para logs de publicação
CREATE POLICY "Owners can view publishing logs" ON publishing_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = publishing_logs.property_id 
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can insert publishing logs" ON publishing_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = publishing_logs.property_id 
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can view publishing results" ON publishing_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = publishing_results.property_id 
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can insert publishing results" ON publishing_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = publishing_results.property_id 
      AND properties.owner_id = auth.uid()
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Instalar e Executar

```bash
npm install
npm run dev
```

## 🔧 Solução de Problemas

### Erro "Failed to fetch" no cadastro de leads

Se você encontrar este erro, verifique:

1. **Variáveis de ambiente**: Certifique-se de que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas corretamente no arquivo `.env`

2. **Tabelas criadas**: Execute todos os comandos SQL acima no editor SQL do Supabase

3. **Políticas RLS**: Verifique se as políticas de Row Level Security foram criadas corretamente

4. **Autenticação**: Certifique-se de que o usuário está logado antes de tentar criar leads

5. **Campos obrigatórios**: Todos os campos marcados com * são obrigatórios:
   - Nome (mínimo 2 caracteres)
   - Email (formato válido)
   - Telefone (10-11 dígitos)
   - Origem
   - Status

### Verificar conexão com Supabase

Abra o console do navegador (F12) e verifique se há erros de conexão. O sistema inclui logs detalhados para debug.

## 📱 Funcionalidades

### ✅ Implementado
- **Autenticação real** com Supabase
- **Banco de dados** PostgreSQL
- **Gestão de leads** completa
- **Gestão de imóveis** completa
- **Sistema de usuários** (agentes/imobiliárias)
- **Dashboard** com métricas
- **Publicação de anúncios** (preparado para APIs)
- **Validação de dados** robusta
- **Tratamento de erros** detalhado

### 🔄 Próximos Passos
- Integração com APIs reais (OLX, ZapImóveis, VivaReal)
- Sistema de notificações
- Upload de imagens
- Relatórios avançados
- App mobile

## 🔧 Integrações Futuras

O sistema está preparado para integrar com:
- **OLX API**
- **ZapImóveis API** 
- **VivaReal API**
- **WhatsApp Business API**

## 🚀 Deploy

Para deploy em produção:

1. **Vercel/Netlify**: Deploy automático do frontend
2. **Supabase**: Banco de dados já em produção
3. **Cloudinary/AWS S3**: Para upload de imagens

## 📞 Suporte

Sistema pronto para atender seu cliente! 

Para dúvidas ou customizações, entre em contato.

## 🔐 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Políticas de acesso** restritivas
- **Validação de dados** no frontend e backend
- **Autenticação JWT** via Supabase
- **HTTPS** obrigatório em produção