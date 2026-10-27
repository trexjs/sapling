import styled from "styled-components";
import { useKingsman } from "../context/KingsmanContext";

const Heading = styled.h1`
  color: ${({ theme }) => theme.palette.primary};
  font-size: 2rem;
  margin-bottom: 24px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.span`
  color: #64748b;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.primary};
`;

export const DashboardPage = () => {
  const {
    state: { realms, usersByRealm, groupsByRealm },
  } = useKingsman();

  const totalUsers = Object.values(usersByRealm).reduce((acc, users) => acc + users.length, 0);
  const totalGroups = Object.values(groupsByRealm).reduce((acc, groups) => acc + groups.length, 0);

  return (
    <div>
      <Heading>Control Center</Heading>
      <CardGrid>
        <StatCard>
          <StatLabel>Realms</StatLabel>
          <StatValue>{realms.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Users</StatLabel>
          <StatValue>{totalUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Groups</StatLabel>
          <StatValue>{totalGroups}</StatValue>
        </StatCard>
      </CardGrid>
    </div>
  );
};
