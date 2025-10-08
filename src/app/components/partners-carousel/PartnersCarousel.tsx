// src/app/components/partners-carousel/PartnersCarousel.js

"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import styles from "./PartnersCarousel.module.css"; 

const partnersLogos = [
  { id: 1, src: "/apae-site-comemorativo/parceiros/parceiro-esperanca.png", alt: "Prefeitura de Esperança - PB" },
  { id: 2, src: "/apae-site-comemorativo/parceiros/parceiro-ifpb.png", alt: "IFPB - Campus Esperança" },
  { id: 3, src: "/apae-site-comemorativo/parceiros/parceiro-lagoa-de-roca.png", alt: "Prefeitura de São Sebastião de Lagoa de Roça" },
  { id: 4, src: "/apae-site-comemorativo/parceiros/parceiro-areial.png", alt: "Prefeitura de Areial" },
  { id: 5, src: "/apae-site-comemorativo/parceiros/parceiro-arara.png", alt: "Prefeitura de Arara" },
  { id: 6, src: "/apae-site-comemorativo/parceiros/parceiro-camara.png", alt: "Camara de Vereadores de Esperança" },
  { id: 7, src: "/apae-site-comemorativo/parceiros/parceiro-comarca.png", alt: "Ministério Público - Comarca Esperança" },
];

const PartnersCarousel = () => {
  const settings = {
    dots: true,           
    arrows: true,          
    infinite: true,        
    speed: 500,
    slidesToShow: 5,       
    slidesToScroll: 1,     
    autoplay: true,        
    autoplaySpeed: 2000,   
    pauseOnHover: true,    
    cssEase: "linear",   
    centerMode: true, 
    centerPadding: "0px",
    
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            centerMode: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            centerMode: false,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            arrows: false,
            centerMode: false,
          }
        }
      ]
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {partnersLogos.map((partner) => (
          <div key={partner.id}>
            <div className={styles.logoSlide} title={partner.alt}>
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={120} 
                  height={120}
                  className={styles.partnerLogo}
                />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PartnersCarousel;