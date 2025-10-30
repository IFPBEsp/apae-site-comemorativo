import React from "react";
import styles from "./TestimonialCarousel.module.css";

interface TestimonialCardProps {
	content: string;
	name: string;
	title: string;
}

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
