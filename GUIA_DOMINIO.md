# Guia: Configurar Domínio espelhoai.com.br no Manus

## Visão Geral

Este guia fornece instruções passo a passo para configurar o domínio personalizado **espelhoai.com.br** para sua aplicação ESPELHO AI hospedada no Manus. O processo envolve registrar o domínio, configurar os registros DNS e vincular o domínio à sua aplicação no painel de controle do Manus.

---

## Pré-requisitos

Antes de começar, você precisará de:

- Uma conta ativa no Manus com o projeto "descubraeu" já criado
- Acesso ao painel de controle do Manus (Management UI)
- Um domínio **espelhoai.com.br** registrado ou pronto para registrar
- Acesso ao painel de controle do seu registrador de domínios (GoDaddy, Namecheap, etc.)

---

## Passo 1: Acessar o Painel de Domínios no Manus

1. Faça login em sua conta Manus
2. Navegue até o projeto **descubraeu**
3. Abra o **Management UI** (clique no ícone de painel no canto superior direito)
4. No menu lateral esquerdo, procure por **Settings** → **Domains**

Você verá a página de gerenciamento de domínios com:
- Seu domínio auto-gerado atual (ex: `descubraeu.manus.space`)
- Opção para adicionar um domínio personalizado
- Opção para comprar um novo domínio diretamente no Manus

---

## Passo 2: Escolher entre Comprar ou Usar Domínio Existente

### Opção A: Comprar Domínio Diretamente no Manus (Recomendado)

Se você ainda não possui o domínio **espelhoai.com.br**, o Manus oferece a opção de comprar domínios diretamente:

1. No painel **Domains**, clique em **"Comprar Novo Domínio"** ou **"Purchase Domain"**
2. Digite **espelhoai.com.br** no campo de busca
3. Verifique a disponibilidade do domínio
4. Se disponível, clique em **"Comprar"** e complete o pagamento
5. O Manus configurará automaticamente os registros DNS necessários

**Vantagem**: Configuração automática, sem necessidade de gerenciar DNS manualmente.

### Opção B: Usar Domínio Existente

Se você já possui o domínio **espelhoai.com.br** registrado em outro registrador:

1. No painel **Domains**, clique em **"Adicionar Domínio Personalizado"** ou **"Add Custom Domain"**
2. Digite **espelhoai.com.br**
3. O Manus exibirá os registros DNS que você precisa configurar no seu registrador

---

## Passo 3: Configurar Registros DNS (Apenas para Domínio Existente)

Se você escolheu a **Opção B**, siga estas instruções para configurar os registros DNS:

### Registros DNS Necessários

O Manus fornecerá registros DNS específicos. Geralmente, você precisará configurar:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| CNAME | www | descubraeu.manus.space | 3600 |
| A | @ | [IP fornecido pelo Manus] | 3600 |
| TXT | @ | [Verificação fornecida pelo Manus] | 3600 |

**Nota**: Os valores exatos serão fornecidos pelo Manus no painel de Domains.

### Acessar Painel DNS do Seu Registrador

1. Faça login no painel de controle do seu registrador de domínios (GoDaddy, Namecheap, Registro.br, etc.)
2. Localize a seção **DNS Management** ou **Gerenciar DNS**
3. Procure por **Registros DNS**, **DNS Records** ou **Zone File**

### Adicionar Registros DNS

**Para registrador GoDaddy:**
1. Vá para **Produtos** → **Domínios**
2. Clique no domínio **espelhoai.com.br**
3. Clique em **Gerenciar DNS**
4. Clique em **Adicionar** para cada registro DNS
5. Preencha os campos conforme fornecido pelo Manus
6. Clique em **Salvar**

**Para registrador Namecheap:**
1. Vá para **Dashboard** → **Domain List**
2. Clique em **Manage** ao lado de **espelhoai.com.br**
3. Clique na aba **Advanced DNS**
4. Clique em **Add New Record** para cada registro
5. Preencha os campos conforme fornecido pelo Manus
6. Clique em **Save All Changes**

**Para registrador Registro.br:**
1. Acesse https://www.registro.br
2. Faça login com suas credenciais
3. Vá para **Meus Domínios**
4. Clique em **espelhoai.com.br**
5. Clique em **Editar Zona de DNS**
6. Adicione os registros conforme fornecido pelo Manus
7. Clique em **Salvar**

---

## Passo 4: Vincular Domínio no Manus

Após configurar os registros DNS (ou após a compra automática):

1. Retorne ao painel **Domains** no Manus
2. Clique em **"Vincular Domínio"** ou **"Bind Domain"**
3. Digite **espelhoai.com.br** no campo de entrada
4. Clique em **"Confirmar"** ou **"Bind"**
5. O Manus verificará os registros DNS e confirmará a vinculação

**Tempo de Propagação**: Os registros DNS podem levar de 15 minutos a 48 horas para se propagar globalmente. Durante este período, seu site pode estar acessível apenas através do domínio anterior.

---

## Passo 5: Verificar Configuração

Após a propagação dos registros DNS, verifique se tudo está funcionando corretamente:

### Teste 1: Acessar o Domínio
1. Abra seu navegador
2. Digite **https://espelhoai.com.br** na barra de endereços
3. Verifique se a página carrega corretamente

### Teste 2: Verificar SSL/TLS
1. Clique no ícone de cadeado na barra de endereços
2. Verifique se o certificado SSL é válido para **espelhoai.com.br**
3. Não deve haver avisos de segurança

### Teste 3: Testar Redirecionamento
1. Digite **www.espelhoai.com.br** na barra de endereços
2. Verifique se redireciona para **https://espelhoai.com.br** sem erros

### Teste 4: Verificar DNS (Ferramenta Online)
Use uma ferramenta de verificação DNS online:
1. Acesse https://mxtoolbox.com ou https://dnschecker.org
2. Digite **espelhoai.com.br**
3. Verifique se os registros DNS estão propagados e corretos

---

## Solução de Problemas

### Problema: Domínio não carrega (erro 404 ou timeout)

**Causa**: Registros DNS não propagados ou incorretos.

**Solução**:
1. Aguarde 24-48 horas para propagação completa
2. Verifique os registros DNS no painel do seu registrador
3. Compare com os valores fornecidos pelo Manus
4. Se incorretos, corrija e aguarde a propagação
5. Limpe o cache do navegador (Ctrl+Shift+Delete)

### Problema: Certificado SSL inválido

**Causa**: Domínio não vinculado corretamente ao Manus.

**Solução**:
1. Verifique se o domínio está vinculado no painel **Domains** do Manus
2. Aguarde 24 horas para renovação automática do certificado SSL
3. Se persistir, entre em contato com suporte Manus

### Problema: Redirecionamento de www não funciona

**Causa**: Registro CNAME para www não configurado.

**Solução**:
1. Verifique se existe um registro CNAME para **www** no painel DNS
2. O valor deve ser **descubraeu.manus.space** (ou conforme fornecido pelo Manus)
3. Se não existir, adicione o registro
4. Aguarde propagação (15 minutos a 48 horas)

### Problema: Email não funciona após vincular domínio

**Causa**: Registros MX não configurados.

**Solução**:
1. Se você usa email com o domínio, configure registros MX adicionais
2. Consulte seu provedor de email para os valores corretos de MX
3. Adicione os registros MX no painel DNS do seu registrador
4. Aguarde propagação

---

## Próximas Etapas

Após vincular com sucesso o domínio **espelhoai.com.br**:

1. **Atualizar Metadados**: Atualize as meta tags (og:image, og:url) em seu código para usar o novo domínio
2. **Configurar Analytics**: Se usar Google Analytics, atualize o domínio nas configurações
3. **Atualizar Links**: Atualize qualquer link hardcoded que aponte para o domínio anterior
4. **Backup**: Faça backup de suas configurações de domínio
5. **Monitoramento**: Monitore o tráfego para garantir que tudo está funcionando

---

## Referências e Recursos Úteis

- **Manus Management UI**: https://manus.im (Acesse após fazer login)
- **Verificador DNS**: https://mxtoolbox.com
- **Verificador DNS Alternativo**: https://dnschecker.org
- **GoDaddy DNS Management**: https://www.godaddy.com
- **Namecheap DNS Management**: https://www.namecheap.com
- **Registro.br**: https://www.registro.br

---

## Suporte

Se encontrar problemas durante o processo:

1. Consulte a seção **Solução de Problemas** acima
2. Verifique a documentação oficial do Manus em https://help.manus.im
3. Entre em contato com o suporte Manus através do formulário em https://help.manus.im

---

**Última atualização**: 10 de dezembro de 2025  
**Versão**: 1.0  
**Autor**: Manus AI
