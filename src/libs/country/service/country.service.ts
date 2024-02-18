import { Injectable } from '@nestjs/common';
import { City, Country, ICity, ICountry } from 'country-state-city';

@Injectable()
export class CountryService {

    public constructor(

    ) { }

    /**
     * Return all countries
     * @returns 
     */
    public async getAllForDropdown(): Promise<{ value: string, label: string }[]> {
        return new Promise(async (resolve, reject) => {
            const countries = await this.getAll();
            resolve(countries.map(_c => ({
                label: _c.name,
                value: _c.isoCode,
            })));
        });
    }

    /**
     * Return all cities of country
     * @param countryCode 
     * @returns 
     */
    public async getCitiesOfCountryForDropdown(
        countryCode?: string
    ): Promise<{ value: string, label: string }[]> {
        return new Promise(async (resolve, reject) => {
            const cities = await this.getCitiesOfCountry(countryCode);
            resolve(cities.map(_c => ({
                label: _c.name,
                value: _c.name,
            })));
        });
    }

    /**
     * Return all countries
     * @returns 
     */
    public async getAll(): Promise<ICountry[]> {
        return new Promise(async (resolve, reject) => {
            resolve(Country.getAllCountries());
        });
    }

    /**
     * Return one country by his code
     * @param countryCode 
     * @returns 
     */
    public async getOne(
        code?: string
    ): Promise<ICountry | null> {
        return new Promise(async (resolve, reject) => {
            resolve(code ? Country.getCountryByCode(code) : null);
        });
    }

    /**
     * Return all cities of country
     * @param countryCode 
     * @returns 
     */
    public async getCitiesOfCountry(
        countryCode?: string
    ): Promise<ICity[]> {
        return new Promise(async (resolve, reject) => {
            const cities = countryCode ? City.getCitiesOfCountry(countryCode) : [];
            resolve(cities);
        });
    }

}
