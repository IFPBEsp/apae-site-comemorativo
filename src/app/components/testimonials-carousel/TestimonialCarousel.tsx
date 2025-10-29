"use client";

import React from "react";
import Slider from "react-slick";
import TestimonialCard from "./TestimonialCard";
import styles from "./TestimonialCarousel.module.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Testimonial {
	id: string;
	name: string;
	content: string;
	date: string;
}

interface TestimonialCarouselProps {
	testimonials: Testimonial[];
}

/**
 * Renders a responsive carousel of testimonial cards.
 *
 * @param testimonials - Array of testimonial objects to display; each item should include an `id`, `name`, and `content`
 * @returns The carousel element containing a slide for each testimonial, or `null` if `testimonials` is empty or not provided
 */
export default function TestimonialCarousel({
	testimonials,
}: TestimonialCarouselProps) {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		autoplay: true,
		autoplaySpeed: 10000,
		slidesToShow: 2,
		slidesToScroll: 2,
		arrows: true,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	const getTestimonialTitle = (index: number) => {
		const titles = ["Pai de Aluno", "Professor", "Ex-Aluno", "Voluntário"];
		return titles[index % titles.length];
	};

	if (!testimonials || testimonials.length === 0) {
		return null;
	}

	return (
		<div className={styles.carouselContainer}>
			<Slider {...settings}>
				{testimonials.map((testimonial, index) => (
					<div key={testimonial.id} className={styles.slideItem}>
						<TestimonialCard
							content={testimonial.content}
							name={testimonial.name}
							title={getTestimonialTitle(index)}
						/>
					</div>
				))}
			</Slider>
		</div>
	);
}