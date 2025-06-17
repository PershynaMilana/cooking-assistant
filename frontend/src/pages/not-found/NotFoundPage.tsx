import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/main");
  };

  return (
      <>
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col sm:items-center md:items-start xl:items-start sm:space-y-1 md:space-y-4 xl:space-y-4">
            <h1 className="xl:text-6xl md:text-6xl sm:text-h3 font-kharkiv">
              Oops....
            </h1>
            <h2 className="xl:text-2xl md:text-2xl font-montserratMedium">
              It looks like you got lost
            </h2>
            <p className="xl:text-lg sm:text-xs-pl md:text-lg max-w-xs font-montserratRegular">
              The page you are looking for does not exist or has been moved. We suggest you return to the homepage.
            </p>
            <button
                onClick={handleGoHome}
                className="bg-perfect-yellow px-6 py-2 rounded-full font-montserratMedium mt-4 hover:bg-yellow-600"
            >
              GO TO HOMEPAGE
            </button>
          </div>
        </div>
      </>
  );
};

export default NotFoundPage;
