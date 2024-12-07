import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": "674f5237b1e41600191b96a8",
      "PLAID-SECRET": "064437ee57fb93f42a5bcaa2863e77",
    },
  },
});

export function encryptId(id) {
  return btoa(id);
}

export const plaidClient = new PlaidApi(configuration);
