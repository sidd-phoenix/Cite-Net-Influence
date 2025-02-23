'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import './Navbar.css';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Graphs', href: '/graphs' },
  { name: 'About', href: '/about' },
  { name: 'Documentation', href: '/docs' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <nav>
        <Link href="/" className="logo">
          Cite-Net Influence
        </Link>

        <div className="desktop-menu">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="nav-link"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XMarkIcon />
          ) : (
            <Bars3Icon />
          )}
        </button>
      </nav>

      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </header>
  );
} 