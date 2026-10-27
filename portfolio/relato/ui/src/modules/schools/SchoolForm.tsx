import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { School } from '../../types';
import { apiService } from '../../services/api';
import { toast } from '../../utils/toast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  PrimaryButton, 
  SecondaryButton, 
  Input, 
  TextArea, 
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

const SchoolForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState<Partial<School>>({
    school_code: '',
    contact_details: {
      phone: [''],
      email_id: '',
      social_media_links: []
    },
    address: {
      site: '',
      landmark: '',
      pincode: '',
      state: '',
      location: {
        lat: 0,
        long: 0
      }
    },
    facilities: [],
    year_of_establishment: '',
    media: {
      school_logo: '',
      school_images: []
    },
    courses_offered: {
      k10: [],
      k12: []
    },
    school_rating: '0',
    school_type: 'day_schooler'
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchSchoolData(id);
    }
  }, [id, isEditMode]);

  const fetchSchoolData = async (schoolId: string) => {
    try {
      setInitialLoading(true);
      const response = await apiService.getSchoolById(schoolId);
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load school data');
      navigate('/schools');
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
    if (!formData.school_code || !formData.year_of_establishment) {
      toast.error('Please fill in school code and year of establishment');
      return false;
    }

    if (!formData.contact_details?.email_id || !formData.contact_details?.phone?.[0]) {
      toast.error('Please provide email and at least one phone number');
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
        await apiService.updateSchool(id, formData);
        toast.success('School updated successfully!');
      } else {
        await apiService.createSchool(formData);
        toast.success('School created successfully!');
      }
      setTimeout(() => {
        navigate('/schools');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} school`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/schools');
  };

  if (initialLoading) {
    return (
      <PageContainer>
        <Card>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <LoadingSpinner style={{ width: '32px', height: '32px', border: '3px solid #3b82f6' }} />
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading school data...</p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Update School' : 'Create New School'}</CardTitle>
        </CardHeader>

        <FormContainer onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Section>
            <SectionTitle>Basic Information</SectionTitle>
            <FormGroup>
              <Label htmlFor="school_code">School Code *</Label>
              <Input
                id="school_code"
                value={formData.school_code || ''}
                onChange={(e) => handleInputChange('school_code', e.target.value)}
                placeholder="e.g., SCH001"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="year_of_establishment">Year of Establishment *</Label>
              <Input
                id="year_of_establishment"
                type="date"
                value={formData.year_of_establishment || ''}
                onChange={(e) => handleInputChange('year_of_establishment', e.target.value)}
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="school_type">School Type</Label>
                <Select
                  id="school_type"
                  value={formData.school_type || 'day_schooler'}
                  onChange={(e) => handleInputChange('school_type', e.target.value)}
                >
                  <option value="day_schooler">Day School</option>
                  <option value="boarding">Boarding School</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="school_rating">School Rating</Label>
                <Select
                  id="school_rating"
                  value={formData.school_rating || '0'}
                  onChange={(e) => handleInputChange('school_rating', e.target.value)}
                >
                  <option value="0">Not Rated</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </Select>
              </FormGroup>
            </FormRow>
          </Section>

          {/* Contact Details */}
          <Section>
            <SectionTitle>Contact Details</SectionTitle>
            <FormGroup>
              <Label htmlFor="email_id">Email Address *</Label>
              <Input
                id="email_id"
                type="email"
                value={formData.contact_details?.email_id || ''}
                onChange={(e) => handleInputChange('contact_details.email_id', e.target.value)}
                placeholder="school@example.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone Numbers *</Label>
              {(formData.contact_details?.phone || ['']).map((phone, index) => (
                <ArrayItemContainer key={index}>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => handleArrayChange('contact_details.phone', index, e.target.value)}
                    placeholder="Phone number"
                    required={index === 0}
                  />
                  {formData.contact_details?.phone && formData.contact_details.phone.length > 1 && (
                    <SecondaryButton
                      type="button"
                      onClick={() => removeArrayItem('contact_details.phone', index)}
                    >
                      Remove
                    </SecondaryButton>
                  )}
                </ArrayItemContainer>
              ))}
              <SecondaryButton
                type="button"
                onClick={() => addArrayItem('contact_details.phone')}
              >
                Add Phone Number
              </SecondaryButton>
            </FormGroup>
          </Section>

          {/* Address */}
          <Section>
            <SectionTitle>Address</SectionTitle>
            <FormGroup>
              <Label htmlFor="site">Address *</Label>
              <TextArea
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

          {/* Facilities */}
          <Section>
            <SectionTitle>Facilities</SectionTitle>
            <FormGroup>
              <Label>School Facilities</Label>
              {(formData.facilities || []).map((facility, index) => (
                <ArrayItemContainer key={index}>
                  <Input
                    value={facility}
                    onChange={(e) => handleArrayChange('facilities', index, e.target.value)}
                    placeholder="Facility name (e.g., Library, Sports Complex)"
                  />
                  <SecondaryButton
                    type="button"
                    onClick={() => removeArrayItem('facilities', index)}
                  >
                    Remove
                  </SecondaryButton>
                </ArrayItemContainer>
              ))}
              <SecondaryButton
                type="button"
                onClick={() => addArrayItem('facilities')}
              >
                Add Facility
              </SecondaryButton>
            </FormGroup>
          </Section>

          {/* Courses */}
          <Section>
            <SectionTitle>Courses Offered</SectionTitle>
            <FormGroup>
              <Label>K10 Courses</Label>
              {(formData.courses_offered?.k10 || []).map((course, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                  <FormRow>
                    <FormGroup>
                      <Label>Board</Label>
                      <Select
                        value={course.board || ''}
                        onChange={(e) => {
                          const newCourses = [...(formData.courses_offered?.k10 || [])];
                          newCourses[index] = { ...newCourses[index], board: e.target.value };
                          handleInputChange('courses_offered.k10', newCourses);
                        }}
                      >
                        <option value="">Select Board</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB (International Baccalaureate)</option>
                        <option value="IGCSE">IGCSE</option>
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Class Range</Label>
                      <Input
                        value={course.class_from || ''}
                        onChange={(e) => {
                          const newCourses = [...(formData.courses_offered?.k10 || [])];
                          newCourses[index] = { ...newCourses[index], class_from: e.target.value };
                          handleInputChange('courses_offered.k10', newCourses);
                        }}
                        placeholder="e.g., 1 to 10"
                      />
                    </FormGroup>
                  </FormRow>
                  <FormGroup>
                    <Label>Eligibility Criteria</Label>
                    <Input
                      value={course.eligibility_criteria || ''}
                      onChange={(e) => {
                        const newCourses = [...(formData.courses_offered?.k10 || [])];
                        newCourses[index] = { ...newCourses[index], eligibility_criteria: e.target.value };
                        handleInputChange('courses_offered.k10', newCourses);
                      }}
                      placeholder="Eligibility criteria"
                    />
                  </FormGroup>
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      const newCourses = [...(formData.courses_offered?.k10 || [])];
                      newCourses.splice(index, 1);
                      handleInputChange('courses_offered.k10', newCourses);
                    }}
                  >
                    Remove Course
                  </SecondaryButton>
                </div>
              ))}
              <SecondaryButton
                type="button"
                onClick={() => {
                  const newCourses = [...(formData.courses_offered?.k10 || []), { board: '', class_from: '', eligibility_criteria: '' }];
                  handleInputChange('courses_offered.k10', newCourses);
                }}
              >
                Add K10 Course
              </SecondaryButton>
            </FormGroup>
          </Section>

          <ButtonContainer>
            <SecondaryButton type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : (isEditMode ? 'Update School' : 'Create School')}
            </PrimaryButton>
          </ButtonContainer>
        </FormContainer>
      </Card>
    </PageContainer>
  );
};

export default SchoolForm;
