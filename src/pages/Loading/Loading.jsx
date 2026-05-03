import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#F3F4F6] dark:bg-gray-900 transition-colors">
      <AiOutlineLoading3Quarters className="animate-spin text-[#4890FE] text-2xl" />
      <h2 className="text-[16px] font-normal text-[#4a5565] dark:text-gray-400">
        Loading profile...
      </h2>
    </div>
  );
}
