import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { FaLaptop, FaPlane, FaUtensils, FaMobileAlt, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Home() {

    /* HERO ADS */

    const heroAds = [
        {
            title: "Reach Millions With Smart Advertising",
            desc: "Promote your business with powerful ad campaigns.",
            image:
                "https://images.unsplash.com/photo-1556745757-8d76bdb6984b"
        },
        {
            title: "Boost Your Brand Visibility",
            desc: "Create engaging advertisements for your audience.",
            image:
                "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
        },
        {
            title: "Target The Right Audience",
            desc: "Smart targeting for better ad performance.",
            image:
                "https://images.unsplash.com/photo-1522199710521-72d69614c702"
        }
    ];

    /* CATEGORIES */

    const categories = [
        { name: "Technology", icon: <FaLaptop size={28} /> },
        { name: "Travel", icon: <FaPlane size={28} /> },
        { name: "Food", icon: <FaUtensils size={28} /> },
        { name: "Electronics", icon: <FaMobileAlt size={28} /> }
    ];

    /* ADS */

    const ads = [
        {
            title: "Macbook Pro M3",
            brand: "Apple",
            img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
        },
        {
            title: "Adidas Running Shoes",
            brand: "Adidas",
            img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
        },
        {
            title: "Luxury Travel Offer",
            brand: "TravelX",
            img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        }
    ];

    /* BRAND LOGOS */

    const brands = [
        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        "https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png",
        "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
    ];

    const sliderSettings = {
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: false,
        infinite: true
    };

    const brandSettings = {
        slidesToShow: 5,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        infinite: true
    };

    return (
        <div className="bg-gray-50">

            {/* HERO CAROUSEL */}

            <Slider {...sliderSettings}>
                {heroAds.map((ad, i) => (
                    <div key={i} className="relative h-[550px]">

                        <img
                            src={ad.image}
                            className="w-full h-full object-cover brightness-75"
                        />

                        <div className="absolute inset-0 flex items-center">

                            <div className="max-w-7xl mx-auto px-6 text-white">

                                <motion.h1
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-5xl font-bold"
                                >
                                    {ad.title}
                                </motion.h1>

                                <p className="mt-6 text-lg max-w-xl">
                                    {ad.desc}
                                </p>

                                <button className="mt-8 bg-indigo-600 px-8 py-3 rounded-lg">
                                    Explore Ads
                                </button>

                            </div>

                        </div>

                    </div>
                ))}
            </Slider>

            {/* BRAND LOGOS */}

            <section className="bg-white py-14">

                <h2 className="text-center text-gray-500 mb-10 font-semibold">
                    Trusted by Global Brands
                </h2>

                <Slider {...brandSettings}>

                    {brands.map((logo, i) => (
                        <div key={i} className="flex justify-center">

                            <img
                                src={logo}
                                className="h-10 opacity-70 hover:opacity-100"
                            />

                        </div>
                    ))}

                </Slider>

            </section>

            {/* STATS */}

            <section className="py-16 bg-white">

                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-10">

                    <div>
                        <h2 className="text-3xl font-bold text-indigo-600">500+</h2>
                        <p>Active Campaigns</p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-indigo-600">150+</h2>
                        <p>Advertisers</p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-indigo-600">60K+</h2>
                        <p>Viewers</p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-indigo-600">2M+</h2>
                        <p>Ad Impressions</p>
                    </div>

                </div>

            </section>

            {/* CATEGORIES */}

            <section className="max-w-7xl mx-auto px-6 py-20">

                <h2 className="text-4xl font-bold text-center mb-14">
                    Explore Categories
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

                    {categories.map((cat, i) => (

                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            key={i}
                            className="bg-white rounded-xl shadow-md hover:shadow-2xl p-10 text-center"
                        >

                            <div className="bg-indigo-100 text-indigo-600 w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4">
                                {cat.icon}
                            </div>

                            <h3 className="font-semibold text-lg">
                                {cat.name}
                            </h3>

                        </motion.div>

                    ))}

                </div>

            </section>

            {/* TRENDING ADS */}

            <section className="bg-gray-100 py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <h2 className="text-4xl font-bold text-center mb-14">
                        Trending Advertisements
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">

                        {ads.map((ad, i) => (

                            <motion.div
                                whileHover={{ y: -8 }}
                                key={i}
                                className="bg-white rounded-xl shadow-lg overflow-hidden"
                            >

                                <img
                                    src={ad.img}
                                    className="h-56 w-full object-cover"
                                />

                                <div className="p-6">

                                    <h3 className="text-xl font-semibold">
                                        {ad.title}
                                    </h3>

                                    <p className="text-gray-500">
                                        {ad.brand}
                                    </p>

                                    <button className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-lg">
                                        View Ad
                                    </button>

                                </div>

                            </motion.div>

                        ))}

                    </div>

                </div>

            </section>

            {/* OFFERS */}

            <section className="py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <h2 className="text-4xl font-bold text-center mb-14">
                        Special Offers
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">

                        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-8 rounded-xl">
                            <h3 className="text-2xl font-bold">50% OFF</h3>
                            <p>Fashion Sale Campaign</p>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 rounded-xl">
                            <h3 className="text-2xl font-bold">Buy 1 Get 1</h3>
                            <p>Food Promotion</p>
                        </div>

                        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8 rounded-xl">
                            <h3 className="text-2xl font-bold">30% Discount</h3>
                            <p>Electronics Campaign</p>
                        </div>

                    </div>

                </div>

            </section>

            {/* SURVEY */}

            <section className="py-24 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">

                <h2 className="text-4xl font-bold mb-6">
                    Help Brands Improve
                </h2>

                <p className="max-w-2xl mx-auto text-lg">
                    Participate in surveys and share your opinion about products.
                </p>

                <button className="mt-8 bg-white text-indigo-600 px-8 py-3 rounded-lg">
                    Take Survey
                </button>

            </section>

            {/* TESTIMONIALS */}

            <section className="bg-gray-100 py-20">

                <div className="max-w-6xl mx-auto px-6 text-center">

                    <h2 className="text-4xl font-bold mb-14">
                        What Advertisers Say
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">

                        <div className="bg-white p-8 rounded-xl shadow">
                            <p>"This platform helped us reach thousands of customers."</p>
                            <h4 className="mt-4 font-semibold">Nike Marketing Manager</h4>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow">
                            <p>"Our campaigns performed much better here."</p>
                            <h4 className="mt-4 font-semibold">Apple Brand Head</h4>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow">
                            <p>"Best advertising platform for targeting audiences."</p>
                            <h4 className="mt-4 font-semibold">Samsung Marketing Lead</h4>
                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="bg-gray-900 text-white py-20 text-center">

                <h2 className="text-4xl font-bold mb-6">
                    Discover Ads Tailored For You
                </h2>

                <p className="text-gray-300 mb-8">
                    Browse campaigns from global brands.
                </p>

                <button className="bg-indigo-600 px-8 py-3 rounded-lg">
                    Browse Ads
                </button>

            </section>

            {/* FOOTER */}

            <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

                    <div>
                        <h3 className="text-white text-xl font-semibold mb-4">
                            E-Advertise
                        </h3>
                        <p>
                            A modern platform helping businesses promote products and
                            reach targeted audiences.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>Home</li>
                            <li>Advertisements</li>
                            <li>Categories</li>
                            <li>Surveys</li>
                            <li>Offers</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white mb-4">Advertisers</h4>
                        <ul className="space-y-2">
                            <li>Create Campaign</li>
                            <li>Analytics</li>
                            <li>Audience Targeting</li>
                            <li>Budget Management</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white mb-4">Follow Us</h4>
                        <div className="flex gap-4 text-xl">
                            <FaFacebook />
                            <FaInstagram />
                            <FaTwitter />
                            <FaLinkedin />
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-700 mt-12 pt-6 text-center">
                    © 2026 E-Advertisement Platform
                </div>

            </footer>

            {/* FLOATING AD */}

            <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg">

                🔥 Advertise your brand today!

            </div>

        </div>
    );
}