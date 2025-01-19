import { useEffect, useState } from "react";
import { getHotelByName } from "../api/apiCalls";

import Hotel from "../types/Hotel";

const HotelDetail = ({ value }: { value: string }) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHotel = async () => {
      const result = await getHotelByName(value);
      if (isMounted) setHotel(result);
    };

    fetchHotel();

    return () => {
      isMounted = false;
    };
  }, [value]);

  if (!hotel) return <div className="spinner-border text-primary"></div>;

  return (
    <div>
      <h1>Hotel Detail</h1>
      <h2>{hotel.hotel_name}</h2>
    </div>
  );
};

export default HotelDetail;
