// User Types
export interface User {
  user_id: string;
  username: string;
  email: string;
  phone_number?: string;
  user_type: 'student' | 'teacher' | 'admin' | 'parent';
  school_id: string;
  school_name?: string;
  is_verified: boolean;
  is_active?: boolean;
  profile: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  last_login?: string;
}

// School Types
export interface School {
  _id: string;
  school_code: string;
  school_status: boolean;
  contact_details: {
    phone: string[];
    email_id: string;
    social_media_links: any[];
  };
  address: {
    site: string;
    landmark: string;
    pincode: string;
    state: string;
    location: {
      lat: number;
      long: number;
    };
  };
  facilities: string[];
  year_of_establishment: string;
  media: {
    school_logo: string;
    school_images: string[];
  };
  profile_photo: string;
  courses_offered: {
    k10: Array<{
      board: string;
      eligibility_criteria: string;
      class_from: string;
    }>;
    k12: Array<{
      board_name: string;
      type: string;
      course: string;
    }>;
  };
  school_rating: string;
  school_type: 'day_schooler' | 'boarding';
  glance_view: {
    facts: {
      number_of_students: number;
      teacher_strength: number;
    };
    ratios: {
      teacher_to_students: string;
      acceptance: string;
    };
    campus_overview: {
      inhouse: {
        doctor_or_medical_practitioner: boolean;
        career_counsellor: boolean;
        internet_enabled_campus: boolean;
        ac_enabled_classrooms: boolean;
      };
      sports: {
        indoor: boolean;
        outdoor: boolean;
        swimming_pool: boolean;
        amphitheatre: boolean;
      };
      transportation: boolean;
      drinking_water: boolean;
      cctv_surveillance: boolean;
      fire_safety_code: boolean;
      smart_classes: boolean;
      dining_hall_or_food_court_or_cafeteria: boolean;
      book_store: boolean;
      laundry_service: boolean;
      campus_elections: boolean;
    };
    sdp: {
      foreign_languages: {
        Germany: boolean;
        Spanish: boolean;
      };
      yoga: boolean;
      music: boolean;
      swimming: boolean;
      chess: boolean;
      karate_classes: boolean;
      coding_classes: boolean;
      public_speaking: boolean;
      summer_camps: boolean;
    };
    student_scholarship_programs: {
      government: boolean;
      ngos: boolean;
      private_corporation: boolean;
      hni: boolean;
      fundraisals: boolean;
      adoption: boolean;
    };
    events: {
      best_idea_competitions: boolean;
      hackathon: boolean;
      essay: boolean;
      quizzes: boolean;
      sports_day: boolean;
      olympiads: boolean;
    };
    school_value_added_services: {
      loans_from_entities: string;
      emergency_cash: string;
      cibil_score: string;
      scholarship: string;
    };
    scholarship_for_students: boolean;
    popular_alumnis: Array<{
      name: string;
      academic_profile: Array<{
        standard: number;
        section: string;
        roll_number: number;
        academic_year: {
          from_date: string;
          to_date: string;
        };
      }>;
    }>;
    recent_achievements: Array<{
      event_info: {
        name: string;
        date: string;
        participants: any[];
        status: string;
        assets: {
          images: any[];
          videos: any[];
        };
      };
      statement_after_achievement: Array<{
        achiever_name: string;
        role: string;
        statement: string;
      }>;
    }>;
    public_reviews: Array<{
      username: string;
      medium: string;
      rating: number;
      comment: string;
      date: string;
    }>;
    brochure: Array<{
      topic: string;
      published_date: string;
      link: string;
    }>;
    foundation_statement: Array<{
      role: string;
      for_academic_year: string;
      published_date: string;
      link: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

// Document Types
export interface Document {
  type: 'proof' | 'id' | 'certificate' | 'photo' | 'other';
  original_name: string;
  storage_path: string;
  mime_type: string;
  uploaded_at?: string;
}

// Teacher Types
export interface Teacher {
  _id: string;
  firstname: string;
  lastname: string;
  displayname?: string;
  school_id: string;
  teacher_id: string;
  status: boolean;
  joining_date: string;
  profile: {
    blood_group: string;
    photo: string[];
    email_id: string;
    age: number;
    phone_number: string[];
    gender: 'male' | 'female' | 'other';
    expertised_fields: string[];
    experience: string[];
    dob: string;
  };
  address: {
    site: string;
    landmark: string;
    pincode: string;
    city: string;
    country: string;
    state: string;
  };
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

// Parent Types
export interface Parent {
  _id: string;
  firstname: string;
  lastname: string;
  displayname?: string;
  email: string;
  phone_number: string;
  school_id: string;
  user_id?: string;
  children: Array<{
    student_id: string | Student;
    relationship: 'father' | 'mother' | 'guardian' | 'other';
  }>;
  address: {
    site: string;
    landmark: string;
    pincode: string;
    state: string;
  };
  profile: {
    photo: string;
    occupation: string;
    blood_group: string;
  };
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// Student Types
export interface Student {
  _id: string;
  student_id: string;
  firstname: string;
  lastname: string;
  displayname?: string;
  school_id: string;
  class: string;
  section: string;
  roll_number: string;
  class_teacher: string;
  profile: {
    email_id: string;
    phone_number: string[];
    gender: 'male' | 'female' | 'other';
    dob: string;
    age: number;
    blood_group: string;
    photo: string[];
  };
  address: {
    site: string;
    landmark: string;
    pincode: string;
    state: string;
  };
  guardian_details: {
    name: string;
    phone_number: string[];
    relationship: string[];
    address: {
      site: string;
      landmark: string;
      pincode: string;
      state: string;
    };
  };
  parent_details?: {
    father_name: string;
    mother_name: string;
    father_phone: string;
    mother_phone: string;
    father_email: string;
    mother_email: string;
  };
  documents: Document[];
  status: boolean;
  admission_date: string;
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export interface AttendanceRecord {
  _id: string;
  school_id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day';
  details: {
    remarks: string;
    marked_by: string;
    marked_at: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Auth Types
export interface LoginCredentials {
  username_or_email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  user_type: 'student' | 'teacher' | 'admin' | 'parent';
  school_id: string;
  profile: {
    first_name: string;
    last_name: string;
  };
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

// Poll Types
export interface PollOption {
  _id: string;
  text: string;
  order: number;
}

export interface PollVote {
  user_id: string;
  option_id: string;
  voted_at: string;
}

export interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  creator_id: string;
  creator_name: string;
  creator_image: string;
  school_id: string;
  duration_days: number;
  expires_at: string;
  is_active: boolean;
  votes: PollVote[];
  total_votes: number;
  created_at: string;
  updated_at: string;
  user_has_voted?: boolean;
  user_vote?: string;
  vote_stats?: Record<string, { count: number; percentage: number }>;
  is_expired?: boolean;
}

export interface PollAnalytics {
  total_votes: number;
  vote_stats: Record<string, { count: number; percentage: number }>;
  is_expired: boolean;
  time_remaining: number;
  created_at: string;
  expires_at: string;
}

// Feedback Types
export interface Feedback {
  _id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  sender_image: string;
  receiver_id: string;
  receiver_name: string;
  receiver_email: string;
  receiver_image: string;
  school_id: string;
  message: string;
  status: 'draft' | 'pending' | 'received' | 'given';
  is_draft: boolean;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackStats {
  _id: string;
  count: number;
}

// Context Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  schools: School[];
  teachers: Teacher[];
  students: Student[];
  attendance: AttendanceRecord[];
  polls: Poll[];
  feedbacks: Feedback[];
}

export interface AppContextType extends AppState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchSchools: () => Promise<void>;
  fetchTeachers: () => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchAttendance: (schoolId: string, studentId?: string) => Promise<void>;
  createSchool: (schoolData: Partial<School>) => Promise<void>;
  createTeacher: (teacherData: Partial<Teacher>) => Promise<void>;
  createStudent: (studentData: Partial<Student>) => Promise<void>;
  updateSchool: (id: string, schoolData: Partial<School>) => Promise<void>;
  updateTeacher: (id: string, teacherData: Partial<Teacher>) => Promise<void>;
  updateStudent: (id: string, studentData: Partial<Student>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}
