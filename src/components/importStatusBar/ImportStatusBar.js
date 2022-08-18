import React from 'react';
import { ProgressBar } from "@adobe/react-spectrum";

export function ImportStatusBar() {

  return (
    <ProgressBar label="Loading..." UNSAFE_style={{ width: "100%", maxWidth: "100%" }} isIndeterminate />
  );
}
