import styled from "styled-components";

export const DESKTOP_WIDTH = 1160;
export const SMALL_LAPTOPS_WIDTH = 970;
export const TABLETS_WIDTH = 750;
export const SMALL_WIDTH = 768;

//padding used to be 15
export const BaseContainer = styled.div`
  margin-left: auto;
  padding-left: 0px;
  margin-right: auto;
  padding-right: 0px;
  max-width: ${DESKTOP_WIDTH}px;
`;
