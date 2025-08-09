# CampusConnect - College Management System

A comprehensive, full-stack college management system built with React.js, Node.js, Express.js, and PostgreSQL.

## Features

### Admin Features
- **Dashboard**: Overview of system statistics and recent activities
- **User Management**: Add, edit, and manage students, faculty, and admin users
- **Class Management**: Create and manage classes with year and section details
- **Subject Management**: Assign subjects to classes and faculty
- **Timetable Management**: Create and manage class schedules
- **Notice Management**: Publish notices for different user groups
- **Reports**: Generate attendance and marks reports

### Faculty Features
- **Dashboard**: Personal overview with subject and student statistics
- **Subject Management**: View assigned subjects and students
- **Attendance Management**: Mark and track student attendance
- **Marks Management**: Add and manage student marks for different assessments
- **Timetable**: View personal teaching schedule
- **Notices**: View relevant notices

### Student Features
- **Dashboard**: Personal academic overview
- **Attendance Tracking**: View attendance percentage and detailed records
- **Marks Viewing**: Access marks for all subjects and assessments
- **Timetable**: View class schedule
- **Notices**: View relevant notices and announcements

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Swagger** - API documentation

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd campusconnect
\`\`\`

2. **Install backend dependencies**
\`\`\`bash
cd backend
npm install
\`\`\`

3. **Environment Configuration**
Create a `.env` file in the backend directory:
\`\`\`env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campusconnect
DB_USER=postgres
DB_PASS=your_password
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=7d
\`\`\`

4. **Database Setup**
\`\`\`bash
# Create database
createdb campusconnect

# Run migrations (if using Sequelize CLI)
npx sequelize-cli db:migrate

# Seed database (optional)
npx sequelize-cli db:seed:all
\`\`\`

5. **Start the backend server**
\`\`\`bash
npm run dev
\`\`\`

The backend server will start on `http://localhost:5000`
API documentation will be available at `http://localhost:5000/api-docs`

### Frontend Setup

1. **Install frontend dependencies**
\`\`\`bash
cd frontend
npm install
\`\`\`

2. **Environment Configuration**
Create a `.env` file in the frontend directory:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

3. **Start the frontend development server**
\`\`\`bash
npm run dev
\`\`\`

The frontend will start on `http://localhost:3000`

### Full Stack Development

To run both backend and frontend simultaneously:
\`\`\`bash
# From the root directory
npm install
npm run dev
\`\`\`

## Database Schema

### Core Tables
- **users**: User authentication and basic info
- **students**: Student-specific information
- **faculty**: Faculty-specific information
- **classes**: Class/section information
- **subjects**: Subject details and assignments
- **marks**: Student marks and assessments
- **attendance**: Attendance records
- **timetable**: Class schedules
- **notices**: Announcements and notices

### Relationships
- Users have one-to-one relationships with Student or Faculty profiles
- Classes have many Students and Subjects
- Faculty can teach multiple Subjects
- Students belong to one Class
- Attendance and Marks link Students to Subjects

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)
- `GET /api/auth/profile` - Get user profile

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- Similar CRUD operations for classes, subjects, timetable, notices

### Faculty Routes
- `GET /api/faculty/dashboard` - Faculty dashboard
- `GET /api/faculty/subjects` - Get assigned subjects
- `POST /api/faculty/attendance` - Mark attendance
- `POST /api/faculty/marks` - Add marks
- `GET /api/faculty/timetable` - Get teaching schedule

### Student Routes
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/attendance` - Get attendance records
- `GET /api/student/marks` - Get marks
- `GET /api/student/timetable` - Get class schedule

## Default Login Credentials

### Admin
- Email: `admin@campus.com`
- Password: `admin123`

### Faculty
- Email: `faculty@campus.com`
- Password: `faculty123`

### Student
- Email: `student@campus.com`
- Password: `student123`

## Deployment

### Backend Deployment (Render/Heroku)

1. **Environment Variables**
Set the following environment variables in your hosting platform:
\`\`\`
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
\`\`\`

2. **Database**
- Use a managed PostgreSQL service (like Render PostgreSQL, Heroku Postgres, or AWS RDS)
- Run migrations in production environment

3. **Deploy**
\`\`\`bash
# Build and deploy
npm run build
npm start
\`\`\`

### Frontend Deployment (Vercel/Netlify)

1. **Build Configuration**
\`\`\`bash
npm run build
\`\`\`

2. **Environment Variables**
Set `VITE_API_URL` to your production backend URL

3. **Deploy**
- Connect your repository to Vercel or Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access Control**: Different permissions for admin, faculty, and students
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet**: Security headers for Express.js

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@campusconnect.com or create an issue in the repository.

## Acknowledgments

- Built with modern web technologies
- Responsive design for all devices
- Production-ready architecture
- Comprehensive error handling
- Real-time data updates
