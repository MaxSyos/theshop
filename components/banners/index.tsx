import React from "react";
import BannerBox from "./banner-box/BannerBox";
// Dados do banner virão por props
import SectionTitle from "../UI/SectionTitle";

interface BannerProps {
  bannerContent: Array<{
    title: string;
    description: string;
    numberOfDiscountDate: number;
    href: string;
    imgHeight: number;
    imgSrc: string;
    imgWidth: number;
    buttonText: string;
  }>;
}

const Banner: React.FC<BannerProps> = ({ bannerContent }) => {
  return (
    <div className="flex items-center flex-col w-full xl:max-w-[2100px] my-4 md:my-8 mx-auto">
      <SectionTitle title={"specialSale"} />
      <div className="grid gap-4 grid-cols-6 lg:grid-cols-12">
        {bannerContent.map((banner) => (
          <BannerBox {...banner} key={banner.title} />
        ))}
      </div>
    </div>
  );
};

export default Banner;
