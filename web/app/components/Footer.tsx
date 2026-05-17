'use client'

import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Container from './Container'

const FooterStyled = styled.footer`
  .footer {
    border-top: 1px solid ${theme.colors.border};
    padding: 24px 0;
    text-align: end;
    color: ${theme.colors.muted};
    font-size: ${theme.fontSize.base};
  }

  .footer__link {
    color: ${theme.colors.muted};
    text-decoration: none;
    transition: color ${theme.transition.default};
  }

  .footer__link:hover {
    color: ${theme.colors.fg};
  }
`

export default function Footer() {
  return (
    <FooterStyled>
      <Container>
        <div className="footer">
          <p>
            MIT licensed. Built by sahajohn.{" "}
            <a
              href="https://www.npmjs.com/package/chromancy"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              npm
            </a>{" "}
            &middot; <a href="/demo" className="footer__link">Demo</a>{" "}
            &middot; <a href="/docs" className="footer__link">Docs</a>
          </p>
        </div>
      </Container>
    </FooterStyled>
  )
}
