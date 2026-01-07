export type QueryOptions = {
  searchTerm?: string;
  sort?: string;
  page?: number;
  limit?: number;
  fields?: string;
  [key: string]: any;
};

export const Querybuilder = (query: QueryOptions, searchableFields: string[]) => {
  // string -> number conversion + default
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const { searchTerm, sort, fields } = query;

  // filterable fields
  const filters = { ...query };
  ["searchTerm", "sort", "page", "limit", "fields"].forEach(k => delete filters[k]);

  const where: any = { ...filters, isDeleted: false };

  if (searchTerm) {
    where.OR = searchableFields.map(field => ({
      [field]: { contains: searchTerm, mode: "insensitive" }
    }));
  }

  // Multi-field sorting fix
  let orderBy: any = [{ createdAt: "desc" }];
  if (sort) {
    orderBy = sort.split(",").map(f => {
      f = f.trim();
      if (!f) return null;
      const desc = f.startsWith("-");
      const key = desc ? f.slice(1) : f;
      return { [key]: desc ? "desc" : "asc" };
    }).filter(Boolean); // remove nulls
    if (orderBy.length === 0) orderBy = [{ createdAt: "desc" }];
  }

  // fields projection
  const select = fields
    ? Object.fromEntries(fields.split(",").map(f => [f.trim(), true]))
    : undefined;

  return { where, skip, take: limit, orderBy, select, page, limit };
};
