import City from '../types/City';
import Country from '../types/Country';
import Hotel from '../types/Hotel';
import { SearchResult } from '../types/SearchResults';

const API_URL = 'http://localhost:3001';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

export const fetchSearchResults = async (query: string): Promise<SearchResult> => {
    if (!query) {
        throw new Error('Query parameter is required');
    }
    try {
        const response = await fetch(`${API_URL}/search?q=${query}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
    }
};

export const getCityByName = async (name: string): Promise<City> => {
    if (!name) {
        throw new Error('City name is required');
    }
    try {
        const response = await fetch(`${API_URL}/cities/${name}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching city by name:', error);
        throw error;
    }
};

export const getCountryByName = async (name: string): Promise<Country> => {
    if (!name) {
        throw new Error('Country name is required');
    }
    try {
        const response = await fetch(`${API_URL}/countries/${name}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching country by name:', error);
        throw error;
    }
};

export const getHotelByName = async (name: string): Promise<Hotel> => {
    if (!name) {
        throw new Error('Hotel name is required');
    }
    try {
        const response = await fetch(`${API_URL}/hotels/${name}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching hotel by name:', error);
        throw error;
    }
};
