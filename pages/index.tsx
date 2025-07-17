import type { NextPage } from "next";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { useProducts } from "../hooks/useProducts";
import { specialOfferProductsActions } from "../store/specialOfferProducts-slice";
import { newestProductsActions } from "../store/newestProduct-slice";
import { mapBackendProductsToIProducts } from "../utilities/mapBackendProduct";

import Benefits from "../components/Benefits";
import Carousel from "../components/carousel";
const Offers = dynamic(() => import("../components/Offers/Offers"));
const Category = dynamic(() => import("../components/category/Category"));
const Newest = dynamic(() => import("../components/newest/Newest"));
const Brands = dynamic(() => import("../components/brands"));
import Banner from "../components/banners";
import { client as sanityClient } from "../lib/sanityClient";

const Home: NextPage = (props: any) => {
  const dispatch = useDispatch();
  const { products, newestProducts, loadProducts, loadNewestProducts } = useProducts();
  const [bannerContent, setBannerContent] = useState(props.bannerContent || []);

  useEffect(() => {
    // Carrega todos os produtos para ofertas
    loadProducts();
    // Carrega os produtos mais novos
    loadNewestProducts(10);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      // Mapeia produtos do backend para o formato do frontend
      const mappedProducts = mapBackendProductsToIProducts(products as any);
      // Filtra produtos com desconto para ofertas
      const offersProducts = mappedProducts.filter((item) => item.discount);
      dispatch(specialOfferProductsActions.addProducts(offersProducts));
    }
  }, [dispatch, products]);

  useEffect(() => {
    if (newestProducts.length > 0) {
      // Mapeia produtos novos do backend para o formato do frontend
      const mappedNewestProducts = mapBackendProductsToIProducts(newestProducts as any);
      dispatch(newestProductsActions.addProducts(mappedNewestProducts));
    }
  }, [dispatch, newestProducts]);

  useEffect(() => {
    // Busca banners do Sanity client-side
    sanityClient.fetch(`*[_type == "banner"]{
      title,
      description,
      buttonText,
      imgSrc,
      imgWidth,
      imgHeight,
      numberOfDiscountDate,
      href
    }`).then((data) => {
      setBannerContent(
        data.map((b: any) => ({
          ...b,
          imgSrc: b.imgSrc && b.imgSrc.asset ? b.imgSrc.asset.url : "",
        }))
      );
    });
  }, []);

  return (
    <>
      <Banner bannerContent={bannerContent} />
      <Benefits />
      <Carousel />
      <Offers />
      <Category />
      <Newest />
      <Brands />
    </>
  );
}

export default Home;
