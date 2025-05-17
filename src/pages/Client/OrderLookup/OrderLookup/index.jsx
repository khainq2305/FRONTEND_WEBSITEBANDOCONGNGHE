import React from "react";
import { Link } from "react-router-dom";

const OrderLookupBreadcrumb = ({ currentPage }) => {
  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">
            Trang chủ
          </Link>
        </li>
        <li>
          <span className="mx-2 text-gray-400">/</span>
        </li>
        <li className="text-gray-500">{currentPage}</li>
      </ol>
    </nav>
  );
};

export default OrderLookupBreadcrumb;
