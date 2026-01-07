 import { MdPeopleAlt } from "react-icons/md";


  export default function PageHeader({ title, icon = "" }) {
  return (
    <div id="pageheader-container" className="flex items-center justify-between p-4">
      <div id="pageheader-left" className="flex flex-col">
        <span id="page-title" className="text-3xl font-semibold mt-3" >
            {title}
      {icon}
        </span>
        <div
          id="breadcrumb-links"
          className="flex items-center font-medium space-x-2 mt-3 text-sm"
        >
          <span id="breadcrumb-home" className="text-gray-500">
            Dashboard
          </span>
          <span id="breadcrumb-separator" className="text-gray-400">/</span>
          <span
            id="breadcrumb-current"
            style={{ color: "#ff6a00", fontWeight: 600 }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}