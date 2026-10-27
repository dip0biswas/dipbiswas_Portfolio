# Dip Biswas - Portfolio

A modern, responsive portfolio website showcasing professional experience, skills, education, and achievements.

## Project Structure

```
Portfolio Dip Biswas/
├── backend/          # Node.js + Express API
└── frontend/         # React + Tailwind CSS
```

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with React and Tailwind CSS for a clean, professional look
- **Backend API**: Express server providing portfolio data
- **Smooth Scrolling**: Easy navigation between sections
- **Contact Form**: Built-in contact functionality using mailto
- **Social Links**: Direct links to LinkedIn and email
- **Admin workspace**: Firebase-authenticated content and inquiry management at `/admin`

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- CORS
- dotenv

## Installation

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
PORT=5001
NODE_ENV=development
FIREBASE_PROJECT_ID=your-firebase-project-id
ADMIN_EMAILS=bdip470@gmail.com
FIREBASE_SERVICE_ACCOUNT_JSON=
```

Configure Firebase Admin with either `FIREBASE_SERVICE_ACCOUNT_JSON` (the
service-account JSON as one environment value) or Google Application Default
Credentials. Keep service-account credentials private and out of source control.
See [backend/.env.example](backend/.env.example) for the full template.

4. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

To enable sign-in, create a Firebase project, register a Web app, enable the
Email/Password provider in Firebase Authentication, and create the authorized
administrator account `bdip470@gmail.com`. Set its password in Firebase Console
or use **Forgot your password?** on the admin sign-in screen to receive a reset
link. There is no default admin password. Verify that account's email before
using the panel. Copy the Firebase Web app settings into `frontend/.env` using
[frontend/.env.example](frontend/.env.example), then restart the frontend.

The admin panel is available at `/admin`. All write APIs and uploads require a
valid Firebase ID token, a verified email, and an email listed in the backend's
`ADMIN_EMAILS` setting. The dashboard manages projects, gallery items,
achievements, profile details, resume uploads, and contact inquiries. Content
is persisted in `backend/admin-content.json`; the public site refreshes portfolio
content automatically. Uploaded files are stored in `frontend/public` so they
can be served by the existing Express/static hosting setup.

## API Endpoints

- `GET /api/portfolio` - Get all portfolio data
- `GET /api/admin/session` - Verify the signed-in administrator
- `GET /api/admin/portfolio` - Read editable content (administrator only)
- `PUT /api/admin/portfolio` - Save editable content (administrator only)
- `GET /api/admin/messages` - Read contact inquiries (administrator only)
- `PATCH /api/admin/messages/:id` - Mark an inquiry read or unread (administrator only)
- `DELETE /api/admin/messages/:id` - Delete an inquiry (administrator only)
- `POST /api/admin/uploads/:kind` - Upload a portfolio image, certificate, or resume (administrator only)
- `GET /api/portfolio/personal` - Get personal information
- `GET /api/portfolio/skills` - Get skills list
- `GET /api/portfolio/experience` - Get work experience
- `GET /api/portfolio/education` - Get education details
- `GET /api/portfolio/achievements` - Get achievements

## Sections

1. **Hero** - Eye-catching introduction
2. **About** - Personal information and biography
3. **Skills** - Professional skills with levels
4. **Experience** - Work experience and responsibilities
5. **Education** - Educational background
6. **Achievements** - Notable awards and recognitions
7. **Contact** - Contact form and information
8. **Footer** - Copyright and links

## Customization

To customize the content, edit the `portfolioData` object in [backend/server.js](backend/server.js).

## Deployment

### Frontend
Deploy on Vercel, Netlify, or any static hosting service.

For this repository layout, both providers are configured automatically:

- Netlify uses `netlify.toml` and builds from `frontend/`.
- Vercel uses `vercel.json` and builds from `frontend/`.

To connect the frontend to a separately hosted backend, set `REACT_APP_API_URL`
to the backend origin (without a trailing slash) in the hosting provider's
environment before building. Leave it unset when Express serves the production
frontend from the same origin.

### Backend
Deploy on Heroku, Railway, or any Node.js hosting service.

## License

MIT License - Feel free to use this template for your own portfolio.

## Contact

- Email: biddo470@email.com
- LinkedIn: https://www.linkedin.com/in/dip-biswas-7b897a243/
- Phone: +880 170 7690 5536
