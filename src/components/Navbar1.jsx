import { Link, useNavigate } from "react-router-dom";

const Navbar1 = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg fixed w-full top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 md:h-24">
          <div className="flex items-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white hover:scale-105 transition-transform duration-300 cursor-default">
              <span className="block sm:inline">MediPal </span>
              <span className="block sm:inline">Panel</span>
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="mr-1">👋</span>
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-50"></div>
    </nav>
  );
};

export default Navbar1;
