'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ChevronRight } from 'lucide-react'
import { theme } from '@/app/styles/global'

const SidebarStyled = styled.aside`
  /* Desktop sidebar */
  .sidebar {
    position: sticky;
    top: 88px;
    align-self: start;
    max-height: calc(100vh - 104px);
    overflow-y: auto;
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.lg};
    padding: 20px;
  }

  .sidebar__title {
    font-family: ${theme.fonts.mono};
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${theme.colors.muted};
    margin-bottom: 16px;
  }

  .sidebar__nav {
    list-style: none;
    padding: 0;
  }

  .sidebar__nav-item {
    margin-bottom: 4px;
  }

  .sidebar__link {
    display: block;
    padding: 6px 10px;
    border-radius: ${theme.radii.sm};
    color: ${theme.colors.muted};
    text-decoration: none;
    font-size: 14px;
    transition: all ${theme.transition.fast};
  }

  .sidebar__link:hover {
    background: ${theme.colors.bg};
    color: ${theme.colors.fg};
  }

  .sidebar__link--active {
    background: ${theme.colors.bg};
    color: ${theme.colors.accent};
  }

  /* Mobile - hidden by default on desktop */
  .sidebar__mobile {
    display: none;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    .sidebar {
      display: none;
    }

    .sidebar__mobile {
      display: block;
    }

    .sidebar__toggle {
      position: fixed;
      left: 0;
      top: 208px;
      transform: translateY(-50%) translateX(0);
      width: 20px;
      height: 56px;
      background: ${theme.colors.surface};
      border: 1px solid ${theme.colors.border};
      border-left: none;
      border-radius: 0 ${theme.radii.md} ${theme.radii.md} 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 101;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      padding: 0;
      transition: transform 0.3s ease;
    }

    .sidebar__toggle--open {
      transform: translateY(-50%) translateX(280px);
      box-shadow: none;
    }

    .sidebar__toggle-icon {
      transition: transform 0.3s ease;
      color: ${theme.colors.muted};
      width: 16px;
      height: 16px;
    }

    .sidebar__toggle-icon--open {
      transform: rotate(180deg);
    }

    .sidebar__backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .sidebar__backdrop--visible {
      opacity: 1;
      pointer-events: auto;
    }

    .sidebar__drawer {
      position: fixed;
      top: 0;
      left: 0;
      width: 280px;
      height: 100vh;
      background: ${theme.colors.surface};
      border-right: 1px solid ${theme.colors.border};
      padding: 20px;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      overflow-y: auto;
      border-radius: 0 24px 24px 0;
    }

    .sidebar__drawer--open {
      transform: translateX(0);
    }
  }
`;

const navItems = [
  { href: '#install', label: 'Installation' },
  { href: '#chromancy', label: 'chromancy()' },
  { href: '#batch', label: 'chromancyBatch()' },
  { href: '#cache', label: 'clearCache()' },
  { href: '#utils', label: 'Utilities' },
  { href: '#options', label: 'Options' },
  { href: '#formats', label: 'Output Formats' },
  { href: '#types', label: 'TypeScript' },
  { href: '#browser', label: 'Browser Support' },
]

function NavList({ activeId, onItemClick }: { activeId: string; onItemClick?: () => void }) {
  return (
    <ul className="sidebar__nav">
      {navItems.map((item) => (
        <li className="sidebar__nav-item" key={item.href}>
          <a
            href={item.href}
            className={`sidebar__link ${activeId === item.href.slice(1) ? 'sidebar__link--active' : ''}`}
            onClick={onItemClick}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Sidebar() {
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const headings = document.querySelectorAll('.docs-content [id]')
    const handleScroll = () => {
      let current = ''
      headings.forEach((h) => {
        if (h.getBoundingClientRect().top < 120) {
          current = h.id
        }
      })
      setActiveId(current)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <SidebarStyled>
      {/* Desktop: sticky sidebar */}
      <div className="sidebar">
        <div className="sidebar__title">On this page</div>
        <NavList activeId={activeId} />
      </div>

      {/* Mobile: toggle + drawer */}
      <div className="sidebar__mobile">
        <button
          className={`sidebar__toggle ${isOpen ? 'sidebar__toggle--open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="sidebar-drawer"
          type="button"
          aria-label="Toggle navigation menu"
        >
          <ChevronRight className={`sidebar__toggle-icon ${isOpen ? 'sidebar__toggle-icon--open' : ''}`} />
        </button>

        <div
          className={`sidebar__backdrop ${isOpen ? 'sidebar__backdrop--visible' : ''}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        <div
          id="sidebar-drawer"
          className={`sidebar__drawer ${isOpen ? 'sidebar__drawer--open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="sidebar__title">On this page</div>
          <NavList activeId={activeId} onItemClick={() => setIsOpen(false)} />
        </div>
      </div>
    </SidebarStyled>
  )
}
