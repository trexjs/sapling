import { Router } from "express";
import { store } from "../datastore";
import { asyncHandler } from "../utils/async-handler";

export const realmRouter = Router();

realmRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const realms = store.listRealms();
    res.json({ items: realms, total: realms.length });
  })
);

realmRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, slug, description, contactEmail, status, settings } = req.body;
    const realm = store.createRealm({ name, slug, description, contactEmail, status, settings });
    res.status(201).json(realm);
  })
);

realmRouter.get(
  "/:realmId",
  asyncHandler(async (req, res) => {
    const realm = store.getRealm(req.params.realmId);
    if (!realm) {
      return res.status(404).json({ error: "Realm not found" });
    }
    res.json(realm);
  })
);

realmRouter.put(
  "/:realmId",
  asyncHandler(async (req, res) => {
    const updated = store.updateRealm(req.params.realmId, req.body);
    res.json(updated);
  })
);

realmRouter.get(
  "/:realmId/users",
  asyncHandler(async (req, res) => {
    const users = store.listUsers(req.params.realmId);
    res.json({ items: users, total: users.length });
  })
);

realmRouter.post(
  "/:realmId/users",
  asyncHandler(async (req, res) => {
    const user = store.createUser({ ...req.body, realmId: req.params.realmId });
    res.status(201).json(user);
  })
);

realmRouter.get(
  "/:realmId/users/:userId",
  asyncHandler(async (req, res) => {
    const user = store.getUser(req.params.realmId, req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  })
);

realmRouter.put(
  "/:realmId/users/:userId",
  asyncHandler(async (req, res) => {
    const updated = store.updateUser(req.params.userId, req.body);
    res.json(updated);
  })
);

realmRouter.get(
  "/:realmId/groups",
  asyncHandler(async (req, res) => {
    const groups = store.listGroups(req.params.realmId);
    res.json({ items: groups, total: groups.length });
  })
);

realmRouter.post(
  "/:realmId/groups",
  asyncHandler(async (req, res) => {
    const group = store.createGroup({ ...req.body, realmId: req.params.realmId });
    res.status(201).json(group);
  })
);

realmRouter.get(
  "/:realmId/groups/:groupId",
  asyncHandler(async (req, res) => {
    const group = store.getGroup(req.params.realmId, req.params.groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  })
);

realmRouter.put(
  "/:realmId/groups/:groupId",
  asyncHandler(async (req, res) => {
    const updated = store.updateGroup(req.params.groupId, req.body);
    res.json(updated);
  })
);

realmRouter.post(
  "/:realmId/groups/:groupId/members",
  asyncHandler(async (req, res) => {
    const updated = store.addUserToGroup(req.params.realmId, req.params.groupId, req.body.userId);
    res.json(updated);
  })
);

realmRouter.delete(
  "/:realmId/groups/:groupId/members/:userId",
  asyncHandler(async (req, res) => {
    const updated = store.removeUserFromGroup(
      req.params.realmId,
      req.params.groupId,
      req.params.userId
    );
    res.json(updated);
  })
);
