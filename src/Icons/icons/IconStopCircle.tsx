/** Do not edit this file directly. Edit the template in scripts/icon-template.ejs **/
import * as React from "react";
import PropTypes from "prop-types";
import { IconProps } from "../IconTypes";
import { useTheme } from "../../Theme/Providers";

export const IconStopCircle: React.FunctionComponent<IconProps> = ({
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
      <circle cx="12" cy="12" r="10" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  );
};

IconStopCircle.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
