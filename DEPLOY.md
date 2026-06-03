# 🚀 Deploy em produção — stack unificado (ex.: Oracle Cloud)

Modelo: todos os apps atrás de **um nginx**, num único servidor (VM). As imagens
do **apae-geral** e do **gestão-escolar** vêm do **GHCR** (pull); o **site
comemorativo** é buildado no próprio servidor.

> Esta é a base "HTTP-first": sobe acessível por `http://<IP-da-VM>`. O HTTPS
> (domínio + Let's Encrypt) está preparado e é ativado depois — ver a seção TLS.

---

## ⚠️ Pré-condições de código (importante)

A produção usa as imagens publicadas no GHCR pelo CI de cada repo. Para o stack
unificado funcionar, **estas correções precisam estar na branch que o CI publica
(`dev`/`main`) e a imagem republicada**:

1. **apae-geral** — `apps/apae/src/lib/axios.ts`: `createBaseApi` usar `API_URL`
   (senão o login pelo navegador dá 500). Ver `DOCKER.md`.
2. **gestão-escolar — CORS.** Hoje `config/WebConfig.java` tem as origens
   **hardcoded** (`localhost:3000`, vercel, onrender). Em produção a origem é a
   **URL pública** (`http://<IP>` ou `https://dominio`). **Recomendado:** tornar
   as origens configuráveis por env (ex.: `CORS_ALLOWED_ORIGINS`) e setar no
   `docker-compose.prod.yml`. Sem isso, o login do gestão-escolar dá **403**.

> Enquanto o CI não republicar com as correções, dá para usar `IMAGE_TAG` apontando
> para uma tag que já as contenha, ou buildar essas imagens no servidor temporariamente.

---

## 1. Provisionar a VM (Oracle Cloud)

- Crie uma instância (Ubuntu 22.04 LTS; o free tier ARM Ampere funciona bem).
- **Abra as portas 80 e 443** em dois lugares:
  - **Security List / NSG** da VCN no console da Oracle (Ingress 0.0.0.0/0 → 80, 443).
  - **Firewall do SO:**
    ```bash
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
    sudo netfilter-persistent save
    ```

## 2. Instalar Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker   # usar docker sem sudo
docker compose version                            # confirmar plugin compose
```

## 3. Clonar o repositório (branch de deploy)

```bash
git clone -b deploy-producao-unificado https://github.com/IFPBEsp/apae-site-comemorativo.git
cd apae-site-comemorativo
```

> Só este repo é necessário no servidor — apae-geral e gestão-escolar vêm do GHCR.

## 4. Autenticar no GHCR (pull das imagens)

Crie um **Personal Access Token** (classic) com escopo `read:packages` e:

```bash
echo SEU_TOKEN | docker login ghcr.io -u SEU_USUARIO_GITHUB --password-stdin
```

## 5. Configurar o `.env.prod`

```bash
cp .env.prod.example .env.prod
nano .env.prod
```

Preencha:
- `PUBLIC_URL` → `http://<IP-da-VM>` (ou `https://dominio` quando tiver TLS).
- Todos os `CHANGE_ME_*` → segredos fortes (`openssl rand -base64 32`).
- `IMAGE_OWNER`/`IMAGE_TAG` → owner GHCR e a tag publicada.

## 6. Subir o stack

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
```

Acesse: `http://<IP-da-VM>/site-comemorativo`, `/apae-geral`, `/gestao-escolar`.

## 7. Criar os usuários admin

Mesmo princípio do `DOCKER.md` (seção "Usuários e logins"), trocando o nome da
rede para a de produção (`apae-prod_apae-network`):

```bash
# Comemorativo: migrations + admin
docker exec apae-site-comemorativo npx prisma migrate deploy
HASH=$(docker exec apae-site-comemorativo node -e "require('bcrypt').hash(process.env.P,12).then(h=>console.log(h))" ) \
  P='SUA_SENHA_FORTE'
docker exec apae-db psql -U "$POSTGRES_USER_COMEMORATIVO" -d "$POSTGRES_DB_COMEMORATIVO" -c \
  "INSERT INTO \"User\" (name, username, password, \"typeUser\") VALUES ('Admin','admin','$HASH','ADMIN');"

# Gestão-escolar: admin é via env (ADMIN_EMAIL/ADMIN_PASS) — nada a criar.

# APAE-geral: cadastro via signup (na rede de produção)
docker exec apae-geral-backend wget -qO- \
  --post-data='{"email":"admin@seu-dominio","password":"SUA_SENHA","cpf":"<cpf-valido>","fullName":"Admin"}' \
  --header='Content-Type: application/json' \
  http://localhost:8080/apae-geral/api/auth/signup
```

> ⚠️ O `/auth/signup` do apae-geral é **público**. Em produção, avalie fechar/proteger
> o cadastro após criar o admin.

## 8. Atualizar (deploy de nova versão)

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

---

## TLS / HTTPS (quando tiver domínio)

1. Aponte o **DNS** do domínio para o IP da VM.
2. Gere o certificado (modo standalone, com o nginx parado, ou via webroot):
   ```bash
   sudo apt install certbot
   docker compose -f docker-compose.prod.yml stop nginx
   sudo certbot certonly --standalone -d SEU_DOMINIO
   ```
3. No `docker-compose.prod.yml`: descomente `"443:443"` e o volume `/etc/letsencrypt`.
4. No `nginx/nginx.prod.conf`: troque `server_name _` pelo domínio, descomente o
   bloco HTTPS (replicando os `location`) e o redirect 80→443.
5. Suba de novo e configure a **renovação automática** (`certbot renew` no cron).

> Alternativa mais simples: pôr **Cloudflare** na frente (TLS no proxy) e manter o
> nginx interno em HTTP — nesse caso `PUBLIC_URL=https://dominio` e nada de certbot.

---

## Notas de produção

- **Segredos:** nunca commite `.env.prod` (já está no `.gitignore`).
- **Backups:** os volumes `*-db-data` e `apae-minio-data` guardam os dados —
  configure backup/snapshot deles.
- **MinIO:** não exposto publicamente; acesse o console via túnel SSH
  (`ssh -L 9001:localhost:9001 ...`) se precisar.
- **Recursos:** os dois backends Java + 3 bancos pedem RAM; numa VM pequena,
  considere limitar memória ou usar a Ampere (mais RAM no free tier).
