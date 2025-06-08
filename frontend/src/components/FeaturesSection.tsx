const FeaturesSection = () => {
  return (
    <section className=" py-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Everything You Need in One Link
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-12">
          LinkHive gives you full control of your link-in-bio. Whether
          you&apos;re a creator, business, or brand — you can manage your
          content your way.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 text-left">
          {/* Feature 1 */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-fuchsia-700/20 transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Link Analytics</h3>
            <p className="text-zinc-400">
              Track clicks in real-time. Understand what works and optimize your
              content.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-fuchsia-700/20 transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Drag & Drop Ordering</h3>
            <p className="text-zinc-400">
              Reorder your links with a smooth drag-and-drop interface — no
              code, no hassle.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-fuchsia-700/20 transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Mobile Optimized</h3>
            <p className="text-zinc-400">
              Built mobile-first so your profile always looks great — on every
              device, every time.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-fuchsia-700/20 transition-shadow">
            <h3 className="text-xl font-semibold mb-2">
              Create Unlimited Links
            </h3>
            <p className="text-zinc-400">
              Add as many links as you want — whether it&apos;s your YouTube
              channel, store, or latest post.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-fuchsia-700/20 transition-shadow">
            <h3 className="text-xl font-semibold mb-2">
              Customize Your Profile
            </h3>
            <p className="text-zinc-400">
              Upload a profile picture, add a bio, and make your LinkHive truly
              yours.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-fuchsia-700/20 transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Easy To Use</h3>
            <p className="text-zinc-400">
              A clean and intuitive dashboard designed for simplicity — no
              learning curve required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
