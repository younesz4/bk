import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminContactsPage() {
  const session = await verifyAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Messages de contact
        </h1>
        <p
          className="text-neutral-600"
          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
        >
          Consultez tous les messages reçus via le formulaire de contact
        </p>
      </div>

      {/* Contacts Table */}
      <div className="bg-frost border border-neutral-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Date
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Nom
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Email
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Téléphone
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Type de projet
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Message
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-neutral-500"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    Aucun message pour le moment
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {formatDate(contact.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-900"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {contact.firstName} {contact.lastName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-neutral-600 hover:text-neutral-900"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {contact.phone || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {contact.projectType || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <span
                        className="text-neutral-600 line-clamp-2"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                        title={contact.message}
                      >
                        {contact.message}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/contacts/${contact.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}


