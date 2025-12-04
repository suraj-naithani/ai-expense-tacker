import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FinancialAccount, FinancialAccountType } from "@/types/account";
import type { AccountFormValues } from "@/components/dialog/AddAccountDialog";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapAccountTypeFromApi = (
  type: FinancialAccountType,
): AccountFormValues["type"] => {
  switch (type) {
    case "CURRENT":
      return "current";
    case "SAVINGS":
      return "savings";
    case "CREDIT_CARD":
      return "credit-card";
    case "CASH":
      return "cash";
    default:
      return "current";
  }
};

export const mapAccountTypeToApi = (
  type: AccountFormValues["type"],
): FinancialAccountType => {
  switch (type) {
    case "current":
      return "CURRENT";
    case "savings":
      return "SAVINGS";
    case "credit-card":
      return "CREDIT_CARD";
    case "cash":
      return "CASH";
    default:
      return "CURRENT";
  }
};

export const mapAccountsFromApi = (
  accounts: FinancialAccount[],
): AccountFormValues[] =>
  accounts.map((account) => ({
    id: account.id,
    name: account.name,
    type: mapAccountTypeFromApi(account.type),
    initialBalance: account.balance,
    isDefault: account.isDefault,
  }));

export const formatAccountType = (type: AccountFormValues["type"]) => {
  switch (type) {
    case "current":
      return "Current account";
    case "savings":
      return "Savings account";
    case "credit-card":
      return "Credit card";
    case "cash":
      return "Cash";
    default:
      return type;
  }
};
