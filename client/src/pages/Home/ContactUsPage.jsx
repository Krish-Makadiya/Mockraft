import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "../../components/main/Navbar";

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-4/5 bg-[#f4f4f9] dark:bg-[#181818] flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-7xl bg-white dark:bg-[#262626] rounded-xl shadow-xl p-10 grid md:grid-cols-2 gap-12">
                    {/* Left - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}>
                        <h3 className="text-sm text-[#2d5ded] dark:text-[#6B8EFF] font-semibold mb-2">
                            Contact Us
                        </h3>
                        <h1 className="text-4xl font-bold text-[#1e293b] dark:text-[#EDEDED] mb-4">
                            Get In Touch With Us
                        </h1>
                        <p className="text-[#64748b] dark:text-[#A3A3A3] mb-8 text-sm leading-relaxed">
                            We'd love to hear from you! Whether you have a
                            question about our services or just want to say
                            hello, our team is ready to help you.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-md bg-[#2d5ded] dark:bg-[#6B8EFF] text-white">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#1e293b] dark:text-[#EDEDED]">
                                        Our Location
                                    </h4>
                                    <p className="text-[#64748b] dark:text-[#A3A3A3] text-sm">
                                        99 S.t Jomblo Park Pekanbaru, 28292.
                                        Indonesia
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-md bg-[#2d5ded] dark:bg-[#6B8EFF] text-white">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#1e293b] dark:text-[#EDEDED]">
                                        Phone Number
                                    </h4>
                                    <p className="text-[#64748b] dark:text-[#A3A3A3] text-sm">
                                        (+62) 814 257 9980
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-md bg-[#2d5ded] dark:bg-[#6B8EFF] text-white">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#1e293b] dark:text-[#EDEDED]">
                                        Email Address
                                    </h4>
                                    <p className="text-[#64748b] dark:text-[#A3A3A3] text-sm">
                                        info@yourdomain.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Contact Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="bg-[#2d5ded] dark:bg-[#6B8EFF] rounded-xl p-8 space-y-6 shadow-md"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}>
                        <div className="space-y-1">
                            <label className="text-sm text-white font-medium">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md text-sm bg-white text-black placeholder:text-gray-600 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-white font-medium">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md text-sm bg-white text-black placeholder:text-gray-600 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-white font-medium">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+91 12345 67890"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md text-sm bg-white text-black placeholder:text-gray-600 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-white font-medium">
                                Message
                            </label>
                            <textarea
                                name="message"
                                placeholder="Write your message here..."
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md text-sm bg-white text-black placeholder:text-gray-600 focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 rounded-md font-medium bg-[#f472b6] hover:bg-[#ec4899] text-white transition-colors">
                            Send Message
                        </button>
                    </motion.form>
                </div>
            </div>
        </>
    );
};

export default ContactUsPage;
