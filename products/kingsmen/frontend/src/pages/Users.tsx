import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useKingsman } from "../context/KingsmanContext";
import type { Group, Realm, User } from "../types";

const Grid = styled.div`
  display: grid;
  gap: 32px;
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.palette.primary};
`;

const Subtitle = styled.h2`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.palette.primary};
  font-size: 1.25rem;
`;

const Muted = styled.p`
  color: #64748b;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: #475569;
`;

const Input = styled.input`
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.accent};
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
  }
`;

const Select = styled.select`
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1rem;
  background: white;
`;

const Button = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 1rem;
  background: ${({ theme }) => theme.palette.accent};
  color: #0f172a;
  cursor: pointer;
  transition: background 120ms ease;
  &:hover {
    background: #0ea5e9;
  }
`;

const UsersList = styled.div`
  display: grid;
  gap: 16px;
`;

const UserCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: grid;
  gap: 12px;
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Email = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.palette.primary};
`;

const GroupChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span<{ $variant?: "neutral" | "assigned" }>`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ $variant }) => ($variant === "assigned" ? "#1e293b" : "#e2e8f0")};
  color: ${({ $variant }) => ($variant === "assigned" ? "white" : "#0f172a")};
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #475569;
`;

const GroupAssignments = styled.div`
  display: grid;
  gap: 8px;
`;

type UserFormState = {
  email: string;
  firstName: string;
  lastName: string;
};

type GroupFormState = {
  name: string;
  description: string;
  parentGroupId: string;
};

const defaultUserForm: UserFormState = {
  email: "",
  firstName: "",
  lastName: "",
};

const defaultGroupForm: GroupFormState = {
  name: "",
  description: "",
  parentGroupId: "",
};

export const UsersPage = () => {
  const { realmId } = useParams<{ realmId: string }>();
  const navigate = useNavigate();
  const {
    state: { realms, usersByRealm, groupsByRealm, loading },
    refreshRealms,
    setSelectedRealm,
    loadRealmUsers,
    loadRealmGroups,
    createUser,
    updateUser,
    createGroup,
    addUserToGroup,
    removeUserFromGroup,
  } = useKingsman();

  const [userForm, setUserForm] = useState<UserFormState>(defaultUserForm);
  const [groupForm, setGroupForm] = useState<GroupFormState>(defaultGroupForm);
  const [selectedUser, setSelectedUser] = useState<string | undefined>();

  const realm = useMemo<Realm | undefined>(
    () => realms.find((item) => item.id === realmId),
    [realmId, realms]
  );

  const users = useMemo<User[]>(() => (realmId ? usersByRealm[realmId] ?? [] : []), [
    usersByRealm,
    realmId,
  ]);

  const groups = useMemo<Group[]>(() => (realmId ? groupsByRealm[realmId] ?? [] : []), [
    groupsByRealm,
    realmId,
  ]);

  useEffect(() => {
    if (!realmId) {
      if (realms[0]) {
        navigate(`/realms/${realms[0].id}/users`, { replace: true });
      }
      return;
    }

    setSelectedRealm(realmId);

    if (!realm) {
      void refreshRealms();
    }

    if (!usersByRealm[realmId]) {
      void loadRealmUsers(realmId);
    }

    if (!groupsByRealm[realmId]) {
      void loadRealmGroups(realmId);
    }
  }, [
    realmId,
    realm,
    realms,
    refreshRealms,
    setSelectedRealm,
    loadRealmUsers,
    loadRealmGroups,
    usersByRealm,
    groupsByRealm,
    navigate,
  ]);

  const handleUserFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!realmId || !userForm.email.trim()) {
      return;
    }

    try {
      await createUser({
        realmId,
        email: userForm.email,
        profile: {
          firstName: userForm.firstName || undefined,
          lastName: userForm.lastName || undefined,
        },
      });
      setUserForm(defaultUserForm);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (user: User, nextStatus: User["status"]) => {
    if (!realmId || user.status === nextStatus) {
      return;
    }
    try {
      await updateUser(realmId, user.id, { status: nextStatus });
    } catch (error) {
      console.error(error);
    }
  };

  const handleGroupToggle = async (user: User, group: Group, checked: boolean) => {
    if (!realmId) {
      return;
    }

    try {
      if (checked) {
        await addUserToGroup(realmId, group.id, user.id);
      } else {
        await removeUserFromGroup(realmId, group.id, user.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGroupFormChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setGroupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!realmId || !groupForm.name.trim()) {
      return;
    }

    try {
      await createGroup({
        realmId,
        name: groupForm.name,
        description: groupForm.description || undefined,
        parentGroupId: groupForm.parentGroupId || undefined,
      });
      setGroupForm(defaultGroupForm);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid>
      <Section>
        <SectionHeader>
          <div>
            <Title>{realm ? realm.name : "Realm"}</Title>
            <Muted>{realm?.metadata?.description ?? "Realm directory"}</Muted>
          </div>
          {loading && <Muted>Syncing…</Muted>}
        </SectionHeader>

        <Subtitle>Create user</Subtitle>
        <Form onSubmit={handleCreateUser}>
          <Field>
            Email
            <Input
              type="email"
              name="email"
              required
              value={userForm.email}
              onChange={handleUserFormChange}
              placeholder="user@company.com"
            />
          </Field>
          <Field>
            First name
            <Input
              name="firstName"
              value={userForm.firstName}
              onChange={handleUserFormChange}
            />
          </Field>
          <Field>
            Last name
            <Input
              name="lastName"
              value={userForm.lastName}
              onChange={handleUserFormChange}
            />
          </Field>
          <Button type="submit">Invite user</Button>
        </Form>
      </Section>

      <Section>
        <Subtitle>Users</Subtitle>
        {users.length === 0 ? (
          <Muted>No users yet – invite your first teammate.</Muted>
        ) : (
          <UsersList>
            {users.map((user) => {
              const isSelected = selectedUser === user.id;
              return (
                <UserCard key={user.id}>
                  <UserHeader>
                    <div>
                      <Email>{user.email}</Email>
                      <Muted>
                        {user.profile.firstName} {user.profile.lastName}
                      </Muted>
                    </div>
                    <Select
                      value={user.status}
                      onChange={(event) =>
                        handleUpdateStatus(user, event.target.value as User["status"])
                      }
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </Select>
                  </UserHeader>

                  <div>
                    <Muted style={{ marginBottom: 8 }}>Groups</Muted>
                    <GroupChips>
                      {user.groups.length === 0 && <Chip>None</Chip>}
                      {user.groups.map((groupId) => {
                        const group = groups.find((item) => item.id === groupId);
                        if (!group) {
                          return null;
                        }
                        return <Chip key={group.id} $variant="assigned">{group.name}</Chip>;
                      })}
                    </GroupChips>
                  </div>

                  <details open={isSelected}>
                    <summary onClick={() => setSelectedUser(isSelected ? undefined : user.id)}>
                      Manage memberships
                    </summary>
                    <GroupAssignments>
                      {groups.length === 0 && <Muted>No groups defined yet.</Muted>}
                      {groups.map((group) => {
                        const checked = user.groups.includes(group.id);
                        return (
                          <CheckboxRow key={group.id}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) =>
                                handleGroupToggle(user, group, event.target.checked)
                              }
                            />
                            {group.name}
                          </CheckboxRow>
                        );
                      })}
                    </GroupAssignments>
                  </details>
                </UserCard>
              );
            })}
          </UsersList>
        )}
      </Section>

      <Section>
        <Subtitle>Create group</Subtitle>
        <Form onSubmit={handleCreateGroup}>
          <Field>
            Group name
            <Input
              name="name"
              value={groupForm.name}
              onChange={handleGroupFormChange}
              placeholder="Developers"
              required
            />
          </Field>
          <Field>
            Description
            <Input
              name="description"
              value={groupForm.description}
              onChange={handleGroupFormChange}
            />
          </Field>
          <Field>
            Parent group
            <Select
              name="parentGroupId"
              value={groupForm.parentGroupId}
              onChange={handleGroupFormChange}
            >
              <option value="">No parent</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit">Create group</Button>
        </Form>
      </Section>
    </Grid>
  );
};
