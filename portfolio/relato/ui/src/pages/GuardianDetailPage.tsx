import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../services/api';
import { toast } from '../utils/toast';
import { Card, CardHeader, CardTitle, PrimaryButton, SecondaryButton, Input, Select, FormGroup, Label, FormRow } from '../components/styled/CommonComponents';

const PageContainer = styled.div`
  padding: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    color: #3b82f6;
  }
`;

const TabContent = styled.div`
  padding: 1.5rem 0;
`;

const GuardianInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled(Card)`
  padding: 1.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
`;

const StudentSection = styled.div`
  margin-top: 2rem;
`;

const StudentCard = styled(Card)`
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const StudentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StudentName = styled.h3`
  font-size: 1.25rem;
  color: #111827;
  margin: 0;
`;

const StudentDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin: 2rem auto;
  display: block;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

interface GuardianData {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  studentName: string;
  studentId: string; // MongoDB _id for navigation
  studentDisplayId: string; // Display ID for showing in UI
  class: string;
  section: string;
  address?: {
    site: string;
    landmark: string;
    pincode: string;
    state: string;
  };
}

const GuardianDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'add'>('view');
  const [loading, setLoading] = useState(true);
  const [guardian, setGuardian] = useState<GuardianData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'father',
    phone: '',
    email: '',
    studentId: '',
    address: {
      site: '',
      landmark: '',
      pincode: '',
      state: ''
    }
  });
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchGuardianData();
    }
    fetchStudents();
  }, [id]);

  const fetchGuardianData = async () => {
    try {
      setLoading(true);
      // Get all students to find the guardian data
      const response = await apiService.getStudents();
      if (response.success && response.data) {
        // Find the guardian by ID (format: studentId_relationship)
        const [studentId, relationship] = id.split('_');
        const student = response.data.find((s: any) => s._id === studentId);

        if (student && student.parent_details) {
          let guardianData = null;

          if (relationship === 'father' && student.parent_details.father_name) {
            guardianData = {
              id,
              name: student.parent_details.father_name,
              relationship: 'Father',
              phone: student.parent_details.father_phone,
              email: student.parent_details.father_email || '',
              studentName: `${student.firstname} ${student.lastname}`,
              studentId: student._id, // Use MongoDB _id for navigation
              studentDisplayId: student.student_id || '', // Keep display ID for display
              class: student.class || '',
              section: student.section || '',
              address: student.address
            };
          } else if (relationship === 'mother' && student.parent_details.mother_name) {
            guardianData = {
              id,
              name: student.parent_details.mother_name,
              relationship: 'Mother',
              phone: student.parent_details.mother_phone,
              email: student.parent_details.mother_email || '',
              studentName: `${student.firstname} ${student.lastname}`,
              studentId: student._id, // Use MongoDB _id for navigation
              studentDisplayId: student.student_id || '', // Keep display ID for display
              class: student.class || '',
              section: student.section || '',
              address: student.address
            };
          }

          if (guardianData) {
            setGuardian(guardianData);
            setFormData({
              name: guardianData.name,
              relationship: guardianData.relationship.toLowerCase(),
              phone: guardianData.phone,
              email: guardianData.email,
              studentId: studentId,
              address: guardianData.address || {
                site: '',
                landmark: '',
                pincode: '',
                state: ''
              }
            });
          }
        }
      }
    } catch (error: any) {
      toast.error('Failed to fetch guardian data');
      console.error('Error fetching guardian:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await apiService.getStudents();
      if (response.success && response.data) {
        setStudents(response.data.map((student: any) => ({
          _id: student._id,
          name: `${student.firstname} ${student.lastname}`,
          student_id: student.student_id || '',
          class: student.class || '',
          section: student.section || ''
        })));
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleUpdateGuardian = async () => {
    try {
      // Find the student and update their parent details
      const [studentId] = id!.split('_');
      const studentResponse = await apiService.getStudentById(studentId);

      if (studentResponse.success && studentResponse.data) {
        const updatedParentDetails = { ...studentResponse.data.parent_details };

        if (formData.relationship === 'father') {
          updatedParentDetails.father_name = formData.name;
          updatedParentDetails.father_phone = formData.phone;
          updatedParentDetails.father_email = formData.email;
        } else if (formData.relationship === 'mother') {
          updatedParentDetails.mother_name = formData.name;
          updatedParentDetails.mother_phone = formData.phone;
          updatedParentDetails.mother_email = formData.email;
        }

        const updateData = {
          ...studentResponse.data,
          parent_details: updatedParentDetails,
          address: formData.address
        };

        await apiService.updateStudent(studentId, updateData);
        toast.success('Guardian updated successfully');
        fetchGuardianData();
        setActiveTab('view');
      }
    } catch (error: any) {
      toast.error('Failed to update guardian');
      console.error('Error updating guardian:', error);
    }
  };

  const handleAddGuardian = async () => {
    try {
      if (!formData.studentId || !formData.name || !formData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Get the selected student
      const selectedStudent = students.find(s => s._id === formData.studentId);
      if (!selectedStudent) {
        toast.error('Selected student not found');
        return;
      }

      // Update the student's parent details
      const studentResponse = await apiService.getStudentById(formData.studentId);
      if (studentResponse.success && studentResponse.data) {
        const updatedParentDetails = { ...studentResponse.data.parent_details };

        if (formData.relationship === 'father') {
          updatedParentDetails.father_name = formData.name;
          updatedParentDetails.father_phone = formData.phone;
          updatedParentDetails.father_email = formData.email;
        } else if (formData.relationship === 'mother') {
          updatedParentDetails.mother_name = formData.name;
          updatedParentDetails.mother_phone = formData.phone;
          updatedParentDetails.mother_email = formData.email;
        }

        const updateData = {
          ...studentResponse.data,
          parent_details: updatedParentDetails,
          address: formData.address
        };

        await apiService.updateStudent(formData.studentId, updateData);
        toast.success('Guardian added successfully');
        navigate('/parents');
      }
    } catch (error: any) {
      toast.error('Failed to add guardian');
      console.error('Error adding guardian:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: 'father',
      phone: '',
      email: '',
      studentId: '',
      address: {
        site: '',
        landmark: '',
        pincode: '',
        state: ''
      }
    });
  };

  const handleViewStudent = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'add' ? 'Add New Guardian' : `Guardian Details - ${guardian?.name || 'New Guardian'}`}
          </CardTitle>
        </CardHeader>

        <TabContainer>
          {id && (
            <Tab active={activeTab === 'view'} onClick={() => setActiveTab('view')}>
              View Details
            </Tab>
          )}
          {id && (
            <Tab active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>
              Edit Guardian
            </Tab>
          )}
          <Tab active={activeTab === 'add'} onClick={() => { setActiveTab('add'); resetForm(); }}>
            Add New Guardian
          </Tab>
        </TabContainer>

        <TabContent>
          {activeTab === 'view' && guardian && (
            <>
              <GuardianInfo>
                <InfoCard>
                  <InfoItem>
                    <InfoLabel>Name</InfoLabel>
                    <InfoValue>{guardian.name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Relationship</InfoLabel>
                    <InfoValue>{guardian.relationship}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Phone</InfoLabel>
                    <InfoValue>{guardian.phone}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{guardian.email || 'N/A'}</InfoValue>
                  </InfoItem>
                </InfoCard>

                <InfoCard>
                  <InfoItem>
                    <InfoLabel>Address</InfoLabel>
                    <InfoValue>{guardian.address?.site || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Landmark</InfoLabel>
                    <InfoValue>{guardian.address?.landmark || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Pincode</InfoLabel>
                    <InfoValue>{guardian.address?.pincode || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>State</InfoLabel>
                    <InfoValue>{guardian.address?.state || 'N/A'}</InfoValue>
                  </InfoItem>
                </InfoCard>
              </GuardianInfo>

              <StudentSection>
                <h3>Associated Student</h3>
                <StudentCard onClick={() => handleViewStudent(guardian.studentId)}>
                  <StudentHeader>
                    <StudentName>{guardian.studentName}</StudentName>
                    <span>→</span>
                  </StudentHeader>
                  <StudentDetails>
                    <InfoItem>
                      <InfoLabel>Student ID</InfoLabel>
                      <InfoValue>{guardian.studentDisplayId}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Class</InfoLabel>
                      <InfoValue>{guardian.class && guardian.section ? `${guardian.class} - ${guardian.section}` : 'N/A'}</InfoValue>
                    </InfoItem>
                  </StudentDetails>
                </StudentCard>
              </StudentSection>
            </>
          )}

          {(activeTab === 'edit' || activeTab === 'add') && (
            <>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                    required
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </Select>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </FormGroup>
              </FormRow>

              {activeTab === 'add' && (
                <FormGroup>
                  <Label htmlFor="studentId">Select Student *</Label>
                  <Select
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    required
                  >
                    <option value="">Choose a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.student_id} ({student.class}-{student.section})
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              <h4>Address Information</h4>
              <FormGroup>
                <Label htmlFor="address.site">Address</Label>
                <Input
                  id="address.site"
                  value={formData.address.site}
                  onChange={(e) => handleInputChange('address.site', e.target.value)}
                  placeholder="Enter complete address"
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="address.landmark">Landmark</Label>
                  <Input
                    id="address.landmark"
                    value={formData.address.landmark}
                    onChange={(e) => handleInputChange('address.landmark', e.target.value)}
                    placeholder="Near landmark"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="address.pincode">Pincode</Label>
                  <Input
                    id="address.pincode"
                    value={formData.address.pincode}
                    onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                    placeholder="Pincode"
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="address.state">State</Label>
                <Select
                  id="address.state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Chandigarh">Chandigarh</option>
                </Select>
              </FormGroup>

              <ButtonContainer>
                <SecondaryButton onClick={() => setActiveTab('view')}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton onClick={activeTab === 'edit' ? handleUpdateGuardian : handleAddGuardian}>
                  {activeTab === 'edit' ? 'Update Guardian' : 'Add Guardian'}
                </PrimaryButton>
              </ButtonContainer>
            </>
          )}
        </TabContent>
      </Card>
    </PageContainer>
  );
};

export default GuardianDetailPage;
