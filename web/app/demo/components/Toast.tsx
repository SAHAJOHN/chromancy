'use client'

import styled from 'styled-components'
import { theme } from '@/app/styles/global'

const ToastStyled = styled.div`
  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${theme.colors.fg};
    color: ${theme.colors.surface};
    padding: 10px 24px;
    border-radius: ${theme.radii.lg};
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 100;
  }

  .toast--show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`

interface ToastProps {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <ToastStyled>
      <div className={`toast ${visible ? 'toast--show' : ''}`}>{message}</div>
    </ToastStyled>
  )
}
