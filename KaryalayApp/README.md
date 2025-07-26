# Karyalay - Venue Booking Mobile App

A React Native mobile application for booking venues, built with Expo and TypeScript.

## Features

### Current Features

- **User Registration**: Create an account with required and optional fields
- **Profile Management**: View and manage user profile information
- **Form Validation**: Comprehensive validation for all input fields
- **Local Storage**: User data persistence using AsyncStorage
- **Modern UI**: Clean and intuitive user interface
- **TypeScript**: Full type safety throughout the application

### User Profile Fields

- **First Name** (Required)
- **Last Name** (Required)
- **Phone Number** (Required, 10-digit validation)
- **Email Address** (Optional, with email format validation)

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **React Native Safe Area Context** for safe area handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd KaryalayApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Running the App

### Using Expo Go (Recommended for testing)

1. Install Expo Go on your mobile device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

### Android Emulator

```bash
npm run android
```

### iOS Simulator (macOS only)

```bash
npm run ios
```

### Web Browser

```bash
npm run web
```

## Project Structure

```
KaryalayApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CustomInput.tsx
│   │   └── CustomButton.tsx
│   ├── screens/            # App screens
│   │   ├── SignupScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── services/           # Business logic and API calls
│   │   └── authService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── utils/              # Utility functions
├── App.tsx                 # Main app component
├── package.json
└── README.md
```

## Key Components

### SignupScreen

- Handles user registration with form validation
- Collects required and optional user information
- Provides real-time validation feedback
- Stores user data locally upon successful registration

### HomeScreen

- Displays user profile information
- Shows account creation date
- Provides navigation to future features (venue browsing, bookings)
- Includes logout functionality

### AuthService

- Manages user authentication state
- Handles local storage operations
- Provides user profile management functions

## Form Validation

The app includes comprehensive form validation:

- **First Name**: Required, non-empty string
- **Last Name**: Required, non-empty string
- **Phone Number**: Required, exactly 10 digits
- **Email**: Optional, valid email format when provided

## Future Enhancements

- Venue browsing and search functionality
- Booking management system
- Payment integration
- Push notifications
- User reviews and ratings
- Admin panel for venue owners

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
