# Guia: Conectar Domínio www.espelhoai.com.br (Hostinger) ao ESPELHO AI

Este guia explica passo a passo como conectar seu domínio **www.espelhoai.com.br** hospedado na **Hostinger** ao aplicativo ESPELHO AI hospedado na plataforma Manus.

---

## 📋 Pré-requisitos

- Domínio **espelhoai.com.br** registrado e ativo na Hostinger
- Acesso ao painel de controle da Hostinger (hPanel)
- Acesso ao painel de gerenciamento do projeto Manus
- URL atual do app: `https://descubraeu-c4seynyh.manus.space`

---

## 🎯 Objetivo

Fazer com que usuários acessem o ESPELHO AI através de:
- **www.espelhoai.com.br** (preferencial)
- **espelhoai.com.br** (redireciona para www)

---

## 📝 Passo 1: Configurar DNS na Hostinger

### 1.1. Acessar o Painel DNS

1. Faça login no **hPanel da Hostinger**: https://hpanel.hostinger.com
2. No menu lateral, clique em **"Domínios"**
3. Localize o domínio **espelhoai.com.br**
4. Clique no botão **"Gerenciar"** ao lado do domínio
5. Role até a seção **"DNS / Nameservers"**
6. Clique em **"Gerenciar registros DNS"**

### 1.2. Adicionar Registros DNS

Você precisará adicionar 2 registros DNS:

#### Registro 1: CNAME para www

| Campo | Valor |
|-------|-------|
| **Tipo** | CNAME |
| **Nome** | www |
| **Aponta para** | descubraeu-c4seynyh.manus.space |
| **TTL** | 3600 (ou deixar padrão) |

**Como adicionar:**
1. Clique no botão **"Adicionar registro"**
2. Selecione **"CNAME"** no tipo
3. Em "Nome", digite: `www`
4. Em "Aponta para" ou "Target", digite: `descubraeu-c4seynyh.manus.space`
5. Clique em **"Adicionar"** ou **"Salvar"**

#### Registro 2: CNAME para domínio raiz (opcional)

| Campo | Valor |
|-------|-------|
| **Tipo** | CNAME |
| **Nome** | @ (ou deixe vazio) |
| **Aponta para** | descubraeu-c4seynyh.manus.space |
| **TTL** | 3600 (ou deixar padrão) |

**Nota:** Alguns provedores DNS não permitem CNAME no domínio raiz. Se a Hostinger não permitir, use um registro **A** apontando para o IP do servidor Manus (você precisará solicitar o IP ao suporte Manus).

**Alternativa com redirecionamento:**
Se CNAME no raiz não funcionar, configure um **redirecionamento 301** de `espelhoai.com.br` para `www.espelhoai.com.br` no painel da Hostinger:
1. Vá em **"Domínios"** → **"Redirecionamentos"**
2. Adicione redirecionamento de `espelhoai.com.br` para `https://www.espelhoai.com.br`
3. Tipo: **301 (Permanente)**

---

## 🖥️ Passo 2: Configurar Domínio Personalizado no Painel Manus

### 2.1. Acessar Configurações do Projeto

1. Acesse o painel do projeto ESPELHO AI na plataforma Manus
2. Clique no ícone de **"Management UI"** (painel direito)
3. No menu lateral, vá em **"Settings"** (Configurações)
4. Clique em **"Domains"** (Domínios)

### 2.2. Adicionar Domínio Personalizado

1. Clique no botão **"Add Custom Domain"** ou **"Adicionar Domínio"**
2. Digite: `www.espelhoai.com.br`
3. Clique em **"Add"** ou **"Adicionar"**
4. O sistema verificará a configuração DNS automaticamente

### 2.3. Aguardar Verificação

- A plataforma Manus verificará se o registro DNS está configurado corretamente
- Isso pode levar de **alguns minutos a 48 horas** (tempo de propagação DNS)
- Status aparecerá como:
  - ⏳ **"Pending"** (Pendente) - Aguardando propagação DNS
  - ✅ **"Active"** (Ativo) - Domínio conectado com sucesso
  - ❌ **"Error"** (Erro) - Verificar configuração DNS

### 2.4. Certificado SSL Automático

- Após verificação bem-sucedida, a Manus gerará automaticamente um **certificado SSL gratuito** (Let's Encrypt)
- Seu site ficará acessível via **HTTPS** (seguro)
- Isso pode levar alguns minutos adicionais

---

## ⏱️ Passo 3: Aguardar Propagação DNS

### Tempo de Propagação

- **Mínimo:** 15 minutos a 2 horas
- **Máximo:** até 48 horas (raro)
- **Média:** 4 a 6 horas

### Como Verificar a Propagação

Você pode verificar se o DNS está propagado usando ferramentas online:

1. **DNS Checker:** https://dnschecker.org
   - Digite: `www.espelhoai.com.br`
   - Tipo: CNAME
   - Clique em "Search"
   - Verifique se aponta para `descubraeu-c4seynyh.manus.space`

2. **What's My DNS:** https://www.whatsmydns.net
   - Digite: `www.espelhoai.com.br`
   - Tipo: CNAME
   - Verifique propagação global

3. **Via Terminal (Linux/Mac):**
   ```bash
   dig www.espelhoai.com.br CNAME
   ```
   ou
   ```bash
   nslookup www.espelhoai.com.br
   ```

---

## ✅ Passo 4: Testar o Domínio

Após propagação DNS completa:

1. Abra o navegador em **modo anônimo/privado** (para evitar cache)
2. Acesse: **https://www.espelhoai.com.br**
3. Verifique se o site ESPELHO AI carrega corretamente
4. Teste também: **https://espelhoai.com.br** (deve redirecionar para www)

### Checklist de Testes

- [ ] Site carrega em `https://www.espelhoai.com.br`
- [ ] Certificado SSL ativo (cadeado verde no navegador)
- [ ] Login funciona normalmente
- [ ] Geração de imagens funciona
- [ ] Sistema de créditos funciona
- [ ] Pagamentos Stripe funcionam (URLs de retorno corretas)

---

## 🔧 Passo 5: Atualizar URLs de Retorno do Stripe (Importante!)

Após domínio ativo, você precisa atualizar as URLs de retorno do Stripe:

### 5.1. Acessar Dashboard Stripe

1. Acesse: https://dashboard.stripe.com
2. Faça login com suas credenciais
3. Certifique-se de estar no modo **"Test"** (canto superior direito)

### 5.2. Atualizar URLs de Redirecionamento

1. Vá em **"Settings"** (Configurações) → **"Checkout settings"**
2. Em **"Success URL"**, atualize para:
   ```
   https://www.espelhoai.com.br/planos?success=true&session_id={CHECKOUT_SESSION_ID}
   ```
3. Em **"Cancel URL"**, atualize para:
   ```
   https://www.espelhoai.com.br/planos?canceled=true
   ```
4. Clique em **"Save"**

### 5.3. Configurar Webhook

1. No Dashboard Stripe, vá em **"Developers"** → **"Webhooks"**
2. Clique em **"Add endpoint"**
3. Em **"Endpoint URL"**, digite:
   ```
   https://www.espelhoai.com.br/api/webhooks/stripe
   ```
4. Em **"Events to send"**, selecione:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Clique em **"Add endpoint"**
6. **Copie o "Signing secret"** (começa com `whsec_...`)
7. Atualize a variável de ambiente `STRIPE_WEBHOOK_SECRET` no painel Manus com este valor

---

## 🚨 Solução de Problemas

### Problema 1: "DNS_PROBE_FINISHED_NXDOMAIN"

**Causa:** DNS ainda não propagou ou está configurado incorretamente

**Solução:**
1. Verifique se os registros DNS foram salvos corretamente na Hostinger
2. Aguarde mais tempo (até 48h)
3. Limpe o cache DNS do seu computador:
   - **Windows:** `ipconfig /flushdns`
   - **Mac:** `sudo dscacheutil -flushcache`
   - **Linux:** `sudo systemd-resolve --flush-caches`

### Problema 2: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"

**Causa:** Certificado SSL ainda não foi gerado

**Solução:**
1. Aguarde alguns minutos após DNS propagar
2. A Manus gera certificado automaticamente
3. Se persistir após 1 hora, contate suporte Manus

### Problema 3: Site carrega mas aparece erro 404

**Causa:** Domínio não foi adicionado corretamente no painel Manus

**Solução:**
1. Verifique se domínio foi adicionado em **Settings → Domains**
2. Certifique-se de que status está **"Active"**
3. Tente remover e adicionar novamente

### Problema 4: Pagamentos Stripe não funcionam

**Causa:** URLs de retorno ainda apontam para domínio antigo

**Solução:**
1. Siga o **Passo 5** deste guia
2. Atualize todas as URLs no Dashboard Stripe
3. Teste novamente em modo anônimo

---

## 📞 Suporte

### Suporte Hostinger
- **Chat:** Disponível no hPanel
- **Email:** suporte@hostinger.com.br
- **Telefone:** Verifique no painel

### Suporte Manus
- **Website:** https://help.manus.im
- **Documentação:** Consulte a documentação oficial da plataforma

### Suporte Stripe
- **Dashboard:** https://dashboard.stripe.com
- **Documentação:** https://stripe.com/docs
- **Suporte:** Disponível no dashboard

---

## 📊 Resumo da Configuração

| Item | Valor |
|------|-------|
| **Domínio** | www.espelhoai.com.br |
| **Tipo DNS** | CNAME |
| **Aponta para** | descubraeu-c4seynyh.manus.space |
| **SSL** | Automático (Let's Encrypt) |
| **Webhook Stripe** | https://www.espelhoai.com.br/api/webhooks/stripe |
| **Success URL** | https://www.espelhoai.com.br/planos?success=true&session_id={CHECKOUT_SESSION_ID} |
| **Cancel URL** | https://www.espelhoai.com.br/planos?canceled=true |

---

## ✨ Próximos Passos Após Conexão

1. **Testar tudo em produção** - Faça testes completos de todas as funcionalidades
2. **Atualizar links de marketing** - Atualize todos os materiais promocionais com novo domínio
3. **Configurar Google Analytics** - Se aplicável, atualize propriedade do GA
4. **Atualizar redes sociais** - Atualize bio/links em Instagram, Facebook, etc.
5. **SEO** - Submeta sitemap no Google Search Console com novo domínio

---

**🎉 Parabéns! Seu domínio personalizado está configurado!**

Agora o ESPELHO AI está acessível em **www.espelhoai.com.br** com certificado SSL e totalmente funcional.
