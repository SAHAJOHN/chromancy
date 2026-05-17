'use client'

import { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Container from './Container'

const HeroSectionStyled = styled.section`
  .hero {
    padding: 120px 0 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero__kicker {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.md};
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${theme.colors.accent};
    margin-bottom: 24px;
  }

  .hero__title {
    font-family: ${theme.fonts.display};
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.02em;
    max-width: 800px;
    margin: 0 auto 28px;
  }

  .hero__subtitle {
    font-size: clamp(17px, 2vw, 22px);
    color: ${theme.colors.muted};
    max-width: 560px;
    margin: 0 auto 38px;
    line-height: 1.55;
  }

  .hero__actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .hero__btn {
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

  .hero__btn--primary {
    background: ${theme.colors.accent};
    color: ${theme.colors.surface};
  }

  .hero__btn--secondary {
    background: ${theme.colors.surface};
    color: ${theme.colors.fg};
    border: 1px solid ${theme.colors.border};
  }

  .hero__install {
    background: ${theme.colors.surface};
    border: 1px dashed #b86b4a;
    border-radius: ${theme.radii.lg};
    padding: 14px 24px;
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.base};
    color: ${theme.colors.muted};
    height: 48px;
  }

  .hero__install-code {
    color: ${theme.colors.fg};
    font-family: inherit;
  }

  .hero__install-btn {
    background: none;
    border: none;
    color: ${theme.colors.muted};
    cursor: pointer;
    font-size: 13px;
    padding: 4px;
  }

  .hero__install-btn:hover {
    color: ${theme.colors.fg};
  }

  .hero__visual {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 38px;
    margin-left: auto;
    margin-right: auto;
    align-items: stretch;
  }

  .hero__visual-panel {
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.xl};
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .hero__visual-header {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.sm};
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: ${theme.colors.muted};
    border-bottom: 1px solid ${theme.colors.border};
    padding-bottom: 12px;
    text-align: start;
  }

  .hero__visual-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hero__visual-label {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.xs};
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${theme.colors.muted};
    text-align: start;
  }

  .hero__swatch-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hero__swatch {
    width: 32px;
    height: 32px;
    border-radius: ${theme.radii.full};
    border: 1px solid ${theme.colors.border};
    flex-shrink: 0;
  }

  .hero__swatch-text {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.base};
    color: ${theme.colors.fg};
  }

  .hero__palette-row {
    display: flex;
    gap: 8px;
  }

  .hero__palette-swatch {
    width: 40px;
    height: 40px;
    border-radius: ${theme.radii.full};
    border: 1px solid ${theme.colors.border};
  }

  .hero__prop {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hero__prop-label {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.muted};
    width: 78px;
    flex-shrink: 0;
    text-align: start;
  }

  .hero__prop-bar-bg {
    flex: 1;
    height: 6px;
    background: ${theme.colors.bg};
    border-radius: 3px;
    overflow: hidden;
  }

  .hero__prop-bar-fill {
    height: 100%;
    border-radius: 3px;
    background: ${theme.colors.accent};
  }

  .hero__prop-value {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.fg};
    width: 32px;
    text-align: right;
    flex-shrink: 0;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    .hero {
      padding: 80px 0 60px;
    }
  }
`;

export default function HeroSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('npm i chromancy')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <HeroSectionStyled>
      <section className="hero">
        <Container>
          <div className="hero__kicker">Browser-native color extraction</div>
          <h1 className="hero__title">Steal colors from any image</h1>
          <p className="hero__subtitle">
            Extract average, dominant, and palette colors with property analysis
            — all in a 15KB package with zero dependencies.
          </p>
          <div className="hero__actions">
            <Link href="/demo" className="hero__btn hero__btn--primary">
              Try the demo
            </Link>
            <Link href="/docs" className="hero__btn hero__btn--secondary">
              Read the docs
            </Link>
          </div>
          <div className="hero__install">
            <code className="hero__install-code">npm i chromancy</code>
            <button className="hero__install-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="hero__visual">
            <div className="hero__visual-panel">
              <div className="hero__visual-header">chromancy() result</div>
              <div className="hero__visual-group">
                <div className="hero__visual-label">Average</div>
                <div className="hero__swatch-row">
                  <div
                    className="hero__swatch"
                    style={{ background: '#b86b4a' }}
                  />
                  <span className="hero__swatch-text">rgb(184, 107, 74)</span>
                </div>
              </div>
              <div className="hero__visual-group">
                <div className="hero__visual-label">Dominant</div>
                <div className="hero__swatch-row">
                  <div
                    className="hero__swatch"
                    style={{ background: '#c96442' }}
                  />
                  <span className="hero__swatch-text">rgb(201, 100, 66)</span>
                </div>
              </div>
              <div className="hero__visual-group">
                <div className="hero__visual-label">Palette</div>
                <div className="hero__palette-row">
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#c96442' }}
                    title="rgb(201, 100, 66)"
                  />
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#5a7a6a' }}
                    title="rgb(90, 122, 106)"
                  />
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#8b5a3c' }}
                    title="rgb(139, 90, 60)"
                  />
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#d97757' }}
                    title="rgb(217, 119, 87)"
                  />
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#4a6a5a' }}
                    title="rgb(74, 106, 90)"
                  />
                </div>
              </div>
              <div className="hero__visual-group">
                <div className="hero__visual-label">Image Properties</div>
                <div className="hero__prop">
                  <span className="hero__prop-label">Brightness</span>
                  <div className="hero__prop-bar-bg">
                    <div
                      className="hero__prop-bar-fill"
                      style={{ width: '62%' }}
                    />
                  </div>
                  <span className="hero__prop-value">62%</span>
                </div>
                <div className="hero__prop">
                  <span className="hero__prop-label">Warmth</span>
                  <div className="hero__prop-bar-bg">
                    <div
                      className="hero__prop-bar-fill"
                      style={{ width: '78%' }}
                    />
                  </div>
                  <span className="hero__prop-value">78%</span>
                </div>
                <div className="hero__prop">
                  <span className="hero__prop-label">Saturation</span>
                  <div className="hero__prop-bar-bg">
                    <div
                      className="hero__prop-bar-fill"
                      style={{ width: '45%' }}
                    />
                  </div>
                  <span className="hero__prop-value">45%</span>
                </div>
                <div className="hero__prop">
                  <span className="hero__prop-label">Contrast</span>
                  <div className="hero__prop-bar-bg">
                    <div
                      className="hero__prop-bar-fill"
                      style={{ width: '53%' }}
                    />
                  </div>
                  <span className="hero__prop-value">53%</span>
                </div>
              </div>
            </div>
            <div className="hero__visual-panel">
              <div className="hero__visual-header">chromancy() result</div>
              <div className="hero__visual-group">
                <div className="hero__visual-label">Average</div>
                <div className="hero__swatch-row">
                  <div
                    className="hero__swatch"
                    style={{ background: '#b86b4a' }}
                  />
                  <span className="hero__swatch-text">rgb(184, 107, 74)</span>
                </div>
              </div>
              <div className="hero__visual-group">
                <div className="hero__visual-label">Dominant</div>
                <div className="hero__swatch-row">
                  <div
                    className="hero__swatch"
                    style={{ background: '#c96442' }}
                  />
                  <span className="hero__swatch-text">rgb(201, 100, 66)</span>
                </div>
              </div>
              <div className="hero__visual-group">
                <div className="hero__visual-label">Palette</div>
                <div className="hero__palette-row">
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#c96442' }}
                    title="rgb(201, 100, 66)"
                  />
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#5a7a6a' }}
                    title="rgb(90, 122, 106)"
                  />
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#8b5a3c' }}
                    title="rgb(139, 90, 60)"
                  />
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#d97757' }}
                    title="rgb(217, 119, 87)"
                  />
                  <div
                    className="hero__palette-swatch"
                    style={{ background: '#4a6a5a' }}
                    title="rgb(74, 106, 90)"
                  />
                </div>
              </div>
              <div className="hero__visual-group">
                <div className="hero__visual-label">Image Properties</div>
                <div className="hero__prop">
                  <span className="hero__prop-label">Brightness</span>
                  <div className="hero__prop-bar-bg">
                    <div
                      className="hero__prop-bar-fill"
                      style={{ width: '62%' }}
                    />
                  </div>
                  <span className="hero__prop-value">62%</span>
                </div>
                <div className="hero__prop">
                  <span className="hero__prop-label">Warmth</span>
                  <div className="hero__prop-bar-bg">
                    <div
                      className="hero__prop-bar-fill"
                      style={{ width: '78%' }}
                    />
                  </div>
                  <span className="hero__prop-value">78%</span>
                </div>
                <div className="hero__prop">
                  <span className="hero__prop-label">Saturation</span>
                  <div className="hero__prop-bar-bg">
                    <div
                      className="hero__prop-bar-fill"
                      style={{ width: '45%' }}
                    />
                  </div>
                  <span className="hero__prop-value">45%</span>
                </div>
                <div className="hero__prop">
                  <span className="hero__prop-label">Contrast</span>
                  <div className="hero__prop-bar-bg">
                    <div
                      className="hero__prop-bar-fill"
                      style={{ width: '53%' }}
                    />
                  </div>
                  <span className="hero__prop-value">53%</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </HeroSectionStyled>
  );
}
