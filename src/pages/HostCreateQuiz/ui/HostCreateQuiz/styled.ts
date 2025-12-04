import styled from 'styled-components'
export const PageWrapper = styled.div`
  padding-bottom: 80px; // Space for sticky footer
  min-height: 100vh;
  background-color: #f8f9fa;
`

export const Header = styled.div`
  background: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`

export const StickyFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  z-index: 100;
`
