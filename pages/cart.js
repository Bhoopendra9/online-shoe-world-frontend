import React, { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import CartItem from "@/components/CartItem";
import { useSelector } from "react-redux";

import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

import { makePaymentRequest } from "@/utils/api";

const Cart = () => {
  const [loading, setloading] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);

  const subTotal = useMemo(() => {
    return cartItems.reduce((total, val) => total + val.attributes.price, 0);
  }, [cartItems]);

  const handlePayment = async () => {
    try {
      setloading(true);
      const stripe = await stripePromise;
      const res = await makePaymentRequest("/api/orders", {
        products: cartItems,
      });

      await stripe.redirectToCheckout({ sessionId: res.stripeSession.id });
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  return (
    <div
      className="w-full md
    py-20"
    >
      <Wrapper>
        {cartItems.length > 0 && (
          <>
            {/* heading and paragraph start */}
            <div className="max-w-[800px] text-center mx-auto mt-8 md:mt-0 ">
              <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight ">
                Shoppping Cart
              </div>
            </div>
            {/* heading and paragraph end */}

            {/* cart content start */}
            <div className="flex flex-col lg:flex-row gap-12 py-10 ">
              {/* cart content left */}
              <div className="flex-[2] ">
                <div className="text-lg font-bold">Cart Items</div>
                <div className="">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} data={item} />
                  ))}
                </div>
              </div>

              {/* cart content right */}
              <div className="flex-[1]">
                <div className="text-lg font-bold">Summry</div>

                <div className="p-5 my-5 bg-black/[0.05] rounded-xl ">
                  <div className="flex justify-between">
                    <div className="uppercase text-md md:text-lg font-medium text-block ">
                      subTotal
                    </div>
                    <div className="text-md md:text-lg font-medium text-black">
                      &#8377;{subTotal}
                    </div>
                  </div>
                  <div className="text-sm md:text-md py-5 border-t mt-5">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Quaerat doloremque voluptatum, earum amet praesentium
                    tempore voluptates molestiae debitis commodi, dolor nostrum
                    tenetur sapiente eveniet quidem nemo a odit expedita qui
                    illo. Laudantium ipsum quos voluptate perspiciatis doloribus
                    facilis iusto explicabo porro qui, rem maxime nesciunt ex
                    illo commodi assumenda cumque?
                  </div>
                </div>
                <button
                  className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center justify-center gap-2 "
                  onClick={handlePayment}
                >
                  Checkout
                  {loading && <img src="/spinner.svg" />}
                </button>
              </div>
            </div>
            {/* cart content end */}
          </>
        )}

        {/* this is empty cart code */}

        {cartItems.length < 1 && (
          <div className="flex flex-[2] flex-col items-center pb-[50px] md:mt-14 ">
            <Image
              src="/empty-cart.jpg"
              width={300}
              height={300}
              className="w-[300px] md:w-[400px] "
            />
            <span className="text-xl font-bold ">Your cart is empty</span>
            <span
              className="text-center mt-4 mb-10
          "
            >
              Seems like you have not added anthing in your Cart.
              <br />
              Go ahead and explore top categories
            </span>
            <Link
              href="/"
              className="py-4 px-8 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 "
            >
              Countinue Shopping
            </Link>
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default Cart;
