'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Container from './Container'

const NavStyled = styled.nav`
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(250, 249, 245, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${theme.colors.border};
  }

  .nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .nav__logo {
    font-family: ${theme.fonts.display};
    font-size: 22px;
    font-weight: 500;
    color: ${theme.colors.fg};
    text-decoration: none;
    letter-spacing: -0.02em;
  }

  .nav__logo-accent {
    color: ${theme.colors.accent};
  }

  .nav__links {
    display: flex;
    gap: 32px;
    list-style: none;
    padding: 0;
  }

  .nav__link {
    color: ${theme.colors.muted};
    text-decoration: none;
    font-size: ${theme.fontSize.lg};
    transition: color ${theme.transition.default};
  }

  .nav__link:hover {
    color: ${theme.colors.fg};
  }

  .nav__link--active {
    color: ${theme.colors.fg};
    font-weight: 500;
  }

  .nav__cta {
    background: ${theme.colors.fg};
    color: ${theme.colors.surface};
    padding: 8px 18px;
    border-radius: ${theme.radii.md};
    font-size: ${theme.fontSize.base};
    font-weight: 500;
    text-decoration: none;
    transition: opacity ${theme.transition.default};
  }

  .nav__cta:hover {
    opacity: 0.85;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .nav__links,
    .nav__cta {
      display: none;
    }

    .nav__inner {
      justify-content: center;
    }
  }
`

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Demo' },
  { href: '/docs', label: 'Docs' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <NavStyled>
      <div className="nav">
        <Container>
          <div className="nav__inner">
            <Link href="/" className="nav__logo">
              chromancy<span className="nav__logo-accent">.</span>
            </Link>
            <ul className="nav__links">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav__link ${pathname === item.href ? 'nav__link--active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/demo" className="nav__cta">
              Try it
            </Link>
          </div>
        </Container>
      </div>
    </NavStyled>
  )
}
