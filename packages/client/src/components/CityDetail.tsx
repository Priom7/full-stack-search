import { useEffect, useState } from "react";
import { getCityByName } from "../api/apiCalls";

import City from "../types/City";

const CityDetail = ({ value }: { value: string }) => {
  const [city, setCity] = useState<City | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCity = async () => {
      const result = await getCityByName(value);
      if (isMounted) setCity(result);
    };

    fetchCity();

    return () => {
      isMounted = false;
    };
  }, [value]);

  if (!city) return <div className="spinner-border text-primary"></div>;

  return (
    <div>
      <h1>City Detail</h1>
      <h2>{city.name}</h2>
    </div>
  );
};

export default CityDetail;
