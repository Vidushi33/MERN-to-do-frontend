import type { ReactNode } from "react";

interface ICard {
  title: string;
  count: number;
  icon: ReactNode;
  variant: "success" | "danger";
}

const MetricsCard = ({ count, icon, title, variant }: ICard) => {
  const styles = {
    success: "bg-[#EFF2FF]",
    danger: "bg-[#FFE6E7]",
  };

  const iconbgstyle = {
    success: "bg-[#99ADEF]",
    danger: "bg-[#FFB1B4]",
  };

  const iconborderstyle = {
    success: "border-[#090E23]",
    danger: "border-[#FF0000]",
  };

  return (
    <div className={`rounded py-6 px-2 md:px-4 ${styles[variant]}`}>
      <div className="flex items-center gap-2 md:gap-4 font-medium">
        <span
          className={`inline-flex items-center justify-center p-2 rounded  ${iconbgstyle[variant]} ${iconborderstyle[variant]}`}
        >
          {icon}
        </span>

        <span className="text-sm md:text-base">{title}</span>
      </div>

      <div className="mt-4 pl-10 flex items-baseline gap-2 font-bold">
        <span className="text-base md:text-2xl">{String(count).padStart(2, "0")}</span>

        <small className="text-xs font-normal text-gray-500">This Week</small>
      </div>
    </div>
  );
};

export default MetricsCard;
