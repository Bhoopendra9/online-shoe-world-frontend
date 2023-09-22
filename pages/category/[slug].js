import React, { useEffect, useState } from "react";

import Wrapper from "@/components/Wrapper";
import ProductCard from "@/components/ProductCard";
import { fetchDatafromApi } from "@/utils/api";
import useSWR from "swr";
import { useRouter } from "next/router";

const maxResult = 3;

const Category = ({ category, products, slug }) => {
  const [pageIndex, setpageIndex] = useState(1);

  const { query } = useRouter();

  useEffect(() => {
    setpageIndex(1);
  }, [query]);

  
  const { data, error, isLoading } = useSWR(
    `/api/products?populate=*&[filters][categories][slug][$eq]=${slug}&pagination$=${pageIndex}&pagination[pageSize]=${maxResult}`,
    fetchDatafromApi,
    { fallbackData: products }
  );

  return (
    <div className="w-full md:py-20 relative">
      <Wrapper>
        <div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0  ">
          <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight ">
            {category?.data?.[0]?.attributes.name}
          </div>
        </div>

        {/* products grid START */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0 ">
          {data?.data.map((product) => (
            <ProductCard key={product?.key} data={product} />
          ))}
        </div>

        {/* PAGINATION BUTTONS START */}
        {data?.meta?.pagination?.total > maxResult && (
          <div className="flex gap-2 items-center justify-center my-16 md:my-0 ">
            <button
              className={`rounded py-2 bg-black text-white px-4 disabled:bg-gray-200 disabled:text-gray-500`}
              disabled={pageIndex === 1}
              onClick={() => setpageIndex(pageIndex - 1)}
            >
              Previous
            </button>

            <span>{`${pageIndex} of ${
              data && data.meta.pagination.pageCount
            }`}</span>

            <button
              className={`rounded py-2 bg-black text-white px-4 disabled:bg-gray-200 disabled:text-gray-500`}
              disabled={pageIndex === (data && data.meta.pagination.pageCount)}
              onClick={() => setpageIndex(pageIndex + 1)}
            >
              Next
            </button>
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default Category;

export async function getStaticPaths() {
  const categories = await fetchDatafromApi(`/api/categories?populate=*`);

  const paths = categories.data.map((c) => ({
    params: {
      slug: c.attributes.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

// getstaticpaths requires using getstaticprops
export async function getStaticProps({ params: { slug } }) {
  const category = await fetchDatafromApi(
    `/api/categories?filters[slug][$eq]=${slug}`
  );
  const products = await fetchDatafromApi(
    `/api/products?populate=*&[filters][categories][slug][$eq]=${slug}&pagination[page]=1&pagination[pageSize]=${maxResult}`
  );

  return {
    props: {
      category,
      products,
      slug,
    },
  };
}
