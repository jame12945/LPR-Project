import { NavLink as Link } from 'react-router-dom'
import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'
//ไมาใช้
// ค่อยมาเปลี่ยนเป็นtailwind
export const NavBar = styled.nav`
  background: #34a0ff;
  height: 85px;
  display: flex;
  justify-content: space-between;
  padding: 0.2 rem calc((100vw-1000px) / 2);
`

export const NavLogo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  @media screen and (max-width: 768) {
    display: none;
  }
`
