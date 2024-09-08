# School CRM System

Welcome to the *School CRM System* project! This CRM is designed for schools to offer an intuitive and user-friendly interface for parents, students, and staff. With a focus on student management and engagement, our system ensures a seamless experience for all users.

## Key Features

### 1. *Parent Signup and Login*
   - Easy registration for parents, allowing them to access their child’s information and updates from the school.
   - Secure login system with password protection and email verification for additional safety.

### 2. *Student Profile*
   - Displays comprehensive details about the student including personal details, grades, activities, and other information.
   - Profiles are viewable by parents and school admins for monitoring and updating purposes.

### 3. *Dashboard Overview (Default Screen)*
   - *Timetable*: A visually appealing timetable displayed with an icon for each subject.
   - *Notifications*: Important alerts such as upcoming events, exams, or school notices are shown with an icon for quick access.
   - *Fee & Attendance Tiles*: Includes quick-glance tiles that show the current fee status and attendance.

### 4. *Class Diary*
   - *Calendar Interface*: The class diary will be shown in the form of a calendar.
   - *Diary Entries*: Clicking on a specific date allows users to view the class diary for that day, with details fetched from a JSON response on the backend.
   - *Diary Content*: Displays the content for all the subjects the student is currently pursuing.

### 5. *Mock Tests*
   - *Test List*: Displays available mock tests in the form of cards.
   - *MCQ Interface*: Upon clicking a test, multiple-choice questions (MCQs) appear. The user can only submit an answer once per question.
      - *Answer Feedback*: Correct answers are marked in green and wrong answers in red, with explanations provided for incorrect choices.
   - *Test Scores*: After completing the test, scores are calculated and shown. On the test tab, users can see their progress:
      - *Attended Test*: Shows the score, e.g., 7/10.
      - *Pending Test*: Displays as “Pending” if the test hasn’t been taken yet.
   - *Sample Test Data*: For now, a set of 10 questions with dummy answers are used for testing purposes.

### 6. *Assignments Tab*
   - *Assignment List*: Students can view a list of their assignments.
   - *Submission*: Allows file uploads (PDF or DOC) for assignment submission.
   - *Assignment Status*: Displays "Pending" for assignments that need to be submitted and "Submitted" for those already uploaded.

### 7. *Attendance Tab*
   - *Calendar View*: Attendance is displayed as a calendar. Dates with attendance are circled.
   - *Attendance Status*: Each date shows a green circle if attended, red if missed. Public holidays are excluded (data fetched from a dummy JSON response).
   - *Summary*: The top right of the tab shows the total number of classes attended out of the total available classes (e.g., 22/30).

---

## Technical Details

1. *Frontend*:
   - Designed with an emphasis on user experience (UX) and simplicity.
   - Uses calendar components for displaying dates in the class diary and attendance tabs.
   - Dynamic cards used for mock tests and assignments for an engaging layout.

2. *Backend*:
   - JSON-based data fetching for diaries, mock tests, and attendance details.
   - Authentication via token-based APIs.
   - Mock test answers and scores are saved in the backend and fetched dynamically.

3. *Testing*:
   - Includes dummy JSON data for testing purposes (e.g., mock test questions, attendance records).
   - Basic validation checks in place for file uploads and form submissions.

---

## Installation & Setup

### 1. *Clone the Repository*
   bash
   git clone https://github.com/your-repo/school-crm-system.git
   

### 2. *Install Dependencies*
   Navigate to the project folder and install the required dependencies using your package manager (e.g., npm or yarn):
   bash
   cd school-crm-system
   npm install
   

### 3. *Run the Application*
   Start the local development server:
   bash
   npm start
   
   The application will be accessible on http://localhost:3000.

### 4. *JSON API Setup*
   - Ensure the backend API for fetching diary entries, attendance, and mock tests is correctly set up.
   - Modify the sample JSON responses as needed for testing.

---

## Future Enhancements

- *Push Notifications*: Integrating real-time push notifications for instant updates to parents.
- *Progress Tracking*: Adding more detailed student performance tracking.
- *User Role Enhancements*: Custom dashboards for teachers, students, and admins.

## Contribution Guidelines

Feel free to open issues or pull requests if you'd like to contribute. We welcome enhancements, bug fixes, and new ideas to improve the system.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

---

## Screenshots
![image](https://github.com/user-attachments/assets/99f053d8-8917-4513-a79f-bf5154f1c9db)
![image](https://github.com/user-attachments/assets/d41d8b2a-0e40-487e-87ad-1a9e12caf153)


https://github.com/user-attachments/assets/727a661c-65e0-4cfc-bf13-4a6675a1f4a1



---

### We hope this School CRM System enhances the learning experience for students and simplifies communication between parents and the school!
