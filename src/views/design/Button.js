import styled from "styled-components";

// only difference to Button is height
export const LogoutButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-size: 20px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: ${props => props.width || null};
  height: 50px;
  border: none;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  transition: all 0.3s ease;
  background: #BDAF7E;
  mix-blend-mode: normal;
`;

export const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-size: 20px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  transition: all 0.3s ease;
  background: #BDAF7E;
  mix-blend-mode: normal;
`;
