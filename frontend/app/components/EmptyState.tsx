"use client";
import { useAuthStore } from "../context/AuthContext";

const EmptyState = () => {
  const { user } = useAuthStore();

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 h-full w-full flex justify-center items-center bg-gray-100">
      <div className="text-center items-center flex flex-col">
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
          Selamat datang {user.fullname}! <br />
          Pilih obrolan atau mulai percakapan baru pada sisi kiri.
        </h3>
      </div>
    </div>
  );
};
export default EmptyState;
