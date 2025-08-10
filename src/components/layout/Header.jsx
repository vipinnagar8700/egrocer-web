import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaMoon, FaRegUser, FaSun } from "react-icons/fa";
import * as api from "@/api/apiRoutes";
import {
  IoCartOutline,
  IoPersonOutline,
  IoLocationOutline,
  IoHomeOutline,
  IoSearchOutline,
  IoLanguage,
} from "react-icons/io5";
import { FaPhoneVolume, FaXTwitter } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import CartDrawer from "../cart/CartDrawer";
import Login from "../login/Login";
import { t } from "@/utils/translation";
import { useDispatch, useSelector } from "react-redux";
import Location from "@/components/locationmodal/Location";
import {
  BiBell,
  BiBookmarkHeart,
  BiCartAlt,
  BiUserCircle,
  BiWallet,
} from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCity } from "@/redux/slices/citySlice";
import { setLocalTheme } from "@/redux/slices/themeSlice";
import { useTheme } from "next-themes";
import LogoutModal from "../logoutmodal/LogoutModal";
import ProfileDrawer from "../profiledashboard/ProfileDrawer";
import { clearCheckout } from "@/redux/slices/checkoutSlice";
import {
  setFilterSearch,
  setProductBySearch,
  setSearchedCategory,
} from "@/redux/slices/productFilterSlice";
import SearchComponent from "../search/SearchComponent";
import { useMediaQuery } from "react-responsive";
import { IoIosCloseCircle } from "react-icons/io";
import { setSelectedLanguage } from "@/redux/slices/languageSlice";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import Image from "next/image";
import MobileNavSidebar from "../mobile-nav-sidebar/MobileNavSidebar";

import { setAvailableLanguages } from "@/redux/slices/languageSlice";
import { CiSun } from "react-icons/ci";
import { FiMoon } from "react-icons/fi";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const themes = useSelector((state) => state.Theme);
  const cart = useSelector((state) => state.Cart);
  const setting = useSelector((state) => state.Setting);
  const user = useSelector((state) => state.User);
  const city = useSelector((state) => state.City);
  const filter = useSelector((state) => state.ProductFilter);
  const language = useSelector((state) => state.Language);

  // Device Width Checking
  const isMobile = useMediaQuery({ query: "(max-width: 765px)" });

  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [mobileActiveKey, setMobileActiveKey] = useState(1);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [showProfile, setShowProfile] = useState(false);

  const [showLocation, setShowLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchCatId, setSearchCatId] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isSuggLoading, setIsSuggLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (router?.pathname != "/checkout") {
      dispatch(clearCheckout());
    }
  }, [router]);

  useEffect(() => {
    // if mobile screen is dragged to desktop screen close the mobile search
    if (isMobile === false && mobileSearch === true) {
      setMobileSearch(false);
    }
  }, [isMobile]);
  useEffect(() => {
    fetchCity();
  }, [setting]);
  useEffect(() => {
    if (router.pathname.includes("/profile")) {
      setMobileActiveKey(3);
    }
  }, [router.pathname]);

  const handleChangeTheme = (theme) => {
    setTheme(theme);
    dispatch(setLocalTheme({ data: theme }));
  };

  const handleLanguageChange = async (language) => {
    try {
      const response = await api.getSystemLanguages({
        id: language?.id,
        isDefault: 0,
        systemType: 3,
      });
      if (response.status == 1) {
        dispatch(setSelectedLanguage({ data: response?.data }));
        document.documentElement.dir = response?.data?.type;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchCity = async () => {
    try {
      if (setting?.setting?.default_city && city?.city == null) {
        const latitude = parseFloat(setting.setting.default_city?.latitude);
        const longitude = parseFloat(setting.setting.default_city?.longitude);
        const response = await api.getCity({
          latitude: latitude,
          longitude: longitude,
        });
        if (response.status === 1) {
          dispatch(setCity({ data: response.data }));
        } else {
          setShowLocation(true);
        }
      } else if (
        setting?.setting &&
        setting.setting?.default_city == null &&
        city?.city == null
      ) {
        setShowLocation(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCartOpen = () => {
    if (router.pathname == "/checkout") {
      router.push("/cart");
    } else {
      setShowCart(true);
    }
  };

  const handleLoginOpen = () => {
    setShowLogin(true);
  };

  const handleOpenLocation = () => {
    setShowLocation(true);
  };

  const handleHomeClick = () => {
    setMobileActiveKey(1);
    router.push("/");
  };

  const handleProfileClick = () => {
    setMobileActiveKey(3);
    if (user?.jwtToken) {
      setShowProfile(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleSearchCategory = (value) => {
    setSearchCatId(value);
    dispatch(setSearchedCategory({ data: value }));
  };
  const handleSearchData = async (searchValue) => {
    setIsSuggLoading(true);
    try {
      const response = await api.getProductByFilter({
        latitude: city?.city?.latitude,
        longitude: city?.city?.longitude,
        filters: {
          search: searchValue,
          category_id: filter?.searchedCategory,
        },
      });
      dispatch(setProductBySearch({ data: response?.data }));
      setIsSuggLoading(false);
    } catch (error) {
      console.log("Error", error?.message);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      dispatch(setProductBySearch({ data: [] }));
      dispatch(setFilterSearch({ data: "" }));
      clearTimeout(typingTimeout);
      return;
    }
    setIsSuggLoading(true);
    dispatch(setFilterSearch({ data: e.target.value }));
    dispatch(setSearchedCategory({ data: searchCatId }));
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      handleSearchData(e.target.value);
    }, 2000);
    setTypingTimeout(timeout);
  };

  const handleMobileSearch = () => {
    setMobileSearch(!mobileSearch);
  };

  const handleMobileNav = () => {
    setMobileNav(!mobileNav);
  };

  return (
    <>
      <section className="border-b-2">
        <div className="w-full primaryBackColor top-header text-white  md:block hidden">
          <div className="container  flex justify-between items-center h-[40px] px-2">
            <div className="w-[50%]">
              {setting?.setting?.social_media?.length > 0 && (
                <div className="flex items-center">
                  <p>{t("follow_us")}</p>
                  <div className="flex">
                    <ul className="flex gap-0 px-[16px] py-[8px]">
                      {setting?.setting?.social_media &&
                        setting?.setting?.social_media?.map((social, index) => {
                          return (
                            <Link
                              key={social?.id}
                              href={social?.link || "#"}
                              target="_blank"
                            >
                              <li className="border-r-[2px]  p-3 border-white py-[2px]">
                                {social?.icon
                                  .toLowerCase()
                                  .includes("wechat") ? (
                                  // Special handling for WeChat icon
                                  <i className="fab fa-weixin"></i>
                                ) : social?.icon
                                    .toLowerCase()
                                    .includes("twitter") ? (
                                  // Special handling for TikTok icon
                                  <FaXTwitter className={`${social?.icon}`} />
                                ) : (
                                  <i className={`${social?.icon}`}></i>
                                )}
                              </li>
                            </Link>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-[8px] flex-last">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-[100px] border-none flex items-center gap-2 justify-center">
                  {themes?.theme == "light" ? <FaSun /> : <FaMoon />}
                  {t(themes?.theme)}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[100px] ">
                  <DropdownMenuItem
                    onSelect={() => handleChangeTheme("light")}
                    className="flex gap-2"
                  >
                    <FaSun />
                    {t("light")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleChangeTheme("dark")}
                    className="flex gap-2"
                  >
                    <FaMoon />
                    {t("dark")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-[100px] border-none flex items-center gap-2 justify-center">
                  <IoLanguage />{" "}
                  {language?.selectedLanguage
                    ? language?.selectedLanguage?.name
                    : "English"}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[100px] ">
                  {language?.availableLanguages &&
                    language?.availableLanguages?.map((language) => {
                      return (
                        <DropdownMenuItem
                          onSelect={() => handleLanguageChange(language)}
                          key={language?.id}
                          className="flex gap-2"
                        >
                          {language?.name}
                        </DropdownMenuItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="headerBackgroundColor pb-3 relative">
          <div className="center-header headerBackgroundColor container">
            <div className="  px-2 flex justify-between items-center pb-[8px] md:py-[12px] lg:py-4 columns-3 border-b-2  md:border-none py-2">
              <div className=" aspect-square relative order-2 lg:order-1 h-[38px] lg:h-[45px] w-[140px] lg:w-[170px]">
                <Link href={"/"}>
                  {setting?.setting?.web_settings?.web_logo && (
                    <Image
                      src={setting?.setting?.web_settings?.web_logo}
                      alt="Logo"
                      width={0}
                      height={0}
                      className="h-full lg:full w-full lg:w-full object-contain"
                      priority={true}
                    />
                  )}
                </Link>
              </div>
              <div className="hidden lg:flex order-2">
                <ul className="flex gap-6">
                  <Link
                    href={"/"}
                    className={router.pathname === "/" ? "primaryColor" : ""}
                  >
                    <li>{t("home")}</li>
                  </Link>
                  <Link
                    href={"/about-us"}
                    className={
                      router.pathname === "/about-us" ? "primaryColor" : ""
                    }
                  >
                    <li>{t("about_us")}</li>
                  </Link>
                  <Link
                    href={"/faqs"}
                    className={
                      router.pathname === "/faqs" ? "primaryColor" : ""
                    }
                  >
                    <li> {t("faq")}</li>
                  </Link>
                  <Link
                    href={"/contact-us"}
                    className={
                      router.pathname === "/contact-us" ? "primaryColor" : ""
                    }
                  >
                    <li>{t("contact_us")}</li>
                  </Link>
                </ul>
              </div>
              <div className="flex sm:order-1 md:order-1 lg:hidden hover:cursor-pointer">
                <RxHamburgerMenu size={21} onClick={handleMobileNav} />
              </div>
              <div className=" gap-4 order-3 hidden md:flex lg:flex ">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleCartOpen}
                >
                  {/* <span className='p-3 iconBackgroundColor rounded-full '><IoCartOutline size={24} className='iconsColor' /></span> */}
                  <span className="p-3 iconBackgroundColor rounded-full relative">
                    <IoCartOutline size={24} className="iconsColor" />
                    {cart.isGuest == true ? (
                      <p
                        className={
                          cart?.guestCart?.length != 0
                            ? "flex absolute top-[-7px] right-0  bodyTextColor textBackground rounded-full h-[20px] w-[20px] items-center justify-center text-center font-bold text-sm"
                            : "none"
                        }
                      >
                        {" "}
                        {cart?.guestCart?.length != 0
                          ? cart?.guestCart?.length
                          : null}
                      </p>
                    ) : (
                      <p
                        className={
                          cart?.cartProducts?.length != 0
                            ? "flex absolute bodyTextColor top-[-7px] right-0   textBackground rounded-full text-center h-5 w-5 items-center justify-center p-1 font-bold text-sm"
                            : "none"
                        }
                      >
                        {" "}
                        {cart?.cartProducts?.length != 0
                          ? cart?.cartProducts?.length
                          : null}
                      </p>
                    )}
                  </span>
                  <div className="flex flex-col ">
                    <span className="text-sm">{t("your_cart")}</span>
                    <span className="text-base font-bold">
                      {setting.setting && setting.setting.currency}
                      {cart.isGuest == true
                        ? cart?.guestCartTotal?.toFixed(2)
                        : cart?.cartSubTotal?.toFixed(2)}
                    </span>
                  </div>
                </div>
                {user?.jwtToken !== "" ? (
                  <div className="flex gap-2 items-center cursor-pointer">
                    <div className="flex ">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center border-none outline-none gap-2 p-0 shadow-none font-bold text-base ">
                          <span className="p-3 iconBackgroundColor rounded-full">
                            <IoPersonOutline size={24} className="iconsColor" />
                          </span>
                          {t("profile")}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Link href={"/profile"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <BiUserCircle size={22} />
                                {t("editProfile")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={"/profile/activeorders"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2  text-base font-semibold bg-transparent">
                                <BiCartAlt size={22} />
                                {t("orders")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={"/profile/wishlist"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <BiBookmarkHeart size={22} />
                                {t("wishlist")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={"/profile/notifications"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <BiBell size={22} />
                                {t("notification")}
                              </span>
                            </DropdownMenuItem>
                          </Link>

                          <Link href={"/profile/address"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <IoLocationOutline size={22} />
                                {t("myAddress")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={"/profile/wallethistory"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <BiWallet size={22} />
                                {t("walletBalance")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="items-center flex justify-start h-full">
                            <span
                              className="flex p-2 gap-2 text-base font-semibold bg-transparent"
                              onClick={() => setShowLogout(true)}
                            >
                              <RiLogoutCircleRLine size={20} />
                              {t("logout")}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={handleLoginOpen}
                  >
                    <span className="p-3 iconBackgroundColor rounded-full">
                      <IoPersonOutline size={24} className="iconsColor" />
                    </span>
                    <div className="flex ">
                      <span className="text-base font-bold">{t("login")}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex  md:hidden gap-2 order-3 items-center">
                <div>
                  {themes?.theme == "light" ? (
                    <CiSun
                      onClick={() => handleChangeTheme("dark")}
                      size={24}
                    />
                  ) : (
                    <FiMoon
                      onClick={() => handleChangeTheme("light")}
                      size={24}
                    />
                  )}
                </div>
                <div onClick={handleCartOpen} className="relative">
                  <IoCartOutline size={24} />{" "}
                  {cart.isGuest == true ? (
                    <p
                      className={
                        cart?.guestCart?.length != 0
                          ? "flex absolute  bottom-4 left-4  bodyTextColor textBackground rounded-full h-[18px] w-[18px] items-center justify-center text-center font-semibold text-xs"
                          : "none"
                      }
                    >
                      {" "}
                      {cart?.guestCart?.length != 0
                        ? cart?.guestCart?.length
                        : null}
                    </p>
                  ) : (
                    <p
                      className={
                        cart?.cartProducts?.length != 0
                          ? "flex absolute bodyTextColor bottom-4 left-4   textBackground rounded-full text-center h-4 w-4 items-center justify-center p-1 font-bold text-sm"
                          : "none"
                      }
                    >
                      {" "}
                      {cart?.cartProducts?.length != 0
                        ? cart?.cartProducts?.length
                        : null}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-header ">
            <div className="container mx-auto grid grid-cols-12 items-center justify-between mt-2 mb-4 px-2 ">
              {/* First column: col-3 equivalent */}
              <div
                className="col-span-4 lg:col-span-3 flex gap-2 items-center cursor-pointer"
                onClick={handleOpenLocation}
              >
                <span className="p-3 iconBackgroundColor  rounded-full">
                  <IoLocationOutline size={24} className="iconsColor" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm ">{t("deliver_to")}</span>
                  <span className="block text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap w-40">
                    <>
                      {city.status === "fulfill" ? (
                        city?.city?.formatted_address
                      ) : (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">
                              {t("loading")}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  </span>
                </div>
              </div>
              <div className="hidden md:block lg:col-span-6 md:col-span-8">
                <SearchComponent
                  isSuggLoading={isSuggLoading}
                  isMobile={isMobile}
                  handleSearchCategory={handleSearchCategory}
                  handleSearch={handleSearch}
                />
              </div>
              {setting?.setting?.support_number && (
                <div className="col-span-3 hidden order-3 justify-end lg:flex  h-full">
                  <Link
                    href={`tel:${setting?.support_number}`}
                    className="p-[10px]   flex items-center justify-center font-medium text-white  rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 primaryBackColor gap-2 text-xl"
                  >
                    <FaPhoneVolume size={18} />{" "}
                    {setting?.setting?.support_number}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <Sheet open={mobileSearch} onOpenChange={setMobileSearch}>
          <SheetContent
            className="p-0 w-full sm:w-[900px]"
            side={language?.selectedLanguage?.type == "RTL" ? "left" : "right"}
          >
            <SheetHeader>
              <SheetTitle className="flex justify-between px-4 py-2 items-center">
                {t("search")}
                <SheetTrigger className="focus:outline-none">
                  <IoIosCloseCircle size={32} />
                </SheetTrigger>
              </SheetTitle>
              <SheetDescription>
                <SearchComponent
                  isSuggLoading={isSuggLoading}
                  isMobile={isMobile}
                  mobileSearch={mobileSearch}
                  setMobileSearch={setMobileSearch}
                  handleSearch={handleSearch}
                  handleSearchCategory={handleSearchCategory}
                />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <MobileNavSidebar
          open={mobileNav}
          setOpen={setMobileNav}
          handleLanguageChange={handleLanguageChange}
        />
        <CartDrawer
          showCart={showCart}
          setShowCart={setShowCart}
          setMobileActiveKey={setMobileActiveKey}
        />
        <Login
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          setMobileActiveKey={setMobileActiveKey}
        />
        <Location
          showLocation={showLocation}
          setShowLocation={setShowLocation}
        />
        <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
      </section>
      <section className="fixed bottom-0 left-0 w-full z-50 md:hidden backgroundColor pt-3">
        <div className="container flex items-center justify-center px-2 ">
          <div className="flex  justify-between gap-16">
            <div
              className={`flex flex-col items-center gap-1`}
              onClick={handleHomeClick}
            >
              <IoHomeOutline
                size={24}
                className={`h-10 w-10 ${
                  mobileActiveKey == 1
                    ? "primaryBackColor text-white  "
                    : "bg-[#55AE7B14] primaryColor "
                }p-2 rounded-full`}
              />
              <span className="text-sm">{t("home")}</span>
            </div>

            <div
              className={`flex flex-col items-center gap-1`}
              onClick={handleMobileSearch}
            >
              <IoSearchOutline
                size={24}
                className={`h-10 w-10 ${
                  mobileActiveKey == 2
                    ? "primaryBackColor text-white "
                    : "bg-[#55AE7B14] primaryColor "
                } p-2 rounded-full`}
              />
              <span className="text-sm">{t("search")}</span>
            </div>

            <div
              className={`flex flex-col items-center gap-1`}
              onClick={handleProfileClick}
            >
              <FaRegUser
                size={24}
                className={`h-10 w-10 ${
                  mobileActiveKey == 3
                    ? "primaryBackColor text-white "
                    : "bg-[#55AE7B14] primaryColor "
                } p-2 rounded-full`}
              />
              <span className="text-sm">
                {user?.jwtToken ? t("profile") : t("login")}
              </span>
            </div>
          </div>
        </div>
      </section>
      <ProfileDrawer
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
    </>
  );
};

export default Header;
