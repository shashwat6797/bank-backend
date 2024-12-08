import { getInstitution, parseStringify, plaidClient } from "../lib/plaid.js";
import { bankAccountModel } from "../model/userModel.js";

export const getAccounts = async (req, res) => {
  const { userId } = req.query;
  const banks = await bankAccountModel.find({
    userId: userId,
  });

  const accounts = await Promise.all(
    banks?.map(async (bank) => {
      // get each account info from plaid
      const accountsResponse = await plaidClient.accountsGet({
        access_token: bank.accessToken,
      });
      const accountData = accountsResponse.data.accounts[0];

      // get institution info from plaid
      const institution = await getInstitution({
        institutionId: accountsResponse.data.item.institution_id,
      });

      const account = {
        id: accountData.account_id,
        availableBalance: accountData.balances.available,
        currentBalance: accountData.balances.current,
        institutionId: institution.institution_id,
        name: accountData.name,
        officialName: accountData.official_name,
        mask: accountData.mask,
        type: accountData.type,
        subtype: accountData.subtype,
        bankId: bank.bankId,
        sharaebleId: bank.shareableId,
      };

      return account;
    }),
  );

  const totalBanks = accounts.length;
  const totalCurrentBalance = accounts.reduce((total, account) => {
    return total + account.currentBalance;
  }, 0);

  res.send({ accounts, totalBanks, totalCurrentBalance, banks });
};

export const getAccount = async (req, res) => {
  const { bankId } = req.query;

  try {
    // get bank from db
    const bank = await bankAccountModel.find({ bankId: bankId });

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank[0].accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id,
    });

    const transactions = await getTransactions(bank[0].accessToken);

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available,
      currentBalance: accountData.balances.current,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask,
      type: accountData.type,
      subtype: accountData.subtype,
      bankId: bank.id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const data = parseStringify({
      data: account,
      transactions: allTransactions,
    });
    res.send(data);
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

export const getBankInfo = async (req, res) => {};

export const getTransactions = async (accessToken) => {
  let hasMore = true;
  let transactions = [];
  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};
