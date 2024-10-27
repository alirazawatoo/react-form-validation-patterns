import React, { useMemo } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { TFormData } from '../types';

interface HeadingProps {
  title: string;
  price: number | string;
}

const Heading: React.FC<HeadingProps> = ({ title, price }) => {
  return (
    <div className="flex w-full space-x-4">
      <h2 className="text-lg font-medium w-1/2">{title}</h2>
      <h2 className="text-lg font-normal w-1/2 text-right">{price}</h2>
    </div>
  );
};

export const FormResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as TFormData | undefined;
  const totalTask = useMemo(
    () =>
      formData?.groups.reduce((accGroup, group) => {
        return accGroup + group.tasks.reduce((accTask, task) => accTask + task.total, 0);
      }, 0),
    []
  );
  const totalMaterial = useMemo(
    () =>
      formData?.groups.reduce((accGroup, group) => {
        return (
          accGroup +
          group.tasks.reduce((accTask, task) => {
            return accTask + task.materials.reduce((accMaterial, material) => accMaterial + material.total, 0);
          }, 0)
        );
      }, 0),
    []
  );
  const netTotal = (totalTask || 0) + (totalMaterial || 0);
  const discountedTotal = netTotal - (netTotal * 20) / 100;

  return (
    <div className="bg-white flex flex-col gap-5 p-5 h-1/2 w-full md:w-1/2 md:rounded-2xl md:shadow-md mx-auto my-auto">
      <button className="text-blue-600 flex items-center mb-4" onClick={() => navigate(-1)}>
        <IoIosArrowBack className="mr-2" size={20} />
        Back
      </button>

      <h1 className="text-3xl font-semibold text-center">Form Results</h1>

      <Heading title="Task Total" price={totalTask || 0} />
      <Heading title="Material Total" price={totalMaterial || 0} />
      <Heading title="Net Total" price={netTotal || 0} />
      <hr className="border-t-2 border-gray-200 my-2" />

      <Heading title="Discount" price="20%" />
      <hr className="border-t-2 border-gray-200 my-2" />

      <Heading title="Grand Total" price={discountedTotal} />
    </div>
  );
};
