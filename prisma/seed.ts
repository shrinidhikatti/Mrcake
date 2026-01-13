import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@mrcake.com' },
        update: {},
        create: {
            email: 'admin@mrcake.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log('✅ Admin user created:', admin.email)

    // Create categories
    const categories = [
        {
            name: 'Cakes',
            slug: 'cakes',
            description: 'Delicious cakes for all occasions',
            image: '/images/categories/cakes.jpg',
        },
        {
            name: 'Pastries',
            slug: 'pastries',
            description: 'Fresh pastries baked daily',
            image: '/images/categories/pastries.jpg',
        },
        {
            name: 'Breads',
            slug: 'breads',
            description: 'Artisan breads and baguettes',
            image: '/images/categories/breads.jpg',
        },
        {
            name: 'Cookies',
            slug: 'cookies',
            description: 'Homemade cookies and biscuits',
            image: '/images/categories/cookies.jpg',
        },
    ]

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        })
    }

    console.log('✅ Categories created')

    // Get category IDs
    const cakesCategory = await prisma.category.findUnique({ where: { slug: 'cakes' } })
    const pastriesCategory = await prisma.category.findUnique({ where: { slug: 'pastries' } })
    const breadsCategory = await prisma.category.findUnique({ where: { slug: 'breads' } })
    const cookiesCategory = await prisma.category.findUnique({ where: { slug: 'cookies' } })

    // Create products
    const products = [
        // Cakes
        {
            name: 'Chocolate Truffle Cake',
            slug: 'chocolate-truffle-cake',
            description: 'Rich chocolate cake with truffle frosting',
            price: 899,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cakesCategory!.id,
            featured: true,
            weight: '1kg',
            servings: '8-10 people',
            ingredients: 'Chocolate, Flour, Eggs, Butter, Sugar',
            allergens: 'Contains gluten, dairy, eggs',
        },
        {
            name: 'Red Velvet Cake',
            slug: 'red-velvet-cake',
            description: 'Classic red velvet with cream cheese frosting',
            price: 799,
            images: JSON.stringify(['/red-velvet.png']),
            categoryId: cakesCategory!.id,
            featured: true,
            weight: '1kg',
            servings: '8-10 people',
            ingredients: 'Flour, Cocoa, Buttermilk, Cream Cheese',
            allergens: 'Contains gluten, dairy, eggs',
        },
        {
            name: 'Black Forest Cake',
            slug: 'black-forest-cake',
            description: 'Chocolate sponge with cherries and cream',
            price: 849,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cakesCategory!.id,
            weight: '1kg',
            servings: '8-10 people',
        },
        // Pastries
        {
            name: 'Croissant',
            slug: 'croissant',
            description: 'Buttery, flaky French croissant',
            price: 49,
            images: JSON.stringify(['/croissants.png']),
            categoryId: pastriesCategory!.id,
            featured: true,
            weight: '80g',
            servings: '1 person',
        },
        {
            name: 'Danish Pastry',
            slug: 'danish-pastry',
            description: 'Sweet pastry with fruit filling',
            price: 69,
            images: JSON.stringify(['/croissants.png']),
            categoryId: pastriesCategory!.id,
            weight: '100g',
            servings: '1 person',
        },
        // Breads
        {
            name: 'Sourdough Bread',
            slug: 'sourdough-bread',
            description: 'Traditional sourdough loaf',
            price: 120,
            images: JSON.stringify(['/hero-bakery.png']),
            categoryId: breadsCategory!.id,
            weight: '500g',
        },
        {
            name: 'Baguette',
            slug: 'baguette',
            description: 'Classic French baguette',
            price: 80,
            images: JSON.stringify(['/hero-bakery.png']),
            categoryId: breadsCategory!.id,
            weight: '300g',
        },
        // Cookies
        {
            name: 'Chocolate Chip Cookies',
            slug: 'chocolate-chip-cookies',
            description: 'Classic cookies with chocolate chips',
            price: 150,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cookiesCategory!.id,
            weight: '250g pack',
            servings: '10-12 cookies',
        },
    ]

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: product, // Update all fields to ensure images are fixed
            create: product,
        })
    }

    console.log('✅ Products created')
    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📝 Admin credentials:')
    console.log('   Email: admin@mrcake.com')
    console.log('   Password: admin123')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
