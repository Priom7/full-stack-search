import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import DetailPage from "./views/DetailPage";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Search Bar Route */}
        <Route
          path="/"
          element={
            <div className="container">
              <div className="row height d-flex justify-content-center align-items-center">
                <div className="col-md-6">
                  <SearchBar />
                </div>
              </div>
            </div>
          }
        />
        {/* Detail Page Routes */}
        <Route path="/hotels/:value" element={<DetailPage type="Hotel" />} />
        <Route path="/cities/:value" element={<DetailPage type="City" />} />
        <Route
          path="/countries/:value"
          element={<DetailPage type="Country" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
