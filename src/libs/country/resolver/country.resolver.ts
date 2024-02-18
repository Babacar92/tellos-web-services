import { Args, Query, Resolver } from '@nestjs/graphql';
import { CountryService } from '../service/country.service';

@Resolver()
export class CountryResolver {

    public constructor(
        private readonly _service: CountryService,
    ) { }

    /**
     * Return all countries
     * @returns 
     */
    @Query(() => JSON, {
        name: 'getCountriesForDropdown',
    })
    public async getAllForDropdown(): Promise<any> {
        return this._service.getAllForDropdown();
    }

    /**
     * Return all countries
     * @param countryCode 
     * @returns 
     */
    @Query(() => JSON, {
        name: 'getCitiesOfCountryForDropdown',
    })
    public async getCitiesOfCountryForDropdown(
        @Args('countryCode')
        countryCode: string
    ): Promise<any> {
        return this._service.getCitiesOfCountryForDropdown(countryCode);
    }

    /**
     * Return all countries
     * @returns 
     */
    @Query(() => JSON, {
        name: 'getCountries',
    })
    public async getAll(): Promise<any> {
        return this._service.getAll();
    }

    /**
     * Return one country by his code
     * @param countryCode 
     * @returns 
     */
    @Query(() => JSON, {
        name: 'getCountry',
    })
    public async getOne(
        @Args('code')
        code: string
    ): Promise<any> {
        return this._service.getOne(code);
    }


    /**
     * Return all cities of country
     * @param countryCode 
     * @returns 
     */
    @Query(() => JSON, {
        name: 'getCitiesOfCountry',
    })
    public async getCitiesOfCountry(
        @Args('countryCode')
        countryCode: string
    ): Promise<any> {
        return this._service.getCitiesOfCountry(countryCode);
    }
}
