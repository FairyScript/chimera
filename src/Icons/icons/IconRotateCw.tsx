/** Do not edit this file directly. Edit the template in scripts/icon-template.ejs **/
import * as React from "react";
import PropTypes from "prop-types";
import { IconProps } from "../IconTypes";
import { useTheme } from "../../Theme/Providers";

export const IconRotateCw: React.FunctionComponent<IconProps> = ({
  color: providedColor,
  size: providedSize = "md",
  ...other
}) => {
  const theme = useTheme();
  const size =
    typeof providedSize === "string"
      ? theme.iconSizes[providedSize]
      : providedSize;
  const color = providedColor || theme.colors.text.default;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
      {...other}
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
};

IconRotateCw.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
