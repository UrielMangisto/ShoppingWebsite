import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

const CategoryCard = ({ category }) => {
  const { id, name, description, image, productCount } = category;

  return (
    <Link
      to={`${ROUTES.CATEGORIES}/${id}`}
      className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Category Image */}
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-200"></div>
      </div>

      {/* Category Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {description}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </span>
        </div>

        {/* View Products Link */}
        <div className="mt-4 flex items-center text-sm text-blue-600">
          <span className="group-hover:underline">View products</span>
          <svg
            className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
