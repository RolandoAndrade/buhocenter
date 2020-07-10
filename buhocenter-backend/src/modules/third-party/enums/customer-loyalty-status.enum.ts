export enum CustomerLoyaltyStatus {
    SUCCESSFUL = 'successful',
    USER_DO_NOT_EXISTS = 'user_do_not_exists',
    UNKNOWN_API_KEY = 'unknown_api_key',
    EXPIRED_CODE = 'expired_code',
    INVALID_CODE = 'invalid_code',
    INTERNAL_ERROR = 'internal_error',
    CLIENT_NOT_ASSOCIATED = 'client_not_associated',
    CSV_NO_FILE_FOUND = 'csv_no_file_found',
    CSV_WRONG_FORMAT = 'csv_wrong_format',
    UNKNOWN_TYPE = 'unknown_type',
    UNKNOWN_CURRENCY = 'unknown_currency',
    DIFFERENT_CURRENCIES = 'different_currencies',
}
