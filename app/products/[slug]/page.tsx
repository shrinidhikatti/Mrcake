import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Star, Check, AlertCircle } from 'lucide-react'
import AddToCartButton from '@/components/shop/AddToCartButton'

async function getProduct(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    })
    return product
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        notFound()
    }

    let images: string[] = []
    try {
        images = JSON.parse(product.images as string)
    } catch (e) {
        images = ['/placeholder.png']
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-foreground/60 mb-8">
                        <Link href="/" className="hover:text-primary transition">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-primary transition">Products</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{product.name}</span>
                    </nav>

                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                        {/* Image Gallery */}
                        <div className="flex flex-col-reverse">
                            <div className="mt-6 w-full max-w-2xl mx-auto block lg:max-w-none">
                                <div className="grid grid-cols-4 gap-6">
                                    {images.map((image, idx) => (
                                        <div key={idx} className="relative h-24 bg-white rounded-md overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition">
                                            <Image
                                                src={image}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full aspect-square relative bg-white rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src={images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                            <div className="mb-6">
                                <span className="text-sm font-bold text-primary bg-secondary px-3 py-1 rounded-full">
                                    {product.category.name}
                                </span>
                            </div>

                            <h1 className="text-4xl font-display font-bold text-foreground mb-4">{product.name}</h1>

                            <div className="flex items-center space-x-4 mb-6">
                                <p className="text-3xl font-bold text-primary">₹{product.price}</p>
                                <div className="flex items-center">
                                    <div className="flex items-center text-accent">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <Star key={rating} className="flex-shrink-0 h-5 w-5 fill-current" />
                                        ))}
                                    </div>
                                    <p className="ml-2 text-sm text-foreground/60">5.0 (24 reviews)</p>
                                </div>
                            </div>

                            <div className="prose prose-sm text-foreground/80 mb-8">
                                <p>{product.description}</p>
                            </div>

                            {/* Product Details */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-border mb-8">
                                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                    {product.weight && (
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <dt className="text-sm text-foreground/60">Weight</dt>
                                            <dd className="text-sm font-medium">{product.weight}</dd>
                                        </div>
                                    )}
                                    {product.servings && (
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <dt className="text-sm text-foreground/60">Servings</dt>
                                            <dd className="text-sm font-medium">{product.servings}</dd>
                                        </div>
                                    )}
                                    {product.allergens && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm text-foreground/60 mb-1 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1 text-warning" />
                                                Allergens
                                            </dt>
                                            <dd className="text-sm font-medium">{product.allergens}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <AddToCartButton product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    images: product.images as string
                                }} />
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center space-x-3 text-sm text-foreground/80">
                                    <Check className="flex-shrink-0 h-5 w-5 text-success" />
                                    <span>Freshly baked today</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-foreground/80">
                                    <Check className="flex-shrink-0 h-5 w-5 text-success" />
                                    <span>Eggless option available</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-foreground/80">
                                    <Check className="flex-shrink-0 h-5 w-5 text-success" />
                                    <span>Secure payment</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-foreground/80">
                                    <Check className="flex-shrink-0 h-5 w-5 text-success" />
                                    <span>Contactless delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
