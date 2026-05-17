'use client'

import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Container from './Container'

const QuickStartSectionStyled = styled.section`
  .quick-start {
    background: ${theme.colors.fg};
    color: ${theme.colors.surface};
    padding: 100px 0;
  }

  .quick-start__header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 64px;
  }

  .quick-start__kicker {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.sm};
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${theme.colors.accent};
    margin-bottom: 16px;
  }

  .quick-start__title {
    font-family: ${theme.fonts.display};
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 500;
    line-height: 1.15;
    margin-bottom: 20px;
    color: ${theme.colors.surface};
  }

  .quick-start__desc {
    font-size: 18px;
    color: ${theme.colors.surface};
    opacity: 0.7;
    line-height: 1.55;
  }

  .quick-start__code {
    background: ${theme.colors.codeBg};
    color: ${theme.colors.surface};
    border-radius: ${theme.radii.lg};
    overflow-x: auto;
    font-family: ${theme.fonts.mono};
    font-size: 14px;
    line-height: 1.7;
    white-space: pre;
  }

  .quick-start__code .comment {
    color: ${theme.colors.codeComment};
  }

  .quick-start__code .keyword {
    color: ${theme.colors.codeKeyword};
  }

  .quick-start__code .string {
    color: ${theme.colors.codeString};
  }

  .quick-start__code .func {
    color: ${theme.colors.codeFunc};
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    .quick-start {
      padding: 64px 0;
    }

    .quick-start__code {
      padding: 24px;
      font-size: 13px;
    }
  }
`

export default function QuickStartSection() {
  return (
    <QuickStartSectionStyled>
      <section className="quick-start">
        <Container>
          <div className="quick-start__header">
            <div className="quick-start__kicker">Quick start</div>
            <h2 className="quick-start__title">Two lines. That&apos;s it.</h2>
            <p className="quick-start__desc">
              Pass an image element or a URL. Get colors back. No configuration required.
            </p>
          </div>
          <div className="quick-start__code">
            <pre><code><span className="keyword">import</span> {'{'} chromancy {'}'} <span className="keyword">from</span> <span className="string">&apos;chromancy&apos;</span>;{'\n'}
{'\n'}<span className="keyword">const</span> result = <span className="keyword">await</span> <span className="func">chromancy</span>(<span className="string">&apos;https://example.com/photo.jpg&apos;</span>);{'\n'}
{'\n'}<span className="comment">// result.averageColor  -&gt; &quot;rgb(128, 64, 32)&quot;</span>{'\n'}
<span className="comment">// result.dominantColor -&gt; &quot;rgb(200, 100, 50)&quot;</span>{'\n'}
<span className="comment">// result.palette       -&gt; [&quot;rgb(...)&quot;, &quot;rgb(...)&quot;, ...]</span>{'\n'}
<span className="comment">// result.properties    -&gt; {'{'} brightness, warmth, saturation, contrast {'}'}</span></code></pre>
          </div>
        </Container>
      </section>
    </QuickStartSectionStyled>
  )
}
