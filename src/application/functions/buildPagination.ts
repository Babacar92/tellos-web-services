export interface buildPaginationInterface {
    page: number;
    total: number;
    limit: number;
}

export const buildPagination = (args: buildPaginationInterface) => {
    const { page, total, limit } = args;
    const totalPages = Math.ceil(total / limit);
    return {
        page: page,
        total,
        totalPage: Math.ceil(total / limit),
        limit: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
    };
};
