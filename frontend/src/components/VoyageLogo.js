// Import only the compiled primitives used by this logo. This avoids Metro
// traversing react-native-svg's unrelated filter exports on Windows.
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

export default function VoyageLogo({ size = 190 }) {
  return <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <Defs>
      <LinearGradient id="sky" x1="42" y1="28" x2="158" y2="173" gradientUnits="userSpaceOnUse"><Stop stopColor="#BFEAFF" /><Stop offset="1" stopColor="#58BCEB" /></LinearGradient>
      <LinearGradient id="glass" x1="40" y1="28" x2="165" y2="174" gradientUnits="userSpaceOnUse"><Stop stopColor="#FFFFFF" stopOpacity=".92" /><Stop offset="1" stopColor="#E1F4FF" stopOpacity=".5" /></LinearGradient>
    </Defs>
    <Circle cx="100" cy="100" r="85" fill="url(#glass)" stroke="#FFFFFF" strokeWidth="3" />
    <Circle cx="100" cy="100" r="68" fill="url(#sky)" opacity=".86" />
    <Path d="M31 104C62 75 93 63 124 66C148 69 163 79 176 91" stroke="#FFFFFF" strokeOpacity=".66" strokeWidth="1.4" />
    <Path d="M25 127C62 112 111 111 177 137" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="1.4" />
    <Path d="M68 31C88 59 94 103 79 168" stroke="#FFFFFF" strokeOpacity=".42" strokeWidth="1.4" />
    <Path d="M136 31C114 70 111 112 128 168" stroke="#FFFFFF" strokeOpacity=".42" strokeWidth="1.4" />
    <Path d="M100 53C82 53 68 66 68 84C68 107 100 133 100 133C100 133 132 107 132 84C132 66 118 53 100 53Z" fill="#FFFFFF" fillOpacity=".94" />
    <Circle cx="100" cy="84" r="10" fill="#1673B9" />
    <Circle cx="100" cy="84" r="4" fill="#F6FBFF" />
    <Path d="M55 147C70 135 82 137 94 148C106 160 119 160 145 145" stroke="#0B5D99" strokeOpacity=".58" strokeWidth="3" strokeLinecap="round" />
  </Svg>;
}
