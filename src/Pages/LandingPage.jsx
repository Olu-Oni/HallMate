import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Users, Calendar, Settings, Megaphone } from "lucide-react"; // Added Megaphone icon
import HMLogo from "../assets/HallMateLogoFull.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center py-6 px-8 md:px-16">
        {/* <div className="font-bold text-2xl text-blue-600">HallMate</div> */}
        <img src={HMLogo} alt="HallMate Logo" className=" h-14 sm:h-16 w-auto" />
              
        {/* <div className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">Testimonials</a>
          <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</a>
        </div> */}
        {/* <Link to="/login" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md">
          Login
        </Link> */}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between py-12 px-8 md:px-16 max-w-6xl mx-auto">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Simplify Hall Management with <span className="text-orange-400">HallMate</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The all-in-one solution for efficient hall management. Streamline operations, improve resident experience, and save time.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/Login" className="bg-orange-400 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center">
              Login <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-3">
                <div className="flex items-center space-x-3">
                <Users size={20} className="text-blue-600" />
                <span className="font-medium">Student Management</span>
                </div>
                <Link to="/admin-student_infoSelect" className="text-sm text-blue-600">View</Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-3">
                <div className="flex items-center space-x-3">
                  <Megaphone size={20} className="text-blue-600" /> {/* Changed icon to Megaphone */}
                  <span className="font-medium">Announcement Management</span>
                </div>
                <Link to="/admin-announcements" className="text-sm text-blue-600 ml-2">View</Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar size={20} className="text-blue-600" />
                  <span className="font-medium">Maintenance Requests</span>
                </div>
                <Link to="/admin-requests" className="text-sm text-blue-600">View</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Management</h3>
              <p className="text-gray-600">Efficiently manage student information and track their activities.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Megaphone size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Announcement Management</h3>
              <p className="text-gray-600">Easily create and distribute announcements to all residents.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Maintenance Tracking</h3>
              <p className="text-gray-600">Streamline maintenance requests and track resolution status in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8 md:px-16 bg-gradient-to-r from-orange-300 to-orange-400 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your hall management?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied hall administrators who've simplified their operations with HallMate.</p>
          <Link to="/register" className="bg-white text-orange-600 py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-md inline-block">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 md:px-16 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">HallMate</h3>
            <p className="text-gray-400">Simplifying hall management since 2025</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" class="hover:text-white transition">Contact</a></li>
              <li><a href="#" class="hover:text-white transition">Careers</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} HallMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;