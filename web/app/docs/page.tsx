import styled from 'styled-components'
import { theme } from '@/app/styles/global'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import Container from '@/app/components/Container'
import Sidebar from './components/Sidebar'
import DocsContent from './components/DocsContent'

const DocsPageStyled = styled.div`
  .docs-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .docs-page__main {
    flex: 1;
  }

  .docs-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 24px;
    padding: 80px 0 40px;
  }

  .docs-layout > * {
    min-width: 0;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    .docs-layout {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
`

export default function DocsPage() {
  return (
    <DocsPageStyled>
      <div className="docs-page">
        <Nav />
        <main className="docs-page__main">
          <Container>
            <div className="docs-layout">
              <Sidebar />
              <DocsContent />
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </DocsPageStyled>
  )
}
