import { encryptId, plaidClient } from "../lib/plaid.js";
import { bankAccountModel } from "../model/userModel.js";

export const createLinkToken = async (req, res) => {
  const { userId, userName } = req.query;
  console.log(userId, userName);
  try {
    const tokenParams = {
      user: {
        client_user_id: userId,
      },
      client_name: userName,
      products: ["auth"], // No need for type casting in JavaScript
      language: "en",
      country_codes: ["US"], // Changed to India country code
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    res.send(JSON.stringify({ linkToken: response.data.link_token }));
  } catch (error) {
    console.error("Error creating link token: \n", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

export const exchangeToken = async (req, res) => {
  const { public_token, userId } = req.body;
  const publicToken = public_token;
  console.log("public token", req.body, public_token, publicToken);
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    const resDb = await bankAccountModel.create({
      userId: userId,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken: accessToken,
      sharableId: encryptId(accountData.account_id),
    });

    res.send(
      JSON.stringify({
        publicTokenExchange: "complete",
        accessToken,
        itemId,
        accountData,
        resDb,
      }),
    );
  } catch (error) {
    console.log("An error occured while creating exchanging token:", error);
  }
};
