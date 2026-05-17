'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { chromancy, type ChromancyResult } from 'chromancy'
import { theme } from '@/app/styles/global'
import Container from './Container'

interface Artwork {
  id: number
  title: string
  imageUrl: string
  artist: string
}

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

  .hero__visual-kicker {
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
    margin-bottom: 52px;
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
    margin-left: auto;
    margin-right: auto;
    align-items: stretch;
    height: 424px;
  }

  .hero__visual-panel {
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.xl};
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 420px;
  }

  .hero__visual-panel--swiper {
    padding: 0;
    overflow: hidden;
    position: relative;
  }

  .hero__swiper {
    width: 100%;
    height: 100%;
    border-radius: ${theme.radii.xl};
  }

  .hero__swiper-slide {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .hero__swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hero__swiper-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 48px 20px 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
    color: #fff;
    text-align: left;
    pointer-events: none;
  }

  .hero__swiper-nav {
    position: absolute;
    bottom: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
    z-index: 10;
  }

  .hero__swiper-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .hero__swiper-btn:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .hero__swiper-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .hero__swiper-title {
    font-family: ${theme.fonts.display};
    font-size: ${theme.fontSize.lg};
    font-weight: 500;
    line-height: 1.3;
    margin-bottom: 4px;
  }

  .hero__swiper-artist {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.sm};
    opacity: 0.85;
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
flex-wrap: wrap;
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

  .hero__analyzing {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${theme.colors.muted};
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.sm};
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    .hero {
      padding: 90px 0 60px;
    }

    .hero__visual {
      grid-template-columns: 1fr;
      height: unset;
    }

    .hero__visual-panel {
      min-height: 360px;
    }
    .hero__visual-panel--swiper {
      height: 430.97px;
    }
  }
`;

export default function HeroSection() {
  const [copied, setCopied] = useState(false)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [results, setResults] = useState<Record<number, ChromancyResult>>({})
  const [currentResult, setCurrentResult] = useState<ChromancyResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText('npm i chromancy')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const analyzeArtwork = async (artwork: Artwork) => {
    if (results[artwork.id]) {
      setCurrentResult(results[artwork.id])
      return
    }

    setAnalyzing(true)
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = artwork.imageUrl
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
      })

      const result = await chromancy(img, {
        paletteSize: 8,
        maxSize: 150,
        outputFormat: 'rgb',
      })

      setResults(prev => ({ ...prev, [artwork.id]: result }))
      setCurrentResult(result)
    } catch (err) {
      console.error('Chromancy analysis error:', err)
      // Remove broken artwork from the list
      setArtworks(prev => prev.filter(a => a.id !== artwork.id))
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const url = new URL('https://api.artic.edu/api/v1/artworks/search')
        url.searchParams.set('fields', 'id,title,image_id,artist_title')
        const queries = ['painting', 'watercolor', 'colorful', 'pop art', 'cat']
        const randomQuery = queries[Math.floor(Math.random() * queries.length)]
        url.searchParams.set('limit', '30')
        url.searchParams.set('q', randomQuery)
        url.searchParams.set('query[term][is_public_domain]', 'true')

        const res = await fetch(url.toString(), {
          headers: {
            'AIC-User-Agent': 'chromancy-landing (sahajohn)',
          },
        })

        if (!res.ok) throw new Error('Failed to fetch artworks')

        const json = await res.json()
        const iiifBase = json.config?.iiif_url || 'https://www.artic.edu/iiif/2'

        const items: Artwork[] = json.data
          .filter((art: any) => art.image_id)
          .map((art: any) => ({
            id: art.id,
            title: art.title,
            imageUrl: `${iiifBase}/${art.image_id}/full/843,/0/default.jpg`,
            artist: art.artist_title || 'Unknown Artist',
          }))

        const shuffled = shuffle(items).slice(0, 8)
        setArtworks(shuffled)
      } catch (err) {
        console.error('Artwork fetch error:', err)
      }
    }

    fetchArtworks()
  }, [])

  useEffect(() => {
    if (artworks.length > 0 && !currentResult) {
      analyzeArtwork(artworks[0])
    }
  }, [artworks])

  const handleSlideChange = (swiper: any) => {
    const index = swiper.realIndex ?? swiper.activeIndex
    const artwork = artworks[index]
    if (artwork) {
      analyzeArtwork(artwork)
    }
  }

  const pct = (n: number) => `${Math.round(n * 100)}%`

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
          <div className="hero__visual-kicker">Live demo</div>
          <div className="hero__visual">
            <div className="hero__visual-panel hero__visual-panel--swiper">
              {artworks.length > 0 ? (
                <>
                  <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation={{
                      prevEl: prevRef.current,
                      nextEl: nextRef.current,
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={artworks.length > 1}
                    className="hero__swiper"
                    onSwiper={(swiper) => {
                      setTimeout(() => {
                        if (!swiper.params?.navigation || !swiper.navigation)
                          return;
                        const nav = swiper.params.navigation;
                        if (typeof nav !== 'boolean') {
                          nav.prevEl = prevRef.current;
                          nav.nextEl = nextRef.current;
                        }
                        swiper.navigation.init();
                        swiper.navigation.update();
                      });
                    }}
                    onSlideChange={handleSlideChange}
                  >
                    {artworks.map((art) => (
                      <SwiperSlide key={art.id} className="hero__swiper-slide">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          loading="lazy"
                        />
                        <div className="hero__swiper-info">
                          <div className="hero__swiper-title">{art.title}</div>
                          <div className="hero__swiper-artist">
                            {art.artist}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="hero__swiper-nav">
                    <button
                      ref={prevRef}
                      className="hero__swiper-btn"
                      aria-label="Previous artwork"
                    >
                      ←
                    </button>
                    <button
                      ref={nextRef}
                      className="hero__swiper-btn"
                      aria-label="Next artwork"
                    >
                      →
                    </button>
                  </div>
                </>
              ) : (
                <div className="hero__analyzing">Loading artworks...</div>
              )}
            </div>
            <div className="hero__visual-panel">
              <div className="hero__visual-header">chromancy() result</div>
              {analyzing && !currentResult ? (
                <div
                  className="hero__analyzing"
                  style={{
                    marginTop: '-30.59px',
                  }}
                >
                  Analyzing image...
                </div>
              ) : currentResult ? (
                <>
                  <div className="hero__visual-group">
                    <div className="hero__visual-label">Average</div>
                    <div className="hero__swatch-row">
                      <div
                        className="hero__swatch"
                        style={{ background: currentResult.averageColor }}
                      />
                      <span className="hero__swatch-text">
                        {currentResult.averageColor}
                      </span>
                    </div>
                  </div>
                  <div className="hero__visual-group">
                    <div className="hero__visual-label">Dominant</div>
                    <div className="hero__swatch-row">
                      <div
                        className="hero__swatch"
                        style={{ background: currentResult.dominantColor }}
                      />
                      <span className="hero__swatch-text">
                        {currentResult.dominantColor}
                      </span>
                    </div>
                  </div>
                  <div className="hero__visual-group">
                    <div className="hero__visual-label">Palette</div>
                    <div className="hero__palette-row">
                      {currentResult.palette.map((color, i) => (
                        <div
                          key={i}
                          className="hero__palette-swatch"
                          style={{ background: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="hero__visual-group">
                    <div className="hero__visual-label">Image Properties</div>
                    <div className="hero__prop">
                      <span className="hero__prop-label">Brightness</span>
                      <div className="hero__prop-bar-bg">
                        <div
                          className="hero__prop-bar-fill"
                          style={{
                            width: pct(currentResult.properties.brightness),
                          }}
                        />
                      </div>
                      <span className="hero__prop-value">
                        {pct(currentResult.properties.brightness)}
                      </span>
                    </div>
                    <div className="hero__prop">
                      <span className="hero__prop-label">Warmth</span>
                      <div className="hero__prop-bar-bg">
                        <div
                          className="hero__prop-bar-fill"
                          style={{
                            width: pct(currentResult.properties.warmth),
                          }}
                        />
                      </div>
                      <span className="hero__prop-value">
                        {pct(currentResult.properties.warmth)}
                      </span>
                    </div>
                    <div className="hero__prop">
                      <span className="hero__prop-label">Saturation</span>
                      <div className="hero__prop-bar-bg">
                        <div
                          className="hero__prop-bar-fill"
                          style={{
                            width: pct(currentResult.properties.saturation),
                          }}
                        />
                      </div>
                      <span className="hero__prop-value">
                        {pct(currentResult.properties.saturation)}
                      </span>
                    </div>
                    <div className="hero__prop">
                      <span className="hero__prop-label">Contrast</span>
                      <div className="hero__prop-bar-bg">
                        <div
                          className="hero__prop-bar-fill"
                          style={{
                            width: pct(currentResult.properties.contrast),
                          }}
                        />
                      </div>
                      <span className="hero__prop-value">
                        {pct(currentResult.properties.contrast)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="hero__analyzing"
                  style={{
                    marginTop: '-30.59px',
                  }}
                >
                  Waiting for image...
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </HeroSectionStyled>
  );
}
