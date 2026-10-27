import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from "react";
import { kingsmanApi } from "../services/kingsmanApi.ts";
import type { Group, Realm, User } from "../types";

type KingsmanState = {
  loading: boolean;
  error?: string;
  realms: Realm[];
  selectedRealmId?: string;
  usersByRealm: Record<string, User[]>;
  groupsByRealm: Record<string, Group[]>;
};

type Action =
  | { type: "setLoading"; payload: boolean }
  | { type: "setError"; payload?: string }
  | { type: "setRealms"; payload: Realm[] }
  | { type: "upsertRealm"; payload: Realm }
  | { type: "setSelectedRealm"; payload?: string }
  | { type: "setUsers"; payload: { realmId: string; users: User[] } }
  | { type: "upsertUser"; payload: { realmId: string; user: User } }
  | { type: "setGroups"; payload: { realmId: string; groups: Group[] } }
  | { type: "upsertGroup"; payload: { realmId: string; group: Group } };

const initialState: KingsmanState = {
  loading: false,
  realms: [],
  selectedRealmId: undefined,
  usersByRealm: {},
  groupsByRealm: {},
};

function reducer(state: KingsmanState, action: Action): KingsmanState {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setError":
      return { ...state, error: action.payload };
    case "setRealms": {
      const selectedRealmId = state.selectedRealmId ?? action.payload[0]?.id;
      return { ...state, realms: action.payload, selectedRealmId };
    }
    case "upsertRealm": {
      const nextRealms = state.realms.some((realm) => realm.id === action.payload.id)
        ? state.realms.map((realm) => (realm.id === action.payload.id ? action.payload : realm))
        : [...state.realms, action.payload];
      return { ...state, realms: nextRealms };
    }
    case "setSelectedRealm":
      return { ...state, selectedRealmId: action.payload };
    case "setUsers":
      return {
        ...state,
        usersByRealm: { ...state.usersByRealm, [action.payload.realmId]: action.payload.users },
      };
    case "upsertUser": {
      const current = state.usersByRealm[action.payload.realmId] ?? [];
      const nextUsers = current.some((user) => user.id === action.payload.user.id)
        ? current.map((user) => (user.id === action.payload.user.id ? action.payload.user : user))
        : [...current, action.payload.user];
      return {
        ...state,
        usersByRealm: { ...state.usersByRealm, [action.payload.realmId]: nextUsers },
      };
    }
    case "setGroups":
      return {
        ...state,
        groupsByRealm: { ...state.groupsByRealm, [action.payload.realmId]: action.payload.groups },
      };
    case "upsertGroup": {
      const current = state.groupsByRealm[action.payload.realmId] ?? [];
      const nextGroups = current.some((group) => group.id === action.payload.group.id)
        ? current.map((group) => (group.id === action.payload.group.id ? action.payload.group : group))
        : [...current, action.payload.group];
      return {
        ...state,
        groupsByRealm: { ...state.groupsByRealm, [action.payload.realmId]: nextGroups },
      };
    }
    default:
      return state;
  }
}

type KingsmanContextValue = {
  state: KingsmanState;
  setLoading: (value: boolean) => void;
  refreshRealms: () => Promise<void>;
  createRealm: (payload: Parameters<typeof kingsmanApi.createRealm>[0]) => Promise<Realm>;
  updateRealm: (
    realmId: string,
    payload: Parameters<typeof kingsmanApi.updateRealm>[1]
  ) => Promise<Realm>;
  setSelectedRealm: (realmId?: string) => void;
  loadRealmUsers: (realmId: string) => Promise<void>;
  createUser: (payload: Parameters<typeof kingsmanApi.createUser>[0]) => Promise<User>;
  updateUser: (
    realmId: string,
    userId: string,
    payload: Parameters<typeof kingsmanApi.updateUser>[2]
  ) => Promise<User>;
  loadRealmGroups: (realmId: string) => Promise<void>;
  createGroup: (payload: Parameters<typeof kingsmanApi.createGroup>[0]) => Promise<Group>;
  updateGroup: (
    realmId: string,
    groupId: string,
    payload: Parameters<typeof kingsmanApi.updateGroup>[2]
  ) => Promise<Group>;
  addUserToGroup: (realmId: string, groupId: string, userId: string) => Promise<Group>;
  removeUserFromGroup: (realmId: string, groupId: string, userId: string) => Promise<Group>;
};

const KingsmanContext = createContext<KingsmanContextValue | undefined>(undefined);

export const KingsmanProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "setLoading", payload: loading });
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error(error);
    dispatch({
      type: "setError",
      payload: error instanceof Error ? error.message : "Unexpected error",
    });
  }, []);

  const refreshRealms = useCallback(async () => {
    setLoading(true);
    dispatch({ type: "setError", payload: undefined });
    try {
      const realms = await kingsmanApi.listRealms();
      dispatch({ type: "setRealms", payload: realms });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError, setLoading]);

  const createRealm = useCallback(
    async (payload: Parameters<typeof kingsmanApi.createRealm>[0]) => {
      setLoading(true);
      dispatch({ type: "setError", payload: undefined });
      try {
        const realm = await kingsmanApi.createRealm(payload);
        dispatch({ type: "upsertRealm", payload: realm });
        if (!state.selectedRealmId) {
          dispatch({ type: "setSelectedRealm", payload: realm.id });
        }
        return realm;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading, state.selectedRealmId]
  );

  const updateRealm = useCallback(
    async (
      realmId: string,
      payload: Parameters<typeof kingsmanApi.updateRealm>[1]
    ) => {
      setLoading(true);
      dispatch({ type: "setError", payload: undefined });
      try {
        const realm = await kingsmanApi.updateRealm(realmId, payload);
        dispatch({ type: "upsertRealm", payload: realm });
        return realm;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading]
  );

  const setSelectedRealm = useCallback((realmId?: string) => {
    dispatch({ type: "setSelectedRealm", payload: realmId });
  }, []);

  const loadRealmUsers = useCallback(
    async (realmId: string) => {
      setLoading(true);
      try {
        const users = await kingsmanApi.listUsers(realmId);
        dispatch({ type: "setUsers", payload: { realmId, users } });
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading]
  );

  const createUser = useCallback(
    async (payload: Parameters<typeof kingsmanApi.createUser>[0]) => {
      setLoading(true);
      try {
        const user = await kingsmanApi.createUser(payload);
        dispatch({ type: "upsertUser", payload: { realmId: payload.realmId, user } });
        return user;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading]
  );

  const updateUser = useCallback(
    async (
      realmId: string,
      userId: string,
      payload: Parameters<typeof kingsmanApi.updateUser>[2]
    ) => {
      setLoading(true);
      try {
        const user = await kingsmanApi.updateUser(realmId, userId, payload);
        dispatch({ type: "upsertUser", payload: { realmId, user } });
        return user;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading]
  );

  const loadRealmGroups = useCallback(
    async (realmId: string) => {
      setLoading(true);
      try {
        const groups = await kingsmanApi.listGroups(realmId);
        dispatch({ type: "setGroups", payload: { realmId, groups } });
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading]
  );

  const createGroup = useCallback(
    async (payload: Parameters<typeof kingsmanApi.createGroup>[0]) => {
      setLoading(true);
      try {
        const group = await kingsmanApi.createGroup(payload);
        dispatch({ type: "upsertGroup", payload: { realmId: payload.realmId, group } });
        return group;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading]
  );

  const updateGroup = useCallback(
    async (
      realmId: string,
      groupId: string,
      payload: Parameters<typeof kingsmanApi.updateGroup>[2]
    ) => {
      setLoading(true);
      try {
        const group = await kingsmanApi.updateGroup(realmId, groupId, payload);
        dispatch({ type: "upsertGroup", payload: { realmId, group } });
        return group;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, setLoading]
  );

  const addUserToGroup = useCallback(
    async (realmId: string, groupId: string, userId: string) => {
      setLoading(true);
      try {
        const group = await kingsmanApi.addUserToGroup(realmId, groupId, userId);
        dispatch({ type: "upsertGroup", payload: { realmId, group } });
        await loadRealmUsers(realmId);
        return group;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, loadRealmUsers, setLoading]
  );

  const removeUserFromGroup = useCallback(
    async (realmId: string, groupId: string, userId: string) => {
      setLoading(true);
      try {
        const group = await kingsmanApi.removeUserFromGroup(realmId, groupId, userId);
        dispatch({ type: "upsertGroup", payload: { realmId, group } });
        await loadRealmUsers(realmId);
        return group;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError, loadRealmUsers, setLoading]
  );

  useEffect(() => {
    void refreshRealms();
  }, [refreshRealms]);

  const value = useMemo<KingsmanContextValue>(
    () => ({
      state,
      setLoading,
      refreshRealms,
      createRealm,
      updateRealm,
      setSelectedRealm,
      loadRealmUsers,
      createUser,
      updateUser,
      loadRealmGroups,
      createGroup,
      updateGroup,
      addUserToGroup,
      removeUserFromGroup,
    }),
    [
      state,
      refreshRealms,
      createRealm,
      updateRealm,
      setSelectedRealm,
      loadRealmUsers,
      createUser,
      updateUser,
      loadRealmGroups,
      createGroup,
      updateGroup,
      addUserToGroup,
      removeUserFromGroup,
    ]
  );

  return <KingsmanContext.Provider value={value}>{children}</KingsmanContext.Provider>;
};

export function useKingsman(): KingsmanContextValue {
  const ctx = useContext(KingsmanContext);
  if (!ctx) {
    throw new Error("useKingsman must be used within KingsmanProvider");
  }
  return ctx;
}
