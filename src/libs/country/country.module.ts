import { Module } from '@nestjs/common';
import { CountryService } from './service/country.service';
import { CountryResolver } from './resolver/country.resolver';
import { CountryController } from './controller/country.controller';

@Module({
  imports: [
    
  ],
  providers: [
    CountryService,
    CountryResolver,
  ],
  exports: [
    CountryService,
  ],
  controllers: [
    CountryController,
  ],
})
export class CountryModule {}
