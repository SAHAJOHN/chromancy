'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { theme } from '@/app/styles/global'

const SidebarStyled = styled.aside`
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

  @media (max-width: ${theme.breakpoints.lg}) {
    .sidebar {
      position: static;
      border-bottom: 1px solid ${theme.colors.border};
      padding-bottom: 16px;
    }
  }
`

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

export default function Sidebar() {
  const [activeId, setActiveId] = useState('')

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

  return (
    <SidebarStyled>
      <div className="sidebar">
        <div className="sidebar__title">On this page</div>
        <ul className="sidebar__nav">
          {navItems.map((item) => (
            <li className="sidebar__nav-item" key={item.href}>
              <a
                href={item.href}
                className={`sidebar__link ${activeId === item.href.slice(1) ? 'sidebar__link--active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </SidebarStyled>
  )
}
