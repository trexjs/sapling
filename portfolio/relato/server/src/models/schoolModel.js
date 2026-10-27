import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  // Basic school information
  school_code: { 
    type: String, 
    required: true, 
    unique: true
  },
  super_admin_password: { 
    type: String, 
    required: true, 
    default: "1997" 
  },
  school_status: { 
    type: Boolean, 
    default: true 
  },

  // Contact details
  contact_details: {
    phone: [{ type: String }],
    email_id: { type: String, default: "" },
    social_media_links: [{ type: Object }]
  },

  // Address information
  address: {
    site: { type: String, default: "" },
    landmark: { type: String, default: "" },
    pincode: { type: String, default: "" },
    state: { type: String, default: "" },
    location: {
      lat: { type: Number, default: 0 },
      long: { type: Number, default: 0 }
    }
  },

  // Facilities offered
  facilities: [{ type: String }],

  // Establishment year
  year_of_establishment: { type: Date },

  // Media files
  media: {
    school_logo: { type: String, default: "" },
    school_images: [{ type: String }]
  },

  // Profile photo
  profile_photo: { type: String, default: "" },

  // Courses offered
  courses_offered: {
    k10: [{
      board: { type: String, enum: ["icse", "cbse", "state_board"] },
      eligibility_criteria: { type: String, default: "" },
      class_from: { type: String, default: "" }
    }],
    k12: [{
      board_name: { type: String, default: "" },
      type: { type: String, enum: ["Science", "Commerce", "Language"] },
      course: { type: String, default: "" }
    }]
  },

  // School rating
  school_rating: { 
    type: String, 
    default: "3.5",
    validate: {
      validator: function(v) {
        const rating = parseFloat(v);
        return rating >= 1 && rating <= 5;
      },
      message: 'School rating must be between 1 and 5'
    }
  },

  // School type
  school_type: { 
    type: String, 
    enum: ["day_schooler", "boarding"], 
    default: "day_schooler" 
  },

  // Boarding facilities (only if school_type is boarding)
  boarding_facilities: {
    food_menu: { 
      type: String, 
      enum: ["veg", "non_veg"] 
    },
    laundry_service: { type: Boolean, default: false },
    hostel_type: [{ 
      type: String, 
      enum: ["boys", "girls"] 
    }]
  },

  // Glance view - comprehensive school overview
  glance_view: {
    facts: {
      number_of_students: { type: Number, default: 0 },
      teacher_strength: { type: Number, default: 0 }
    },
    
    popular_alumnis: [{
      name: { type: String, default: "" },
      academic_profile: [{
        standard: { type: Number },
        section: { type: String, default: "" },
        roll_number: { type: Number },
        academic_year: {
          from_date: { type: Date },
          to_date: { type: Date }
        }
      }]
    }],

    recent_achievements: [{
      event_info: {
        name: { type: String, default: "" },
        date: { type: Date },
        participants: [{ type: Object }],
        status: { type: String, default: "" },
        assets: {
          images: [{ type: String }],
          videos: [{ type: String }]
        }
      },
      statement_after_achievement: [{
        achiever_name: { type: String, default: "" },
        role: { type: String, default: "" },
        statement: { type: String, default: "" }
      }]
    }],

    public_reviews: [{
      username: { type: String, default: "" },
      medium: { type: String, default: "" },
      rating: { 
        type: Number, 
        min: 1, 
        max: 5 
      },
      comment: { type: String, default: "" },
      date: { type: Date }
    }],

    brochure: [{
      topic: { type: String, default: "" },
      published_date: { type: Date },
      link: { type: String, default: "" }
    }],

    foundation_statement: [{
      role: { type: String, default: "" },
      for_academic_year: { type: String, default: "" },
      published_date: { type: Date },
      link: { type: String, default: "" }
    }],

    ratios: {
      teacher_to_students: { type: String, default: "" },
      acceptance: { type: String, default: "" }
    },

    // Campus Infrastructure and Facilities
    campus_overview: {
      transportation: { type: Boolean, default: false },
      drinking_water: { type: Boolean, default: false },
      cctv_surveillance: { type: Boolean, default: false },
      fire_safety_code: { type: Boolean, default: false },
      inhouse: {
        doctor_or_medical_practitioner: { type: Boolean, default: false },
        career_counsellor: { type: Boolean, default: false },
        internet_enabled_campus: { type: Boolean, default: false },
        ac_enabled_classrooms: { type: Boolean, default: false }
      },
      sports: {
        indoor: { type: Boolean, default: false },
        outdoor: { type: Boolean, default: false },
        swimming_pool: { type: Boolean, default: false },
        amphitheatre: { type: Boolean, default: false }
      },
      smart_classes: { type: Boolean, default: false },
      dining_hall_or_food_court_or_cafeteria: { type: Boolean, default: false },
      book_store: { type: Boolean, default: false },
      laundry_service: { type: Boolean, default: false },
      campus_elections: { type: Boolean, default: false }
    },

    // Skill Development Programs
    sdp: {
      yoga: { type: Boolean, default: false },
      music: { type: Boolean, default: false },
      swimming: { type: Boolean, default: false },
      chess: { type: Boolean, default: false },
      karate_classes: { type: Boolean, default: false },
      coding_classes: { type: Boolean, default: false },
      public_speaking: { type: Boolean, default: false },
      summer_camps: { type: Boolean, default: false },
      foreign_languages: {
        Germany: { type: Boolean, default: false },
        Spanish: { type: Boolean, default: false }
      }
    },

    scholarship_for_students: { type: Boolean, default: false },
    student_scholarship_programs: {
      government: { type: Boolean, default: false },
      ngos: { type: Boolean, default: false },
      private_corporation: { type: Boolean, default: false },
      hni: { type: Boolean, default: false },
      fundraisals: { type: Boolean, default: false },
      adoption: { type: Boolean, default: false }
    },

    events: {
      best_idea_competitions: { type: Boolean, default: false },
      hackathon: { type: Boolean, default: false },
      essay: { type: Boolean, default: false },
      quizzes: { type: Boolean, default: false },
      sports_day: { type: Boolean, default: false },
      olympiads: { type: Boolean, default: false }
    },

    school_value_added_services: {
      loans_from_entities: { type: String, default: "" },
      emergency_cash: { type: String, default: "" },
      cibil_score: { type: String, default: "" },
      scholarship: { type: String, default: "" }
    }
  }

}, { 
  strict: false, // Allow additional fields not defined in schema
  timestamps: true // Add createdAt and updatedAt
});

// Index for better query performance
schoolSchema.index({ school_status: 1 });

export const School = mongoose.model("School", schoolSchema);
