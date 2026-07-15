import { db } from '@/lib/db'
import ConventionList from './ConventionList'
import ConventionForm from './ConventionForm'

export default async function ConvenzioniPage() {
  const conventions = await db.convention.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tags: { select: { name: true } } },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-extrabold tracking-tight text-ink">Convenzioni</h1>
        <p className="text-[13px] text-muted">{conventions.filter(c => c.active).length} attive · {conventions.length} totali</p>
      </div>

      {/* Form aggiunta */}
      <section className="bg-white rounded-[16px] border border-line px-5 py-5 mb-6">
        <h2 className="text-[14px] font-bold text-ink mb-4">Aggiungi convenzione</h2>
        <ConventionForm mode="create" />
      </section>

      {/* Lista */}
      <ConventionList
        conventions={conventions.map(c => ({
          id: c.id,
          name: c.name,
          benefitText: c.benefitText,
          active: c.active,
          tags: c.tags.map(t => t.name),
        }))}
      />
    </div>
  )
}
