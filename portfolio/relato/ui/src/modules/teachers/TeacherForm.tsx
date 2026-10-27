import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Teacher } from '../../types';
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

const ArrayItemContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const TeacherForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [schools, setSchools] = useState<Array<{ _id: string; school_code: string }>>([]);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    firstname: '',
    lastname: '',
    displayname: '',
    school_id: '',
    profile: {
      blood_group: '',
      photo: [],
      email_id: '',
      age: 0,
      phone_number: [''],
      gender: 'male' as const,
      expertised_fields: [],
      experience: [],
      dob: ''
    },
    address: {
      site: '',
      landmark: '',
      pincode: '',
      city: '',
      country: '',
      state: ''
    },
    documents: [],
    joining_date: ''
  });

  useEffect(() => {
    fetchSchools();
    if (isEditMode && id) {
      fetchTeacherData(id);
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

  const fetchTeacherData = async (teacherId: string) => {
    try {
      setInitialLoading(true);
      const response = await apiService.getTeacherById(teacherId);
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load teacher data');
      navigate('/teachers');
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

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const keys = field.split('.');
      const newData = { ...prev };
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = [];
        }
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      if (!Array.isArray(current[lastKey])) {
        current[lastKey] = [];
      }
      current[lastKey][index] = value;
      return newData;
    });
  };

  const addArrayItem = (field: string) => {
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
      
      const lastKey = keys[keys.length - 1];
      if (!Array.isArray(current[lastKey])) {
        current[lastKey] = [];
      }
      current[lastKey] = [...current[lastKey], ''];
      return newData;
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const keys = field.split('.');
      const newData = { ...prev };
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      current[lastKey] = current[lastKey].filter((_: any, i: number) => i !== index);
      return newData;
    });
  };

  const validateForm = (): boolean => {
    if (!formData.firstname || !formData.lastname || !formData.school_id || !formData.joining_date) {
      toast.error('Please fill in all required basic fields');
      return false;
    }

    if (!formData.profile?.email_id || !formData.profile?.phone_number?.[0] || !formData.profile?.dob) {
      toast.error('Please fill in all required profile fields');
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
        await apiService.updateTeacher(id, formData);
        toast.success('Teacher updated successfully!');
      } else {
        await apiService.createTeacher(formData);
        toast.success('Teacher onboarded successfully!');
      }
      setTimeout(() => {
        navigate('/teachers');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'onboard'} teacher`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/teachers');
  };

  if (initialLoading) {
    return (
      <PageContainer>
        <Card>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <LoadingSpinner style={{ width: '32px', height: '32px', border: '3px solid #3b82f6' }} />
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading teacher data...</p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Update Teacher' : 'Onboard New Teacher'}</CardTitle>
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

            <FormGroup>
              <Label htmlFor="joining_date">Joining Date *</Label>
              <Input
                id="joining_date"
                type="date"
                value={formData.joining_date || ''}
                onChange={(e) => handleInputChange('joining_date', e.target.value)}
                required
              />
            </FormGroup>
          </Section>

          {/* Profile */}
          <Section>
            <SectionTitle>Profile Details</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="email_id">Email Address *</Label>
                <Input
                  id="email_id"
                  type="email"
                  value={formData.profile?.email_id || ''}
                  onChange={(e) => handleInputChange('profile.email_id', e.target.value)}
                  placeholder="teacher@example.com"
                  required
                />
              </FormGroup>

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
            </FormRow>

            <FormGroup>
              <Label>Phone Numbers *</Label>
              {(formData.profile?.phone_number || ['']).map((phone, index) => (
                <ArrayItemContainer key={index}>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => handleArrayChange('profile.phone_number', index, e.target.value)}
                    placeholder="Phone number"
                    required={index === 0}
                  />
                  {formData.profile?.phone_number && formData.profile.phone_number.length > 1 && (
                    <SecondaryButton
                      type="button"
                      onClick={() => removeArrayItem('profile.phone_number', index)}
                    >
                      Remove
                    </SecondaryButton>
                  )}
                </ArrayItemContainer>
              ))}
              <SecondaryButton
                type="button"
                onClick={() => addArrayItem('profile.phone_number')}
              >
                Add Phone Number
              </SecondaryButton>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.profile?.dob || ''}
                  onChange={(e) => handleInputChange('profile.dob', e.target.value)}
                  required
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

          {/* Parent/Guardian Emergency Contact */}
          <Section>
            <SectionTitle>Emergency Contact Details</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="emergency_contact_name">Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={(formData as any).emergency_contact?.name || ''}
                  onChange={(e) => handleInputChange('emergency_contact.name', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                <Input
                  id="emergency_contact_relationship"
                  value={(formData as any).emergency_contact?.relationship || ''}
                  onChange={(e) => handleInputChange('emergency_contact.relationship', e.target.value)}
                  placeholder="e.g., Parent, Spouse, Sibling"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                <Input
                  type="tel"
                  id="emergency_contact_phone"
                  value={(formData as any).emergency_contact?.phone || ''}
                  onChange={(e) => handleInputChange('emergency_contact.phone', e.target.value)}
                  placeholder="Emergency contact phone"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="emergency_contact_email">Contact Email</Label>
                <Input
                  type="email"
                  id="emergency_contact_email"
                  value={(formData as any).emergency_contact?.email || ''}
                  onChange={(e) => handleInputChange('emergency_contact.email', e.target.value)}
                  placeholder="Emergency contact email"
                />
              </FormGroup>
            </FormRow>
          </Section>

          {/* Expertise */}
          <Section>
            <SectionTitle>Expertise & Experience</SectionTitle>
            <FormGroup>
              <Label>Expertise Fields</Label>
              {(formData.profile?.expertised_fields || []).map((field, index) => (
                <ArrayItemContainer key={index}>
                  <Select
                    value={field}
                    onChange={(e) => handleArrayChange('profile.expertised_fields', index, e.target.value)}
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Economics">Economics</option>
                    <option value="Political Science">Political Science</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physical Education">Physical Education</option>
                    <option value="Art & Craft">Art & Craft</option>
                    <option value="Music">Music</option>
                    <option value="Dance">Dance</option>
                  </Select>
                  <SecondaryButton
                    type="button"
                    onClick={() => removeArrayItem('profile.expertised_fields', index)}
                  >
                    Remove
                  </SecondaryButton>
                </ArrayItemContainer>
              ))}
              <SecondaryButton
                type="button"
                onClick={() => addArrayItem('profile.expertised_fields')}
              >
                Add Expertise Field
              </SecondaryButton>
            </FormGroup>

            <FormGroup>
              <Label>Experience</Label>
              {(formData.profile?.experience || []).map((exp, index) => (
                <ArrayItemContainer key={index}>
                  <Select
                    value={exp}
                    onChange={(e) => handleArrayChange('profile.experience', index, e.target.value)}
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10-15 years">10-15 years</option>
                    <option value="15-20 years">15-20 years</option>
                    <option value="20+ years">20+ years</option>
                  </Select>
                  <SecondaryButton
                    type="button"
                    onClick={() => removeArrayItem('profile.experience', index)}
                  >
                    Remove
                  </SecondaryButton>
                </ArrayItemContainer>
              ))}
              <SecondaryButton
                type="button"
                onClick={() => addArrayItem('profile.experience')}
              >
                Add Experience
              </SecondaryButton>
            </FormGroup>
          </Section>

          <ButtonContainer>
            <SecondaryButton type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : (isEditMode ? 'Update Teacher' : 'Onboard Teacher')}
            </PrimaryButton>
          </ButtonContainer>
        </FormContainer>
      </Card>
    </PageContainer>
  );
};

export default TeacherForm;
