import React from "react";
import styled from "styled-components";
import JustOneImage from "./JustOneLogo.jpeg";

const JustOneLogo = require("./logo.jpeg");

const Logo = styled.svg`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;
export const JustOneLogo = props => {
    return (
        <Logo viewBox="0 0 841.9 595.3" {...props}>
        </Logo>
    );
};
