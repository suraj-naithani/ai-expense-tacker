export const server = process.env.NEXT_PUBLIC_SERVER_URL;

// Account toast messages
export const ACCOUNT_MESSAGES = {
    CREATE_SUCCESS: "Account created successfully",
    UPDATE_SUCCESS: "Account updated successfully",
    DELETE_SUCCESS: "Account deleted successfully",
    DEFAULT_UPDATE_SUCCESS: "Default account updated successfully",
    CREATE_ERROR: "Failed to create account. Please try again.",
    UPDATE_ERROR: "Failed to update account. Please try again.",
    DELETE_ERROR: "Failed to delete account. Please try again.",
    DEFAULT_UPDATE_ERROR: "Failed to update default account. Please try again.",
    LOAD_ERROR: "Failed to load accounts. Please try again later.",
    LOADING: "Loading your accounts...",
} as const;