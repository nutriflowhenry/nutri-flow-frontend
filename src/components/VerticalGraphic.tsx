import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react'
import { IUsersPayments } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getAllPayments } from '@/helpers/admin.helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const VerticalGraphic = () => {
  const { userData } = useAuth();
  const [allPayments, setAllPayments] = useState<IUsersPayments>({ data: [] });
  const [loading, setLoading] = useState(true);
  const [salesByDay, setSalesByDay] = useState<number[]>(Array(7).fill(0));

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userData?.token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const paymentsData = await getAllPayments(userData?.token);
        setAllPayments(paymentsData);
      } catch (error) {
        console.error("Error al obtener pagos de los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userData?.token]);

  useEffect(() => {
    if (allPayments?.data.length > 0) {
      const salesData = Array(7).fill(0);

      allPayments.data.forEach(payment => {
        if (!payment.currentPeriodStart) return;
        const date = new Date(payment.currentPeriodStart);
        let dayIndex = date.getDay();

        dayIndex = (dayIndex + 6) % 7; 

        salesData[dayIndex] += 1;
      });

      setSalesByDay(salesData);
    }
  }, [allPayments]);

  const totalSales = allPayments?.data.length;

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false }
    },

    plotOptions: {
      bar: {
        columnWidth: "40%",
      },
    },

    colors: ["#63948D"],

    xaxis: { categories: ["Lun", "Mar", "Mier", "Juev", "Vier", "Sab", "Dom"] },
  };

  const chartSeries = [{
    name: "Ventas",
    data: salesByDay
  }];

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center">

          <div className='flex flex-wrap gap-3 items-center'>
            <div className="w-14 h-14 bg-[#1e2e2c] flex items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-3xl text-[#f7f8f8]"/>
            </div>  
              <div className='flex flex-col'>
                <h5 className="text-3xl font-bold text-[#c19a4c]">
                  {totalSales}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Ventas por semana
                </p>
              </div>
          </div>
        </div>

      </div>

      {/* Chart */}
      <ApexChart options={chartOptions} series={chartSeries} type="bar" height={250} />
    </div>
  );
};

export default VerticalGraphic;