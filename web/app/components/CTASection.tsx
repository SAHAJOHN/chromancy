'use client'

import Link from 'next/link'
import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Container from './Container'

const CTASectionStyled = styled.section`
  .cta {
    text-align: center;
    padding: 72px 0;
  }

  .cta__title {
    font-family: ${theme.fonts.display};
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 500;
    margin-bottom: 20px;
  }

  .cta__desc {
    font-size: 18px;
    color: ${theme.colors.muted};
    max-width: 480px;
    margin: 0 auto 40px;
  }

  .cta__actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: ${theme.radii.md};
    font-size: ${theme.fontSize.lg};
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: opacity ${theme.transition.default};
    height: 48px;
  }

  .cta__btn--primary {
    background: ${theme.colors.accent};
    color: ${theme.colors.surface};
  }

  .cta__btn--secondary {
    background: ${theme.colors.surface};
    color: ${theme.colors.fg};
    border: 1px solid ${theme.colors.border};
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    .cta {
      padding: 80px 0;
    }
  }
`

export default function CTASection() {
  return (
    <CTASectionStyled>
      <section className="cta">
        <Container>
          <h2 className="cta__title">Ready to extract?</h2>
          <p className="cta__desc">
            Play with the interactive demo or dive straight into the API documentation.
          </p>
          <div className="cta__actions">
            <Link href="/demo" className="cta__btn cta__btn--primary">
              Open the demo
            </Link>
            <Link href="/docs" className="cta__btn cta__btn--secondary">
              Read the docs
            </Link>
          </div>
        </Container>
      </section>
    </CTASectionStyled>
  )
}
