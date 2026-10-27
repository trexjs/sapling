```js
For attendance module we need to create a config.json
and store
-  Holidays list
-  Frozen time for attendance list
    -  02:00
    -  pm
After this time of for a particular day the attendance api is frozen for the day


Create an attendance api
// /api/attendance?type=student&student_id=”1222”
- In Body 
    - School_id
    - Teacher_id

const students = {
  2025: {
    meta: {
      current_month: "JAN",
      holidays: {
        JAN: [],
      },
    },
    JAN: {
      meta: {
        total_days: 31,
        today: 28,
        working_days: [27, 28],
        non_working_days: [{ day: 21, weekend: true, remarks: "" }, 29],
        frozen: true, // cannot update after 3 pm
      },
      dates: {
        28: [
          {
            id: "stu.123u849",
            status: "present",
          },
        ],
      },
      29: [],
      30: [
        {
          id: "stu.123u849",
          status: "present",
        },
      ],
    },
  },
};

// students/attendance?year=2025&month=JAN
const response = {
  meta: {
    total_days: 31,
    today: 28,
    working_days: [27, 28],
    non_working_days: [{ day: 21, weekend: true, remarks: "" }, 29],
    frozen: true, // cannot update after 3 pm
  },
  dates: {
    28: [
      {
        id: "stu.123u849",
        status: "present",
      },
    ],
  },
  29: [],
  30: [
    {
      id: "stu.123u849",
      status: "present",
    },
  ],
};


```