import { createClient } from '@base44/sdk';

// Cliente sem redirecionamento obrigatório para login (uso público)
export const base44 = createClient({
  appId: "683c8e5c7f28b76cbf2c7555",
  requiresAuth: false
});
