# NAT - Cybersecurity Portfolio

A modern, hacker-themed personal portfolio website built with React and Vite. Features a terminal-inspired dark aesthetic with animated typing effects and smooth scroll-based navigation.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)

## Features

- **Terminal Aesthetic** - Dark theme with green accent colors and monospace fonts
- **Typing Animations** - Dynamic terminal-style command typing effects
- **Smooth Scrolling** - Snap-scroll navigation between sections
- **Contact Form** - Functional email contact form with Express.js backend
- **Responsive Design** - Mobile-first design with hamburger menu navigation
- **Preloader Animation** - Grid-reveal loading animation
- **Parallax Effects** - Scroll-based parallax animations

## Sections

| Section | Description |
|---------|-------------|
| **Hero** | Landing section with name and terminal typing effect |
| **Summary** | About section with personal introduction |
| **Skills** | Technical skills and proficiencies |
| **Certifications** | Accredited cybersecurity certifications and verified credentials |
| **Projects** | Portfolio of completed projects |
| **Tools** | Cybersecurity tools expertise (Nmap, Nikto, Wireshark, Metasploit, etc.) |
| **Contact** | Contact form with email integration |

## Tech Stack

### Frontend
- **Next** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Material UI** - UI component library
- **Lucide React** - Icon library
- **Motion** - Animation library
- **Embla Carousel** - Carousel component

### Backend
- **Express.js** - Node.js web framework
- **Nodemailer** - Email sending
- **CORS** - Cross-origin resource sharing

### Custom Fonts
- PP Mondwest
- Satoshi
- Sooner

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bhai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   RECIPIENT_EMAIL=your-recipient@email.com
   PORT=3001
   ```

### Running the Application

```bash
# Run frontend only
npm run dev

# Run backend server only
npm run server

# Run both frontend and backend concurrently
npm run dev:all
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
├── public/                 # Static assets
├── server/
│   └── index.js           # Express server for contact form
├── src/
│   ├── app/
│   │   └── App.tsx        # Main application component
│   ├── assets/
│   │   └── fonts/         # Custom fonts (PP Mondwest, Satoshi, Sooner)
│   ├── styles/
│   │   ├── fonts.css      # Font face declarations
│   │   ├── index.css      # Global styles
│   │   ├── tailwind.css   # Tailwind imports
│   │   └── theme.css      # Theme variables
│   ├── main.tsx           # Application entry point
│   └── vite-env.d.ts      # Vite type declarations
├── guidelines/
│   └── Guidelines.md      # AI/Design system guidelines
├── package.json
├── postcss.config.mjs
├── vite.config.ts
└── ATTRIBUTIONS.md
```

## Email Server Setup (Gmail)

To enable the contact form:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Navigate to **App passwords**
4. Generate a new app password for "Mail"
5. Use the 16-character password in your `.env` file

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | POST | Submit contact form (requires: name, email, message) |
| `/api/health` | GET | Server health check |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run server` | Start Express email server |
| `npm run dev:all` | Run frontend and backend concurrently |

## Cybersecurity Tools Featured

- Nmap - Network scanner
- Nikto - Web server scanner
- Wireshark - Network protocol analyzer
- Metasploit - Penetration testing framework
- Hashcat - Password recovery
- John the Ripper - Password cracker
- Maltego - OSINT and forensics
- SQLmap - SQL injection tool
- Kali Linux - Security-focused OS

## License

Private project - All rights reserved.

## Author

**NAT** (Najmudeen)

---

*Built with React, Vite, and a passion for cybersecurity*
