import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react'
import Chart from "react-apexcharts";

const VerticalGraphic = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
      };

    const chartOptions: ApexOptions = {
        chart: { type: "bar" },
        xaxis: { categories: ["Lun", "Mar", "Mier", "Juev", "Vier", "Sab", "Dom"] },
      };
    
      const chartSeries = [{ name: "Leads", data: [30, 50, 35, 70, 90, 40, 80] }];

      return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
                <svg
                  className="w-6 h-6 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 19"
                >
                  <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z" />
                </svg>
              </div>
              <div>
                <h5 className="text-2xl font-bold text-gray-900 dark:text-white pb-1">
                  3.4k
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Usuarios Premium generados por semana
                </p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
              <svg
                className="w-2.5 h-2.5 me-1.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 14"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M5 13V1m0 0L1 5m4-4 4 4"
                />
              </svg>
              42.5%
            </span>
          </div>
    
          {/* Chart */}
          <Chart options={chartOptions} series={chartSeries} type="bar" height={250} />
    
          {/* Footer */}
          <div className="flex justify-between items-center pt-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleDropdown}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Last 7 days
            </button>
            {dropdownOpen && (
              <ul className="absolute mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700">
                {["Yesterday", "Today", "Last 7 days", "Last 30 days", "Last 90 days"].map(
                  (option, index) => (
                    <li key={index}>
                      <button className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                        {option}
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
            <a
              href="#"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:hover:text-blue-500"
            >
              Leads Report
            </a>
          </div>
        </div>
      );
    };

export default VerticalGraphic;