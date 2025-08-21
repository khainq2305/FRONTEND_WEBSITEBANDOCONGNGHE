// src/components/common/AutoBreadcrumb.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';

const AutoBreadcrumb = ({ basePath = '/admin' }) => {
  const location = useLocation();
  const pathSegments = location.pathname.replace(basePath, '').split('/').filter(Boolean);

  const items = [
    { label: 'Trang chủ', href: basePath },
    ...pathSegments.map((seg, idx) => {
      const href = `${basePath}/${pathSegments.slice(0, idx + 1).join('/')}`;
      return {
        label: decodeURIComponent(seg.replace(/-/g, ' ')),
        href: idx === pathSegments.length - 1 ? null : href, // Không cho click item cuối
      };
    }),
  ];

  return <Breadcrumb items={items} />;
};

export default AutoBreadcrumb;
