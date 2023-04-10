import React from "react";
import { isNumberControl, rankWith } from "@jsonforms/core";
import { MuiInputNumber } from "./MuiInputNumber";
import { MaterialInputControl } from "@jsonforms/material-renderers";
import { withJsonFormsControlProps } from "@jsonforms/react";

export const MaterialNumberControl = (props) => (
  <MaterialInputControl {...props} input={MuiInputNumber} />
);

const tester = rankWith(5, isNumberControl);
const renderer = withJsonFormsControlProps(MaterialNumberControl);

const Renderer = { tester, renderer };
export default Renderer;
