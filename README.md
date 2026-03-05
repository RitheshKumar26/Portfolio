# NAT - Cybersecurity Portfolio

A modern, hacker-themed personal portfolio website built with React and Vite. Features a terminal-inspired dark aesthetic with animated typing effects and smooth scroll-based navigation.

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

Madras Web Company  - All rights reserved.

## Author

**NAT** (Najmudeen)

---

*Built with Next, Vite, and a passion for cybersecurity*
