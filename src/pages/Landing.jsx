import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#F0EDE5] text-[#004643]">
      {/* Header */}
      <header className="bg-[#004643] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#D8A85F] flex items-center justify-center shadow-sm">
                <span className="text-[#004643] font-black text-lg">G</span>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Gym<span className="text-[#D8A85F]">Flow</span>
                </h1>

                <p className="text-[11px] text-white/50 tracking-wide">
                  GYM MANAGEMENT SYSTEM
                </p>
              </div>
            </Link>

            {/* Tagline */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D8A85F]"></span>

              <p className="text-sm text-white/70">
                Simple. Organized. Efficient.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#155955] mb-4">
            Smart Gym Management
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Manage Your Gym
            <span className="block text-[#155955]">Easily With GymFlow</span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-gray-600 text-base sm:text-lg leading-relaxed">
            GymFlow helps gyms manage members, memberships, payments, check-ins
            and scheduled activities from one simple system.
          </p>

          {/* Login & Register - Only Here */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/login"
              className="px-7 py-3 rounded-lg bg-[#004643] text-white font-semibold hover:bg-[#155955] transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-7 py-3 rounded-lg bg-[#D8A85F] text-[#004643] font-semibold hover:opacity-90 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Why GymFlow */}
      <section className="bg-white border-y border-[#DEDCD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">Why GymFlow?</h2>

            <p className="mt-4 text-gray-600 leading-relaxed">
              GymFlow brings important gym management activities together in one
              organized platform, making everyday management simpler.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Member Management */}
            <div className="border border-[#DEDCD2] rounded-xl p-6 bg-[#F0EDE5]/40">
              <h3 className="text-xl font-semibold mb-3">Member Management</h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Manage member information and keep your gym member records
                organized.
              </p>
            </div>

            {/* Membership & Payments */}
            <div className="border border-[#DEDCD2] rounded-xl p-6 bg-[#F0EDE5]/40">
              <h3 className="text-xl font-semibold mb-3">
                Membership & Payments
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Manage membership products and keep track of payment information
                easily.
              </p>
            </div>

            {/* Check-in */}
            <div className="border border-[#DEDCD2] rounded-xl p-6 bg-[#F0EDE5]/40">
              <h3 className="text-xl font-semibold mb-3">
                Check-in & Check-out
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Track when members enter and leave the gym with simple check-in
                records.
              </p>
            </div>

            {/* Calendar */}
            <div className="border border-[#DEDCD2] rounded-xl p-6 bg-[#F0EDE5]/40">
              <h3 className="text-xl font-semibold mb-3">Calendar</h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Keep gym activities and scheduled events organized with the
                calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How GymFlow Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold">How GymFlow Works</h2>

          <p className="mt-4 text-gray-600">
            A simple approach to managing everyday gym activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#DEDCD2] rounded-xl p-7 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#004643] text-white flex items-center justify-center font-bold">
              1
            </div>

            <h3 className="text-xl font-semibold mt-5">Manage</h3>

            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Manage members, memberships and important gym information from the
              system.
            </p>
          </div>

          <div className="bg-white border border-[#DEDCD2] rounded-xl p-7 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#004643] text-white flex items-center justify-center font-bold">
              2
            </div>

            <h3 className="text-xl font-semibold mt-5">Track</h3>

            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Track payments, member check-ins and check-outs in an organized
              way.
            </p>
          </div>

          <div className="bg-white border border-[#DEDCD2] rounded-xl p-7 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#004643] text-white flex items-center justify-center font-bold">
              3
            </div>

            <h3 className="text-xl font-semibold mt-5">Monitor</h3>

            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Use the calendar and dashboard to keep track of gym activities and
              information.
            </p>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-[#004643] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Built for Different Gym Roles
            </h2>

            <p className="mt-4 text-white/70">
              GymFlow provides role-based access so users can access the
              features relevant to their responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold">Admin</h3>

              <p className="text-white/70 text-sm mt-3 leading-relaxed">
                Manage the complete gym system and user access.
              </p>
            </div>

            <div className="border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold">Manager</h3>

              <p className="text-white/70 text-sm mt-3 leading-relaxed">
                Manage members, products, payments and daily activities.
              </p>
            </div>

            <div className="border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold">Trainer</h3>

              <p className="text-white/70 text-sm mt-3 leading-relaxed">
                Access the calendar and relevant gym activities.
              </p>
            </div>

            <div className="border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold">Member</h3>

              <p className="text-white/70 text-sm mt-3 leading-relaxed">
                Access personal information, billing and gym calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#F0EDE5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Use GymFlow?
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Get started with a simple and organized way to manage your gym
            activities.
          </p>

          <Link
            to="/register"
            className="inline-block mt-7 px-7 py-3 rounded-lg bg-[#D8A85F] text-[#004643] font-semibold hover:opacity-90 transition"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004643] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-xl font-bold">GymFlow</p>

          <p className="text-sm text-white/70 mt-2">
            Simple and efficient gym management system.
          </p>

          <div className="border-t border-white/10 mt-6 pt-5">
            <p className="text-xs text-white/50">
              © 2026 GymFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
