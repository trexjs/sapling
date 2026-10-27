import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Student } from '../../types';
import { apiService } from '../../services/api';
import { toast } from '../../utils/toast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  PrimaryButton, 
  SecondaryButton, 
  Input, 
  Select, 
  FormGroup, 
  Label, 
  FormRow 
} from '../../components/styled/CommonComponents';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [schools, setSchools] = useState<Array<{ _id: string; school_code: string }>>([]);

  const [formData, setFormData] = useState<Partial<Student>>({
    student_id: '',
    firstname: '',
    lastname: '',
    displayname: '',
    school_id: '',
    class: '',
    section: '',
    roll_number: '',
    profile: {
      email_id: '',
      phone_number: [''],
      gender: 'male' as const,
      dob: '',
      age: 0,
      blood_group: '',
      photo: []
    },
    address: {
      site: '',
      landmark: '',
      pincode: '',
      state: ''
    },
    parent_details: {
      father_name: '',
      mother_name: '',
      father_phone: '',
      mother_phone: '',
      father_email: '',
      mother_email: ''
    },
    documents: [],
    status: true,
    admission_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSchools();
    if (isEditMode && id) {
      fetchStudentData(id);
    }
  }, [id, isEditMode]);

  const fetchSchools = async () => {
    try {
      const response = await apiService.getSchools();
      if (response.success && response.data) {
        setSchools(response.data.map((school: any) => ({
          _id: school._id,
          school_code: school.school_code
        })));
      }
    } catch (error) {
      toast.error('Failed to load schools');
    }
  };

  const fetchStudentData = async (studentId: string) => {
    try {
      setInitialLoading(true);
      const response = await apiService.getStudentById(studentId);
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load student data');
      navigate('/students');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      const newData = { ...prev };
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const validateForm = (): boolean => {
    if (!formData.firstname || !formData.lastname || !formData.school_id || !formData.student_id) {
      toast.error('Please fill in all required basic fields');
      return false;
    }

    if (!formData.profile?.email_id) {
      toast.error('Please provide student email');
      return false;
    }

    if (!formData.parent_details?.father_name || !formData.parent_details?.father_phone) {
      toast.error('Please provide parent/guardian details');
      return false;
    }

    if (!formData.address?.site || !formData.address?.state || !formData.address?.pincode) {
      toast.error('Please fill in all address fields');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && id) {
        await apiService.updateStudent(id, formData);
        toast.success('Student updated successfully!');
      } else {
        await apiService.createStudent(formData);
        toast.success('Student registered successfully!');
      }
      setTimeout(() => {
        navigate('/students');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'register'} student`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  if (initialLoading) {
    return (
      <PageContainer>
        <Card>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <LoadingSpinner style={{ width: '32px', height: '32px', border: '3px solid #3b82f6' }} />
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading student data...</p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Update Student' : 'Register New Student'}</CardTitle>
        </CardHeader>

        <FormContainer onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Section>
            <SectionTitle>Basic Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstname">First Name *</Label>
                <Input
                  id="firstname"
                  value={formData.firstname || ''}
                  onChange={(e) => handleInputChange('firstname', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="lastname">Last Name *</Label>
                <Input
                  id="lastname"
                  value={formData.lastname || ''}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="displayname">Display Name</Label>
              <Input
                id="displayname"
                value={formData.displayname || ''}
                onChange={(e) => handleInputChange('displayname', e.target.value)}
                placeholder="Enter display name (optional)"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="school_id">School *</Label>
              <Select
                id="school_id"
                value={formData.school_id || ''}
                onChange={(e) => handleInputChange('school_id', e.target.value)}
                required
              >
                <option value="">Select a school</option>
                {schools.map(school => (
                  <option key={school._id} value={school._id}>
                    {school.school_code}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="student_id">Student ID *</Label>
                <Input
                  id="student_id"
                  value={formData.student_id || ''}
                  onChange={(e) => handleInputChange('student_id', e.target.value)}
                  placeholder="e.g., STU001"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="roll_number">Roll Number</Label>
                <Input
                  id="roll_number"
                  value={formData.roll_number || ''}
                  onChange={(e) => handleInputChange('roll_number', e.target.value)}
                  placeholder="Roll number"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="class">Class</Label>
                <Select
                  id="class"
                  value={formData.class || ''}
                  onChange={(e) => handleInputChange('class', e.target.value)}
                >
                  <option value="">Select Class</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="section">Section</Label>
                <Select
                  id="section"
                  value={formData.section || ''}
                  onChange={(e) => handleInputChange('section', e.target.value)}
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="admission_date">Admission Date</Label>
              <Input
                id="admission_date"
                type="date"
                value={formData.admission_date || ''}
                onChange={(e) => handleInputChange('admission_date', e.target.value)}
              />
            </FormGroup>
          </Section>

          {/* Profile */}
          <Section>
            <SectionTitle>Profile Details</SectionTitle>
            <FormGroup>
              <Label htmlFor="email_id">Email Address *</Label>
              <Input
                id="email_id"
                type="email"
                value={formData.profile?.email_id || ''}
                onChange={(e) => handleInputChange('profile.email_id', e.target.value)}
                placeholder="student@example.com"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  id="gender"
                  value={formData.profile?.gender || 'male'}
                  onChange={(e) => handleInputChange('profile.gender', e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.profile?.dob || ''}
                  onChange={(e) => handleInputChange('profile.dob', e.target.value)}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.profile?.age || ''}
                  onChange={(e) => handleInputChange('profile.age', parseInt(e.target.value) || 0)}
                  placeholder="Age"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select
                  id="blood_group"
                  value={formData.profile?.blood_group || ''}
                  onChange={(e) => handleInputChange('profile.blood_group', e.target.value)}
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Select>
              </FormGroup>
            </FormRow>
          </Section>

          {/* Parent/Guardian Details */}
          <Section>
            <SectionTitle>Parent/Guardian Details</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="father_name">Father's Name *</Label>
                <Input
                  id="father_name"
                  value={formData.parent_details?.father_name || ''}
                  onChange={(e) => handleInputChange('parent_details.father_name', e.target.value)}
                  placeholder="Father's name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="mother_name">Mother's Name</Label>
                <Input
                  id="mother_name"
                  value={formData.parent_details?.mother_name || ''}
                  onChange={(e) => handleInputChange('parent_details.mother_name', e.target.value)}
                  placeholder="Mother's name"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="father_phone">Father's Phone *</Label>
                <Input
                  type="tel"
                  id="father_phone"
                  value={formData.parent_details?.father_phone || ''}
                  onChange={(e) => handleInputChange('parent_details.father_phone', e.target.value)}
                  placeholder="Father's phone number"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="mother_phone">Mother's Phone</Label>
                <Input
                  type="tel"
                  id="mother_phone"
                  value={formData.parent_details?.mother_phone || ''}
                  onChange={(e) => handleInputChange('parent_details.mother_phone', e.target.value)}
                  placeholder="Mother's phone number"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="father_email">Father's Email</Label>
                <Input
                  id="father_email"
                  type="email"
                  value={formData.parent_details?.father_email || ''}
                  onChange={(e) => handleInputChange('parent_details.father_email', e.target.value)}
                  placeholder="Father's email"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="mother_email">Mother's Email</Label>
                <Input
                  id="mother_email"
                  type="email"
                  value={formData.parent_details?.mother_email || ''}
                  onChange={(e) => handleInputChange('parent_details.mother_email', e.target.value)}
                  placeholder="Mother's email"
                />
              </FormGroup>
            </FormRow>
          </Section>

          {/* Address */}
          <Section>
            <SectionTitle>Address</SectionTitle>
            <FormGroup>
              <Label htmlFor="site">Address *</Label>
              <Input
                id="site"
                value={formData.address?.site || ''}
                onChange={(e) => handleInputChange('address.site', e.target.value)}
                placeholder="Enter complete address"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                value={formData.address?.landmark || ''}
                onChange={(e) => handleInputChange('address.landmark', e.target.value)}
                placeholder="Near landmark"
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="state">State *</Label>
                <Select
                  id="state"
                  value={formData.address?.state || ''}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  required
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

              <FormGroup>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.address?.pincode || ''}
                  onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                  placeholder="Pincode"
                  required
                />
              </FormGroup>
            </FormRow>
          </Section>

          <ButtonContainer>
            <SecondaryButton type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : (isEditMode ? 'Update Student' : 'Register Student')}
            </PrimaryButton>
          </ButtonContainer>
        </FormContainer>
      </Card>
    </PageContainer>
  );
};

export default StudentForm;
