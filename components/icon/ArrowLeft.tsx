import Svg, { Path } from "react-native-svg";

export default function ArrowLeft({
  color,
  width = 2,
}: {
  color: string;
  width?: number;
}) {
  return (
    <Svg width="25" height="30" viewBox="0 0 25 30" fill="none">
      <Path
        d="M6.24992 10L2.08325 15L6.24992 20"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 15H17"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
