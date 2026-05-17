'use client'

import styled from 'styled-components'
import { theme } from '@/app/styles/global'

const DocsContentStyled = styled.main`
  @media (max-width: ${theme.breakpoints.lg}) {
    margin-top: -24px;
  }
  .docs-content {
    min-width: 0;
  }

  .docs-content h2 {
    font-family: ${theme.fonts.display};
    font-size: 32px;
    font-weight: 500;
    margin: 48px 0 20px;
    padding-top: 24px;
    border-top: 1px solid ${theme.colors.border};
  }

  .docs-content h2:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  .docs-content h3 {
    font-family: ${theme.fonts.display};
    font-size: 22px;
    font-weight: 500;
    margin: 32px 0 14px;
  }

  .docs-content p {
    font-size: 16px;
    color: ${theme.colors.muted};
    margin-bottom: 16px;
    line-height: 1.65;
  }

  .docs-content p strong {
    color: ${theme.colors.fg};
  }

  .docs-content table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 20px 0 32px;
    width: 100%;
    max-width: 100%;
  }

  .table-wrapper table {
    width: auto;
    min-width: 100%;
  }

  .docs-content th,
  .docs-content td {
    text-align: left;
    padding: 12px 14px;
    border-bottom: 1px solid ${theme.colors.border};
  }

  .docs-content th {
    font-weight: 500;
    color: ${theme.colors.fg};
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: ${theme.colors.surface};
  }

  .docs-content td {
    color: ${theme.colors.muted};
    vertical-align: top;
  }

  .col-description {
    min-width: 280px;
    width: 50%;
  }

  .docs-content tr:hover td {
    background: ${theme.colors.surface};
  }

  .code-block {
    background: ${theme.colors.codeBg};
    color: ${theme.colors.surface};
    border-radius: ${theme.radii.lg};
    padding: 24px;
    overflow-x: auto;
    font-family: ${theme.fonts.mono};
    font-size: 13px;
    line-height: 1.7;
    margin: 16px 0 28px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .code-block .comment {
    color: ${theme.colors.codeComment};
  }

  .code-block .keyword {
    color: ${theme.colors.codeKeyword};
  }

  .code-block .string {
    color: ${theme.colors.codeString};
  }

  .code-block .func {
    color: ${theme.colors.codeFunc};
  }

  .code-block .type {
    color: ${theme.colors.codeNum};
  }

  .docs-content code {
    font-family: ${theme.fonts.mono};
    font-size: 13px;
    background: ${theme.colors.surface};
    padding: 2px 6px;
    border-radius: ${theme.radii.sm};
    border: 1px solid ${theme.colors.border};
  }

  .docs-content th code,
  .docs-content td code {
    font-family: ${theme.fonts.mono};
    font-size: 12px;
    background: ${theme.colors.bg};
    padding: 2px 6px;
    border-radius: ${theme.radii.sm};
    color: ${theme.colors.fg};
  }

  .badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: ${theme.radii.full};
    font-size: 11px;
    font-family: ${theme.fonts.mono};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: ${theme.colors.bg};
    border: 1px solid ${theme.colors.border};
    color: ${theme.colors.muted};
    margin-left: 8px;
  }

  .return-type {
    font-family: ${theme.fonts.mono};
    font-size: 13px;
    color: ${theme.colors.muted};
    margin-bottom: 12px;
  }
`;

export default function DocsContent() {
  return (
    <DocsContentStyled>
      <div className="docs-content">
        <h2 id="install">Installation</h2>
        <p>Chromancy is a browser-only library with zero dependencies. Install via npm or your favorite package manager.</p>
        <div className="code-block">
          <span className="comment"># npm</span>{'\n'}
          npm install chromancy{'\n'}
          {'\n'}
          <span className="comment"># yarn</span>{'\n'}
          yarn add chromancy{'\n'}
          {'\n'}
          <span className="comment"># pnpm</span>{'\n'}
          pnpm add chromancy
        </div>
        <p>Import the functions you need:</p>
        <div className="code-block">
          <span className="keyword">import</span> {'{'} chromancy, chromancyBatch, clearCache {'}'} <span className="keyword">from</span> <span className="string">&apos;chromancy&apos;</span>;{'\n'}
          <span className="comment">// or</span>{'\n'}
          <span className="keyword">const</span> {'{'} chromancy {'}'} = <span className="func">require</span>(<span className="string">&apos;chromancy&apos;</span>);
        </div>

        <h2 id="chromancy">chromancy() <span className="badge">Main</span></h2>
        <p>The primary function for extracting colors from a single image. Pass an <code>HTMLImageElement</code> or a URL string.</p>
        <div className="return-type">Promise&lt;ChromancyResult&gt;</div>
        <div className="code-block">
          <span className="keyword">const</span> result = <span className="keyword">await</span> <span className="func">chromancy</span>(source, options?);{'\n'}
          {'\n'}
          <span className="comment">// With an image element</span>{'\n'}
          <span className="keyword">const</span> img = document.<span className="func">getElementById</span>(<span className="string">&apos;my-image&apos;</span>);{'\n'}
          <span className="keyword">const</span> result = <span className="keyword">await</span> <span className="func">chromancy</span>(img, {'{'} paletteSize: <span className="type">5</span> {'}'});{'\n'}
          {'\n'}
          <span className="comment">// With a URL string</span>{'\n'}
          <span className="keyword">const</span> result = <span className="keyword">await</span> <span className="func">chromancy</span>(<span className="string">&apos;https://example.com/photo.jpg&apos;</span>, {'{'}{'\n'}
          {'  '}outputFormat: <span className="string">&apos;hex&apos;</span>,{'\n'}
          {'  '}paletteSize: <span className="type">3</span>,{'\n'}
          {'}'});
        </div>

        <h3>Parameters</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Parameter</th><th>Type</th><th className="col-description">Description</th></tr>
            </thead>
            <tbody>
              <tr><td><code>source</code></td><td><code>HTMLImageElement | string</code></td><td className="col-description">An image element or a URL string pointing to the image.</td></tr>
              <tr><td><code>options</code></td><td><code>ChromancyOptions</code></td><td className="col-description">Optional configuration object (see <a href="#options">Options</a>).</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="batch">chromancyBatch()</h2>
        <p>Analyzes multiple images in parallel. Returns an array of results in the same order as the input sources.</p>
        <div className="return-type">Promise&lt;ChromancyResult[]&gt;</div>
        <div className="code-block">
          <span className="keyword">import</span> {'{'} chromancyBatch {'}'} <span className="keyword">from</span> <span className="string">&apos;chromancy&apos;</span>;{'\n'}
          {'\n'}
          <span className="keyword">const</span> results = <span className="keyword">await</span> <span className="func">chromancyBatch</span>([{'\n'}
          {'  '}<span className="string">&apos;https://example.com/1.jpg&apos;</span>,{'\n'}
          {'  '}<span className="string">&apos;https://example.com/2.jpg&apos;</span>,{'\n'}
          {'  '}<span className="string">&apos;https://example.com/3.jpg&apos;</span>,{'\n'}
          ], {'{'} paletteSize: <span className="type">5</span> {'}'});{'\n'}
          {'\n'}
          <span className="comment">// results[0] {'->'} result for 1.jpg</span>{'\n'}
          <span className="comment">// results[1] {'->'} result for 2.jpg</span>{'\n'}
          <span className="comment">// results[2] {'->'} result for 3.jpg</span>
        </div>

        <h2 id="cache">clearCache()</h2>
        <p>Clears the internal URL result cache. Use this when you want to force re-analysis of previously fetched images.</p>
        <div className="code-block">
          <span className="keyword">import</span> {'{'} clearCache {'}'} <span className="keyword">from</span> <span className="string">&apos;chromancy&apos;</span>;{'\n'}
          {'\n'}
          <span className="comment">// First call — analyzes the image</span>{'\n'}
          <span className="keyword">await</span> <span className="func">chromancy</span>(<span className="string">&apos;https://example.com/photo.jpg&apos;</span>);{'\n'}
          {'\n'}
          <span className="comment">// Second call — returns cached result instantly</span>{'\n'}
          <span className="keyword">await</span> <span className="func">chromancy</span>(<span className="string">&apos;https://example.com/photo.jpg&apos;</span>);{'\n'}
          {'\n'}
          <span className="comment">// Clear cache when needed</span>{'\n'}
          <span className="func">clearCache</span>();
        </div>

        <h2 id="utils">Utilities</h2>

        <h3>rgbToHex()</h3>
        <p>Converts an RGB string to a Hex string.</p>
        <div className="code-block">
          <span className="keyword">import</span> {'{'} rgbToHex {'}'} <span className="keyword">from</span> <span className="string">&apos;chromancy&apos;</span>;{'\n'}
          {'\n'}
          <span className="func">rgbToHex</span>(<span className="string">&apos;rgb(128, 64, 32)&apos;</span>);{'\n'}
          <span className="comment">// {'->'} &quot;#804020&quot;</span>
        </div>

        <h3>rgbToHsl()</h3>
        <p>Converts an RGB string to an HSL string.</p>
        <div className="code-block">
          <span className="keyword">import</span> {'{'} rgbToHsl {'}'} <span className="keyword">from</span> <span className="string">&apos;chromancy&apos;</span>;{'\n'}
          {'\n'}
          <span className="func">rgbToHsl</span>(<span className="string">&apos;rgb(128, 64, 32)&apos;</span>);{'\n'}
          <span className="comment">// {'->'} &quot;hsl(20, 43%, 31%)&quot;</span>
        </div>

        <h3>rgbToObject()</h3>
        <p>Converts an RGB string to an <code>{'{ r, g, b }'}</code> object.</p>
        <div className="code-block">
          <span className="keyword">import</span> {'{'} rgbToObject {'}'} <span className="keyword">from</span> <span className="string">&apos;chromancy&apos;</span>;{'\n'}
          {'\n'}
          <span className="func">rgbToObject</span>(<span className="string">&apos;rgb(128, 64, 32)&apos;</span>);{'\n'}
          <span className="comment">// {'->'} {'{'} r: 128, g: 64, b: 32 {'}'}</span>
        </div>

        <h2 id="options">Options</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Option</th><th>Type</th><th>Default</th><th className="col-description">Description</th></tr>
            </thead>
            <tbody>
              <tr><td><code>maxSize</code></td><td><code>number</code></td><td><code>100</code></td><td className="col-description">Maximum width or height (in pixels) to resize the image for analysis.</td></tr>
              <tr><td><code>quantizationLevel</code></td><td><code>number</code></td><td><code>32</code></td><td className="col-description">Color quantization level. Lower = more color bins (finer detail). Higher = less precision.</td></tr>
              <tr><td><code>sampleRate</code></td><td><code>number</code></td><td><code>0.1</code></td><td className="col-description">Fraction of pixels to sample (0 to 1). 0.5 = half of pixels.</td></tr>
              <tr><td><code>paletteSize</code></td><td><code>number</code></td><td><code>5</code></td><td className="col-description">Number of distinct colors in the palette. Set to 0 to disable.</td></tr>
              <tr><td><code>colorScale</code></td><td><code>number</code></td><td><code>0</code></td><td className="col-description">Normalizes and scales color intensity. 0 = no scaling.</td></tr>
              <tr><td><code>outputFormat</code></td><td><code>string</code></td><td><code>&apos;rgb&apos;</code></td><td className="col-description">Output format: <code>&apos;rgb&apos;</code>, <code>&apos;hex&apos;</code>, <code>&apos;hsl&apos;</code>, or <code>&apos;object&apos;</code>.</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="formats">Output Formats</h2>
        <div className="code-block">
          <span className="comment">// RGB (default)</span>{'\n'}
          <span className="keyword">const</span> rgb = <span className="keyword">await</span> <span className="func">chromancy</span>(url, {'{'} paletteSize: <span className="type">3</span> {'}'});{'\n'}
          <span className="comment">// rgb.averageColor  {'->'} &quot;rgb(128,64,32)&quot;</span>{'\n'}
          {'\n'}
          <span className="comment">// Hex</span>{'\n'}
          <span className="keyword">const</span> hex = <span className="keyword">await</span> <span className="func">chromancy</span>(url, {'{'} paletteSize: <span className="type">3</span>, outputFormat: <span className="string">&apos;hex&apos;</span> {'}'});{'\n'}
          <span className="comment">// hex.averageColor  {'->'} &quot;#804020&quot;</span>{'\n'}
          {'\n'}
          <span className="comment">// HSL</span>{'\n'}
          <span className="keyword">const</span> hsl = <span className="keyword">await</span> <span className="func">chromancy</span>(url, {'{'} paletteSize: <span className="type">3</span>, outputFormat: <span className="string">&apos;hsl&apos;</span> {'}'});{'\n'}
          <span className="comment">// hsl.averageColor  {'->'} &quot;hsl(20,43%,31%)&quot;</span>{'\n'}
          {'\n'}
          <span className="comment">// Object</span>{'\n'}
          <span className="keyword">const</span> obj = <span className="keyword">await</span> <span className="func">chromancy</span>(url, {'{'} paletteSize: <span className="type">3</span>, outputFormat: <span className="string">&apos;object&apos;</span> {'}'});{'\n'}
          <span className="comment">// obj.averageColor  {'->'} {'{'} r: 128, g: 64, b: 32 {'}'}</span>
        </div>

        <h2 id="types">TypeScript</h2>
        <p>Chromancy ships with built-in TypeScript definitions.</p>
        <div className="code-block">
          <span className="keyword">import</span> {'{'} chromancy, ChromancyOptions, ChromancyResult {'}'} <span className="keyword">from</span> <span className="string">&apos;chromancy&apos;</span>;{'\n'}
          {'\n'}
          <span className="keyword">const</span> options: ChromancyOptions = {'{'}{'\n'}
          {'  '}maxSize: <span className="type">150</span>,{'\n'}
          {'  '}quantizationLevel: <span className="type">16</span>,{'\n'}
          {'  '}sampleRate: <span className="type">0.2</span>,{'\n'}
          {'  '}paletteSize: <span className="type">5</span>,{'\n'}
          {'  '}outputFormat: <span className="string">&apos;hex&apos;</span>,{'\n'}
          {'}'};{'\n'}
          {'\n'}
          <span className="keyword">const</span> result: ChromancyResult = <span className="keyword">await</span> <span className="func">chromancy</span>(<span className="string">&apos;https://example.com/photo.jpg&apos;</span>, options);{'\n'}
          {'\n'}
          <span className="comment">// ChromancyResult shape:</span>{'\n'}
          <span className="comment">//   averageColor:  string</span>{'\n'}
          <span className="comment">//   dominantColor: string</span>{'\n'}
          <span className="comment">//   palette:       string[]</span>{'\n'}
          <span className="comment">//   properties:    {'{'} brightness, warmth, saturation, contrast {'}'}</span>
        </div>

        <h3>Next.js / SSR</h3>
        <p>Because Chromancy requires the browser&apos;s DOM, use dynamic import with <code>ssr: false</code>:</p>
        <div className="code-block">
          <span className="string">&apos;use client&apos;</span>;{'\n'}
          <span className="keyword">import</span> {'{'} useRef, useEffect {'}'} <span className="keyword">from</span> <span className="string">&apos;react&apos;</span>;{'\n'}
          {'\n'}
          <span className="keyword">export default function</span> ImageAnalyzer() {'{'}{'\n'}
          {'  '}<span className="keyword">const</span> imageRef = <span className="func">useRef</span>&lt;HTMLImageElement&gt;(<span className="keyword">null</span>);{'\n'}
          {'\n'}
          {'  '}<span className="func">useEffect</span>(() =&gt; {'{'}{'\n'}
          {'    '}<span className="keyword">async function</span> analyze() {'{'}{'\n'}
          {'      '}<span className="keyword">if</span> (!imageRef.current) <span className="keyword">return</span>;{'\n'}
          {'      '}<span className="keyword">const</span> {'{'} chromancy {'}'} = <span className="keyword">await</span> <span className="keyword">import</span>(<span className="string">&apos;chromancy&apos;</span>);{'\n'}
          {'      '}<span className="keyword">const</span> result = <span className="keyword">await</span> <span className="func">chromancy</span>(imageRef.current, {'{'} maxSize: <span className="type">150</span>, paletteSize: <span className="type">5</span> {'}'});{'\n'}
          {'      '}document.body.style.backgroundColor = result.dominantColor;{'\n'}
          {'    '}{'}'}{'\n'}
          {'    '}<span className="func">analyze</span>();{'\n'}
          {'  '}{'}'}, []);{'\n'}
          {'\n'}
          {'  '}<span className="keyword">return</span> ({'\n'}
          {'    '}&lt;img{'\n'}
          {'      '}ref={'{'}imageRef{'}'}{'\n'}
          {'      '}src=<span className="string">&quot;/your-image.jpg&quot;</span>{'\n'}
          {'      '}alt=<span className="string">&quot;Sample&quot;</span>{'\n'}
          {'      '}style={'{{'} maxWidth: <span className="string">&apos;100%&apos;</span>, height: <span className="string">&apos;auto&apos;</span> {'}}'}{'\n'}
          {'    '}/&gt;{'\n'}
          {'  '});{'\n'}
          {'}'}
        </div>

        <h2 id="browser">Browser Support</h2>
        <p>Chromancy uses browser DOM APIs (<code>canvas</code>, <code>document</code>) and works in all modern browsers.</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Chrome</th><th>Firefox</th><th>Safari</th><th>Edge</th></tr>
            </thead>
            <tbody>
              <tr><td>60+</td><td>60+</td><td>12+</td><td>79+</td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '16px' }}>
          <strong>Note:</strong> Cross-origin images require proper CORS headers. The library will throw an error if the image cannot be loaded due to CORS restrictions.
        </p>
      </div>
    </DocsContentStyled>
  )
}
