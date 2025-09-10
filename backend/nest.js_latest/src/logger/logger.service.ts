import { Injectable, LoggerService } from '@nestjs/common';
import LoggerInstance from 'src/utils/logger';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  log(message: string) {
    LoggerInstance.info(message);
  }

  error(message: string) {
    LoggerInstance.error(message);
  }

  warn(message: string) {
    LoggerInstance.warn(message);
  }

  debug(message: string) {
    LoggerInstance.debug(message);
  }

  verbose(message: string) {
    LoggerInstance.verbose(message);
  }
}
