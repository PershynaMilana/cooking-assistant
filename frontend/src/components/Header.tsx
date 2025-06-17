import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
      <header className="bg-perfect-purple p-6 py-8 text-white">
        <nav>
          <ul className="flex justify-between items-center">
            <div className="flex space-x-14 ml-[10vw]">
              <li>
                <Link to="/main" className="font-montserratRegular text-l">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/my-recipes" className="font-montserratRegular text-l">
                  My Recipes
                </Link>
              </li>
              <li>
                <Link to="/stats" className="font-montserratRegular text-l">
                  Statistics
                </Link>
              </li>
              <li>
                <Link to="/types" className="font-montserratRegular text-l">
                  Types
                </Link>
              </li>
              <li>
                <Link to="/ingredients" className="font-montserratRegular text-l">
                  My Ingredients
                </Link>
              </li>
              {/* New "Menu" tab */}
              <li>
                <Link to="/menu" className="font-montserratRegular text-l">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/my-menus" className="font-montserratRegular text-l">
                  My Menus
                </Link>
              </li>
            </div>

            {token ? (
                <button
                    onClick={handleLogout}
                    className="bg-dark-purple font-montserratRegular px-8 py-2 -mt-1 mr-[3vw] rounded-full"
                >
                  Logout
                </button>
            ) : (
                <div className="flex space-x-14 mr-[5vw]">
                  <li>
                    <Link to="/login" className="font-montserratRegular text-l">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                        to="/registration"
                        className="bg-dark-purple px-5 py-3 rounded-full font-montserratRegular text-l"
                    >
                      Register
                    </Link>
                  </li>
                </div>
            )}
          </ul>
        </nav>
      </header>
  );
};

export default Header;
