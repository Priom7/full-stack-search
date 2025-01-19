import Hotel  from './Hotel';
import City  from './City';
import Country  from './Country';


export type SearchResult =
 {
    hotels: Hotel[];
    cities: City[];
    countries: Country[];
};
    