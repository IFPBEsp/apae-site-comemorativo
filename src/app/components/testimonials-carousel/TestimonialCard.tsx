import React from "react";
import styles from "./TestimonialCarousel.module.css";

interface TestimonialCardProps {
	content: string;
	name: string;
	title: string;
}

/**
 * Renders a styled testimonial card containing the quote, author name, and author title.
 *
 * @param content - The testimonial text to display inside the card.
 * @param name - The author's full name to display alongside the testimonial.
 * @param title - The author's title, role, or affiliation to display under the name.
 * @returns A JSX element representing the testimonial card.
 */
export default function TestimonialCard({
	content,
	name,
	title,
}: TestimonialCardProps) {
	return (
		<div className={styles.card}>
			<span className={styles.quoteIcon} aria-hidden="true">
				&ldquo;
			</span>

			<p className={styles.content}>{content}</p>

			<div className={styles.authorInfo}>
				<p className={styles.authorName}>— {name}</p>
				<p className={styles.authorTitle}>{title}</p>
			</div>
		</div>
	);
}