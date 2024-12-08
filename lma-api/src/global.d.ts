declare namespace NodeJS {
  interface ProcessEnv {
    USER_POOL_ID: string;
    DYNAMO_DB_USER_TABLE: string;

    [key: string]: string | undefined; // Allow for other variables
  }
}
