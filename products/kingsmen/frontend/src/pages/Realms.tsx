import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useKingsman } from "../context/KingsmanContext";
import type { Realm } from "../types";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.palette.primary};
`;

const RealmsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const RealmCard = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? "#1e293b" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#0f172a")};
  border: none;
  border-radius: 12px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.18);
  }
`;

const Chip = styled.span<{ $kind?: "success" | "warning" }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $kind }) => ($kind === "success" ? "#bbf7d0" : "#fef9c3")};
  color: ${({ $kind }) => ($kind === "success" ? "#166534" : "#854d0e")};
`;

const FormShell = styled.form`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  color: #0f172a;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.accent};
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
  }
`;

const SubmitButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 600;
  background: ${({ theme }) => theme.palette.accent};
  color: #0f172a;
  cursor: pointer;
  transition: background 120ms ease;
  &:hover {
    background: #0ea5e9;
  }
`;

const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
`;

const Muted = styled.p`
  color: #64748b;
`;

const ErrorBanner = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const statusMap: Record<Realm["status"], { label: string; kind: "success" | "warning" }> = {
  active: { label: "Active", kind: "success" },
  suspended: { label: "Suspended", kind: "warning" },
};

type RealmFormState = {
  name: string;
  slug: string;
  contactEmail: string;
  description: string;
};

const defaultFormState: RealmFormState = {
  name: "",
  slug: "",
  contactEmail: "",
  description: "",
};

export const RealmsPage = () => {
  const navigate = useNavigate();
  const {
    state: { realms, selectedRealmId, error, loading, usersByRealm, groupsByRealm },
    createRealm,
    setSelectedRealm,
    loadRealmUsers,
    loadRealmGroups,
  } = useKingsman();

  const [formState, setFormState] = useState<RealmFormState>(defaultFormState);

  const selectedRealm = useMemo(
    () => realms.find((realm) => realm.id === selectedRealmId) ?? realms[0],
    [realms, selectedRealmId]
  );

  useEffect(() => {
    const realmId = selectedRealm?.id;
    if (!realmId) {
      return;
    }

    if (!usersByRealm[realmId]) {
      void loadRealmUsers(realmId);
    }

    if (!groupsByRealm[realmId]) {
      void loadRealmGroups(realmId);
    }
  }, [
    selectedRealm?.id,
    usersByRealm,
    groupsByRealm,
    loadRealmUsers,
    loadRealmGroups,
  ]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    setFormState((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      return;
    }

    try {
      const realm = await createRealm({
        name: formState.name,
        slug: formState.slug || undefined,
        contactEmail: formState.contactEmail || undefined,
        description: formState.description || undefined,
      });
      setFormState(defaultFormState);
      setSelectedRealm(realm.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectRealm = (realmId: string) => {
    setSelectedRealm(realmId);
    void loadRealmUsers(realmId);
    void loadRealmGroups(realmId);
    navigate(`/realms/${realmId}/users`);
  };

  return (
    <div>
      <PageHeader>
        <Title>Realms</Title>
        {loading && <Muted>Loading…</Muted>}
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Layout>
        <RealmsGrid>
          {realms.map((realm) => {
            const status = statusMap[realm.status];
            const userCount = usersByRealm[realm.id]?.length ?? 0;
            const groupCount = groupsByRealm[realm.id]?.length ?? 0;

            return (
              <RealmCard
                key={realm.id}
                type="button"
                onClick={() => handleSelectRealm(realm.id)}
                $active={realm.id === selectedRealm?.id}
              >
                <div>
                  <strong>{realm.name}</strong>
                </div>
                <div>Slug: {realm.slug}</div>
                <div>{realm.metadata?.description ?? "No description"}</div>
                <Chip $kind={status.kind}>{status.label}</Chip>
                <Muted>
                  Users: {userCount} • Groups: {groupCount}
                </Muted>
              </RealmCard>
            );
          })}
          {realms.length === 0 && <Muted>No realms yet. Create one to get started.</Muted>}
        </RealmsGrid>

        <FormShell onSubmit={handleSubmit}>
          <h2>Create Realm</h2>
          <Field>
            Name
            <Input
              name="name"
              value={formState.name}
              onInput={handleChange}
              placeholder="Realm name"
              required
            />
          </Field>
          <Field>
            Slug
            <Input
              name="slug"
              value={formState.slug}
              onInput={handleChange}
              placeholder="kingsman-dev"
            />
          </Field>
          <Field>
            Contact Email
            <Input
              type="email"
              name="contactEmail"
              value={formState.contactEmail}
              onInput={handleChange}
              placeholder="owner@company.com"
            />
          </Field>
          <Field>
            Description
            <Input
              name="description"
              value={formState.description}
              onInput={handleChange}
              placeholder="Short summary"
            />
          </Field>
          <SubmitButton type="submit">Create Realm</SubmitButton>
        </FormShell>
      </Layout>
    </div>
  );
};
