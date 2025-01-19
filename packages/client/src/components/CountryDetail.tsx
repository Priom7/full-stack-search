import { useEffect, useState } from "react";
import { getCountryByName } from "../api/apiCalls";
import Country from "../types/Country";

const CountryDetail = ({ value }: { value: string }) => {
  const [country, setCountry] = useState<Country | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCountry = async () => {
      const result = await getCountryByName(value);
      if (isMounted) setCountry(result);
    };

    fetchCountry();

    return () => {
      isMounted = false;
    };
  }, [value]);

  if (!country) return <div className="spinner-border text-primary"></div>;

  return (
    <div>
      <h1>Country Detail</h1>
      <h2>{country.country}</h2>
    </div>
  );
};

export default CountryDetail;
