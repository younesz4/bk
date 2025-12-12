import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendOrderAdminNotification } from '@/lib/email'

export const dynamic = 'force-dynamic'

interface OrderItemInput {
  productId: string
  quantity: number
}

interface CreateOrderBody {
  customerName: string
  customerEmail?: string
  customerPhone?: string
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode?: string
  country: string
  notes?: string
  paymentMethod: 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'QUOTE_ONLY' | 'COD'
  items: OrderItemInput[]
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderBody = await request.json()

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide. Veuillez ajouter des articles.' },
        { status: 400 }
      )
    }

    if (!body.customerName || !body.addressLine1 || !body.city || !body.country || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Informations client incomplètes' },
        { status: 400 }
      )
    }

    // Email is optional for COD orders, but validate if provided
    if (body.customerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.customerEmail)) {
        return NextResponse.json(
          { error: 'Format d\'email invalide' },
          { status: 400 }
        )
      }
    }

    const productIds = body.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    })

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id))
      const missingIds = productIds.filter((id) => !foundIds.has(id))
      return NextResponse.json(
        { error: `Produits non trouvés: ${missingIds.join(', ')}` },
        { status: 400 }
      )
    }

    const productMap = new Map(products.map((p) => [p.id, p]))

    let totalAmount = 0
    const orderItems = []

    for (const item of body.items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Article invalide: productId et quantity requis' },
          { status: 400 }
        )
      }

      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Produit non trouvé: ${item.productId}` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}, Demandé: ${item.quantity}` },
          { status: 400 }
        )
      }

      const unitPrice = product.price
      const subtotal = unitPrice * item.quantity
      totalAmount += subtotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      })
    }

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail || `customer-${Date.now()}@placeholder.com`, // Placeholder email if not provided
        customerPhone: body.customerPhone || null,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2 || null,
        city: body.city,
        postalCode: body.postalCode || null,
        country: body.country,
        notes: body.notes || null,
        paymentMethod: body.paymentMethod === 'COD' ? 'CASH_ON_DELIVERY' : body.paymentMethod,
        status: 'PENDING',
        totalAmount,
        currency: 'EUR',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    try {
      await sendOrderConfirmationEmail(order as any)
      await sendOrderAdminNotification(order as any)
    } catch (emailError) {
      console.error('Error sending order emails:', emailError)
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
    })
  } catch (error: any) {
    console.error('Error creating order:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Commande en double' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Échec de la création de la commande. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
