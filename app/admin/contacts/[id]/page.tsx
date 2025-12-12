import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminContactDetailPage({ params }: PageProps) {
  const session = await verifyAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const { id } = await params
  const contact = await prisma.contact.findUnique({
    where: { id },
  })

  if (!contact) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/contacts"
          className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-4"
          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
        >
          ← Retour aux messages
        </Link>
        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Message de {contact.firstName} {contact.lastName}
        </h1>
        <p
          className="text-neutral-600"
          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
        >
          Reçu le {formatDate(contact.createdAt)}
        </p>
      </div>

      {/* Contact Details */}
      <div className="bg-frost border border-neutral-200 rounded-sm p-6 md:p-8 space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p
              className="text-sm text-neutral-500 mb-1"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Nom complet
            </p>
            <p
              className="text-base font-medium"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              {contact.firstName} {contact.lastName}
            </p>
          </div>
          <div>
            <p
              className="text-sm text-neutral-500 mb-1"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Email
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="text-base font-medium text-neutral-900 hover:text-neutral-600"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              {contact.email}
            </a>
          </div>
          {contact.phone && (
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Téléphone
              </p>
              <a
                href={`tel:${contact.phone}`}
                className="text-base font-medium text-neutral-900 hover:text-neutral-600"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {contact.phone}
              </a>
            </div>
          )}
          {contact.projectType && (
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Type de projet
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {contact.projectType}
              </p>
            </div>
          )}
          {contact.budget && (
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Budget
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {contact.budget}
              </p>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="pt-6 border-t border-neutral-200">
          <p
            className="text-sm text-neutral-500 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Message
          </p>
          <p
            className="text-base text-neutral-900 whitespace-pre-wrap"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {contact.message}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-neutral-200 flex gap-4">
          <a
            href={`mailto:${contact.email}?subject=Re: Votre message&body=Bonjour ${contact.firstName},%0D%0A%0D%0A`}
            className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
          >
            Répondre par email
          </a>
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            >
              Appeler
            </a>
          )}
        </div>
      </div>
    </div>
  )
}


