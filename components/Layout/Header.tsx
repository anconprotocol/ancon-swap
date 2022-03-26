import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { selectProvider } from "../../redux/features/provider/providerSlice";

function Header() {
  const { address } = useSelector(selectProvider);
  const { theme, setTheme } = useTheme()
  return (
    <header className="grid grid-cols-1 p-4 items-center shadow-md dark:bg-blueGray-800 bg-gray-100 justify-items-center">
      {/* left section */}
      <div className="flex justify-between col-span-2 w-full">
        <Link passHref href={"/"}>
          <div className="flex md:flex-grow cursor-pointer">
            <img
              className="ifesa-logo"
              src={"/ifesa-logo.png"}
              width={"150px"}
              height={"35px"}
            ></img>
            <img
              src={"/ancon-logo.png"}
              width={"35px"}
              height={"35px"}
              className="ml-2 md:ml-4"
            ></img>
          </div>
        </Link>
        {address && (
          <div className="bg-primary-500 rounded-full px-3 py-1">
            <p className="font-medium text-white">
              {address?.slice(0, 6)}...{address?.slice(-6)}
            </p>
          </div>
        )}
        {theme == "dark" ? (
          <SunIcon
            onClick={() => setTheme("light")}
            className="text-yellow-300 ml-2 w-6 cursor-pointer"
          />
        ) : (
          <MoonIcon
            onClick={() => setTheme("dark")}
            className="text-yellow-300 ml-2 w-6 cursor-pointer"
          />
        )}
      </div>

      <div className="bg-primary-500 rounded-xl p-2 flex col-span-2 w-full md:w-1/2 mt-10 items-center dark:bg-primary-500">
        <img
          src={"/ancon-logo.png"}
          width={"35px"}
          height={"35px"}
          className="ml-2 md:ml-4"
        ></img>
        <p className="text-white select-none">
          PHISHING WARNING: please make sure youre visiting
          https://dex.anconprotocol.com/ - check the URL carefully.:
        </p>
      </div>
    </header>
  );
}

export default Header;
