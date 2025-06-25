import { Variants } from 'framer-motion';

const fadeSlide = (y: number, duration = 0.5): Variants => ({
    initial: { opacity: 0, y },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration,
            ease: [0.16, 0.77, 0.47, 0.97],
        },
    },
    exit: { opacity: 0, y: -10 },
});

const staggerContainer = (staggerChildren = 0.08, delay = 0, when: 'beforeChildren' | 'afterChildren' = 'beforeChildren'): Variants => ({
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            delay,
            staggerChildren,
            when,
        },
    },
});

export const fadeOnly: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const pageVariants: Variants = {
    ...fadeSlide(20, 0.5),
    exit: { opacity: 0, y: -20 },
    animate: {
        ...fadeSlide(20, 0.5).animate,
        transition: {
            duration: 0.5,
            when: 'beforeChildren',
            staggerChildren: 0.08,
        },
    },
};

export const cardItemVariants = fadeSlide(10);
export const statCardVariants = fadeSlide(20);
export const modalVariants: Variants = {
    ...fadeSlide(20),
    exit: { opacity: 0, y: 20 },
};

export const headerVariants: Variants = {
    initial: { opacity: 0, y: -10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: 'easeInOut',
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.4,
            ease: 'easeInOut',
        },
    },
};

export const gridVariants = staggerContainer(0.1, 0.1);
export const containerVariants = staggerContainer();

export const bookingCardVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
    },
    transition: { delay: 0.1 },
};

export const noTripsAnimation: Variants = {
    initial: { y: 0 },
    animate: {
        y: [0, -20, 0, 12, 0],
        transition: {
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: [0.45, 0.45, 0.45, 0.45],
        },
    },
};

export const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.3,
        },
    }),
};

// Registration step animation
export const slideTransitionVariants = {
    enter: (direction: number): Variants => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number): Variants => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

// Unit Registration
export const tabContainerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const tabItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export const tabContentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
};
