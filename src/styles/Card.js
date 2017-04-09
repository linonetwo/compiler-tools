import styled from 'styled-components'

export const Card = styled.section`
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.15);
  background-color: #ffffff;
  padding: 20px;
  transition: box-shadow 200ms cubic-bezier(0.4, 1, 0.75, 0.9), -webkit-transform 200ms cubic-bezier(0.4, 1, 0.75, 0.9);
  transition: transform 200ms cubic-bezier(0.4, 1, 0.75, 0.9), box-shadow 200ms cubic-bezier(0.4, 1, 0.75, 0.9);
  transition: transform 200ms cubic-bezier(0.4, 1, 0.75, 0.9), box-shadow 200ms cubic-bezier(0.4, 1, 0.75, 0.9), -webkit-transform 200ms cubic-bezier(0.4, 1, 0.75, 0.9); }
  .pt-card.pt-dark,
  .pt-dark .pt-card {
    box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.4);
    background-color: #30404d;
  }
`
