import { Link, useParams } from "react-router-dom";
import CityDetail from "../components/CityDetail";
import CountryDetail from "../components/CountryDetail";
import HotelDetail from "../components/HotelDetail";

const DetailPage = ({ type }: { type: string }) => {
  const { value } = useParams<{ value: string }>();

  const renderDetail = () => {
    if (!value) return null;
    switch (type) {
      case "Hotel":
        return <HotelDetail value={value} />;
      case "City":
        return <CityDetail value={value} />;
      case "Country":
        return <CountryDetail value={value} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h1>
        <i className="fa fa-info-circle mr-2"></i>
      </h1>
      {renderDetail()}
      <Link to="/" className="btn btn-primary mt-3">
        Back to Search
      </Link>
    </div>
  );
};

export default DetailPage;
