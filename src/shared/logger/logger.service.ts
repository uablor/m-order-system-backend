import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string, ...optionalParams: unknown[]) {
    console.log(message, ...optionalParams);
  }
  error(message: string, ...optionalParams: unknown[]) {
    console.error(message, ...optionalParams);
  }
  warn(message: string, ...optionalParams: unknown[]) {
    console.warn(message, ...optionalParams);
  }
  debug?(message: string, ...optionalParams: unknown[]) {
    console.debug(message, ...optionalParams);
  }
  verbose?(message: string, ...optionalParams: unknown[]) {
    console.log(message, ...optionalParams);
  }
}
