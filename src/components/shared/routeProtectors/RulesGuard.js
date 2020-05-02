import React from "react";
import { Redirect } from "react-router-dom";

/**
 *
 * Another way to export directly your functional component.
 */
export const RulesGuard = props => {
    return props.children
};