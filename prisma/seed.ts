import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...\n')

    // ============================================
    // 1. CREATE USERS
    // ============================================
    console.log('👥 Creating users...')

    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@mrcake.com' },
        update: {},
        create: {
            email: 'admin@mrcake.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
            phone: '+91 98765 43210',
        },
    })
    console.log('  ✅ Admin user:', admin.email)

    // Customer users with hashed passwords
    const customerPassword = await bcrypt.hash('customer123', 10)

    const customer1 = await prisma.user.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
            email: 'john.doe@example.com',
            name: 'John Doe',
            password: customerPassword,
            role: 'CUSTOMER',
            phone: '+91 98765 11111',
        },
    })
    console.log('  ✅ Customer 1:', customer1.email)

    const customer2 = await prisma.user.upsert({
        where: { email: 'priya.sharma@example.com' },
        update: {},
        create: {
            email: 'priya.sharma@example.com',
            name: 'Priya Sharma',
            password: customerPassword,
            role: 'CUSTOMER',
            phone: '+91 98765 22222',
        },
    })
    console.log('  ✅ Customer 2:', customer2.email)

    const customer3 = await prisma.user.upsert({
        where: { email: 'amit.patel@example.com' },
        update: {},
        create: {
            email: 'amit.patel@example.com',
            name: 'Amit Patel',
            password: customerPassword,
            role: 'CUSTOMER',
            phone: '+91 98765 33333',
        },
    })
    console.log('  ✅ Customer 3:', customer3.email)

    // ============================================
    // 2. CREATE DELIVERY PARTNERS
    // ============================================
    console.log('\n🚴 Creating delivery partners...')

    const partnerPassword = await bcrypt.hash('delivery123', 10)

    const partner1 = await prisma.deliveryPartner.upsert({
        where: { phone: '+91 88888 11111' },
        update: {},
        create: {
            name: 'Rajesh Kumar',
            phone: '+91 88888 11111',
            email: 'rajesh@mrcake.com',
            password: partnerPassword,
            vehicleType: 'Bike',
            vehicleNumber: 'KA01AB1234',
            status: 'AVAILABLE',
            totalDeliveries: 45,
        },
    })
    console.log('  ✅ Delivery Partner 1:', partner1.name)

    const partner2 = await prisma.deliveryPartner.upsert({
        where: { phone: '+91 88888 22222' },
        update: {},
        create: {
            name: 'Suresh Nair',
            phone: '+91 88888 22222',
            email: 'suresh@mrcake.com',
            password: partnerPassword,
            vehicleType: 'Scooter',
            vehicleNumber: 'KA02CD5678',
            status: 'BUSY',
            totalDeliveries: 32,
        },
    })
    console.log('  ✅ Delivery Partner 2:', partner2.name)

    const partner3 = await prisma.deliveryPartner.upsert({
        where: { phone: '+91 88888 33333' },
        update: {},
        create: {
            name: 'Mohammed Ali',
            phone: '+91 88888 33333',
            password: partnerPassword,
            vehicleType: 'Bike',
            vehicleNumber: 'KA03EF9012',
            status: 'AVAILABLE',
            totalDeliveries: 28,
        },
    })
    console.log('  ✅ Delivery Partner 3:', partner3.name)

    // ============================================
    // 3. CREATE CATEGORIES
    // ============================================
    console.log('\n📂 Creating categories...')

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
        console.log('  ✅ Category:', category.name)
    }

    // ============================================
    // 4. CREATE PRODUCTS
    // ============================================
    console.log('\n🍰 Creating products...')

    const cakesCategory = await prisma.category.findUnique({ where: { slug: 'cakes' } })
    const pastriesCategory = await prisma.category.findUnique({ where: { slug: 'pastries' } })
    const breadsCategory = await prisma.category.findUnique({ where: { slug: 'breads' } })
    const cookiesCategory = await prisma.category.findUnique({ where: { slug: 'cookies' } })

    const products = [
        // CAKES
        {
            name: 'Chocolate Truffle Cake',
            slug: 'chocolate-truffle-cake',
            description: 'Rich chocolate cake with truffle frosting and chocolate shavings. Perfect for chocolate lovers.',
            price: 899,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cakesCategory!.id,
            featured: true,
            inStock: true,
            weight: '1kg',
            servings: '8-10 people',
            ingredients: 'Chocolate, Flour, Eggs, Butter, Sugar, Cocoa Powder, Heavy Cream',
            allergens: 'Contains gluten, dairy, eggs',
        },
        {
            name: 'Red Velvet Cake',
            slug: 'red-velvet-cake',
            description: 'Classic red velvet with smooth cream cheese frosting. Moist and delicious.',
            price: 799,
            images: JSON.stringify(['/red-velvet.png']),
            categoryId: cakesCategory!.id,
            featured: true,
            inStock: true,
            weight: '1kg',
            servings: '8-10 people',
            ingredients: 'Flour, Cocoa, Buttermilk, Cream Cheese, Food Color, Vanilla',
            allergens: 'Contains gluten, dairy, eggs',
        },
        {
            name: 'Black Forest Cake',
            slug: 'black-forest-cake',
            description: 'Chocolate sponge layers with cherries, whipped cream, and chocolate shavings.',
            price: 849,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cakesCategory!.id,
            featured: false,
            inStock: true,
            weight: '1kg',
            servings: '8-10 people',
            ingredients: 'Chocolate Sponge, Cherries, Whipped Cream, Dark Chocolate',
            allergens: 'Contains gluten, dairy, eggs',
        },
        {
            name: 'Vanilla Sponge Cake',
            slug: 'vanilla-sponge-cake',
            description: 'Light and fluffy vanilla sponge with buttercream frosting.',
            price: 699,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cakesCategory!.id,
            featured: false,
            inStock: true,
            weight: '1kg',
            servings: '8-10 people',
            ingredients: 'Flour, Eggs, Butter, Sugar, Vanilla Extract, Milk',
            allergens: 'Contains gluten, dairy, eggs',
        },
        {
            name: 'Butterscotch Cake',
            slug: 'butterscotch-cake',
            description: 'Butterscotch flavored cake with crunchy butterscotch bits.',
            price: 749,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cakesCategory!.id,
            featured: false,
            inStock: true,
            weight: '1kg',
            servings: '8-10 people',
            ingredients: 'Flour, Butterscotch, Butter, Sugar, Eggs',
            allergens: 'Contains gluten, dairy, eggs, nuts',
        },

        // PASTRIES
        {
            name: 'Croissant',
            slug: 'croissant',
            description: 'Buttery, flaky French croissant. Perfect for breakfast.',
            price: 49,
            images: JSON.stringify(['/croissants.png']),
            categoryId: pastriesCategory!.id,
            featured: true,
            inStock: true,
            weight: '80g',
            servings: '1 person',
            ingredients: 'Flour, Butter, Yeast, Sugar, Salt',
            allergens: 'Contains gluten, dairy',
        },
        {
            name: 'Chocolate Croissant',
            slug: 'chocolate-croissant',
            description: 'Flaky croissant filled with rich dark chocolate.',
            price: 69,
            images: JSON.stringify(['/croissants.png']),
            categoryId: pastriesCategory!.id,
            featured: true,
            inStock: true,
            weight: '90g',
            servings: '1 person',
            ingredients: 'Flour, Butter, Dark Chocolate, Yeast',
            allergens: 'Contains gluten, dairy',
        },
        {
            name: 'Danish Pastry',
            slug: 'danish-pastry',
            description: 'Sweet pastry with fruit filling and glazed topping.',
            price: 69,
            images: JSON.stringify(['/croissants.png']),
            categoryId: pastriesCategory!.id,
            featured: false,
            inStock: true,
            weight: '100g',
            servings: '1 person',
            ingredients: 'Flour, Butter, Fruit Jam, Sugar Glaze',
            allergens: 'Contains gluten, dairy',
        },
        {
            name: 'Éclair',
            slug: 'eclair',
            description: 'French pastry filled with custard cream and topped with chocolate.',
            price: 79,
            images: JSON.stringify(['/croissants.png']),
            categoryId: pastriesCategory!.id,
            featured: false,
            inStock: true,
            weight: '110g',
            servings: '1 person',
            ingredients: 'Choux Pastry, Custard Cream, Chocolate Glaze',
            allergens: 'Contains gluten, dairy, eggs',
        },

        // BREADS
        {
            name: 'Sourdough Bread',
            slug: 'sourdough-bread',
            description: 'Traditional sourdough loaf with a crispy crust.',
            price: 120,
            images: JSON.stringify(['/hero-bakery.png']),
            categoryId: breadsCategory!.id,
            featured: false,
            inStock: true,
            weight: '500g',
            servings: '4-5 people',
            ingredients: 'Flour, Water, Salt, Sourdough Starter',
            allergens: 'Contains gluten',
        },
        {
            name: 'Multigrain Bread',
            slug: 'multigrain-bread',
            description: 'Healthy multigrain bread packed with seeds and grains.',
            price: 110,
            images: JSON.stringify(['/hero-bakery.png']),
            categoryId: breadsCategory!.id,
            featured: false,
            inStock: true,
            weight: '450g',
            servings: '4-5 people',
            ingredients: 'Whole Wheat Flour, Oats, Flax Seeds, Sunflower Seeds',
            allergens: 'Contains gluten, seeds',
        },
        {
            name: 'Baguette',
            slug: 'baguette',
            description: 'Classic French baguette with a golden crust.',
            price: 80,
            images: JSON.stringify(['/hero-bakery.png']),
            categoryId: breadsCategory!.id,
            featured: false,
            inStock: true,
            weight: '300g',
            servings: '2-3 people',
            ingredients: 'Flour, Water, Yeast, Salt',
            allergens: 'Contains gluten',
        },
        {
            name: 'Garlic Bread',
            slug: 'garlic-bread',
            description: 'Soft bread with garlic butter and herbs.',
            price: 90,
            images: JSON.stringify(['/hero-bakery.png']),
            categoryId: breadsCategory!.id,
            featured: false,
            inStock: true,
            weight: '250g',
            servings: '2-3 people',
            ingredients: 'Bread, Butter, Garlic, Parsley, Oregano',
            allergens: 'Contains gluten, dairy',
        },

        // COOKIES
        {
            name: 'Chocolate Chip Cookies',
            slug: 'chocolate-chip-cookies',
            description: 'Classic cookies loaded with chocolate chips. Soft and chewy.',
            price: 150,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cookiesCategory!.id,
            featured: true,
            inStock: true,
            weight: '250g pack',
            servings: '10-12 cookies',
            ingredients: 'Flour, Butter, Chocolate Chips, Sugar, Eggs',
            allergens: 'Contains gluten, dairy, eggs',
        },
        {
            name: 'Oatmeal Raisin Cookies',
            slug: 'oatmeal-raisin-cookies',
            description: 'Healthy oatmeal cookies with juicy raisins.',
            price: 140,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cookiesCategory!.id,
            featured: false,
            inStock: true,
            weight: '250g pack',
            servings: '10-12 cookies',
            ingredients: 'Oats, Flour, Raisins, Brown Sugar, Butter',
            allergens: 'Contains gluten, dairy',
        },
        {
            name: 'Double Chocolate Cookies',
            slug: 'double-chocolate-cookies',
            description: 'Rich chocolate cookies with chocolate chunks.',
            price: 160,
            images: JSON.stringify(['/chocolate-cake.png']),
            categoryId: cookiesCategory!.id,
            featured: false,
            inStock: true,
            weight: '250g pack',
            servings: '10-12 cookies',
            ingredients: 'Flour, Cocoa Powder, Dark Chocolate, Butter, Sugar',
            allergens: 'Contains gluten, dairy, eggs',
        },
    ]

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: product,
            create: product,
        })
        console.log('  ✅ Product:', product.name)
    }

    // ============================================
    // 5. CREATE ADDRESSES FOR CUSTOMERS
    // ============================================
    console.log('\n📍 Creating customer addresses...')

    const address1 = await prisma.address.upsert({
        where: { id: 'address-1-john' },
        update: {},
        create: {
            id: 'address-1-john',
            userId: customer1.id,
            label: 'Home',
            fullName: 'John Doe',
            phone: '+91 98765 11111',
            address: '123, MG Road, Richmond Town',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560025',
            isDefault: true,
        },
    })
    console.log('  ✅ Address for:', customer1.name)

    const address2 = await prisma.address.upsert({
        where: { id: 'address-2-priya' },
        update: {},
        create: {
            id: 'address-2-priya',
            userId: customer2.id,
            label: 'Home',
            fullName: 'Priya Sharma',
            phone: '+91 98765 22222',
            address: '456, Koramangala 4th Block',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560034',
            isDefault: true,
        },
    })
    console.log('  ✅ Address for:', customer2.name)

    const address3 = await prisma.address.upsert({
        where: { id: 'address-3-amit' },
        update: {},
        create: {
            id: 'address-3-amit',
            userId: customer3.id,
            label: 'Office',
            fullName: 'Amit Patel',
            phone: '+91 98765 33333',
            address: '789, Whitefield Main Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560066',
            isDefault: true,
        },
    })
    console.log('  ✅ Address for:', customer3.name)

    // ============================================
    // 6. CREATE ORDERS WITH DIFFERENT STATUSES
    // ============================================
    console.log('\n📦 Creating sample orders...')

    // Get some products
    const chocolateCake = await prisma.product.findUnique({ where: { slug: 'chocolate-truffle-cake' } })
    const redVelvet = await prisma.product.findUnique({ where: { slug: 'red-velvet-cake' } })
    const croissant = await prisma.product.findUnique({ where: { slug: 'croissant' } })
    const cookies = await prisma.product.findUnique({ where: { slug: 'chocolate-chip-cookies' } })

    // Order 1: DELIVERED (Customer 1)
    const order1 = await prisma.order.create({
        data: {
            orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
            userId: customer1.id,
            addressId: address1.id,
            subtotal: 899,
            deliveryFee: 50,
            tax: 0,
            total: 949,
            status: 'DELIVERED',
            paymentStatus: 'PAID',
            deliveryPartnerId: partner1.id,
            deliveryDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
            deliverySlot: '10 AM - 12 PM',
            statusHistory: JSON.stringify([
                { status: 'PENDING', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Order placed' },
                { status: 'CONFIRMED', timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(), note: 'Order confirmed by admin' },
                { status: 'PREPARING', timestamp: new Date(Date.now() - 86400000 * 2.2).toISOString(), note: 'Started preparing' },
                { status: 'ASSIGNED', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: `Assigned to ${partner1.name}` },
                { status: 'PICKED_UP', timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(), note: 'Package picked up' },
                { status: 'OUT_FOR_DELIVERY', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), note: 'Out for delivery' },
                { status: 'DELIVERED', timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(), note: 'Successfully delivered' },
            ]),
            items: {
                create: [
                    {
                        productId: chocolateCake!.id,
                        quantity: 1,
                        price: chocolateCake!.price,
                        customization: 'Happy Birthday message',
                    },
                ],
            },
        },
    })
    console.log('  ✅ Order 1 (DELIVERED):', order1.orderNumber)

    // Order 2: OUT_FOR_DELIVERY (Customer 2)
    const order2 = await prisma.order.create({
        data: {
            orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
            userId: customer2.id,
            addressId: address2.id,
            subtotal: 799,
            deliveryFee: 40,
            tax: 0,
            total: 839,
            status: 'OUT_FOR_DELIVERY',
            paymentStatus: 'PAID',
            deliveryPartnerId: partner2.id,
            deliveryDate: new Date(),
            deliverySlot: '2 PM - 4 PM',
            statusHistory: JSON.stringify([
                { status: 'PENDING', timestamp: new Date(Date.now() - 7200000).toISOString(), note: 'Order placed' },
                { status: 'CONFIRMED', timestamp: new Date(Date.now() - 5400000).toISOString(), note: 'Order confirmed' },
                { status: 'PREPARING', timestamp: new Date(Date.now() - 3600000).toISOString(), note: 'Preparing your order' },
                { status: 'ASSIGNED', timestamp: new Date(Date.now() - 1800000).toISOString(), note: `Assigned to ${partner2.name}` },
                { status: 'PICKED_UP', timestamp: new Date(Date.now() - 900000).toISOString(), note: 'Picked up by delivery partner' },
                { status: 'OUT_FOR_DELIVERY', timestamp: new Date(Date.now() - 300000).toISOString(), note: 'On the way' },
            ]),
            items: {
                create: [
                    {
                        productId: redVelvet!.id,
                        quantity: 1,
                        price: redVelvet!.price,
                    },
                ],
            },
        },
    })
    console.log('  ✅ Order 2 (OUT_FOR_DELIVERY):', order2.orderNumber)

    // Order 3: PREPARING (Customer 3)
    const order3 = await prisma.order.create({
        data: {
            orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
            userId: customer3.id,
            addressId: address3.id,
            subtotal: 247,
            deliveryFee: 30,
            tax: 0,
            total: 277,
            status: 'PREPARING',
            paymentStatus: 'PAID',
            deliveryDate: new Date(),
            deliverySlot: '4 PM - 6 PM',
            statusHistory: JSON.stringify([
                { status: 'PENDING', timestamp: new Date(Date.now() - 3600000).toISOString(), note: 'Order received' },
                { status: 'CONFIRMED', timestamp: new Date(Date.now() - 2700000).toISOString(), note: 'Payment confirmed' },
                { status: 'PREPARING', timestamp: new Date(Date.now() - 1800000).toISOString(), note: 'Kitchen preparing your items' },
            ]),
            items: {
                create: [
                    {
                        productId: croissant!.id,
                        quantity: 3,
                        price: croissant!.price,
                    },
                    {
                        productId: cookies!.id,
                        quantity: 1,
                        price: cookies!.price,
                    },
                ],
            },
        },
    })
    console.log('  ✅ Order 3 (PREPARING):', order3.orderNumber)

    // Order 4: PENDING (Customer 1)
    const order4 = await prisma.order.create({
        data: {
            orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
            userId: customer1.id,
            addressId: address1.id,
            subtotal: 849,
            deliveryFee: 50,
            tax: 0,
            total: 899,
            status: 'PENDING',
            paymentStatus: 'PAID',
            deliveryDate: new Date(Date.now() + 86400000), // Tomorrow
            deliverySlot: '12 PM - 2 PM',
            statusHistory: JSON.stringify([
                { status: 'PENDING', timestamp: new Date(Date.now() - 600000).toISOString(), note: 'Order placed successfully' },
            ]),
            items: {
                create: [
                    {
                        productId: (await prisma.product.findUnique({ where: { slug: 'black-forest-cake' } }))!.id,
                        quantity: 1,
                        price: 849,
                    },
                ],
            },
        },
    })
    console.log('  ✅ Order 4 (PENDING):', order4.orderNumber)

    // Order 5: ASSIGNED (Customer 2) - Ready for pickup
    const order5 = await prisma.order.create({
        data: {
            orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
            userId: customer2.id,
            addressId: address2.id,
            subtotal: 699,
            deliveryFee: 40,
            tax: 0,
            total: 739,
            status: 'ASSIGNED',
            paymentStatus: 'PAID',
            deliveryPartnerId: partner3.id,
            deliveryDate: new Date(),
            deliverySlot: '6 PM - 8 PM',
            statusHistory: JSON.stringify([
                { status: 'PENDING', timestamp: new Date(Date.now() - 5400000).toISOString(), note: 'Order placed' },
                { status: 'CONFIRMED', timestamp: new Date(Date.now() - 4500000).toISOString(), note: 'Order confirmed' },
                { status: 'PREPARING', timestamp: new Date(Date.now() - 2700000).toISOString(), note: 'Preparing in kitchen' },
                { status: 'ASSIGNED', timestamp: new Date(Date.now() - 900000).toISOString(), note: `Assigned to ${partner3.name}` },
            ]),
            items: {
                create: [
                    {
                        productId: (await prisma.product.findUnique({ where: { slug: 'vanilla-sponge-cake' } }))!.id,
                        quantity: 1,
                        price: 699,
                    },
                ],
            },
        },
    })
    console.log('  ✅ Order 5 (ASSIGNED):', order5.orderNumber)

    // ============================================
    // 7. CREATE REVIEWS
    // ============================================
    console.log('\n⭐ Creating product reviews...')

    await prisma.review.create({
        data: {
            userId: customer1.id,
            productId: chocolateCake!.id,
            rating: 5,
            comment: 'Absolutely delicious! The truffle frosting was perfect. Everyone at the party loved it!',
        },
    })
    console.log('  ✅ Review 1: Chocolate Truffle Cake')

    await prisma.review.create({
        data: {
            userId: customer2.id,
            productId: redVelvet!.id,
            rating: 5,
            comment: 'Best red velvet cake in town! Moist, fluffy, and the cream cheese frosting is heavenly.',
        },
    })
    console.log('  ✅ Review 2: Red Velvet Cake')

    await prisma.review.create({
        data: {
            userId: customer3.id,
            productId: croissant!.id,
            rating: 4,
            comment: 'Very good croissants! Fresh and flaky. Would love if they were a bit more buttery.',
        },
    })
    console.log('  ✅ Review 3: Croissant')

    await prisma.review.create({
        data: {
            userId: customer1.id,
            productId: cookies!.id,
            rating: 5,
            comment: 'Perfect for my kids! Soft, chewy, and loaded with chocolate chips. Will order again!',
        },
    })
    console.log('  ✅ Review 4: Chocolate Chip Cookies')

    console.log('\n✨ Database seeded successfully!\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 TEST CREDENTIALS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n👨‍💼 ADMIN LOGIN')
    console.log('   Email: admin@mrcake.com')
    console.log('   Password: admin123')
    console.log('   Access: /admin')
    console.log('\n👥 CUSTOMER LOGINS')
    console.log('   1. John Doe')
    console.log('      Email: john.doe@example.com')
    console.log('      Password: customer123')
    console.log('   2. Priya Sharma')
    console.log('      Email: priya.sharma@example.com')
    console.log('      Password: customer123')
    console.log('   3. Amit Patel')
    console.log('      Email: amit.patel@example.com')
    console.log('      Password: customer123')
    console.log('\n🚴 DELIVERY PARTNER LOGINS')
    console.log('   1. Rajesh Kumar')
    console.log('      Phone: +91 88888 11111')
    console.log('      Password: delivery123')
    console.log('      Access: /delivery/login')
    console.log('   2. Suresh Nair')
    console.log('      Phone: +91 88888 22222')
    console.log('      Password: delivery123')
    console.log('   3. Mohammed Ali')
    console.log('      Phone: +91 88888 33333')
    console.log('      Password: delivery123')
    console.log('\n📊 DATABASE SUMMARY')
    console.log('   • Users: 4 (1 admin, 3 customers)')
    console.log('   • Delivery Partners: 3')
    console.log('   • Categories: 4')
    console.log('   • Products: 17')
    console.log('   • Orders: 5 (various statuses)')
    console.log('   • Reviews: 4')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
