'use client'

import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Container from './Container'

const FeaturesSectionStyled = styled.section`
  .features {
    padding: 0 0 100px 0;
  }

  .features__header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 64px;
  }

  .features__kicker {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.sm};
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${theme.colors.accent};
    margin-bottom: 16px;
  }

  .features__title {
    font-family: ${theme.fonts.display};
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 500;
    line-height: 1.15;
    margin-bottom: 20px;
  }

  .features__desc {
    font-size: 18px;
    color: ${theme.colors.muted};
    line-height: 1.55;
  }

  .features__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .feature-card {
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.xl};
    padding: 24px;
    transition: box-shadow ${theme.transition.default};
  }

  .feature-card:hover {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  }

  .feature-card__icon {
    font-family: ${theme.fonts.display};
    font-size: ${theme.fontSize['4xl']};
    font-style: italic;
    font-weight: 400;
    margin-bottom: 8px;
    color: ${theme.colors.accent};
  }

  .feature-card__title {
    font-family: ${theme.fonts.display};
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .feature-card__desc {
    font-size: 15px;
    color: ${theme.colors.muted};
    line-height: 1.55;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    .features {
      padding: 64px 0;
    }

    .features__grid {
      grid-template-columns: 1fr;
    }
  }
`

const features = [
  {
    title: 'Average, Dominant & Palette',
    desc: 'Get the average color, the single most dominant color, or a full palette of distinct colors from any image.',
  },
  {
    title: 'Multiple Output Formats',
    desc: 'Receive colors as RGB, HEX, HSL, or raw {r,g,b} objects. Pick the format that fits your pipeline.',
  },
  {
    title: 'Image Properties',
    desc: 'Analyze brightness, warmth, saturation, and contrast to make smart, data-driven design decisions.',
  },
  {
    title: 'Web Worker Support',
    desc: 'Offload heavy analysis to a worker thread so your UI stays buttery smooth, even on large images.',
  },
  {
    title: 'Batch Processing',
    desc: 'Analyze multiple images in parallel with a single call. Perfect for galleries, grids, and bulk workflows.',
  },
  {
    title: 'Zero Dependencies',
    desc: 'Only ~15KB minified. No heavy image-processing libraries. Just the browser Canvas API, done right.',
  },
]

export default function FeaturesSection() {
  return (
    <FeaturesSectionStyled>
      <section className="features">
        <Container>
          <div className="features__header">
            <div className="features__kicker">Capabilities</div>
            <h2 className="features__title">Everything you need from an image</h2>
            <p className="features__desc">
              Six powerful features packed into a tiny, zero-dependency library that works in every modern browser.
            </p>
          </div>
          <div className="features__grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-card__icon">— {String(i + 1).padStart(2, '0')}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </FeaturesSectionStyled>
  )
}
