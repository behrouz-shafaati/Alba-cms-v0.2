import { QueryFind } from '../features/core/interface'

export default function parseQuery(req: any): QueryFind {
  const searchParams = req.nextUrl.searchParams

  // pagination
  const page = searchParams.get('page') ?? 1
  const perPage = searchParams.get('perPage') ?? 6

  // filters
  const filters: any = {}
  searchParams.forEach((value, key) => {
    if (
      ![
        'page',
        'perPage',
        'orderBy',
        'order',
        'saveLog',
        'sort',
        'populate',
      ].includes(key)
    ) {
      filters[key] = value
    }
  })

  return {
    filters: {
      ...filters,
      orderBy: searchParams.get('orderBy') ?? undefined,
      order: searchParams.get('order') ?? undefined,
    },
    pagination: {
      page: page === 'off' ? 'off' : Number(page ?? 1),
      perPage: Number(perPage ?? 10),
    },
    saveLog: searchParams.get('saveLog') === 'true' ? true : false,
    sort: searchParams.get('sort') ?? undefined,
    populate: searchParams.get('populate') ?? undefined,
  }
}
