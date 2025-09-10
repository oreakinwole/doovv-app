#Routag#
Routag is a React Native application built with Expo, designed to streamline package delivery by connecting senders, couriers, and businesses. The app includes features like user authentication, role-based sign-up, OTP verification, and fleet management.

Table of Contents
Features
Project Structure
Setup Instructions
Scripts
Key Components
Contributing

Features
Authentication: Login, sign-up, and forgot password flows.
Role-Based Sign-Up: Users can register as senders, individual couriers, or business couriers.
OTP Verification: Secure account verification with OTP input and resend functionality.
Fleet Management: Register vehicles and drivers for business couriers.
Responsive UI: Built with react-native and styled using twrnc (Tailwind CSS for React Native).

Project Structure
routag/
├── app/
│   ├── authentication/       # Authentication screens (login, sign-up, forgot password, verification)
│   ├── index.tsx             # Onboarding screen
├── components/               # Reusable UI components (InputField, CustomButton, etc.)
├── db/                       # Static data for dropdowns and options
├── layout/                   # Layout components (PageLayout, FullPageModalLayout)
├── assets/                   # Static assets (images, SVGs)
├── .expo/                    # Expo configuration
├── metro.config.js           # Metro bundler configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation

Setup Instructions
Clone the Repository:
git clone https://github.com/your-username/routag.git
cd routag

Install Dependencies:
npm install

Start the Development Server:
npm run start

Run on iOS/Android:
iOS: npm run ios
Android: npm run android
Run on Web:
npm run web

Scripts
The following scripts are available in the package.json:

npm run start: Start the Expo development server.
npm run ios: Run the app on an iOS simulator.
npm run android: Run the app on an Android emulator.
npm run web: Run the app in a web browser.
npm run lint: Lint the codebase using ESLint and Prettier.
npm run format: Format the codebase with Prettier.

Key Components

Authentication Screens
Login: Located at index.tsx.
Forgot Password: Located at index.tsx.
Sign-Up: Located at index.tsx.
OTP Verification: Located at index.tsx.

Reusable Components
InputField: Custom input field with optional secure text entry (components/Input.tsx).
CustomButton: Styled button with multiple variants (components/Button.tsx).
OTPInput: OTP input field with auto-focus and completion handling (components/OTPInput.tsx).
UploadDocumentInput: File upload component for documents (components/UploadFile.tsx).

Layouts
PageLayout: Standard layout for screens (layout/PageLayout.tsx).
FullPageModalLayout: Modal layout for registering vehicles and drivers (layout/FullPageModalLayout.tsx).

Contributing
Fork the repository.
Create a new branch:
git checkout -b feature-name

Commit your changes:
git commit -m "Add feature description"

Push to your branch:
git push origin feature-name

Open a pull request.