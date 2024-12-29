import React from 'react';
import ProductCard from "@/components/shared/product/product-card";

interface ProductListProps {
    data: Record<string, any>[];
    title: string
    limit?: number
}

const ProductList = ({data, title, limit}: ProductListProps) => {
    const limitedData = limit ? data.slice(0, limit) : data;

    return (
        <div className={'my-10'}>
            <h2 className={'h2-bold mb-4'}>{title}</h2>
            {limitedData.length > 0 ? (
                <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}>
                    {
                        limitedData.map((product) => (
                            <ProductCard product={product} key={product.slug}/>
                        ))
                    }
                </div>
            ) : (
                <div>No products found </div>
            )}
        </div>
    );
};

export default ProductList;
