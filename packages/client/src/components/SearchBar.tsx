import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { SearchResult } from "../types/SearchResults";
import { fetchSearchResults } from "../api/apiCalls";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [showClearBtn, setShowClearBtn] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        const data = await fetchSearchResults(query);
        setResults(data);
        setShowClearBtn(true);
      } else {
        setResults(null);
        setShowClearBtn(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setShowClearBtn(false);
  };

  const handleRedirect = (
    type: "hotels" | "cities" | "countries",
    value: string
  ) => {
    navigate(`/${type}/${encodeURIComponent(value)}`);
  };

  return (
    <div className="dropdown">
      <div className="form">
        <i className="fa fa-search"></i>
        <input
          type="text"
          className="form-control form-input"
          placeholder="Search accommodation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {showClearBtn && (
          <span className="left-pan" onClick={clearSearch}>
            <i className="fa fa-close"></i>
          </span>
        )}
      </div>
      {results && (
        <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
          <h2 className="section-header">Hotels</h2>
          {results.hotels.length ? (
            results.hotels.map((hotel) => (
              <li
                key={hotel._id}
                onClick={() => handleRedirect("hotels", hotel.hotel_name)}
              >
                <a className="dropdown-item">
                  <i className="fa fa-building mr-2"></i>
                  {hotel.hotel_name}
                </a>
                <hr className="divider" />
              </li>
            ))
          ) : (
            <p className="no-match">No hotels matched</p>
          )}
          <h2 className="section-header">Countries</h2>
          {results.countries.length ? (
            results.countries.map((country, index) => (
              <li
                key={index}
                onClick={() => handleRedirect("countries", country.country)}
              >
                <a className="dropdown-item">
                  <i className="fa fa-globe mr-2"></i>
                  {country.country}
                </a>
                <hr className="divider" />
              </li>
            ))
          ) : (
            <p className="no-match">No countries matched</p>
          )}
          <h2 className="section-header">Cities</h2>
          {results.cities.length ? (
            results.cities.map((city, index) => (
              <li
                key={index}
                onClick={() => handleRedirect("cities", city.name)}
              >
                <a className="dropdown-item">
                  <i className="fa fa-map-marker mr-2"></i>
                  {city.name}
                </a>
                <hr className="divider" />
              </li>
            ))
          ) : (
            <p className="no-match">No cities matched</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
