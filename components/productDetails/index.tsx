import React from "react";
import { IProduct } from "../../lib/types/products";
import Breadcrumb from "../UI/Breadcrumb";
import ImageSection from "./ImageSection";
import DetailsSection from "./DetailsSection";
import Benefits from "../Benefits";
import SimilarProducts from "./SimilarProducts";

interface Props {
  product: IProduct | null | undefined;
  products: IProduct[] | null | undefined;
}
const ProductDetails: React.FC<Props> = ({ product, products }) => {
  // Log para depuração
  console.log('ProductDetails - product:', product);
  console.log('ProductDetails - products:', products);

  if (!product) {
    return <div className="text-center py-12">Carregando produto...</div>;
  }
  const similarProductsList = Array.isArray(products)
    ? products.filter(
        (similarProduct) =>
          similarProduct &&
          similarProduct.slug &&
          product &&
          product.slug &&
          similarProduct.slug.current !== product.slug.current
      ).slice(0, 10)
    : [];

  return (
    <div className="flex flex-col">
      <Breadcrumb productName={product.name} />
      <div className="w-full xl:max-w-[2100px] mx-auto">
        <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap items-center md:items-start mt-8 relative">
          <ImageSection imgArray={product.image} product={product} />
          <DetailsSection product={product} />
        </div>
        <div className="border-2 my-8">
          <Benefits />
        </div>
        <SimilarProducts products={similarProductsList} />
      </div>
    </div>
  );
};

export default ProductDetails;
