import Link from "next/link";
import React from "react";

function Header() {
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

      {/* right section */}
      <div className="header-right flex md:justify-end md:flex-shrink items-center md:space-x-3 space-x-1"></div>
    </header>
  );
}

export default Header;
