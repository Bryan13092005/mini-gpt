# mini-gpt (Vercel)

App Node/Express que sirve el frontend estático desde `backend/public` y expone:
- `GET /api/health`
- `POST /api/chat`

## Requisitos
- Node (Vercel lo maneja)
- Variable de entorno obligatoria:
  - `HF_TOKEN`: token de HuggingFace

## Deploy en Vercel
1. Sube el repo a GitHub/GitLab.
2. En Vercel, crea un proyecto apuntando a **la carpeta `mini-gpt`** (root del repo que contiene `vercel.json`).
3. Ve a **Project Settings > Environment Variables** y agrega:
   - `HF_TOKEN` = tu token de HuggingFace
   - (opcional) `HF_PROVIDER` = `auto` (default) o el provider que uses
4. Deploy.

## Probar
- Abre: `https://TU-DOMINIO/api/health`
- Abre: `https://TU-DOMINIO/` (frontend)

> Nota: el servidor responde 500 si `HF_TOKEN` no está seteado.

