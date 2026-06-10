import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

interface IItem {
    _id: string;
    title: string;
    description: string;
    img: string;
    price: number;
    discount?: number;
    stock: number;
    slug: string;
    colors: string[];
    size: string[];
    published?: boolean; // Ensure this is typed if used in filter
    details?: {
        name: string;
        value: string;
    }[];
    createdAt: string;
}

interface ISlug {
    _id: string;
    category: string;
}

interface ICategory {
    _id: string;
    name: string;
}

const ShoppingShow: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const catQuery = searchParams.get('cat');

    // Products Data States
    const [originalProducts, setOriginalProducts] = useState<IItem[]>([]);
    const [slugs, setSlugs] = useState<ISlug[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);

    // Status States
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter and sort controls states
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('default');

    // Fetch initial data (Products, Slugs, Categories)
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [productsRes, slugsRes, catsRes] = await Promise.all([
                    axios.get<IItem[]>(`${import.meta.env.VITE_SERVER}/products`),
                    axios.get<ISlug[]>(`${import.meta.env.VITE_SERVER}/slug`),
                    axios.get<ICategory[]>(`${import.meta.env.VITE_SERVER}/category`)
                ]);

                if (productsRes.status === 200) setOriginalProducts(productsRes.data);
                if (slugsRes.status === 200) setSlugs(slugsRes.data);
                if (catsRes.status === 200) setCategories(catsRes.data);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError('Failed to load shop items. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // ✨ THE MAGIC HAPPENS HERE: Compute filtered products on the fly using useMemo
    const filteredProducts = useMemo(() => {
        let result = [...originalProducts];

        // 1. Apply Category Query Filter from URL if present
        if (catQuery && catQuery !== 'default') {
            const activeCategory = categories.find(
                (c) => c.name.toLowerCase() === catQuery.toLowerCase()
            );

            if (activeCategory) {
                // Find all slugs matching this category ID
                const matchingSlugIds = slugs
                    .filter((s) => s.category === activeCategory._id)
                    .map((s) => s._id);

                // Filter products that belong to those slug IDs
                result = result.filter((p) => matchingSlugIds.includes(p.slug));
            } else {
                // If catQuery exists but category isn't found, return empty array
                result = [];
            }
        }

        // 2. Apply Price Filters
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (!isNaN(min)) {
            result = result.filter(p => (p.price - (p.discount || 0)) >= min);
        }
        if (!isNaN(max)) {
            result = result.filter(p => (p.price - (p.discount || 0)) <= max);
        }

        // 3. Apply Sorting
        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'priceLowToHigh') {
            result.sort((a, b) => (a.price - (a.discount || 0)) - (b.price - (b.discount || 0)));
        } else if (sortBy === 'priceHighToLow') {
            result.sort((a, b) => (b.price - (b.discount || 0)) - (a.price - (a.discount || 0)));
        }

        return result;
    }, [originalProducts, slugs, categories, catQuery, minPrice, maxPrice, sortBy]);


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
                <p className="ml-3 text-lg text-gray-700">Loading Products...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-red-500 text-lg">{error}</div>;
    }

    if (originalProducts.length === 0 && !loading) {
        return <div className="text-center py-10 text-gray-600 text-lg">No products found.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO
                title={catQuery ? `${t("Shop")} - ${catQuery}` : t("Shop All Products")}
                description={t("Discover our latest collection of high-quality products. Shop now for the best deals at SaSha Store.")}
                keywords={`shopping, fashion, online store, ${catQuery || 'men, women'}`}
            />
            {/* Filter and Sort Controls */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">{t("Min Price (EGP)")}</label>
                        <input
                            type="number"
                            id="minPrice"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="e.g., 50"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">{t("Max Price (EGP)")}</label>
                        <input
                            type="number"
                            id="maxPrice"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="e.g., 500"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">{t("Sort By")}</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="default">{t("Default")}</option>
                            <option value="newest">{t("Newest Arrivals")}</option>
                            <option value="priceLowToHigh">{t("Price: Low to High")}</option>
                            <option value="priceHighToLow">{t("Price: High to Low")}</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">{t("Categories")}</label>
                        <select
                            id="categorySelect"
                            value={catQuery || 'default'}
                            onChange={(e) => {
                                if (e.target.value === 'default') {
                                    navigate('/shopping');
                                } else {
                                    navigate(`/shopping?cat=${e.target.value}`);
                                }
                            }}
                            className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="default">{t("Default")}</option>
                            {categories?.length > 0 && categories?.map((cat) => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Handled publication filtering directly during array manipulation or display */}
                    {filteredProducts.filter((p) => p.published !== false).map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 text-lg">{t("No Items Found")}</div>
            )}
        </div>
    );
};

export default ShoppingShow;