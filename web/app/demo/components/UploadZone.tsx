'use client'

import { useCallback } from 'react'
import styled from 'styled-components'
import { theme } from '@/app/styles/global'

const UploadZoneStyled = styled.div`
  .upload-zone {
    border: 1.5px solid ${theme.colors.border};
    border-radius: ${theme.radii.xl};
    padding: 56px 32px;
    text-align: center;
    cursor: pointer;
    transition: all ${theme.transition.slow};
    background: ${theme.colors.surface};
    position: relative;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }

  .upload-zone:hover,
  .upload-zone--dragover {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 1px ${theme.colors.accent}, 0 4px 24px rgba(0, 0, 0, 0.04);
  }

  .upload-zone__input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .upload-zone__icon {
    width: 48px;
    height: 48px;
    margin: 0 auto ${theme.spacing['6']};
    border: 1.5px solid ${theme.colors.border};
    border-radius: ${theme.radii.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color ${theme.transition.slow};
  }

  .upload-zone:hover .upload-zone__icon,
  .upload-zone--dragover .upload-zone__icon {
    border-color: ${theme.colors.accent};
  }

  .upload-zone__icon svg {
    width: 20px;
    height: 20px;
    stroke: ${theme.colors.muted};
    transition: stroke ${theme.transition.slow};
  }

  .upload-zone:hover .upload-zone__icon svg,
  .upload-zone--dragover .upload-zone__icon svg {
    stroke: ${theme.colors.accent};
  }

  .upload-zone__text {
    font-size: ${theme.fontSize.xl};
    color: ${theme.colors.fg};
    font-weight: 500;
    margin-bottom: ${theme.spacing['2']};
  }

  .upload-zone__hint {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.fontSize.md};
    color: ${theme.colors.muted};
    opacity: 0.7;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .upload-zone {
      padding: 40px 20px;
    }
  }
`

interface UploadZoneProps {
  onFileSelect: (file: File) => void
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('upload-zone--dragover')
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('upload-zone--dragover')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('upload-zone--dragover')
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) {
      onFileSelect(f)
    }
  }, [onFileSelect])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      onFileSelect(f)
    }
  }, [onFileSelect])

  return (
    <UploadZoneStyled>
      <div
        className="upload-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="upload-zone__input"
          accept="image/*"
          onChange={handleChange}
        />
        <div className="upload-zone__icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="upload-zone__text">Drop an image here, or click to browse</div>
        <div className="upload-zone__hint">JPG, PNG, GIF, WebP — up to 10MB</div>
      </div>
    </UploadZoneStyled>
  )
}
