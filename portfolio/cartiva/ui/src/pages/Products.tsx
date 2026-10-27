import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { productsApi } from '../services/api';
import { Product, PaginatedResponse } from '../types';
import ProductCard from '../components/ProductCard';
import { Section, SectionTitle, Button, Grid, LoadingSpinner, ErrorMessage } from '../styles/App.styles';

const ProductsContainer = styled.div`
  padding-top: 100px;
  min-height: 100vh;
`;

const FiltersContainer = styled.div`
  background: #f8f9fa;
  padding: 2rem 0;
  margin-bottom: 2rem;
`;

const FiltersContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 0.875rem;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const ResultsCount = styled.p`
  color: #666;
  font-size: 0.875rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: ${props => props.disabled ? '#f5f5f5' : 'white'};
  color: ${props => props.disabled ? '#999' : '#1a1a1a'};
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
  }
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });

  const currentParams = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '12',
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    search: searchParams.get('search') || '',
    isFeatured: searchParams.get('featured') === 'true',
    isOnSale: searchParams.get('sale') === 'true',
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: PaginatedResponse<Product> = await productsApi.getAll(currentParams);
        setProducts(response.products);
        setPagination(response.pagination);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page when filtering
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <ProductsContainer>
        <LoadingSpinner />
      </ProductsContainer>
    );
  }

  if (error) {
    return (
      <ProductsContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <FiltersContainer>
        <FiltersContent>
          <FilterGroup>
            <FilterLabel>Search</FilterLabel>
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={currentParams.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Gender</FilterLabel>
            <FilterSelect
              value={currentParams.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">All</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="unisex">Unisex</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Sort By</FilterLabel>
            <FilterSelect
              value={`${currentParams.sortBy}-${currentParams.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Price Range</FilterLabel>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <SearchInput
                type="number"
                placeholder="Min"
                value={currentParams.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                style={{ minWidth: '80px' }}
              />
              <SearchInput
                type="number"
                placeholder="Max"
                value={currentParams.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                style={{ minWidth: '80px' }}
              />
            </div>
          </FilterGroup>
        </FiltersContent>
      </FiltersContainer>

      <div className="container">
        <ResultsInfo>
          <ResultsCount>
            Showing {products.length} of {pagination.totalProducts} products
          </ResultsCount>
        </ResultsInfo>

        {products.length > 0 ? (
          <>
            <Grid columns={4}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Grid>

            {pagination.totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Previous
                </PaginationButton>
                
                <PageInfo>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </PageInfo>
                
                <PaginationButton
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h3>No products found</h3>
            <p style={{ color: '#666', marginTop: '1rem' }}>
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </ProductsContainer>
  );
};

export default Products;
