import React, { useState, useEffect } from "react";

import Wrapper from "./Wrapper";
import Link from "next/link";
import Menu from "./Menu";
import MobileMenu from "./MobileMenu";

import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { BiMenuAltRight } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { fetchDatafromApi } from "@/utils/api";
import { useSelector } from "react-redux";

const Header = () => {
  const [mobileMenu, setmobileMenu] = useState(false);
  const [showCatMenu, setshowCatMenu] = useState(false);
  const [show, setshow] = useState("translate-y-0");
  const [lastScrolly, setlastScrolly] = useState(0);
  const [category, setcategory] = useState(null);

  const { cartItems } = useSelector((state) => state.cart);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrolly && !mobileMenu) {
        setshow("-translate-y-[80px]");
      } else {
        setshow("shadow-sm");
      }
    } else {
      setshow("translate-y-0");
    }
    setlastScrolly(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrolly]);

  const fetchcategoryfromapi = async () => {
    const { data } = await fetchDatafromApi(`/api/categories?populate=*`);
    setcategory(data);
  };
  useEffect(() => {
    fetchcategoryfromapi();
  }, []);
  return (
    <header
      className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show} `}
    >
      <Wrapper className="h-[60px] flex justify-between items-center ">
        <Link href="/">
          <img src="/logo.svg" className="w-[40px] md:w-[60px]" />
        </Link>
        <Menu
          showCatMenu={showCatMenu}
          setshowCatMenu={setshowCatMenu}
          category={category}
        />
        {mobileMenu && (
          <MobileMenu
            showCatMenu={showCatMenu}
            setshowCatMenu={setshowCatMenu}
            setmobileMenu={setmobileMenu}
            category={category}
          />
        )}

        <div className="flex justify-center items-center gap-2 text-black ">
          <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative ">
            <IoMdHeartEmpty className="text-[19px] md:text-[24px] " />{" "}
            <span className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px] ">
              17
            </span>
          </div>
          <Link href="/cart">
            <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative ">
              <BsCart className="text-[15px] md:text-[20px] " />{" "}
              {cartItems.length > 0 && (
                <span className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px] ">
                  {cartItems.length}
                </span>
              )}
            </div>
          </Link>

          {/* mobile Menu start*/}
          <div className="w-8 h-8 rounded-full flex justify-center items-center hover:bg-black/[0.05] md:hidden  cursor-pointer relative -mr-2 ">
            {mobileMenu ? (
              <VscChromeClose
                className="text-[20px] "
                onClick={() => setmobileMenu(false)}
              />
            ) : (
              <BiMenuAltRight
                className="text-[24px]"
                onClick={() => setmobileMenu(true)}
              />
            )}
          </div>
          {/* mobile Menu end*/}
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;
