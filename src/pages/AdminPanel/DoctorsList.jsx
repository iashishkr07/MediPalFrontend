import React, { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const navigate = useNavigate();

  const specialties = [...new Set(doctors.map((doc) => doc.speciality))];

  const filteredSpecialties = specialties.filter((specialty) =>
    specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = searchQuery
    ? doctors.filter((doctor) =>
        doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedSpecialty
    ? doctors.filter((doctor) => doctor.speciality === selectedSpecialty)
    : doctors;

  useEffect(() => {
    API.get("/doctors")
      .then((res) => {
        const fetchedDoctors = res.data.doctors || res.data || [];
        setDoctors(fetchedDoctors);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
        setLoading(false);
      });
  }, []);

  const openProfile = (doctor) => setSelectedDoctor(doctor);
  const closeProfile = () => setSelectedDoctor(null);

  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(specialty === selectedSpecialty ? "" : specialty);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSelectedSpecialty(""); // Clear selected specialty when searching
  };

  if (selectedDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={closeProfile}
            className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Doctors
          </button>

          <div className="backdrop-blur-lg bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <div className="md:flex">
              <div className="md:w-1/3 p-8 flex flex-col items-center bg-gradient-to-b from-indigo-50 to-purple-50">
                <div className="relative">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-48 h-48 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Available
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-indigo-900 mt-4">
                  {selectedDoctor.name}
                </h2>
                <p className="text-lg text-indigo-700 text-center">
                  {selectedDoctor.degree} - {selectedDoctor.speciality}
                </p>
                <p className="text-indigo-600 mt-2">
                  {selectedDoctor.experience} Experience
                </p>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-indigo-900 mb-4">
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedDoctor.about}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                  <p className="font-semibold text-gray-800 text-xl">
                    Appointment fee:{" "}
                    <span className="text-indigo-600">
                      ₹{selectedDoctor.fees}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className=" rounded-2xl  p-6 mb-8 ">
          {/* Search Input */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by specialty (e.g., Gynecologist)..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-10 text-indigo-900 bg-white border border-indigo-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3"></div>
        </div>

        {/* Doctors List */}
        <div className="bg-white/80 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-900">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-900">
                    Specialty
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-900">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-900">
                    Fees
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor, index) => (
                    <tr
                      key={index}
                      onClick={() => openProfile(doctor)}
                      className="hover:bg-indigo-50 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-indigo-900">
                              {doctor.name}
                            </p>
                            <p className="text-xs text-indigo-600">
                              {doctor.degree}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-indigo-700">
                          {doctor.speciality}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-indigo-700">
                          {doctor.experience}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-indigo-700">
                          ₹{doctor.fees || "500"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Available
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchQuery
                        ? "No doctors found for this specialty"
                        : "No doctors available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
