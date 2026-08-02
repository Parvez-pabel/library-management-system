export const paginate = async ({
  model,
  reqQuery = {},
  customFilter = {},
  selectFields = "",
  populateOptions = null,
}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = reqQuery;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const finalQuery = { ...customFilter };
    let queryPromise = model
      .find(finalQuery)
      .select(selectFields)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    if (populateOptions) {
      queryPromise = queryPromise.populate(populateOptions);
    }
    const [totalData, resultData] = await Promise.all([
      model.countDocuments(finalQuery),
      queryPromise,
    ]);
    return {
      totalData,
      currentPage: pageNum,
      totalPages: Math.ceil(totalData / limitNum),
      limit: limitNum,
      nextPage: pageNum < Math.ceil(totalData / limitNum),
      prevPage: pageNum > 1,
      data: resultData,
    };
  } catch (error) {
    throw error;
  }
};
