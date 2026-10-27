const getBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "yes"].includes(value.toLowerCase());
  }
  return undefined;
};

export const buildTaskQuery = (params = {}) => {
  const query = {};

  if (params.search) {
    query.$or = [
      { title: { $regex: params.search, $options: "i" } },
      { description: { $regex: params.search, $options: "i" } },
      { notes: { $regex: params.search, $options: "i" } },
    ];
  }

  if (params.status) {
    query.status = params.status;
  }

  if (params.category) {
    query.category = params.category;
  }

  const isFavorite = getBoolean(params.isFavorite);
  if (isFavorite !== undefined) {
    query.isFavorite = isFavorite;
  }

  if (params.dueBefore || params.dueAfter) {
    query.dueDate = {};

    if (params.dueBefore) {
      query.dueDate.$lte = new Date(params.dueBefore);
    }

    if (params.dueAfter) {
      query.dueDate.$gte = new Date(params.dueAfter);
    }
  }

  if (getBoolean(params.overdue)) {
    query.dueDate = query.dueDate || {};
    query.dueDate.$lt = new Date();
    query.status = { $ne: "completed" };
  }

  if (params.reminderBefore) {
    query.reminders = {
      $elemMatch: {
        time: { $lte: new Date(params.reminderBefore) },
      },
    };
  }

  return query;
};
