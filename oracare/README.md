# OraCare - Oral Cancer Detection Web Application

OraCare is a web application that uses AI-powered image analysis to detect early signs of oral cancer. The application provides a user-friendly interface for uploading or capturing images of the oral cavity and receiving instant AI-driven analysis results.

## Features

- User Authentication (Login/Register)
- Image Upload and Capture
- Real-time AI Analysis using Anthropic's Claude API
- Analysis History Management
- Responsive Design (works on all devices)
- Secure Data Storage with Firebase

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase Account
- Anthropic API Key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd oracare
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase and Anthropic API configurations:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
oracare/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── services/      # Firebase and API services
│   ├── utils/         # Utility functions
│   └── api/           # API endpoints
├── public/            # Static assets
└── ...config files
```

## Technologies Used

- React (with Vite)
- Firebase (Authentication, Firestore, Storage)
- Anthropic Claude API
- TailwindCSS
- React Router DOM
- React Webcam

## Development

1. Make sure you have all the prerequisites installed
2. Follow the setup instructions
3. The application will be available at `http://localhost:5173`

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred hosting service (e.g., Firebase Hosting, Vercel, Netlify)

## Security Considerations

- All API keys should be kept secure and never exposed in the client-side code
- Use environment variables for sensitive information
- Implement proper authentication and authorization
- Follow Firebase security rules best practices
- Validate and sanitize user inputs

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details
