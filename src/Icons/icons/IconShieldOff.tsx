/** Do not edit this file directly. Edit the template in scripts/icon-template.ejs **/
import * as React from "react";
import PropTypes from "prop-types";
import { IconProps } from "../IconTypes";
import { useTheme } from "../../Theme/Providers";

export const IconShieldOff: React.FunctionComponent<IconProps> = ({
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
      <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18" />
      <path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
};

IconShieldOff.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
