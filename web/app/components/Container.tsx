'use client'

import styled from 'styled-components'
import { theme } from '@/app/styles/global'

const ContainerStyled = styled.div`
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing['9']};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .container {
      padding: 0 ${theme.spacing['7']};
    }
  }
`

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <ContainerStyled>
      <div className="container">{children}</div>
    </ContainerStyled>
  )
}
