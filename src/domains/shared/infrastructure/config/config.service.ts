import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private nestConfigService: NestConfigService) {}

  get(key: string): string {
    const value = this.nestConfigService.get<string>(key);

    if (!value) {
      throw new Error(`Configuration key "${key}" is not defined`);
    }

    return value;
  }

  getOptional(key: string, defaultValue: string = ''): string {
    const value = this.nestConfigService.get<string>(key);
    return value || defaultValue;
  }

  getNumber(key: string): number {
    const value = this.get(key);
    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      throw new Error(`Configuration key "${key}" is not a number`);
    }

    return numberValue;
  }

  getOptionalNumber(key: string, defaultValue: number = 0): number {
    const value = this.nestConfigService.get<string>(key);

    if (!value) {
      return defaultValue;
    }

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      return defaultValue;
    }

    return numberValue;
  }

  getBoolean(key: string): boolean {
    const value = this.get(key).toLowerCase();
    return value === 'true' || value === '1';
  }

  getOptionalBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = this.nestConfigService.get<string>(key);

    if (!value) {
      return defaultValue;
    }

    return value.toLowerCase() === 'true' || value === '1';
  }
}
