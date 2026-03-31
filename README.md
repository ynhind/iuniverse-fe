# IUiverse - Online Learning System

Welcome to **IUiverse**, a modern online learning platform designed for IU (International University) students. This is the frontend application built with React, JavaScript, and Tailwind CSS.

## Features

- **Dashboard**: Quick overview of your courses, grades, and upcoming deadlines
- **Course Management**: View all active courses with progress tracking
- **Schedule**: Manage your class schedule and events
- **Grades**: Track your academic performance
- **Announcements**: Stay updated with course announcements
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Lucide React**: Icon library


```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

### Development

Start the development server:

```bash
npm run dev
```

The application will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Component Overview

### Header

- Navigation and branding
- Notification bell
- User profile menu
- Logout button

### Sidebar

- Collapsible navigation menu
- Quick access to main sections
- Responsive design (hidden on mobile)

### Dashboard

- Statistics cards with key metrics
- Course cards with progress tracking
- Recent announcements
- Upcoming deadlines

## Styling

This project uses **Tailwind CSS** for styling. The configuration can be found in `tailwind.config.js`.

### Color Palette

- Primary: Blue
- Secondary: Various complementary colors
- Background: Light gray

## Next Steps

1. **Setup Backend**: Create API endpoints for authentication, courses, grades, etc.
2. **Add Pages**: Implement remaining pages (Courses, Schedule, Grades, Settings)
3. **Authentication**: Add login/signup functionality
4. **State Management**: Consider adding Redux, Zustand, or Context API
5. **Error Handling**: Implement error boundaries and proper error handling
6. **Testing**: Add unit and integration tests

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=IUiverse
```

## Contributing

Guidelines for contributing to this project will be added soon.

## License

This project is proprietary software for IU students.

---

**Happy Learning! 🎓**
