import React, { useState } from "react";

import Wrapper from "@/components/Wrapper";
import { IoMdHeartEmpty } from "react-icons/io";
import ProductDetailsCarousel from "@/components/ProductDetailsCarousel";
import { fetchDatafromApi } from "@/utils/api";
import RelatedProduct from "@/components/RelatedProduct";
import { getdiscountedPricePercentage } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "@/store/cartSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = ({ product, relatedProducts }) => {
  const [selectedsize, setselectedsize] = useState();
  const [showerroe, setshowerror] = useState(false);
  const dispatch = useDispatch();

  const notify = () => {
    toast.success("Success. Check your Cart", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const p = product?.data?.[0]?.attributes;
  return (
    <div className="w-full md:py-20">
      <ToastContainer />
      <Wrapper>
        <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px] ">
          {/* left colum start */}
          <div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full lg:mx-0 ">
            <ProductDetailsCarousel images={p.image.data} />
          </div>
          {/* left colum end */}

          {/* right colum start */}
          <div className="flex-[1] py-3">
            <div className="text-[34px] font-semibold mb-2 ">{p.name}</div>
            <div className="text-lg font-semibold mb-5">{p.subtitle}</div>
            <div className="flex items-center  text-black/[0.5] ">
              <p className="mr-2  text-lg text-black/[0.7] font-semibold ">
                {" "}
                MRP : &#8377;{p.price}
              </p>
              {p.original && (
                <>
                  <p className="text-base font-medium line-through">
                    &#8377;{p.original}
                  </p>
                  <p className="ml-auto text-base font-medium text-green-500 ">
                    {getdiscountedPricePercentage(p.original, p.price)}% off
                  </p>
                </>
              )}
            </div>
            <div className="text-md font-medium text-black/[0.5] ">
              {" "}
              incl. of taxes{" "}
            </div>
            <div className="text-md font-medium text-black/[0.5] mb-12 ">
              {" "}
              {`(Also includes all applicable duties)`}{" "}
            </div>

            {/* product size range start */}
            <div className="mb-10">
              <div className="flex justify-between mb-2 ">
                <div className="text-md font-semibold ">Select Size</div>
                <div className="text-md font-medium text-black/[0.5] cursor-pointer ">
                  Select Guide
                </div>
              </div>

              <div id="sizeGrid" className="grid grid-cols-3 gap-2">
                {p.size.data.map((s, id) => (
                  <div
                    key={id}
                    className={`border rounded-md text-center py-3 font-medium 
                    ${
                      s.enabled
                        ? " hover:border-black  cursor-pointer"
                        : "cursor-not-allowed bg-black/[0.1] opacity-50 "
                    }
                    ${selectedsize === s.size ? "border-black" : " "}`}
                    onClick={() => {
                      setselectedsize(s.size);
                      setshowerror(false);
                    }}
                  >
                    {s.size}
                  </div>
                ))}
              </div>

              {/* show error start */}
              {showerroe && (
                <div className="text-red-600 mt-1 ">
                  Size selection is required
                </div>
              )}
            </div>

            {/* add to cart button start */}
            <button
              className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform  active:scale-95 mb-3 hover:opacity-75 "
              onClick={() => {
                if (!selectedsize) {
                  setshowerror(true);
                  document.getElementById("sizeGrid").scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                  });
                } else {
                  dispatch(addTocart({ ...product?.data?.[0], selectedsize, oneQuantityprice: p.price }));
                  notify()
                }
              }}
            >
              Add to Cart
            </button>
            <button className="w-full py-4 rounded-full border border-black text-black text-lg font-medium flex items-center justify-center gap-2 transition-transform  active:scale-95 mb-10 hover:opacity-75  ">
              WishList
              <IoMdHeartEmpty size={20} />
            </button>

            <div className="">
              <div className="text-lg font-bold mb-5">Prodct Details</div>
              <p
                className="text-md mb-5
              "
              >
                {p.description}
              </p>
              <p
                className="text-md mb-5
              "
              ></p>
            </div>
          </div>
          {/* right colum end */}
        </div>

        <RelatedProduct relatedProducts={relatedProducts} />
      </Wrapper>
    </div>
  );
};

export default ProductDetails;

export async function getStaticPaths() {
  const products = await fetchDatafromApi("/api/products?populate=*");

  const paths = products.data.map((p) => ({
    params: {
      slug: p.attributes.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const product = await fetchDatafromApi(
    `/api/products?populate=*&filters[slug][$eq]=${slug}`
  );

  const relatedProducts = await fetchDatafromApi(
    `/api/products?populate=*&[filters][slug][$ne]=${slug}`
  );

  return {
    props: {
      product,
      relatedProducts,
    },
  };
}
