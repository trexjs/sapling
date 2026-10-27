
APIs
CRUD apis to onboard a school
Create a school by 
- School_code
- Super_admin password of 1997
- Status true // by default true
Need a update api for the same

Need set of update api where we need the 
    - mongo_id  of the school
    - Super_admin password of 1997
    - Any data can be updated until the school is active ( true )

export const school = {
  contact_details: {
    phone: ["8951432665"],
    email_id: "snrakshith.97@gmail.com",
    social_media_links: [{}],
  },
  address: {
    site: "",
    landmark: "", // Optional
    pincode: "",
    state: "",
    location: {
      lat: 98.6,
      long: 51.54,
    },
  },
  facilities: ["library", "food court"], // Array of String
  year_of_eastablisment: "Date",
  media: {
    school_logo: "logo.svg",
    school_images: ["img1.png", "img2.jpeg"],
  },
  school_code: "",
  courses_offered: {
    k10: [
      {
        board: "icse",
        eligibility_critery: "above 10 years",
        class_from: "1 to 10", // Can rate between `1 to 5` 5 being the highest
      },
      {
        board: "cbse",
        eligibality_critery: "above 10 years",
        class_from: "1 to 10",
      },
      {
        board: "state_board",
        eligibality_critery: "above 10 years",
        class_from: "1 to 10",
      },
    ],
    k12: [
      {
        board_name: "",
        type: "Science",
        course: "PCMC" || "PCMB",
      },
      {
        board_name: "",
        type: "Commerce",
        course: "EBAC" || "EBAS",
      },
      {
        board_name: "",
        type: "Language",
        course: "Hindi" || "English",
      },
    ],
  },
  school_rating: "3.5", // Can rate between `1 to 5` 5 being the highest
  // By default `day_schooler`
  school_type: "day_schooler" || "boarding", // enum
  // Available only if `school_type` value is `boarding`
  boarding_facilies: {
    food_menu: "veg" || "non_veg", // enum
    laundry_service: false, // boolean
    hostel_type: ["boys", "girls"], // Array of specific values
  },
  //  By default it is true
  school_status: true, // School status - if active true or else false
  glance_view: {
    facts: {
      number_of_students: 50,
      teacher_strength: 50,
    },
    popular_alumnis: [
      {
        name: "Rajinikanth",
        academic_profile: [
          {
            standard: 5,
            section: "B",
            roll_number: 51,
            academic_year: {
              from_date: "29-01-1997",
              to_date: "5-02-1998",
            },
          },
        ],
      },
    ],
    recent_achievements: [
      {
        event_info: {
          name: "State Chess Compainship",
          date: "",
          participants: [{}],
          status: "Winner",
          assets: {
            images: [],
            videos: [],
          },
        },
        statement_after_achievement: [
          {
            achiever_name: "Ramesh",
            role: "teacher",
            statement: "",
          },
        ],
      },
    ],
    public_reviews: [
      {
        username: "Rakshith",
        medium: "google",
        rating: 5,
        comment: "Good school",
        date: "06-02-2005",
      },
    ],
    brochure: [
      {
        topic: "Hostal life",
        published_date: "06-05-2021",
        link: "https://www.dummy.com/",
      },
    ],
    foundation_statement: [
      {
        role: "Principal",
        for_academic_year: "2021-2022",
        published_date: "06-07-2021",
        link: "https://www.dummy.com/",
      },
    ],
    ratios: {
      teacher_to_students: "1:30",
      acceptency: "5%",
    },
    // Campus Infrastructure and Faculties
    campus_overview: {
      transportation: true,
      drinking_water: true,
      cctv_surveillance: false,
      fire_safety_code: true,
      inhouse: {
        doctor_or_medical_practitioner: false,
        career_counsler: false,
        internet_enabled_campus: false,
        ac_enabled_classrooms: false,
      },
      sports: {
        indoor: false,
        outdoor: false,
        swimming_pool: false,
        amphitheatre: false,
      },
      smart_classes: false,
      dining_hall_or_food_court_or_cafeteria: true,
      book_store: true,
      laundry_service: false,
      campus_elections: true,
    },
    // Skill Development Programs
    sdp: {
      yoga: false,
      music: false,
      swimming: false,
      chess: false,
      karate_classes: false,
      coding_classes: false,
      public_speaking: false,
      summer_camps: false,
      foreign_languages: {
        Germany: false,
        Spanish: false,
      },
    },
    scholarship_for_students: false,
    student_scholarship_programs: {
      government: true,
      ngos: true,
      private_corporation: true,
      hni: true,
      fundraisals: true,
      adoption: true,
    },
    events: {
      best_idea_compitions: true,
      hackathon: true,
      essay: true,
      quizzes: true,
      sports_day: true,
      olympiads: true,
    },
    school_value_added_services: {
      loans_from_entites: "",
      emergency_cash: "",
      cibil_score: "",
      scholarship: "",
    },
  },
};

