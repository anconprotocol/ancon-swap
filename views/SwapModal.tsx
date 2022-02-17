import React from "react";
import {
  ArrowSmDownIcon,
  ChevronDownIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
function SwapModal() {
  return (
    <section className="flex items-center justify-center">
      <div className="bg-[#0c0f1c] rounded-xl p-2 mt-8 md:mt-32 xl:mt-60 w-10/12 shadow-lg sm:w-7/12 sm:mt-12 sm:px-3 md:w-5/12 xl:w-3/12">
        {/* first section */}
        <div className="flex justify-between items-center">
          {/* title */}
          <h1 className="text-white font-black text-2xl">Swap</h1>
          {/* settings */}
          <CogIcon className="w-5 text-gray-100 sm:w-8" />
        </div>

        <div className="relative">
          {/* first token */}
          <div className="bg-[#2b334f] rounded-xl flex justify-between p-3 sm:py-5 items-center mt-2 relative">
            {/* dropdown */}
            <div className="bg-[#0c0f1c] flex flex-shrink rounded-xl px-3 py-2 text-white">
              <ChevronDownIcon className="w-5" />
              <p className="font-medium sm:text-xl xl:text-xl">
                WETH
              </p>
              <QuestionMarkCircleIcon className="w-5 text-gray-100 ml-1" />
            </div>
            <p className="text-xl text-white font-sans sm:text-2xl">
              0.0
            </p>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center justify-center">
              <div className="bg-[#2b334f] p-1 rounded-3xl my-2 border-4 border-[#0c0f1c]">
                <ArrowSmDownIcon className="w-5 text-white" />
              </div>
            </div>
          </div>
          {/* second token */}
          <div className="bg-[#2b334f] rounded-xl flex justify-between p-3 items-center mt-4 sm:py-5">
            {/* dropdown */}
            <div className="bg-[#0c0f1c] flex flex-shrink rounded-xl px-3 py-2 text-white">
              <ChevronDownIcon className="w-5" />
              <p className="font-medium sm:text-xl">ANCON</p>
              <QuestionMarkCircleIcon className="w-5 text-gray-100 ml-1" />
            </div>
            <p className="text-xl text-white font-sans sm:text-2xl">
              0.0
            </p>
          </div>
        </div>

        {/* button */}
        <div className="bg-primary-500 rounded-full flex justify-center items-center py-2 mt-5 mb-3">
          <p className="text-white font-bold text-lg">
            Connect Wallet
          </p>
        </div>
      </div>
    </section>
  );
}

export default SwapModal;
