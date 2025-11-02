"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './ViewDropdown.module.css';

interface ViewDropdownProps {
    onChangeView: (view: string) => void;
    currentView: string;
}

export function ViewDropdown({ onChangeView, currentView }: ViewDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleViewClick = (view: string) => {
        onChangeView(view);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getViewText = (view: string) => {
        const viewMap: { [key: string]: string } = {
            dayGridMonth: 'Mês',
            dayGridWeek: 'Semana', 
            dayGridDay: 'Dia',   
            listWeek: 'Agenda',
        };
        return viewMap[view] || 'Mês';
    };

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
                {getViewText(currentView)}
                <span className={styles.arrow}></span>
            </button>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    <button onClick={() => handleViewClick('dayGridMonth')}>Mês</button>
                    <button onClick={() => handleViewClick('dayGridWeek')}>Semana</button> 
                    <button onClick={() => handleViewClick('dayGridDay')}>Dia</button>
                    <button onClick={() => handleViewClick('listWeek')}>Agenda</button>
                </div>
            )}
        </div>
    );
}