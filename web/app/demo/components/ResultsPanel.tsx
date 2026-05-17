'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { theme } from '@/app/styles/global'

const ResultsPanelStyled = styled.div`
  .results {
    display: none;
  }

  .results--active {
    display: block;
  }

  .result-panel {
    max-width: 800px;
    margin: 0 auto 16px;
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.xl};
    padding: ${theme.spacing['11']};
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: ${theme.spacing['7']};
    border-bottom: 1px solid ${theme.colors.border};
    padding-bottom: ${theme.spacing['5']};
  }

  .result-header__title {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.sm};
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: ${theme.colors.muted};
  }

  .format-toggle {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .format-toggle__btn {
    padding: 6px 14px;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.bg};
    border-radius: ${theme.radii.md};
    font-size: ${theme.fontSize.md};
    font-family: ${theme.fonts.mono};
    cursor: pointer;
    color: ${theme.colors.muted};
    transition: all ${theme.transition.default};
  }

  .format-toggle__btn:hover {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.fg};
  }

  .format-toggle__btn--active {
    background: ${theme.colors.fg};
    color: ${theme.colors.surface};
    border-color: ${theme.colors.fg};
  }


  .code-out {
    background: ${theme.colors.codeBg};
    color: ${theme.colors.surface};
    border-radius: ${theme.radii.lg};
    padding: ${theme.spacing['11']};
    font-family: ${theme.fonts.mono};
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .code-out .comment {
    color: ${theme.colors.codeComment};
  }

  .code-out .string {
    color: ${theme.colors.codeString};
  }

  .code-out .num {
    color: ${theme.colors.codeNum};
  }

  .code-out .key {
    color: ${theme.colors.codeKey};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .result-panel {
      padding: ${theme.spacing['9']};
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

interface ResultsPanelProps {
  result: ChromancyResult | null
  previewSrc: string
  onCopy: (text: string) => void
}

type FormatType = 'rgb' | 'hex' | 'hsl' | 'object'

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const [format, setFormat] = useState<FormatType>('rgb')

  const formats: FormatType[] = ['rgb', 'hex', 'hsl', 'object']

  if (!result) {
    return (
      <ResultsPanelStyled>
        <div className="results" />
      </ResultsPanelStyled>
    )
  }

  const { averageColor, dominantColor, palette, properties } = result

  return (
    <ResultsPanelStyled>
      <div className="results results--active">
        <div className="result-panel">
          <div className="result-header">
            <span className="result-header__title">chromancy() result</span>
            <div className="format-toggle">
              {formats.map((f) => (
                <button
                  key={f}
                  className={`format-toggle__btn ${format === f ? 'format-toggle__btn--active' : ''}`}
                  onClick={() => setFormat(f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <pre className="code-out">
              <span className="comment">// ChromancyResult</span>
              {'\n'}{'{ '}
              {'\n'}  <span className="key">averageColor</span>:  <span className="string">&quot;{averageColor}&quot;</span>,
              {'\n'}  <span className="key">dominantColor</span>: <span className="string">&quot;{dominantColor}&quot;</span>,
              {'\n'}  <span className="key">palette</span>: [
              {palette.map((c, i) => (
                <span key={i}>{'\n'}    <span className="string">&quot;{c}&quot;</span>,</span>
              ))}
              {'\n'}  ],
              {'\n'}  <span className="key">properties</span>: {'{'}
              {'\n'}    <span className="key">brightness</span>:  <span className="num">{properties.brightness}</span>,
              {'\n'}    <span className="key">warmth</span>:      <span className="num">{properties.warmth}</span>,
              {'\n'}    <span className="key">saturation</span>:  <span className="num">{properties.saturation}</span>,
              {'\n'}    <span className="key">contrast</span>:    <span className="num">{properties.contrast}</span>
              {'\n'}  {'}'}
              {'\n'}{'}'}
            </pre>
          </div>
        </div>
      </div>
    </ResultsPanelStyled>
  )
}
