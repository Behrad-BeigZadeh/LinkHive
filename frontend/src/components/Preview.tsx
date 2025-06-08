import React from "react";

const Preview = () => {
  return (
    <section className=" py-20 px-4 sm:px-8 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          LinkHive in Action
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-12">
          See both sides of your profile — the sleek public page your followers
          will love, and the private dashboard where you control every detail.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Public Profile Preview */}
          <div className="group p-4 rounded-2xl border border-white/10 shadow-lg transition-all duration-500 hover:border-emerald-500 hover:shadow-emerald-500/20 hover:scale-105 sm:hover:scale-110">
            <h3 className="text-xl font-semibold mb-4 text-left transition-colors group-hover:text-emerald-400">
              Your Public Profile
            </h3>
            <img
              src="https://res.cloudinary.com/dc0quhvpm/image/upload/v1749303474/public-page_tukrj8.png"
              alt="LinkHive Public Profile Preview"
              className="rounded-xl border border-white/10 object-cover w-full "
            />
          </div>

          {/* Analytics Preview */}
          <div className="group p-4 rounded-2xl border border-white/10 shadow-lg transition-all duration-500 hover:border-fuchsia-500 hover:shadow-fuchsia-500/20 hover:scale-105 sm:hover:scale-110">
            <h3 className="text-xl font-semibold mb-4 text-left transition-colors group-hover:text-fuchsia-400">
              Real-Time Analytics
            </h3>
            <img
              src="https://res.cloudinary.com/dc0quhvpm/image/upload/v1749303450/analytics_p1ufik.png"
              alt="LinkHive Analytics Preview"
              className="rounded-xl border border-white/10 object-cover w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
