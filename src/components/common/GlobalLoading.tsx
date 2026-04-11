import { useUI } from "../../contexts";
import { LoadingSpinner } from "./LoadingSpinner";

export const GlobalLoading = () => {
  const { globalLoading } = useUI();

  if (!globalLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8">
        <LoadingSpinner text="Đang xử lý..." />
      </div>
    </div>
  );
};
