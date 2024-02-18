import { Body, Controller, Post } from '@nestjs/common';
import { CountryService } from '../service/country.service';

@Controller('country')
export class CountryController {


    public constructor(
        private readonly _service: CountryService,
    ) { }

    /**
     * Return all countries
     * @returns 
     */
    @Post('/find-all/for-dropdown')
    public async getAllForDropdown(): Promise<any> {
        return this._service.getAllForDropdown();
    }

    /**
     * Return all countries
     * @param countryCode 
     * @returns 
     */
    @Post('/find-cities/for-dropdown')
    public async getCitiesOfCountryForDropdown(
        @Body('countryCode')
        countryCode: string,
    ): Promise<any> {
        return this._service.getCitiesOfCountryForDropdown(countryCode);
    }

    /**
     * Return all countries
     * @returns 
     */
    @Post('/find-all')
    public async getAll(): Promise<any> {
        return this._service.getAll();
    }

    /**
     * Return one country by his code
     * @param countryCode 
     * @returns 
     */
    @Post('/find-one')
    public async getOne(
        @Body('code')
        code: string,
    ): Promise<any> {
        return this._service.getOne(code);
    }


    /**
     * Return all cities of country
     * @param countryCode 
     * @returns 
     */
    @Post('/find-cities')
    public async getCitiesOfCountry(
        @Body('countryCode')
        countryCode: string
    ): Promise<any> {
        return this._service.getCitiesOfCountry(countryCode);
    }

}
