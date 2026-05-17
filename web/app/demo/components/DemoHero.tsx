'use client'

import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Container from '@/app/components/Container'

const DemoHeroStyled = styled.section`
  .demo-hero {
    padding: ${theme.spacing['17']} 0 ${theme.spacing['15']};
    text-align: center;
  }

  .demo-hero__kicker {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.md};
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${theme.colors.accent};
    margin-bottom: ${theme.spacing['6']};
  }

  .demo-hero__title {
    font-family: ${theme.fonts.display};
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: ${theme.spacing['5']};
  }

  .demo-hero__desc {
    color: ${theme.colors.muted};
    font-size: clamp(16px, 1.8vw, 20px);
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.55;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .demo-hero {
      padding: 90px 0 40px;
    }
  }
`;

export default function DemoHero() {
  return (
    <DemoHeroStyled>
      <section className="demo-hero">
        <Container>
          <p className="demo-hero__kicker">Interactive Playground</p>
          <h1 className="demo-hero__title">Steal colors from any image</h1>
          <p className="demo-hero__desc">
            Drop an image below or paste a URL. Watch chromancy extract colors and properties in real time.
          </p>
        </Container>
      </section>
    </DemoHeroStyled>
  )
}
