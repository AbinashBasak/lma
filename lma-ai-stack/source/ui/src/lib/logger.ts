import { Logger } from 'aws-amplify';

const awsLogger = new Logger('log');

// const isEnabled = process.env.NODE_ENV === 'development';
const isEnabled = false;

export const logger = {
  error: (...props: any) => {
    if (isEnabled) {
      awsLogger.error(props);
    }
  },
  debug: (...props: any) => {
    if (isEnabled) {
      awsLogger.debug(props);
    }
  },
  log: (...props: any) => {
    if (isEnabled) {
      awsLogger.debug(props);
    }
  },
};
