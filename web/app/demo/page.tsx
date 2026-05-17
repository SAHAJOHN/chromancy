'use client'

import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import Container from '@/app/components/Container'
import DemoHero from './components/DemoHero'
import UploadZone from './components/UploadZone'
import ResultsPanel from './components/ResultsPanel'
import Toast from './components/Toast'

const DemoPageStyled = styled.div`
  .demo-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .demo-page__main {
    flex: 1;
  }

  .url-section {
    max-width: 800px;
    margin: 0 auto ${theme.spacing['13']};
  }

  .url-row {
    display: flex;
    gap: 10px;
  }

  .url-row__input {
    flex: 1;
    padding: 14px 18px;
    border: 1.5px solid ${theme.colors.border};
    border-radius: ${theme.radii.lg};
    font-size: ${theme.fontSize.lg};
    font-family: ${theme.fonts.body};
    background: ${theme.colors.surface};
    color: ${theme.colors.fg};
    height: 48px;
    transition: border-color ${theme.transition.default}, box-shadow ${theme.transition.default};
  }

  .url-row__input:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 1px ${theme.colors.accent};
  }

  .url-row__input::placeholder {
    color: ${theme.colors.muted};
    opacity: 0.6;
  }

  .url-row__btn {
    padding: 14px 28px;
    background: ${theme.colors.fg};
    color: ${theme.colors.surface};
    border: none;
    border-radius: ${theme.radii.lg};
    font-size: ${theme.fontSize.lg};
    font-weight: 500;
    cursor: pointer;
    transition: opacity ${theme.transition.default};
    white-space: nowrap;
    height: 48px;
  }

  .url-row__btn:hover {
    opacity: 0.85;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .url-row {
      flex-direction: column;
    }

    .url-row__btn {
      width: 100%;
    }
  }
`

interface ChromancyResult {
  averageColor: string
  dominantColor: string
  palette: string[]
  properties: {
    brightness: number
    warmth: number
    saturation: number
    contrast: number
  }
}

export default function DemoPage() {
  const [result, setResult] = useState<ChromancyResult | null>(null)
  const [previewSrc, setPreviewSrc] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2000)
  }, [])

  const analyzeImage = useCallback(async (src: string) => {
    try {
      const { chromancy } = await import('chromancy')
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = async () => {
        const res = await chromancy(img, { paletteSize: 5 })
        setPreviewSrc(src)
        setResult({
          averageColor: res.averageColor,
          dominantColor: res.dominantColor,
          palette: res.palette,
          properties: res.properties,
        })
        setTimeout(() => {
          const resultsEl = document.querySelector('.results--active')
          if (resultsEl) {
            const y = resultsEl.getBoundingClientRect().top + window.scrollY - 20
            window.scrollTo({ top: y, behavior: 'smooth' })
          }
        }, 50)
      }
      img.onerror = () => showToast('Failed to load image. CORS issue?')
      img.src = src
    } catch {
      showToast('Error analyzing image')
    }
  }, [showToast])

  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        analyzeImage(ev.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }, [analyzeImage])

  const handleUrlAnalyze = useCallback(() => {
    const url = urlInput.trim()
    if (!url) return
    analyzeImage(url)
  }, [urlInput, analyzeImage])

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'))
  }, [showToast])

  return (
    <DemoPageStyled>
      <div className="demo-page">
        <Nav />
        <main className="demo-page__main">
          <DemoHero />
          <Container>
            <div style={{ maxWidth: '800px', margin: '0 auto 24px' }}>
              <UploadZone onFileSelect={handleFileSelect} />
            </div>
            <div className="url-section">
              <div className="url-row">
                <input
                  type="text"
                  className="url-row__input"
                  placeholder="https://example.com/photo.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlAnalyze()}
                />
                <button className="url-row__btn" onClick={handleUrlAnalyze}>
                  Analyze URL
                </button>
              </div>
            </div>
            {result && (
              <ResultsPanel result={result} previewSrc={previewSrc} onCopy={handleCopy} />
            )}
          </Container>
        </main>
        <Footer />
        <Toast message={toastMsg} visible={toastVisible} />
      </div>
    </DemoPageStyled>
  )
}
