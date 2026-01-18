import Image from 'next/image'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <BackButton />
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/hero-bakery.png"
          alt="MrCake Bakery"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-serif text-white">About Us</h1>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            Founded in 2020 in the heart of Bidar, MrCake Palace & Bakers began with a simple vision:
            to bring the joy of authentic, handcrafted baked goods to our community.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            We believe in the purity of ingredients. Our cakes are baked fresh daily using the finest
            Belgian chocolate, organic flour, and farm-fresh cream. No preservatives, just pure indulgence.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Every cake tells a story, and we're honored to be part of your celebrations,
            milestones, and special moments.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <h3 className="text-xl font-serif text-gray-900 mb-3">Quality First</h3>
            <p className="text-gray-600 text-sm">
              We never compromise on ingredients. Only the finest, freshest, and most authentic.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-serif text-gray-900 mb-3">Crafted Daily</h3>
            <p className="text-gray-600 text-sm">
              Every product is baked fresh each day with love and attention to detail.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-serif text-gray-900 mb-3">Customer Joy</h3>
            <p className="text-gray-600 text-sm">
              Your happiness is our mission. We bake to create memorable moments.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-block bg-amber-900 text-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-amber-800 transition-colors"
          >
            Explore Our Menu
          </Link>
        </div>
      </section>
    </div>
  )
}
