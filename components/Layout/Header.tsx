import Link from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";
import { addressState } from "../../atoms/addressAtom";

function Header() {
  const address = useRecoilValue(addressState);
  return (
    <header className="flex justify-between p-4 items-center shadow-md bg-blueGray-800">
      {/* left section */}
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
      <div className="bg-yellow-200 rounded-xl px-3 p-2 flex mr-10 w-1/2">
        <img
          src={"/ancon-logo.png"}
          width={"35px"}
          height={"35px"}
          className="ml-2 md:ml-4"
        ></img>
        <p>
          PHISHING WARNING: please make sure youre visiting
          https://app.ancon.did.pa - check the URL carefully.:
        </p>
      </div>
      <div className="bg-primary-500 rounded-full px-3 py-1">
        <p className="font-medium text-white">
          {address.slice(0, 6)}...{address.slice(-6)}
        </p>
      </div>

      {/* right section */}
      <div className="header-right flex md:justify-end md:flex-shrink items-center md:space-x-3 space-x-1"></div>
    </header>
  );
}

export default Header;
