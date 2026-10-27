import { Task } from "../models/task.model.js";
import { buildTaskQuery } from "../utils/taskQueryBuilder.js";

export const listTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = "-createdAt" } = req.query;

    const pageNumber = Math.max(1, Number.isNaN(Number(page)) ? 1 : Number(page));
    const limitNumberRaw = Number.isNaN(Number(limit)) ? 20 : Number(limit);
    const limitNumber = Math.min(Math.max(1, limitNumberRaw), 100);
    const sortValue = typeof sort === "string" && sort.trim().length > 0 ? sort : "-createdAt";

    const query = buildTaskQuery(req.query);

    const tasks = await Task.find(query)
      .sort(sortValue)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Task.countDocuments(query);

    res.json({
      data: tasks,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const toggleComplete = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    task.status = task.status === "completed" ? "pending" : "completed";
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    task.isFavorite = !task.isFavorite;
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const duplicateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    const duplicated = await Task.create(task.duplicate());

    res.status(201).json(duplicated);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getTaskSummary = async (_req, res, next) => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [statusBuckets, favoriteCount, overdueCount, dueSoonCount, categoryBuckets] =
      await Promise.all([
        Task.aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),
        Task.countDocuments({ isFavorite: true }),
        Task.countDocuments({
          dueDate: { $lt: now },
          status: { $ne: "completed" },
        }),
        Task.countDocuments({
          dueDate: { $gte: now, $lte: sevenDaysFromNow },
          status: { $ne: "completed" },
        }),
        Task.aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),
      ]);

    const total = statusBuckets.reduce((acc, bucket) => acc + bucket.count, 0);
    const statusBreakdown = statusBuckets.reduce(
      (acc, bucket) => ({ ...acc, [bucket._id || "unspecified"]: bucket.count }),
      {}
    );

    res.json({
      totals: {
        all: total,
        favorites: favoriteCount,
        overdue: overdueCount,
        dueSoon: dueSoonCount,
      },
      statusBreakdown,
      categories: categoryBuckets.map(({ _id: category, count }) => ({
        category: category || "Uncategorized",
        count,
      })),
    });
  } catch (error) {
    next(error);
  }
};
