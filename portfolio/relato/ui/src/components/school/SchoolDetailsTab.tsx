import React from 'react';
import styled from 'styled-components';
import { School } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../styled/CommonComponents';

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SchoolHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`;

const SchoolLogo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 0.5rem;
  object-fit: cover;
  border: 2px solid #e2e8f0;
`;

const SchoolInfo = styled.div`
  flex: 1;
`;

const SchoolName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const SchoolCode = styled.p`
  color: #64748b;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
`;

const StatusBadge = styled(Badge)<{ status: boolean }>`
  ${props => props.status ? `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  ` : `
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  `}
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  color: #111827;
  font-size: 1rem;
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FacilityBadge = styled(Badge)`
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
`;

interface SchoolDetailsTabProps {
  school: School;
}

const SchoolDetailsTab: React.FC<SchoolDetailsTabProps> = ({ school }) => {
  return (
    <DetailsContainer>
      {/* School Header */}
      <SchoolHeader>
        <SchoolLogo 
          src={school.profile_photo || school.media?.school_logo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iOCIgZmlsbD0iI0YzRjRGNiIvPgo8cGF0aCBkPSJNMzAgNDBINzBWODBIMzBWNDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik00MCA1MEg2MFY2MEg0MFY1MFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+'} 
          alt={school.school_code}
        />
        <SchoolInfo>
          <SchoolName>{school.school_code}</SchoolName>
          <SchoolCode>School ID: {school._id.slice(-8)}</SchoolCode>
          <StatusBadge status={school.school_status}>
            {school.school_status ? 'Active' : 'Inactive'}
          </StatusBadge>
        </SchoolInfo>
      </SchoolHeader>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>School Code</InfoLabel>
              <InfoValue>{school.school_code}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>School Type</InfoLabel>
              <InfoValue>{school.school_type || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Year of Establishment</InfoLabel>
              <InfoValue>
                {school.year_of_establishment 
                  ? new Date(school.year_of_establishment).getFullYear()
                  : 'N/A'
                }
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>School Rating</InfoLabel>
              <InfoValue>{school.school_rating || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{school.contact_details?.email_id || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Phone Numbers</InfoLabel>
              <InfoValue>
                {school.contact_details?.phone && school.contact_details.phone.length > 0
                  ? school.contact_details.phone.join(', ')
                  : 'N/A'
                }
              </InfoValue>
            </InfoItem>
          </InfoGrid>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Address</InfoLabel>
              <InfoValue>{school.address?.site || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Landmark</InfoLabel>
              <InfoValue>{school.address?.landmark || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>State</InfoLabel>
              <InfoValue>{school.address?.state || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Pincode</InfoLabel>
              <InfoValue>{school.address?.pincode || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Location (Lat, Long)</InfoLabel>
              <InfoValue>
                {school.address?.location 
                  ? `${school.address.location.lat}, ${school.address.location.long}`
                  : 'N/A'
                }
              </InfoValue>
            </InfoItem>
          </InfoGrid>
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities & Features</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoItem style={{ marginBottom: '1rem' }}>
            <InfoLabel>Available Facilities</InfoLabel>
            <BadgeList>
              {school.facilities && school.facilities.length > 0 ? (
                school.facilities.map((facility, index) => (
                  <FacilityBadge key={index}>{facility}</FacilityBadge>
                ))
              ) : (
                <span style={{ color: '#6b7280' }}>No facilities listed</span>
              )}
            </BadgeList>
          </InfoItem>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>Number of Students</InfoLabel>
              <InfoValue>{school.glance_view?.facts?.number_of_students || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Teacher Strength</InfoLabel>
              <InfoValue>{school.glance_view?.facts?.teacher_strength || 'N/A'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Transportation</InfoLabel>
              <InfoValue>
                <StatusBadge status={school.glance_view?.campus_overview?.transportation || false}>
                  {school.glance_view?.campus_overview?.transportation ? 'Available' : 'Not Available'}
                </StatusBadge>
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>CCTV Surveillance</InfoLabel>
              <InfoValue>
                <StatusBadge status={school.glance_view?.campus_overview?.cctv_surveillance || false}>
                  {school.glance_view?.campus_overview?.cctv_surveillance ? 'Available' : 'Not Available'}
                </StatusBadge>
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Smart Classes</InfoLabel>
              <InfoValue>
                <StatusBadge status={school.glance_view?.campus_overview?.smart_classes || false}>
                  {school.glance_view?.campus_overview?.smart_classes ? 'Available' : 'Not Available'}
                </StatusBadge>
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Internet Enabled Campus</InfoLabel>
              <InfoValue>
                <StatusBadge status={school.glance_view?.campus_overview?.inhouse?.internet_enabled_campus || false}>
                  {school.glance_view?.campus_overview?.inhouse?.internet_enabled_campus ? 'Available' : 'Not Available'}
                </StatusBadge>
              </InfoValue>
            </InfoItem>
          </InfoGrid>
        </CardContent>
      </Card>
    </DetailsContainer>
  );
};

export default SchoolDetailsTab;
