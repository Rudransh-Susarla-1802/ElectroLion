import React, { useState } from 'react';
import { Search, Menu, Filter, ArrowDownUp, ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import FilterModal from '../PageComponents/FilterModal';
import SortModal from '../PageComponents/SortModal';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({});
  const [sortOptions, setSortOptions] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => setSearchValue(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim() !== '') {
      navigate('/searched', {
        state: {
          searchTerm: searchValue,
          filters,
          ...sortOptions,
        },
      });
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
    navigate('/searched', {
      state: {
        searchTerm: searchValue,
        filters: newFilters,
        ...sortOptions,
      },
    });
  };

  const handleApplySort = (newSortOptions) => {
    setSortOptions(newSortOptions);
    setIsSortOpen(false);
    navigate('/searched', {
      state: {
        searchTerm: searchValue,
        filters,
        ...newSortOptions,
      },
    });
  };

  return (
    <div className="header h-1/7 bg-[#0B192C] flex items-center justify-between px-4">
      {/* Left */}
      <div className="header-left flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          ElectoLion
        </h1>
        <span className="text-2xl font-bold mx-4 text-[#FF6500]">|</span>
        <span className="text-md font-bold text-white">Rule Boldly</span>
      </div>

      {/* Center: Search */}
      <div className="flex items-center border-2 border-[#1E3E62] hover:border-[#FF6500] rounded-md px-4">
        <Search size={20} className="text-white mr-2" />
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full h-10 rounded-md px-4 outline-none bg-transparent text-white placeholder-white"
        />
      </div>

      {/* Right: Filter, Sort, Profile */}
      <div className="flex items-center gap-3">
        {/* Filter Button */}
        <div
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className="rounded-md cursor-pointer border-2 border-white p-2"
        >
          <Filter color="white" size={22} />
        </div>

        {/* Sort Button */}
        <div
          onClick={() => setIsSortOpen((prev) => !prev)}
          className="rounded-md cursor-pointer border-2 border-white p-2"
        >
          <ArrowDownUp color="white" size={22} />
        </div>

        <div
          onClick={() => {
            if (location.pathname === '/cart') {
              const lastPage = localStorage.getItem('lastNonCartPage') || '/';
              navigate(lastPage);
            } else {
              navigate('/cart');
            }
          }}
          className="rounded-md cursor-pointer border-2 border-white p-2"
        >
          <ShoppingCart color="white" size={22} />
        </div>

        {/* Profile Button */}
        <div
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="rounded-md cursor-pointer border-2 border-white p-2"
        >
          <Menu color="white" size={22} />
        </div>

        {/* Modals */}
        {isModalOpen && <ProfileModal onClose={() => setIsModalOpen(false)} />}
        {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} onApply={handleApplyFilters} />}
        {isSortOpen && <SortModal onClose={() => setIsSortOpen(false)} onApply={handleApplySort} />}
      </div>
    </div>
  );
};

export default Header;
