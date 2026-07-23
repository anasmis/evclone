# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## EVplug AI Assistant Webhook

The floating assistant (`src/components/common/FloatingAssistant.jsx`) sends messages through `src/lib/api/assistant.js`.

Set these variables in `.env.local`:

```bash
VITE_N8N_WEBHOOK_URL=https://marketing.evborne.ma/webhook/bf4dd093-bb02-472c-9454-7ab9af97bd1d
VITE_N8N_WEBHOOK_AUTH_HEADER=X-EVBORNE-ASSISTANT-KEY
VITE_N8N_WEBHOOK_AUTH_VALUE=<set-a-strong-random-secret>

# Optional legacy fallback
VITE_N8N_WEBHOOK_TOKEN=
```

### n8n Setup (Header Auth)

1. Open the Webhook node in n8n.
2. Set `Authentication` to `Header Auth`.
3. Set `Header Name` to `X-EVBORNE-ASSISTANT-KEY`.
4. Set `Header Value` to the same value as `VITE_N8N_WEBHOOK_AUTH_VALUE`.
5. Ensure the workflow ends with `Respond to Webhook` and returns one of these keys: `reply`, `output`, `message`, or `text`.

### Notes

- Keep `VITE_N8N_WEBHOOK_AUTH_HEADER` and `VITE_N8N_WEBHOOK_AUTH_VALUE` both filled or both empty.
- A Vite `VITE_*` variable is exposed to the browser bundle. For stronger protection, move webhook calls behind a server-side proxy and keep the secret only on the server.
