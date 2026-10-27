import axios, { AxiosInstance } from "axios";
import {
  ApiResponse,
  School,
  Teacher,
  Student,
  Parent,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  Poll,
  PollAnalytics,
  Feedback,
  FeedbackStats,
} from "../types";

class ApiService {
  public api: AxiosInstance;
  private baseURL = "http://localhost:8080/api";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Don't redirect to login for attendance API errors - they might just mean no data exists
        const isAttendanceEndpoint =
          originalRequest.url?.includes("/attendance/");

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAttendanceEndpoint
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { access_token } = response.data;

              localStorage.setItem("accessToken", access_token);
              originalRequest.headers.Authorization = `Bearer ${access_token}`;

              return this.api(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        }

        // For attendance endpoints, just return the error without redirecting
        if (isAttendanceEndpoint && error.response?.status === 401) {
          console.log(
            "Attendance endpoint returned 401 - may need RBAC configuration on backend"
          );
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: any; tokens: AuthTokens }>> {
    const response = await this.api.post("/auth/login", credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<ApiResponse<any>> {
    const response = await this.api.post("/auth/register", data);
    return response.data;
  }

  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ access_token: string }>> {
    const response = await this.api.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  async getProfile(): Promise<ApiResponse<any>> {
    const response = await this.api.get("/auth/profile");
    return response.data;
  }

  // School APIs
  async getSchools(params?: {
    status?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<School[]>> {
    const response = await this.api.get("/schools", { params });
    return response.data;
  }

  async getSchoolById(id: string): Promise<ApiResponse<School>> {
    const response = await this.api.get(`/schools/${id}`);
    return response.data;
  }

  async getSchoolByCode(code: string): Promise<ApiResponse<School>> {
    const response = await this.api.get(`/schools/code/${code}`);
    return response.data;
  }

  async createSchool(
    schoolData: Partial<School>
  ): Promise<ApiResponse<School>> {
    const response = await this.api.post("/schools", {
      ...schoolData,
      super_admin_password: "1997",
    });
    return response.data;
  }

  async updateSchool(
    id: string,
    schoolData: Partial<School>
  ): Promise<ApiResponse<School>> {
    const response = await this.api.put(`/schools/${id}`, {
      ...schoolData,
      super_admin_password: "1997",
    });
    return response.data;
  }

  async deleteSchool(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/schools/${id}`, {
      data: { super_admin_password: "1997" },
    });
    return response.data;
  }

  async searchSchools(
    query: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<School[]>> {
    const response = await this.api.get("/schools/search", {
      params: { query, ...params },
    });
    return response.data;
  }

  async getSchoolStats(): Promise<ApiResponse<any>> {
    const response = await this.api.get("/schools/stats");
    return response.data;
  }

  // Teacher APIs
  async getTeachers(params?: {
    school_id?: string;
    status?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Teacher[]>> {
    const response = await this.api.get("/teacher", { params });
    return response.data;
  }

  async getTeacherById(id: string): Promise<ApiResponse<Teacher>> {
    const response = await this.api.get(`/teacher/${id}`);
    return response.data;
  }

  async createTeacher(
    teacherData: Partial<Teacher>
  ): Promise<ApiResponse<Teacher>> {
    // Transform documents array if needed
    const requestData = {
      ...teacherData,
      super_admin_password: "1997",
      documents: teacherData.documents || [],
    };
    const response = await this.api.post("/teacher/onboard", requestData);
    return response.data;
  }

  async updateTeacher(
    id: string,
    teacherData: Partial<Teacher>
  ): Promise<ApiResponse<Teacher>> {
    const response = await this.api.put(`/teacher/${id}`, {
      ...teacherData,
      documents: teacherData.documents || [],
      super_admin_password: "1997",
    });
    return response.data;
  }

  async deleteTeacher(teacherId: string): Promise<ApiResponse<any>> {
    const response = await this.api.patch(`/teacher/disable/${teacherId}`, {
      super_admin_password: "1997",
    });
    return response.data;
  }

  async searchTeachers(
    query: string,
    params?: { school_id?: string; page?: number; limit?: number }
  ): Promise<ApiResponse<Teacher[]>> {
    const response = await this.api.get("/teacher/search", {
      params: { query, ...params },
    });
    return response.data;
  }

  async getTeacherStats(): Promise<ApiResponse<any>> {
    const response = await this.api.get("/teacher/stats");
    return response.data;
  }

  // Student APIs (assuming similar structure to teachers)
  async getStudents(params?: {
    school_id?: string;
    status?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Student[]>> {
    const response = await this.api.get("/students", { params });

    // Transform backend data structure to match frontend Student type
    if (response.data.success && response.data.data) {
      const transformedData = response.data.data.map((backendStudent: any) => {
        return {
          _id: backendStudent._id,
          student_id:
            backendStudent.education?.csIdentifier || backendStudent._id,
          firstname: backendStudent.firstname || "",
          lastname: backendStudent.lastname || "",
          displayname: backendStudent.displayname || "",
          school_id: backendStudent.meta?.school_id || "",
          class: backendStudent.education?.csIdentifier?.charAt(0) || "",
          section: backendStudent.education?.csIdentifier?.charAt(1) || "",
          roll_number: backendStudent.education?.roll_number || "",
          profile: {
            email_id: backendStudent.profile?.email_id || "",
            phone_number: backendStudent.guardian_details?.phone_number
              ? [backendStudent.guardian_details.phone_number]
              : [],
            gender: backendStudent.profile?.gender || "",
            dob: "",
            age: parseInt(backendStudent.profile?.age) || 0,
            blood_group: backendStudent.profile?.blood_group || "",
            photo: backendStudent.profile?.photo
              ? [backendStudent.profile.photo]
              : [],
          },
          address: {
            site: backendStudent.guardian_details?.address?.site || "",
            landmark: backendStudent.guardian_details?.address?.landmark || "",
            pincode: backendStudent.guardian_details?.address?.pincode || "",
            state: backendStudent.guardian_details?.address?.state || "",
          },
          parent_details: {
            father_name: backendStudent.guardian_details?.name || "",
            mother_name: "",
            father_phone: backendStudent.guardian_details?.phone_number || "",
            mother_phone: "",
            father_email: "",
            mother_email: "",
          },
          documents: backendStudent.documents || [],
          status: true,
          admission_date: backendStudent.createdAt || new Date().toISOString(),
          createdAt: backendStudent.createdAt || new Date().toISOString(),
          updatedAt: backendStudent.updatedAt || new Date().toISOString(),
        } as Student;
      });

      return {
        ...response.data,
        data: transformedData,
      };
    }

    return response.data;
  }

  async getStudentById(id: string): Promise<ApiResponse<Student>> {
    const response = await this.api.get(`/students/${id}`);

    // Transform backend data structure to match frontend Student type
    if (response.data.success && response.data.data) {
      const backendStudent = response.data.data;
      const transformedStudent = {
        _id: backendStudent._id,
        student_id:
          backendStudent.education?.csIdentifier || backendStudent._id,
        firstname: backendStudent.firstname || "",
        lastname: backendStudent.lastname || "",
        displayname: backendStudent.displayname || "",
        school_id: backendStudent.meta?.school_id || "",
        class: backendStudent.education?.csIdentifier?.charAt(0) || "",
        section: backendStudent.education?.csIdentifier?.charAt(1) || "",
        roll_number: backendStudent.education?.roll_number || "",
        profile: {
          email_id: backendStudent.profile?.email_id || "",
          phone_number: backendStudent.guardian_details?.phone_number
            ? [backendStudent.guardian_details.phone_number]
            : [],
          gender: backendStudent.profile?.gender || "",
          dob: "",
          age: parseInt(backendStudent.profile?.age) || 0,
          blood_group: backendStudent.profile?.blood_group || "",
          photo: backendStudent.profile?.photo
            ? [backendStudent.profile.photo]
            : [],
        },
        address: {
          site: backendStudent.guardian_details?.address?.site || "",
          landmark: backendStudent.guardian_details?.address?.landmark || "",
          pincode: backendStudent.guardian_details?.address?.pincode || "",
          state: backendStudent.guardian_details?.address?.state || "",
        },
        parent_details: {
          father_name: backendStudent.guardian_details?.name || "",
          mother_name: "",
          father_phone: backendStudent.guardian_details?.phone_number || "",
          mother_phone: "",
          father_email: "",
          mother_email: "",
        },
        documents: backendStudent.documents || [],
        status: true,
        admission_date: backendStudent.createdAt || new Date().toISOString(),
        createdAt: backendStudent.createdAt || new Date().toISOString(),
        updatedAt: backendStudent.updatedAt || new Date().toISOString(),
      } as Student;

      return {
        ...response.data,
        data: transformedStudent,
      };
    }

    return response.data;
  }

  async createStudent(
    studentData: Partial<Student>
  ): Promise<ApiResponse<Student>> {
    // Transform frontend Student format to backend format
    const backendData: any = {
      firstname: studentData.firstname || "",
      lastname: studentData.lastname || "",
      displayname: studentData.displayname || "",
      meta: {
        school_id: studentData.school_id || "",
        org_id: "",
        teacher_id: "",
        name: `${studentData.firstname || ""} ${
          studentData.lastname || ""
        }`.trim(),
      },
      profile: {
        name: `${studentData.firstname || ""} ${
          studentData.lastname || ""
        }`.trim(),
        blood_group: studentData.profile?.blood_group || "",
        photo: studentData.profile?.photo?.[0] || "",
        email_id: studentData.profile?.email_id || "",
        age: studentData.profile?.age?.toString() || "",
        gender: studentData.profile?.gender || "",
      },
      guardian_details: {
        name: studentData.parent_details?.father_name || "",
        phone_number:
          studentData.parent_details?.father_phone ||
          studentData.profile?.phone_number?.[0] ||
          "",
        relationship: "father",
        address: {
          site: studentData.address?.site || "",
          landmark: studentData.address?.landmark || "",
          pincode: studentData.address?.pincode || "",
          state: studentData.address?.state || "",
        },
      },
      education: {
        csIdentifier:
          `${studentData.class || ""}${studentData.section || ""}`.trim() ||
          studentData.student_id ||
          "",
        roll_number: studentData.roll_number || "",
      },
      documents: studentData.documents || [],
    };

    const response = await this.api.post("/students", backendData);

    // Transform the response back to frontend format
    if (response.data.success && response.data.data) {
      const backendStudent = response.data.data;
      const transformedStudent = {
        _id: backendStudent._id,
        student_id:
          backendStudent.education?.csIdentifier || backendStudent._id,
        firstname: backendStudent.firstname || "",
        lastname: backendStudent.lastname || "",
        displayname: backendStudent.displayname || "",
        school_id: backendStudent.meta?.school_id || "",
        class: backendStudent.education?.csIdentifier?.charAt(0) || "",
        section: backendStudent.education?.csIdentifier?.charAt(1) || "",
        roll_number: backendStudent.education?.roll_number || "",
        profile: {
          email_id: backendStudent.profile?.email_id || "",
          phone_number: backendStudent.guardian_details?.phone_number
            ? [backendStudent.guardian_details.phone_number]
            : [],
          gender: backendStudent.profile?.gender || "",
          dob: "",
          age: parseInt(backendStudent.profile?.age) || 0,
          blood_group: backendStudent.profile?.blood_group || "",
          photo: backendStudent.profile?.photo
            ? [backendStudent.profile.photo]
            : [],
        },
        address: {
          site: backendStudent.guardian_details?.address?.site || "",
          landmark: backendStudent.guardian_details?.address?.landmark || "",
          pincode: backendStudent.guardian_details?.address?.pincode || "",
          state: backendStudent.guardian_details?.address?.state || "",
        },
        parent_details: {
          father_name: backendStudent.guardian_details?.name || "",
          mother_name: "",
          father_phone: backendStudent.guardian_details?.phone_number || "",
          mother_phone: "",
          father_email: "",
          mother_email: "",
        },
        documents: backendStudent.documents || [],
        status: true,
        admission_date: backendStudent.createdAt || new Date().toISOString(),
        createdAt: backendStudent.createdAt || new Date().toISOString(),
        updatedAt: backendStudent.updatedAt || new Date().toISOString(),
      } as Student;

      return {
        ...response.data,
        data: transformedStudent,
      };
    }

    return response.data;
  }

  async updateStudent(
    id: string,
    studentData: Partial<Student>
  ): Promise<ApiResponse<Student>> {
    // Transform frontend Student format to backend format
    const backendData: any = {
      firstname: studentData.firstname || "",
      lastname: studentData.lastname || "",
      displayname: studentData.displayname || "",
      meta: {
        school_id: studentData.school_id || "",
        org_id: "",
        teacher_id: "",
        name: `${studentData.firstname || ""} ${
          studentData.lastname || ""
        }`.trim(),
      },
      profile: {
        name: `${studentData.firstname || ""} ${
          studentData.lastname || ""
        }`.trim(),
        blood_group: studentData.profile?.blood_group || "",
        photo: studentData.profile?.photo?.[0] || "",
        email_id: studentData.profile?.email_id || "",
        age: studentData.profile?.age?.toString() || "",
        gender: studentData.profile?.gender || "",
      },
      guardian_details: {
        name: studentData.parent_details?.father_name || "",
        phone_number:
          studentData.parent_details?.father_phone ||
          studentData.profile?.phone_number?.[0] ||
          "",
        relationship: "father",
        address: {
          site: studentData.address?.site || "",
          landmark: studentData.address?.landmark || "",
          pincode: studentData.address?.pincode || "",
          state: studentData.address?.state || "",
        },
      },
      education: {
        csIdentifier:
          `${studentData.class || ""}${studentData.section || ""}`.trim() ||
          studentData.student_id ||
          "",
        roll_number: studentData.roll_number || "",
      },
      documents: studentData.documents || [],
    };

    const response = await this.api.put(`/students/${id}`, backendData);

    // Transform the response back to frontend format
    if (response.data.success && response.data.data) {
      const backendStudent = response.data.data;
      const transformedStudent = {
        _id: backendStudent._id,
        student_id:
          backendStudent.education?.csIdentifier || backendStudent._id,
        firstname: backendStudent.firstname || "",
        lastname: backendStudent.lastname || "",
        displayname: backendStudent.displayname || "",
        school_id: backendStudent.meta?.school_id || "",
        class: backendStudent.education?.csIdentifier?.charAt(0) || "",
        section: backendStudent.education?.csIdentifier?.charAt(1) || "",
        roll_number: backendStudent.education?.roll_number || "",
        profile: {
          email_id: backendStudent.profile?.email_id || "",
          phone_number: backendStudent.guardian_details?.phone_number
            ? [backendStudent.guardian_details.phone_number]
            : [],
          gender: backendStudent.profile?.gender || "",
          dob: "",
          age: parseInt(backendStudent.profile?.age) || 0,
          blood_group: backendStudent.profile?.blood_group || "",
          photo: backendStudent.profile?.photo
            ? [backendStudent.profile.photo]
            : [],
        },
        address: {
          site: backendStudent.guardian_details?.address?.site || "",
          landmark: backendStudent.guardian_details?.address?.landmark || "",
          pincode: backendStudent.guardian_details?.address?.pincode || "",
          state: backendStudent.guardian_details?.address?.state || "",
        },
        parent_details: {
          father_name: backendStudent.guardian_details?.name || "",
          mother_name: "",
          father_phone: backendStudent.guardian_details?.phone_number || "",
          mother_phone: "",
          father_email: "",
          mother_email: "",
        },
        documents: backendStudent.documents || [],
        status: true,
        admission_date: backendStudent.createdAt || new Date().toISOString(),
        createdAt: backendStudent.createdAt || new Date().toISOString(),
        updatedAt: backendStudent.updatedAt || new Date().toISOString(),
      } as Student;

      return {
        ...response.data,
        data: transformedStudent,
      };
    }

    return response.data;
  }

  async deleteStudent(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/students/${id}`);
    return response.data;
  }

  // Attendance APIs
  async getAttendanceConfig(schoolId: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/attendance/config`, {
      params: { school_id: schoolId },
    });
    return response.data;
  }

  async updateAttendanceConfig(
    schoolId: string,
    config: any
  ): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/attendance/config`, config, {
      params: { school_id: schoolId },
    });
    return response.data;
  }

  async getStudentAttendance(params: {
    student_id: string;
    school_id: string;
    start_date?: string;
    end_date?: string;
    type?: string;
    year?: number;
    month?: string;
  }): Promise<ApiResponse<any>> {
    const response = await this.api.get("/attendance/student", {
      params,
    });
    return response.data;
  }

  async markAttendance(data: {
    school_id: string;
    teacher_id: string;
    date: string;
    students: Array<{
      id: string;
      status: string;
      remarks?: string;
    }>;
  }): Promise<ApiResponse<any>> {
    const response = await this.api.post("/attendance/mark", data);
    return response.data;
  }

  async getAttendanceSummary(
    schoolId: string,
    studentId: string,
    params?: { year?: number; month?: string }
  ): Promise<ApiResponse<any>> {
    const response = await this.api.get(
      `/attendance/summary/${schoolId}/${studentId}`,
      { params }
    );
    return response.data;
  }

  async getClassAttendance(
    schoolId: string,
    teacherId: string,
    params?: { date?: string; class_name?: string; section?: string }
  ): Promise<ApiResponse<any>> {
    const response = await this.api.get(
      `/attendance/class/${schoolId}/${teacherId}`,
      { params }
    );
    return response.data;
  }

  async updateAttendanceRecord(
    schoolId: string,
    studentId: string,
    date: string,
    data: {
      status: string;
      remarks?: string;
      teacher_id: string;
    }
  ): Promise<ApiResponse<any>> {
    const response = await this.api.put(
      `/attendance/record/${schoolId}/${studentId}/${date}`,
      data
    );
    return response.data;
  }

  async deleteAttendanceRecord(
    schoolId: string,
    studentId: string,
    date: string
  ): Promise<ApiResponse<any>> {
    const response = await this.api.delete(
      `/attendance/record/${schoolId}/${studentId}/${date}`
    );
    return response.data;
  }

  // Poll APIs
  async createPoll(pollData: {
    question: string;
    options: Array<{ text: string; order: number }>;
    duration_days?: number;
  }): Promise<ApiResponse<Poll>> {
    const response = await this.api.post("/polls", pollData);
    return response.data;
  }

  async getPolls(params?: {
    page?: number;
    limit?: number;
    status?: "active" | "expired";
  }): Promise<ApiResponse<Poll[]>> {
    const response = await this.api.get("/polls", { params });
    return response.data;
  }

  async getPollById(id: string): Promise<ApiResponse<Poll>> {
    const response = await this.api.get(`/polls/${id}`);
    return response.data;
  }

  async votePoll(id: string, optionId: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/polls/${id}/vote`, {
      option_id: optionId,
    });
    return response.data;
  }

  async updatePoll(
    id: string,
    pollData: {
      question?: string;
      options?: Array<{ text: string; order: number }>;
      duration_days?: number;
    }
  ): Promise<ApiResponse<Poll>> {
    const response = await this.api.put(`/polls/${id}`, pollData);
    return response.data;
  }

  async deletePoll(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/polls/${id}`);
    return response.data;
  }

  async getPollAnalytics(id: string): Promise<ApiResponse<PollAnalytics>> {
    const response = await this.api.get(`/polls/${id}/analytics`);
    return response.data;
  }

  // Feedback APIs
  async createFeedback(feedbackData: {
    receiver_id: string;
    message: string;
    status?: "draft" | "pending" | "received" | "given";
  }): Promise<ApiResponse<Feedback>> {
    const response = await this.api.post("/feedback", feedbackData);
    return response.data;
  }

  async getFeedbacks(params?: {
    status?: "draft" | "pending" | "received" | "given";
    user_type?: "sender" | "receiver";
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Feedback[]>> {
    const response = await this.api.get("/feedback", { params });
    return response.data;
  }

  async getFeedbackById(id: string): Promise<ApiResponse<Feedback>> {
    const response = await this.api.get(`/feedback/${id}`);
    return response.data;
  }

  async updateFeedbackStatus(
    id: string,
    status: "draft" | "pending" | "received" | "given"
  ): Promise<ApiResponse<Feedback>> {
    const response = await this.api.patch(`/feedback/${id}/status`, { status });
    return response.data;
  }

  async updateFeedback(
    id: string,
    data: { message: string; status?: string }
  ): Promise<ApiResponse<Feedback>> {
    const response = await this.api.put(`/feedback/${id}`, data);
    return response.data;
  }

  async deleteFeedback(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/feedback/${id}`);
    return response.data;
  }

  async getFeedbackStats(): Promise<ApiResponse<FeedbackStats[]>> {
    const response = await this.api.get("/feedback/stats");
    return response.data;
  }

  async searchStudents(query: string): Promise<
    ApiResponse<
      Array<{
        _id: string;
        name: string;
        displayname: string;
        photo: string;
      }>
    >
  > {
    const response = await this.api.get("/feedback/search-students", {
      params: { query },
    });
    return response.data;
  }

  // Kudos APIs
  async createKudos(kudosData: {
    recipient_id: string;
    message: string;
    values?: string[];
    reactions?: string[];
    visibility?: "public" | "school" | "private";
  }): Promise<ApiResponse<any>> {
    const response = await this.api.post("/kudos", kudosData);
    return response.data;
  }

  async getKudos(params?: {
    user_type?: "all" | "sent" | "received" | "school";
    page?: number;
    limit?: number;
    featured_only?: boolean;
  }): Promise<ApiResponse<any[]>> {
    const response = await this.api.get("/kudos", { params });
    return response.data;
  }

  async getKudosById(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/kudos/${id}`);
    return response.data;
  }

  async updateKudos(
    id: string,
    data: {
      message?: string;
      values?: string[];
      reactions?: string[];
      visibility?: "public" | "school" | "private";
      is_featured?: boolean;
    }
  ): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/kudos/${id}`, data);
    return response.data;
  }

  async deleteKudos(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/kudos/${id}`);
    return response.data;
  }

  async addReaction(
    id: string,
    reaction_type: string
  ): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/kudos/${id}/reactions`, {
      reaction_type,
    });
    return response.data;
  }

  async removeReaction(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/kudos/${id}/reactions`);
    return response.data;
  }

  async getKudosStats(): Promise<ApiResponse<any>> {
    const response = await this.api.get("/kudos/stats");
    return response.data;
  }

  async searchStudentsForKudos(query: string): Promise<
    ApiResponse<
      Array<{
        _id: string;
        name: string;
        displayname: string;
        photo: string;
      }>
    >
  > {
    const response = await this.api.get("/kudos/search-students", {
      params: { query },
    });
    return response.data;
  }

  // Mapping APIs
  async mapTeachersToSchool(schoolId: string, teacherIds: string[]) {
    const response = await this.api.post(
      `/mapping/schools/${schoolId}/teachers`,
      {
        teacherIds,
      }
    );
    return response.data;
  }

  async mapStudentsToSchool(schoolId: string, studentIds: string[]) {
    const response = await this.api.post(
      `/mapping/schools/${schoolId}/students`,
      {
        studentIds,
      }
    );
    return response.data;
  }

  async getSchoolTeachers(schoolId: string) {
    const response = await this.api.get(
      `/mapping/schools/${schoolId}/teachers`
    );
    return response.data;
  }

  async getSchoolStudents(schoolId: string) {
    const response = await this.api.get(
      `/mapping/schools/${schoolId}/students`
    );
    return response.data;
  }

  async removeTeacherFromSchool(schoolId: string, teacherId: string) {
    const response = await this.api.delete(
      `/mapping/schools/${schoolId}/teachers/${teacherId}`
    );
    return response.data;
  }

  async removeStudentFromSchool(schoolId: string, studentId: string) {
    const response = await this.api.delete(
      `/mapping/schools/${schoolId}/students/${studentId}`
    );
    return response.data;
  }

  // Parent APIs
  async getParents(params?: {
    school_id?: string;
    status?: boolean;
  }): Promise<ApiResponse<Parent[]>> {
    const response = await this.api.get("/parents", { params });
    return response.data;
  }

  async getParentById(id: string): Promise<ApiResponse<Parent>> {
    const response = await this.api.get(`/parents/${id}`);
    return response.data;
  }

  async getParentChildren(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/parents/${id}/children`);
    return response.data;
  }

  async createParent(data: Partial<Parent>): Promise<ApiResponse<Parent>> {
    const response = await this.api.post("/parents", data);
    return response.data;
  }

  async updateParent(
    id: string,
    data: Partial<Parent>
  ): Promise<ApiResponse<Parent>> {
    const response = await this.api.put(`/parents/${id}`, data);
    return response.data;
  }

  async deleteParent(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/parents/${id}`);
    return response.data;
  }

  async addChildToParent(
    id: string,
    data: { student_id: string; relationship: string }
  ): Promise<ApiResponse<Parent>> {
    const response = await this.api.post(`/parents/${id}/children`, data);
    return response.data;
  }

  async removeChildFromParent(
    id: string,
    studentId: string
  ): Promise<ApiResponse<Parent>> {
    const response = await this.api.delete(
      `/parents/${id}/children/${studentId}`
    );
    return response.data;
  }

  async createParentAccount(
    id: string,
    data: { username: string; password: string }
  ): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/parents/${id}/create-account`, data);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
