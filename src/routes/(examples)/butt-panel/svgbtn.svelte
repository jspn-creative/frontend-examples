<script lang="ts">
  interface Props {
    isGlowing: boolean;
    toggleGlow: () => void;
    isTextured?: boolean;
    texture?: number;
  }

  let { isGlowing, toggleGlow, isTextured = false, texture = 1 }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 675 1200">
  <defs>
    <linearGradient id="linear-gradient" x1="-5.6" x2="-.8" y1="-16535.4" y2="-16535.4" gradientTransform="translate(6.35 -16534.31) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1a1917" />
      <stop offset=".5" stop-color="#1d201c" />
      <stop offset="1" stop-color="#131411" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-2" x1="7.7" x2="12.5" />
    <linearGradient id="linear-gradient-3" x1="1.1" x2="5.8" y1="-16535.5" y2="-16535.5" gradientTransform="translate(6.35 -16534.31) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4b4e45" />
      <stop offset=".5" stop-color="#5b5d55" />
      <stop offset="1" stop-color="#4c4c46" />
    </linearGradient>
    <linearGradient id="linear-gradient-4" x1="3.4" x2="3.4" y1="-16536.3" y2="-16540.1" gradientTransform="translate(6.35 -16534.31) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#181a17" />
      <stop offset="1" stop-color="#020503" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-5" x1="14.3" x2="19.1" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-6" x1="16.7" x2="16.7" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-7" y1="-16548.1" y2="-16548.1" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-8" x1="7.7" x2="12.5" y1="-16548.1" y2="-16548.1" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-9" y1="-16548.1" y2="-16548.1" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-10" y1="-16549" y2="-16552.8" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-11" x1="14.3" x2="19.1" y1="-16548.1" y2="-16548.1" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-12" x1="16.7" x2="16.7" y1="-16549" y2="-16552.8" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-13" x1="17191.6" x2="17196.4" y1="-16541.8" y2="-16541.8" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-14" x1="17204.9" x2="17209.7" y1="-16541.8" y2="-16541.8" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-15" x1="17198.3" x2="17203" y1="-16541.8" y2="-16541.8" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-16" x1="17200.6" x2="17200.6" y1="-16542.7" y2="-16546.5" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-17" x1="17211.5" x2="17216.3" y1="-16541.8" y2="-16541.8" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-18" x1="17213.9" x2="17213.9" y1="-16542.7" y2="-16546.5" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-19" x1="17191.6" x2="17196.4" y1="-16554.4" y2="-16554.4" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-20" x1="17204.9" x2="17209.7" y1="-16554.4" y2="-16554.4" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-21" x1="17198.3" x2="17203" y1="-16554.4" y2="-16554.4" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-22" x1="17200.6" x2="17200.6" y1="-16555.3" y2="-16559.1" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-23" x1="17211.5" x2="17216.3" y1="-16554.4" y2="-16554.4" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-24" x1="17213.9" x2="17213.9" y1="-16555.3" y2="-16559.1" gradientTransform="translate(17217.07 -16534.31) rotate(-180)" />
    <linearGradient id="linear-gradient-25" x1="299.8" x2="367.1" y1="516.6" y2="141.2" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#050505" />
      <stop offset="1" stop-color="#1F2320" />
    </linearGradient>
    <linearGradient id="linear-gradient-26" x1="337.5" x2="337.5" y1="479.8" y2="179" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#020302" />
      <stop offset=".7" stop-color="#171a17" />
      <stop offset="1" stop-color="#747570" />
    </linearGradient>
    <linearGradient id="linear-gradient-27" x1="337.5" x2="337.5" y1="404" y2="254.8" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#82857b" />
      <stop offset=".1" stop-color="#585a53" />
      <stop offset=".3" stop-color="#171a17" />
      <stop offset=".6" stop-color="#171a17" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="linear-gradient-28" x1="392.7" x2="392.7" y1="532.7" y2="290.2" gradientTransform="translate(-96.07 -124.83) scale(1.1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#161915" />
      <stop offset=".9" stop-color="#1d1f1d" />
    </linearGradient>
    <linearGradient id="linear-gradient-29" x1="285.8" x2="389.2" y1="329.8" y2="329.8" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#747570" />
      <stop offset=".5" stop-color="#52544f" />
      <stop offset="1" stop-color="#747570" />
    </linearGradient>
    <linearGradient id="linear-gradient-30" x1="493.2" x2="493.2" y1="1127.3" y2="948.6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#080a08" />
      <stop offset=".7" stop-color="#171a17" />
      <stop offset="1" stop-color="#444642" />
    </linearGradient>
    <linearGradient id="linear-gradient-31" x1="373" x2="613.4" y1="1037.9" y2="1037.9" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0c0e0c" />
      <stop offset="1" stop-color="#161915" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-32" x1="182.9" x2="182.9" y1="1128.3" y2="949.6" />
    <linearGradient id="linear-gradient-33" x1="62.7" x2="303.1" y1="1038.9" y2="1038.9" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#161915" />
      <stop offset="1" stop-color="#0c0e0c" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-34" y1="941" y2="762.3" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-35" y1="851.6" y2="851.6" />
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-36" x1="182.9" x2="182.9" y1="942" y2="763.3" />
    <linearGradient xlink:href="#linear-gradient-33" id="linear-gradient-37" y1="852.6" y2="852.6" />
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-38" x1="-400.5" x2="-400.5" y1="754.7" y2="519" gradientTransform="translate(95.3) rotate(-180) scale(1 -1)" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-39" x1="376.6" x2="617.7" y1="637.6" y2="637.6" />
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-40" x1="180.2" x2="180.2" y1="755.7" y2="520" />
    <linearGradient xlink:href="#linear-gradient-33" id="linear-gradient-41" x1="58.3" x2="299.3" y1="638.6" y2="638.6" />
    <linearGradient id="linear-gradient-42" x1="393.4" x2="393.4" y1="191.8" y2="91.1" gradientTransform="translate(899.55) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#080a08" />
      <stop offset=".7" stop-color="#090a09" />
      <stop offset="1" stop-color="#181a17" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-43" x1="393.4" x2="393.4" y1="187.8" y2="95.1" gradientTransform="translate(899.55) rotate(-180) scale(1 -1)" />
    <linearGradient id="linear-gradient-44" x1="500.6" x2="284.1" y1="141.4" y2="141.4" gradientTransform="translate(899.55) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#161915" />
      <stop offset="1" stop-color="#0c0e0c" />
    </linearGradient>
    <linearGradient id="linear-gradient-45" x1="424.2" x2="351.3" y1="62.6" y2="189" gradientTransform="translate(899.55) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#fff" stop-opacity=".2" />
    </linearGradient>
    <linearGradient id="linear-gradient-46" x1="168.9" x2="168.9" y1="191.8" y2="91.1" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#080a08" />
      <stop offset=".7" stop-color="#090a09" />
      <stop offset="1" stop-color="#181a17" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-47" x1="168.9" x2="168.9" y1="187.8" y2="95.1" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-48" x1="59.6" x2="276.1" y1="141.4" y2="141.4" />
    <linearGradient xlink:href="#linear-gradient-45" id="linear-gradient-49" x1="199.7" x2="126.7" y2="189" gradientTransform="matrix(1,0,0,1,0,0)" />
    <radialGradient id="radial-gradient" cx="392.7" cy="656.5" r="440.9" fx="392.7" fy="656.5" gradientTransform="translate(-96.07 -124.83) scale(1.1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1d201c" />
      <stop offset="1" stop-color="#050505" />
    </radialGradient>
    <radialGradient id="radial-gradient-2" cx="392.7" cy="656.5" r="440.9" fx="392.7" fy="656.5" gradientTransform="translate(-96.07 -849.65) scale(1.1 2.21)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1d211c" />
      <stop offset="1" stop-color="#0d0f0d" />
    </radialGradient>
    <radialGradient id="radial-gradient-3" cx="392.7" cy="411.6" r="157" fx="392.7" fy="411.6" gradientTransform="translate(-96.07 -33.94) scale(1.1 .88)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#252824" />
      <stop offset="1" stop-color="#0c0e0c" />
    </radialGradient>
    <radialGradient id="radial-gradient-4" cx="392.7" cy="411.4" r="113.5" fx="392.7" fy="411.4" gradientTransform="translate(-96.07 -33.98) scale(1.1 .88)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3d3e39" />
      <stop offset="1" stop-color="#181b18" />
    </radialGradient>
    <radialGradient id="radial-gradient-5" cx="-74.5" cy="1037.9" r="84.9" fx="-74.5" fy="1037.9" gradientTransform="translate(591.38) scale(1.32 1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#232723" />
      <stop offset="1" stop-color="#161816" />
    </radialGradient>
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-6" cx="2122.8" cy="1038.9" r="84.9" fx="2122.8" fy="1038.9" gradientTransform="translate(2979.73) rotate(-180) scale(1.32 -1)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-7" cy="851.6" r="84.9" fy="851.6" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-8" cx="2122.8" cy="852.6" r="84.9" fx="2122.8" fy="852.6" gradientTransform="translate(2979.73) rotate(-180) scale(1.32 -1)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-9" cx="2553.6" cy="637.6" r="99.4" fx="2553.6" fy="637.6" gradientTransform="translate(-2728.57) scale(1.26 1)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-10" cx="2093.9" cy="638.6" r="99.4" fx="2093.9" fy="638.6" gradientTransform="translate(2823.87) rotate(-180) scale(1.26 -1)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-11" cx="392.4" cy="141.4" r="81.3" fx="392.4" fy="141.4" gradientTransform="translate(899.55) rotate(-180) scale(1 -1)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-12" cx="167.8" cy="141.4" r="81.3" fx="167.8" fy="141.4" gradientTransform="matrix(1,0,0,1,0,0)" />
    <filter id="luminosity-noclip" width="695.3" height="1220.4" x="-10.1" y="-10.2" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-2" width="250.3" height="104.9" x="380.9" y="88.9" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-3" width="242.4" height="97" x="385" y="93" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-4" width="220.8" height="81.4" x="396.7" y="100.7" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-5" width="220.8" height="81.4" x="396.7" y="100.7" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-6" width="250.3" height="104.9" x="43.7" y="88.9" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-7" width="242.4" height="97" x="47.8" y="93" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-8" width="220.8" height="81.4" x="57.4" y="100.7" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-9" width="220.8" height="81.4" x="57.4" y="100.7" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-10" width="220.8" height="77.5" x="57.4" y="104.5" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <mask id="mask" width="695.3" height="1220.4" x="-10.1" y="-10.2" maskUnits="userSpaceOnUse" />
    <mask id="mask-1" width="250.3" height="104.9" x="380.9" y="88.9" maskUnits="userSpaceOnUse" />
    <mask id="mask-2" width="242.4" height="97" x="385" y="93" maskUnits="userSpaceOnUse" />
    <mask id="mask-3" width="220.8" height="81.4" x="396.7" y="100.7" maskUnits="userSpaceOnUse">
      <use xlink:href="#image" class="cls-8" transform="translate(396.72 100.7) scale(.24)" />
    </mask>
    <mask id="mask-4" width="220.8" height="81.4" x="396.7" y="100.7" maskUnits="userSpaceOnUse">
      <use xlink:href="#image" class="cls-13" transform="translate(396.72 100.7) scale(.24)" />
    </mask>
    <mask id="mask-5" width="250.3" height="104.9" x="43.7" y="88.9" maskUnits="userSpaceOnUse" />
    <mask id="mask-6" width="242.4" height="97" x="47.8" y="93" maskUnits="userSpaceOnUse" />
    <mask id="mask-7" width="220.8" height="81.4" x="57.4" y="100.7" maskUnits="userSpaceOnUse">
      <use xlink:href="#image-2" class="cls-14" transform="translate(57.36 100.7) scale(.24)" />
    </mask>
    <mask id="mask-8" width="220.8" height="81.4" x="57.4" y="100.7" maskUnits="userSpaceOnUse">
      <use xlink:href="#image-2" class="cls-10" transform="translate(57.36 100.7) scale(.24)" />
    </mask>
    <mask id="mask-9" width="220.8" height="77.5" x="57.4" y="104.5" maskUnits="userSpaceOnUse" />
    <clipPath id="clippath">
      <path
        d="M0 0v1200h675V0H0Zm574.5 365V237l62.8-62.8V356l-35.6 35.6-27.2-26.5ZM637 528.8l-59.4-59.4v-49l9.9-13.9 49.4 49.4.1 72.9ZM123.6 217.1l199.6-114.3c8.9-5.1 19.7-5.1 28.6 0L551.4 217v225.4c0 1.7-.7 3.2-2 4.3l-192 133.7a34.7 34.7 0 0 1-39.7 0L125.5 446.8c-1.2-1-2-2.6-2-4.3V217.1Zm-86-43 62.9 62.8V365l-27.2 26.6L37.7 356V174.1Zm59.9 246.2v49l-59.4 59.4.1-72.9 49.4-49.4 9.9 13.9Zm541.3 294c0 6.8-3.4 13.3-9.3 17.9l-.5.3-43.8 23.9a58 58 0 0 1 5.4 5.4l-.8 7.6 40.4 26.7c5.4 3.6 8.5 9 8.5 14.8V871c0 5.8-3 11.1-8.3 14.7L573 925l-1.5 13.7s.2 5 1.8 6.1l57 37.6c5.4 3.6 8.5 9 8.5 14.9v60c0 5.8-3 11.2-8.3 14.8l-86.6 59c-4.1 2.7-9.3 4.2-14.6 4.2H445c-5.3 0-10.4-1.5-14.5-4.2l-74.4-50c-5.3-3.6-8.4-9-8.4-14.8v-22.5h-19.3v23.5c0 5.8-3 11.2-8.4 14.8l-74.4 50c-4 2.7-9.2 4.2-14.5 4.2H147c-5.4 0-10.6-1.5-14.6-4.3l-86.7-59c-5.3-3.5-8.3-8.9-8.3-14.6v-60.1c0-5.9 3.1-11.3 8.6-14.9l57-37.6c1.6-1.1.6-7 .6-7l-1.5-13.6-56.4-38.4c-5.3-3.6-8.3-9-8.3-14.7v-60c0-6 3.1-11.3 8.6-15l39.4-26-1-9.2 5.1-5.1L47 733.5l-.5-.3c-6-4.6-9.3-11.1-9.3-18v-131c0-7 3.6-13.7 9.8-18.2l65.9-48.3c5-3.7 11.3-5.7 18-5.7h35.7c6.3 0 12.5 1.9 17.4 5.3l129 89.3c4.6 3.3 7.9 7.7 9.3 12.7h31.1a23.5 23.5 0 0 1 9.7-13.7l129-89.3c4.9-3.4 11-5.3 17.4-5.3h35.7c6.6 0 13 2 18 5.7L629 565a22.7 22.7 0 0 1 9.7 18.2v131Z"
        class="cls-1"
      />
    </clipPath>
    <pattern id="New_Pattern_3" width="26.2" height="25.7" x="0" y="0" data-name="New Pattern 3" patternTransform="translate(1970.94 3243.61) scale(1.1)" patternUnits="userSpaceOnUse">
      <path d="M0 0h26.2v25.7H0z" class="cls-1" />
      <path d="M0 0h26.2v25.7H0z" class="cls-54" />
      <path d="M.8.8h4.8v.7H.8z" class="cls-36" />
      <path d="M14 .8h4.8v.7H14z" class="cls-33" />
      <path d="M7.4.8h4.8v.7H7.4z" class="cls-32" />
      <path d="M7.4 2h4.8v3.8H7.4z" class="cls-31" />
      <path d="M20.7.8h4.8v.7h-4.8z" class="cls-28" />
      <path d="M20.7 2h4.8v3.8h-4.8z" class="cls-29" />
      <path d="M.8 13.4h4.8v.7H.8z" class="cls-27" />
      <path d="M14 13.4h4.8v.7H14z" class="cls-26" />
      <path d="M7.4 13.5h4.8v.7H7.4z" class="cls-30" />
      <path d="M7.4 14.7h4.8v3.8H7.4z" class="cls-66" />
      <path d="M20.7 13.5h4.8v.7h-4.8z" class="cls-67" />
      <path d="M20.7 14.7h4.8v3.8h-4.8z" class="cls-68" />
      <path d="M20.7 7.8h4.8v-.7h-4.8v.7z" class="cls-69" />
      <path d="M7.4 7.8h4.8v-.7H7.4v.7z" class="cls-71" />
      <path d="M14 7.8h4.8v-.7H14v.7z" class="cls-82" />
      <path d="M14 12.1h4.8V8.4H14v3.7z" class="cls-83" />
      <path d="M.8 7.8h4.7v-.7H.8v.7z" class="cls-84" />
      <path d="M.8 12.1h4.7V8.4H.8v3.7z" class="cls-85" />
      <path d="M20.7 20.4h4.8v-.6h-4.8v.6z" class="cls-70" />
      <path d="M7.4 20.4h4.8v-.6H7.4v.6z" class="cls-73" />
      <path d="M14 20.5h4.8v-.7H14v.7z" class="cls-72" />
      <path d="M14 24.8h4.8V21H14v3.8z" class="cls-74" />
      <path d="M.8 20.5h4.7v-.7H.8v.7z" class="cls-75" />
      <path d="M.8 24.8h4.7V21H.8v3.8z" class="cls-91" />
    </pattern>
    <style>
      .cls-1 {
        fill: none;
      }
      .cls-2 {
        mask: url(#mask);
      }
      .cls-3 {
        fill: #0f100f;
      }
      .cls-4 {
        filter: url(#luminosity-noclip);
      }
      .cls-5 {
        fill: #6a6b66;
      }
      .cls-6 {
        filter: url(#luminosity-noclip-10);
      }
      .cls-7 {
        filter: url(#luminosity-noclip-3);
      }
      .cls-8 {
        filter: url(#luminosity-noclip-4);
      }
      .cls-9 {
        filter: url(#luminosity-noclip-6);
      }
      .cls-10 {
        filter: url(#luminosity-noclip-9);
      }
      .cls-11 {
        filter: url(#luminosity-noclip-2);
      }
      .cls-12 {
        filter: url(#luminosity-noclip-7);
      }
      .cls-13 {
        filter: url(#luminosity-noclip-5);
      }
      .cls-14 {
        filter: url(#luminosity-noclip-8);
      }
      .cls-15 {
        fill: url(#radial-gradient-7);
      }
      .cls-16 {
        fill: url(#radial-gradient-6);
      }
      .cls-17 {
        fill: url(#radial-gradient-5);
      }
      .cls-18 {
        fill: url(#radial-gradient-4);
      }
      .cls-19 {
        fill: url(#radial-gradient-9);
      }
      .cls-20 {
        fill: url(#radial-gradient-8);
      }
      .cls-21 {
        fill: url(#radial-gradient-3);
      }
      .cls-22 {
        fill: url(#radial-gradient-2);
      }
      .cls-23,
      .cls-24,
      .cls-25 {
        opacity: 0.3;
      }
      .cls-23,
      .cls-25 {
        mix-blend-mode: hard-light;
      }
      .cls-26 {
        fill: url(#linear-gradient-8);
      }
      .cls-27 {
        fill: url(#linear-gradient-7);
      }
      .cls-28 {
        fill: url(#linear-gradient-5);
      }
      .cls-29 {
        fill: url(#linear-gradient-6);
      }
      .cls-30 {
        fill: url(#linear-gradient-9);
      }
      .cls-31 {
        fill: url(#linear-gradient-4);
      }
      .cls-32 {
        fill: url(#linear-gradient-3);
      }
      .cls-33 {
        fill: url(#linear-gradient-2);
      }
      .cls-34 {
        fill: #0d0f0d;
      }
      .cls-35 {
        fill: url(#radial-gradient);
      }
      .cls-36 {
        fill: url(#linear-gradient);
      }
      .cls-37 {
        opacity: 0.2;
      }
      .cls-24,
      .cls-25,
      .cls-37,
      .cls-38,
      .cls-39 {
        fill: #fff;
      }
      .cls-38 {
        opacity: 0.3;
      }
      .cls-40 {
        isolation: isolate;
      }
      .cls-41 {
        mask: url(#mask-2);
      }
      .cls-42 {
        mask: url(#mask-3);
      }
      .cls-43 {
        mask: url(#mask-4);
      }
      .cls-44 {
        mask: url(#mask-5);
      }
      .cls-45 {
        mask: url(#mask-7);
      }
      .cls-46 {
        mask: url(#mask-6);
      }
      .cls-47 {
        mask: url(#mask-1);
      }
      .cls-48 {
        mask: url(#mask-9);
      }
      .cls-49 {
        mask: url(#mask-8);
      }
      .cls-50 {
        fill: #020202;
      }
      .cls-51 {
        fill: url(#radial-gradient-12);
      }
      .cls-52 {
        fill: url(#radial-gradient-10);
      }
      .cls-53 {
        fill: url(#radial-gradient-11);
      }
      .cls-54 {
        fill: #000100;
      }
      .cls-55 {
        fill: #d92831;
      }
      .cls-56 {
        fill: url(#linear-gradient-43);
      }
      .cls-57 {
        fill: url(#linear-gradient-40);
      }
      .cls-58 {
        fill: url(#linear-gradient-41);
      }
      .cls-59 {
        fill: url(#linear-gradient-42);
      }
      .cls-60 {
        fill: url(#linear-gradient-49);
      }
      .cls-61 {
        fill: url(#linear-gradient-48);
      }
      .cls-62 {
        fill: url(#linear-gradient-45);
      }
      .cls-63 {
        fill: url(#linear-gradient-47);
      }
      .cls-64 {
        fill: url(#linear-gradient-44);
      }
      .cls-65 {
        fill: url(#linear-gradient-46);
      }
      .cls-66 {
        fill: url(#linear-gradient-10);
      }
      .cls-67 {
        fill: url(#linear-gradient-11);
      }
      .cls-68 {
        fill: url(#linear-gradient-12);
      }
      .cls-69 {
        fill: url(#linear-gradient-13);
      }
      .cls-70 {
        fill: url(#linear-gradient-19);
      }
      .cls-71 {
        fill: url(#linear-gradient-14);
      }
      .cls-72 {
        fill: url(#linear-gradient-21);
      }
      .cls-73 {
        fill: url(#linear-gradient-20);
      }
      .cls-74 {
        fill: url(#linear-gradient-22);
      }
      .cls-75 {
        fill: url(#linear-gradient-23);
      }
      .cls-76 {
        fill: url(#linear-gradient-28);
      }
      .cls-77 {
        fill: url(#linear-gradient-25);
      }
      .cls-78 {
        fill: url(#linear-gradient-32);
      }
      .cls-79 {
        fill: url(#linear-gradient-31);
      }
      .cls-80 {
        fill: url(#linear-gradient-33);
      }
      .cls-81 {
        fill: url(#linear-gradient-30);
      }
      .cls-82 {
        fill: url(#linear-gradient-15);
      }
      .cls-83 {
        fill: url(#linear-gradient-16);
      }
      .cls-84 {
        fill: url(#linear-gradient-17);
      }
      .cls-85 {
        fill: url(#linear-gradient-18);
      }
      .cls-86 {
        fill: url(#linear-gradient-35);
      }
      .cls-87 {
        fill: url(#linear-gradient-34);
      }
      .cls-88 {
        fill: url(#linear-gradient-36);
      }
      .cls-89 {
        fill: url(#linear-gradient-38);
      }
      .cls-90 {
        fill: url(#linear-gradient-27);
      }
      .cls-91 {
        fill: url(#linear-gradient-24);
      }
      .cls-92 {
        fill: url(#linear-gradient-26);
      }
      .cls-93 {
        fill: url(#linear-gradient-29);
      }
      .cls-94 {
        fill: url(#linear-gradient-37);
      }
      .cls-95 {
        fill: url(#linear-gradient-39);
      }
      .cls-96 {
        opacity: 0.5;
      }
      .cls-97 {
        opacity: 0.1;
      }
      .cls-98 {
        fill: url(#New_Pattern_3);
        mix-blend-mode: darken;
        opacity: 0.9;
      }
      .cls-99 {
        fill: #191919;
      }
      .cls-100 {
        clip-path: url(#clippath);
      }
    </style>
    <pattern id="distressed-metal-1" patternUnits="userSpaceOnUse" width="675" height="1200">
      <image href="https://cdn.midjourney.com/fae9b5dd-5867-4425-993b-cfd9fd04d685/0_0.png" width="675" height="1200" preserveAspectRatio="xMidYMid slice" opacity="0.4" style="mix-blend-mode: multiply; filter: brightness(0.5) contrast(1.5) saturate(0.8);" />
    </pattern>

    <pattern id="distressed-metal-2" patternUnits="userSpaceOnUse" width="675" height="1200">
      <image href="https://previews.123rf.com/images/timoshenkoanna/timoshenkoanna1609/timoshenkoanna160900435/62915726-distressed-overlay-texture-of-rusted-peeled-metal-grunge-background-abstract-halftone-vector-illustr.jpg" width="675" height="1200" preserveAspectRatio="none" opacity="0.45" style="mix-blend-mode: multiply; filter: brightness(0.2) contrast(1.2) saturate(0.6);" />
    </pattern>

    <pattern id="distressed-metal-3" patternUnits="userSpaceOnUse" width="675" height="1200">
      <image href="https://cdn.midjourney.com/f5345822-8818-4946-bef1-2310e538702c/0_0.png" width="675" height="1200" preserveAspectRatio="xMidYMid slice" opacity="0.45" style="mix-blend-mode: multiply; filter: brightness(0.7) contrast(1.2) saturate(0.6);" />
    </pattern>

    <pattern id="distressed-metal-4" patternUnits="userSpaceOnUse" width="675" height="1200">
      <image href="https://cdn.midjourney.com/27a5953b-cb7a-4998-845e-fc438275aa19/0_0.png" width="675" height="1200" preserveAspectRatio="xMidYMid slice" opacity="0.5" style="mix-blend-mode: overlay; filter: brightness(0.8) contrast(1.1) saturate(0.1);" />
    </pattern>

    <pattern id="distressed-metal-5" patternUnits="userSpaceOnUse" width="675" height="1200">
      <image href="https://cdn.midjourney.com/04037ac1-570f-46bf-8e46-8a38e2eec7d9/0_1.png" width="675" height="1200" preserveAspectRatio="xMidYMid slice" opacity="0.35" style="mix-blend-mode: multiply; filter: brightness(0.3) contrast(1.4) saturate(0.7);" />
    </pattern>

    <pattern id="distressed-metal-6" patternUnits="userSpaceOnUse" width="675" height="1200">
      <image href="https://cdn.midjourney.com/037ecb9a-238b-4a73-b102-fab6bc0fc2d2/0_3.png" width="675" height="1200" preserveAspectRatio="xMidYMid slice" opacity="0.6" style="mix-blend-mode: overlay; filter: brightness(0.25) contrast(1) saturate(0.4);" />
    </pattern>

    <pattern id="distressed-metal-7" patternUnits="userSpaceOnUse" width="675" height="1200">
      <image href="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcHg4MjUyMjAtaW1hZ2Utam9iNjMwLWYtbDBnMGEzcTIuanBn.jpg" width="675" height="1200" preserveAspectRatio="xMidYMid slice" opacity="0.4" style="mix-blend-mode: multiply; filter: brightness(0.6) contrast(1.3) saturate(0.7);" />
    </pattern>
  </defs>
  <g class="cls-40">
    <g id="butt-panel">
      <g id="bg">
        <path id="bg-2" d="M0 0h675v1200H0z" class="cls-35" data-name="bg" />
        <path id="mesh" d="M0 0h675v1200H0z" class="cls-98" />
        <g id="plate">
          <g id="bevel">
            <path
              d="M-8 1208V-8h691v1216H-8Zm119-257.4c-1.4.5-2.7 1-3.7 1.8l-57 37.6c-3.2 2.1-5 5-5 8.2v60.1c0 3.1 1.8 6 4.9 8.1l86.6 59a18 18 0 0 0 10.1 2.9h84.2c3.7 0 7.3-1 10-2.9l74.4-50c3.1-2.1 4.9-5 4.9-8.1v-31.6h35.3v30.6c0 3.1 1.7 6 4.9 8.1l74.4 50a18 18 0 0 0 10 2.9H529c3.8 0 7.4-1 10.1-3l86.7-59c3-2 4.8-4.9 4.8-8v-60.1c0-3.2-1.8-6-5-8.2l-57-37.6a16 16 0 0 0-3.6-1.8l-1.3-14.8 1.5-14.5 60.6-41.2c3-2.1 4.8-5 4.8-8v-60.2c0-3.2-1.8-6-5-8.2l-44.4-29.4 1-8.7-2.7-2.5-7.9-7.6 52.9-28.7c4-3 6.1-7.2 6.1-11.6v-131c0-4.5-2.3-8.8-6.4-11.8l-66-48.3a22.4 22.4 0 0 0-13.2-4.1h-35.7c-4.7 0-9.3 1.3-12.8 3.8l-129 89.4a15.4 15.4 0 0 0-6.5 9l-1.5 6h-43.3l-1.7-5.7c-1-3.2-3.2-6.1-6.3-8.3l-129-89.4a22.6 22.6 0 0 0-12.8-3.8h-35.7c-5 0-9.6 1.4-13.2 4.1l-66 48.3c-4 3-6.5 7.3-6.5 11.8v131c0 4.4 2.3 8.6 6.2 11.6l51.6 28-7.9 7.6-2.3 2.2L94 775l-43.6 28.7c-3.2 2.1-5 5-5 8.2V872c0 3.1 1.8 6 4.9 8.1l59.5 40.5 1.5 14.2-.2 15.8ZM322.2 574a26.6 26.6 0 0 0 30.6 0l190.6-132.7V221.8l-195.6-112a20.8 20.8 0 0 0-20.6 0l-195.6 112v219.4L322.2 574Zm-276-64.5L89.4 466v-43.2l-3-4L46.3 459v50.3Zm582.7 0-.1-50.3-40.4-40.4-2.9 4.1V466l43.4 43.4Zm-27.2-129 27.6-27.7V193.5l-46.8 46.7v121.5l19.2 18.7Zm-528.4 0 19.2-18.7V240.2l-46.8-46.7v159.2l27.6 27.7Z"
              class="cls-34"
            />
            <g class="cls-2">
              <g class="cls-96">
                <path
                  d="M-8 1208V-8h691v1216H-8Zm119-257.4c-1.4.5-2.7 1-3.7 1.8l-57 37.6c-3.2 2.1-5 5-5 8.2v60.1c0 3.1 1.8 6 4.9 8.1l86.6 59a18 18 0 0 0 10.1 2.9h84.2c3.7 0 7.3-1 10-2.9l74.4-50c3.1-2.1 4.9-5 4.9-8.1v-31.6h35.3v30.6c0 3.1 1.7 6 4.9 8.1l74.4 50a18 18 0 0 0 10 2.9H529c3.8 0 7.4-1 10.1-3l86.7-59c3-2 4.8-4.9 4.8-8v-60.1c0-3.2-1.8-6-5-8.2l-57-37.6a16 16 0 0 0-3.6-1.8l-1.3-14.8 1.5-14.5 60.6-41.2c3-2.1 4.8-5 4.8-8v-60.2c0-3.2-1.8-6-5-8.2l-44.4-29.4 1-8.7-2.7-2.5-7.9-7.6 52.9-28.7c4-3 6.1-7.2 6.1-11.6v-131c0-4.5-2.3-8.8-6.4-11.8l-66-48.3a22.4 22.4 0 0 0-13.2-4.1h-35.7c-4.7 0-9.3 1.3-12.8 3.8l-129 89.4a15.4 15.4 0 0 0-6.5 9l-1.5 6h-43.3l-1.7-5.7c-1-3.2-3.2-6.1-6.3-8.3l-129-89.4a22.6 22.6 0 0 0-12.8-3.8h-35.7c-5 0-9.6 1.4-13.2 4.1l-66 48.3c-4 3-6.5 7.3-6.5 11.8v131c0 4.4 2.3 8.6 6.2 11.6l51.6 28-7.9 7.6-2.3 2.2L94 775l-43.6 28.7c-3.2 2.1-5 5-5 8.2V872c0 3.1 1.8 6 4.9 8.1l59.5 40.5 1.5 14.2-.2 15.8ZM322.2 574a26.6 26.6 0 0 0 30.6 0l190.6-132.7V221.8l-195.6-112a20.8 20.8 0 0 0-20.6 0l-195.6 112v219.4L322.2 574Zm-276-64.5L89.4 466v-43.2l-3-4L46.3 459v50.3Zm582.7 0-.1-50.3-40.4-40.4-2.9 4.1V466l43.4 43.4Zm-27.2-129 27.6-27.7V193.5l-46.8 46.7v121.5l19.2 18.7Zm-528.4 0 19.2-18.7V240.2l-46.8-46.7v159.2l27.6 27.7Z"
                  class="cls-50"
                />
              </g>
            </g>
          </g>
          <g id="plate-face" class="cls-100">
            <path id="texture" d="M0 0h675v1200H0z" class="cls-22" style={isTextured ? `fill: #151714` : ""} />
            {#if isTextured}
              <path id="texture-overlay" d="M0 0h675v1200H0z" fill={`url(#distressed-metal-${texture})`} class="cls-100" style="opacity: 0.4;" />
              <path id="vignette" d="M0 0h675v1200H0z" class="cls-22 opacity-75 mix-blend-multiply invert" />
            {/if}
            <path
              id="bevel-2"
              d="M-8 1208V-8h691v1216H-8Zm131.7-261.7-12.7 4.3c-1.4.5-2.6 1-3.7 1.8l-57 37.6c-3.1 2.1-5 5-5 8.2v60.1c0 3.1 1.8 6 4.9 8.1l86.6 59a18 18 0 0 0 10.1 2.9h84.2c3.7 0 7.3-1 10-2.9l74.4-50c3.1-2.1 4.9-5 4.9-8.1v-31.6h35.3v30.6c0 3.1 1.7 6 4.9 8.1l74.4 50a18 18 0 0 0 10 2.9H529c3.8 0 7.4-1 10.1-3l86.7-59c3-2 4.8-4.9 4.8-8v-60.1c0-3.2-1.8-6-5-8.2l-57-37.6a16 16 0 0 0-3.6-1.8l-12.8-4.4 11.5-10.4 1.5-14.5 60.6-41.2c3-2.1 4.8-5 4.8-8v-60.2c0-3.2-1.8-6-5-8.2l-44.4-29.4 1-8.7-2.7-2.5-7.9-7.6 52.9-28.7c4-3 6.1-7.2 6.1-11.6v-131c0-4.5-2.3-8.8-6.4-11.8l-66-48.3a22.4 22.4 0 0 0-13.2-4.1h-35.7c-4.7 0-9.3 1.3-12.8 3.8l-129 89.4a15.4 15.4 0 0 0-6.5 9l-1.5 6h-43.3l-1.7-5.7c-1-3.2-3.2-6.1-6.3-8.3l-129-89.4a22.6 22.6 0 0 0-12.8-3.8h-35.7c-5 0-9.6 1.4-13.2 4.1l-66 48.3c-4 3-6.5 7.3-6.5 11.8v131c0 4.4 2.3 8.6 6.2 11.6l51.6 28-7.9 7.6-2.3 2.2L94 775l-43.6 28.7c-3.2 2.1-5 5-5 8.2V872c0 3.1 1.8 6 4.9 8.1l59.5 40.5 1.5 14.2 12.5 11.5Zm198.5-372.4a26.6 26.6 0 0 0 30.6 0l190.6-132.7V221.8l-195.6-112a20.8 20.8 0 0 0-20.6 0l-195.6 112v219.4L322.2 574Zm-276-64.5L89.4 466v-43.2l-3-4L46.3 459v50.3Zm582.7 0-.1-50.3-40.4-40.4-2.9 4.1V466l43.4 43.4Zm-27.2-129 27.6-27.7V193.5l-46.8 46.7v121.5l19.2 18.7Zm-528.4 0 19.2-18.7V240.2l-46.8-46.7v159.2l27.6 27.7Z"
              class="cls-1"
              data-name="bevel"
            />
          </g>
        </g>
      </g>
      <!-- Addition: -->
      <g class="extra-butt-bg">
        <path class="fill-white" d="M497.73,247.12c-.18-8.72-4.88-16.73-12.44-21.12l-135.22-78.52c-3.88-2.26-8.23-3.38-12.57-3.38-4.34,0-8.68,1.13-12.57,3.38l-135.23,78.52c-6.61,3.84-11.03,10.45-12.16,17.87-.02.15-.06.31-.08.46-.12.92-.18,1.85-.2,2.79,0,.17-.02.34-.02.52v112.12c0,26.11,12.29,50.7,33.18,66.36l112.05,84.04c4.45,3.34,9.73,5.01,15.02,5,5.28,0,10.57-1.67,15.02-5l112.05-84.04c20.89-15.67,33.18-40.25,33.18-66.36v-112.12c0-.17-.01-.34-.02-.52Z" />
      </g>
      <g id="butt-top" onclick={toggleGlow} class:active={isGlowing}>
        <g id="butt-bg">
          <path data-name="bevel-bg" d="M337.5 515.2v7.7c-7.2 0-14-2.3-19.7-6.6l-112-84a91.1 91.1 0 0 1-36.3-72.5V247a33.8 33.8 0 0 1 .4-4.3 32.6 32.6 0 0 1 16-23.4L321 140.8a32.8 32.8 0 0 1 32.9 0l135.2 78.5a33 33 0 0 1 16.3 27.7v112.8a91.1 91.1 0 0 1-36.3 72.5l-112 84a32.5 32.5 0 0 1-19.7 6.6v-7.7Z" class="cls-77" />
          <path d="M497.7 247.1a25 25 0 0 0-12.4-21.1L350 147.5a25 25 0 0 0-25.2 0L189.7 226a25 25 0 0 0-12.2 17.9v.4c-.2 1-.2 1.9-.2 2.8v112.7a83 83 0 0 0 33.1 66.3l112 84a24.9 24.9 0 0 0 30.1 0l112-84a83 83 0 0 0 33.2-66.3V247Z" class={isTextured ? "" : "cls-21"} data-name="butt-face" fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
          <path data-name="highlight" d="M497.7 247.1a25 25 0 0 0-12.4-21.1L350 147.5a25 25 0 0 0-25.2 0L189.7 226a25 25 0 0 0-12.2 17.9v.4c-.2 1-.2 1.9-.2 2.8v1.9-.5c0-1 0-1.8.2-2.8v-.4a25 25 0 0 1 12.2-17.9l135.2-78.5a25 25 0 0 1 25.2 0l135.2 78.5a25 25 0 0 1 12.4 21.1v.5-1.9Z" class="cls-24" />
        </g>
        <path id="bevel-3" d="M337.5 479.8c-6.1 0-12.2-2-17-5.7l-93.5-70a55.6 55.6 0 0 1-22.2-44.3v-85.4c0-15.6 8.4-30.1 22-38l88.6-51.5a44 44 0 0 1 44.2 0l88.6 51.5a44.1 44.1 0 0 1 22 38v85.4c0 17.3-8.3 33.8-22.2 44.2l-93.5 70.1c-4.8 3.7-10.9 5.7-17 5.7Z" class="cls-92" data-name="bevel" />
        <circle id="inner-bevel" cx="337.5" cy="329.4" r="74.6" class="cls-90" />
        <path id="active-face" d="m440 250.7-88.7-51.5c-8.5-4.9-19-4.9-27.6 0l-88.6 51.5c-8.5 5-13.7 14-13.7 23.7v85.4c0 12.2 5.8 23.7 15.5 31l93.5 70c4.2 3.2 10 3.2 14.2 0l93.5-70a38.8 38.8 0 0 0 15.5-31v-85.4c0-9.7-5.2-18.8-13.6-23.7ZM337.4 403a73.5 73.5 0 1 1 0-147 73.5 73.5 0 0 1 0 147Z" class="cls-18" />
        <path id="face" d="m440 250.7-88.7-51.5c-8.5-4.9-19-4.9-27.6 0l-88.6 51.5c-8.5 5-13.7 14-13.7 23.7v85.4c0 12.2 5.8 23.7 15.5 31l93.5 70c4.2 3.2 10 3.2 14.2 0l93.5-70a38.8 38.8 0 0 0 15.5-31v-85.4c0-9.7-5.2-18.8-13.6-23.7ZM337.4 403a73.5 73.5 0 1 1 0-147 73.5 73.5 0 0 1 0 147Z" class={isTextured ? "" : "cls-76"} style={isTextured ? `fill: url(#distressed-metal-${texture})` : ""} />
        <circle id="bg-3" cx="337.5" cy="329.4" r="65.1" class="cls-3" data-name="bg" />
        <path id="highlight" d="M337.5 404c43.5 0 62-35 62-35s-19.8 34-62 34-62-34-62-34 18.5 35 62 35Z" class="cls-38" />
        <path id="top-highlight" d="m440 249.6-88.7-51.5c-8.5-5-19-5-27.6 0l-88.6 51.5c-8.5 5-13.7 14-13.7 23.7v1.1c0-9.7 5.2-18.8 13.7-23.7l88.6-51.5c8.6-5 19-5 27.6 0l88.6 51.5c8.5 5 13.7 14 13.7 23.7v-1c0-9.8-5.2-18.9-13.7-23.8Z" class="cls-37" />
        <g id="SEAS_Logo" data-name="SEAS Logo">
          <path d="M335.2 278.3a51.7 51.7 0 0 0-36.1 86.2 52 52 0 0 0 85-12c16.9-34.9-10-76.4-49-74.2Zm10.7 24.8a28 28 0 0 0-25.3 5c-2.3 1.7-3.9 3.7-5.7 6-2.3-.4-4.4-1.2-6.6-1.9l8.6 15.7 15.2-9.1c0-.5-4.3-1.2-5-1.5-.4 0-.8-.1-.8-.6.4 0 .6-.2 1-.5a17.7 17.7 0 0 1 25 3c2.1 2.5 3 5.4 3.8 8.6l17.9 5c5.8 2.3 4.7 7.4 2.9 12.1a42 42 0 0 1-43.4 26.4A41.2 41.2 0 0 1 303 352c-.7-.5-5.6 3.3-6 2.9l4.7-18.3 18.4 4.8-5.5 3.7c2.2 3.9 6.1 7.5 10 9.5a28.4 28.4 0 0 0 36.5-8.7l6.8 1.6-8.6-15.4-15.1 8.7c-.6.4 0 .6.4.6 1.9.4 3.7 1.3 5.7 1.3.4.5-2 2.2-2.3 2.4a18 18 0 0 1-26.8-9.1c-.2-.7-.7-3.3-1-3.6-3.4-.8-6.7-2-10.1-3-2.6-.8-6.2-1.4-8.7-2.5a7 7 0 0 1-3.8-5.5c-.3-2.7 2.7-9.2 4-11.6 9-16.1 27.7-24.4 45.8-20.2a40.8 40.8 0 0 1 25.7 18.5l5.8-3c.1.3-1 4.3-1.2 5l-.7 2.4-3 11-18.3-4.8 1.4-1 4.4-2.7a27.5 27.5 0 0 0-15.7-11.9Z" class="cls-93" />
          <path d="M336.8 320.3c4.5-.8 7.8 3.3 6 7.5-.5 1-1.7 2-1.8 2.5-.5 2.9 1.6 10-3 10.1-4.7.3-2.6-7.3-3-10-.2-.8-1.2-1.3-1.6-2-2-3-.2-7.5 3.4-8.1Z" class="cls-55" />
        </g>
      </g>
      <g id="main-butts">
        <g id="butt-6">
          <path id="butt-bevel" d="M444.1 948.6H559c3.6 0 7.2 1 10 2.8l56.8 37.6c3.2 2.1 5 5 5 8.2v60.1c0 3-1.7 6-4.8 8.1l-86.6 59c-2.8 1.8-6.4 2.9-10.1 2.9H445c-3.7 0-7.3-1-10-2.9l-74.4-50c-3.1-2-4.9-5-4.9-8.1v-60.8c0-3.2 2-6.3 5.3-8.4l73.5-46c2.7-1.6 6.1-2.5 9.6-2.5Z" class="cls-81" />
          <path id="active-butt-face" d="M450.3 959.9h100.3c3.2 0 6.3.8 8.7 2.4l49.7 32.9c2.8 1.8 4.4 4.4 4.4 7.1v52.6c0 2.7-1.5 5.2-4.2 7l-75.8 51.6a15.8 15.8 0 0 1-8.8 2.5h-73.5c-3.3 0-6.4-.9-8.8-2.5l-65-43.7c-2.7-1.8-4.3-4.4-4.3-7.1v-53c0-3 1.7-5.6 4.6-7.4L442 962a16 16 0 0 1 8.4-2.3Z" class="cls-17" />
          <path id="butt-face" d="M450.3 959.9h100.3c3.2 0 6.3.8 8.7 2.4l49.7 32.9c2.8 1.8 4.4 4.4 4.4 7.1v52.6c0 2.7-1.5 5.2-4.2 7l-75.8 51.6a15.8 15.8 0 0 1-8.8 2.5h-73.5c-3.3 0-6.4-.9-8.8-2.5l-65-43.7c-2.7-1.8-4.3-4.4-4.3-7.1v-53c0-3 1.7-5.6 4.6-7.4L442 962a16 16 0 0 1 8.4-2.3Z" class={isTextured ? "" : "cls-79"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
          <g id="highlight-2" class="cls-23" data-name="highlight">
            <path d="m377.3 1001.8 64.2-40.2a16 16 0 0 1 8.4-2.3h100.3c3.2 0 6.3 1 8.7 2.5l49.8 32.9c1.1.8 2 1.7 2.8 2.7a11 11 0 0 0-2.4-2.2l-49.8-32.9a15.9 15.9 0 0 0-8.7-2.4H450.3c-3 0-6 .8-8.4 2.2l-64.3 40.2c-2.9 1.8-4.6 4.5-4.6 7.3 1 2.6-1.8 57 1.5 57.6-3.7-.8-1.1-55.5-1.8-58 0-3 1.7-5.6 4.6-7.4Z" class="cls-39" />
          </g>
          <path d="M460.6 1049.7v-23.5h16v4.5h-11v5.8h10v4.4h-10v8.8h-5ZM480 1028.8v-4.6h5v4.6h-5Zm.1 21v-18h4.7v18h-4.7ZM489.6 1043.2v-18.6h4.7v19c0 1.5.7 2.2 2.2 2.4v4c-4.6 0-6.9-2.2-6.9-6.8ZM500 1044.2v-7c0-3.6 1.8-5.5 5.5-5.5h4.4c3.7 0 5.5 1.9 5.5 5.6v5.2h-10.7v2c0 .8.4 1.1 1 1.1h9v2.6l-2 1.5h-7.2c-3.6 0-5.5-1.8-5.5-5.5Zm4.7-5.3h6v-2c0-.7-.3-1-1-1h-4c-.7 0-1 .3-1 1v2ZM519.5 1048.2v-2.6h7.8c.7 0 1.1-.4 1.1-1.3s-.3-1.3-1-1.5l-3.6-.6c-2.9-.5-4.3-2.1-4.3-5 0-3.6 1.8-5.4 5.5-5.4h5.2l2 1.5v2.5h-7c-.7 0-1.1.5-1.1 1.3 0 1 .3 1.5 1 1.6l3.7.6c2.9.5 4.3 2.1 4.3 5 0 3.6-1.9 5.4-5.5 5.4h-6.1l-2-1.5Z" class="cls-5" />
        </g>
        <g id="butt-5">
          <path id="butt-bevel-2" d="M232 949.6H117.2c-3.6 0-7.2 1-9.9 2.8l-57 37.6c-3.1 2.1-4.9 5-4.9 8.2v60.1c0 3 1.7 6 4.8 8.1l86.6 59c2.8 1.8 6.4 2.9 10.1 2.9h84.2c3.7 0 7.3-1 10-2.9l74.4-50c3.1-2 4.9-5 4.9-8.1v-60.8c0-3.2-2-6.3-5.3-8.4l-73.5-46a18.3 18.3 0 0 0-9.6-2.5Z" class="cls-78" data-name="butt-bevel" />
          <path id="active-butt-face-2" d="M225.8 960.9H125.5c-3.2 0-6.3.8-8.7 2.4l-49.7 32.9c-2.8 1.8-4.4 4.4-4.4 7.1v52.6c0 2.7 1.5 5.2 4.2 7l75.8 51.6c2.4 1.6 5.5 2.5 8.8 2.5H225c3.2 0 6.4-.9 8.8-2.5l65-43.7c2.7-1.8 4.3-4.4 4.3-7.1v-53c0-3-1.7-5.6-4.7-7.4L234.2 963a16 16 0 0 0-8.4-2.3Z" class="cls-16" data-name="active-butt-face" />
          <path id="butt-face-2" d="M225.8 960.9H125.5c-3.2 0-6.3.8-8.7 2.4l-49.7 32.9c-2.8 1.8-4.4 4.4-4.4 7.1v52.6c0 2.7 1.5 5.2 4.2 7l75.8 51.6c2.4 1.6 5.5 2.5 8.8 2.5H225c3.2 0 6.4-.9 8.8-2.5l65-43.7c2.7-1.8 4.3-4.4 4.3-7.1v-53c0-3-1.7-5.6-4.7-7.4L234.2 963a16 16 0 0 0-8.4-2.3Z" class={isTextured ? "" : "cls-80"} data-name="butt-face" fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
          <g id="highlight-3" class="cls-23" data-name="highlight">
            <path d="m298.8 1002.8-64.2-40.2a16 16 0 0 0-8.4-2.3H125.9c-3.2 0-6.3 1-8.7 2.5l-49.8 32.9c-1.1.8-2 1.7-2.8 2.7a11 11 0 0 1 2.5-2.2l49.7-32.9c2.4-1.6 5.5-2.4 8.7-2.4h100.3c3 0 6 .8 8.4 2.2l64.3 40.2c2.9 1.8 4.6 4.5 4.6 7.3-1 2.7 1.8 57-1.5 57.6 3.7-.8 1.1-55.5 1.8-58 0-3-1.7-5.6-4.6-7.4Z" class="cls-39" />
          </g>
          <path d="m137.4 1027 .7-.9h4.3l5.3 19h.6l5.3-19h4.3l.6 1-6.6 22.5H144l-6.6-22.5ZM161.5 1028.7v-4.6h4.9v4.6h-5Zm0 20.9v-18h4.8v18h-4.7ZM171 1044.1v-7c0-3.6 1.7-5.5 5.4-5.5h5.3v-7.2h4.7v25.2h-10c-3.7 0-5.5-1.8-5.5-5.5Zm4.6.3c0 .8.4 1.1 1 1.1h5v-9.8h-5c-.6 0-1 .4-1 1.1v7.6ZM191 1044.1v-7c0-3.6 1.8-5.5 5.5-5.5h4.4c3.7 0 5.5 1.9 5.5 5.6v5.2h-10.7v2c0 .8.3 1.1 1 1.1h9v2.6l-2 1.5h-7.2c-3.7 0-5.5-1.8-5.5-5.5Zm4.7-5.3h6v-2c0-.7-.3-1-1-1h-4c-.7 0-1 .3-1 1v2ZM210.8 1044.1v-7c0-3.6 1.8-5.5 5.5-5.5h4.7c3.7 0 5.5 1.9 5.5 5.6v6.9c0 3.7-1.8 5.5-5.5 5.5h-4.7c-3.7 0-5.6-1.8-5.6-5.5Zm4.6.3c0 .8.4 1.1 1.1 1.1h4.3c.7 0 1-.3 1-1v-7.7c0-.7-.3-1-1-1h-4.3c-.7 0-1 .3-1 1v7.6Z" class="cls-5" />
        </g>
        <g id="butt-4">
          <path id="butt-bevel-3" d="M444.1 762.3H559c3.6 0 7.2 1 10 2.8l56.8 37.6c3.2 2.1 5 5.1 5 8.2V871c0 3.1-1.7 6-4.8 8.1l-86.6 59c-2.8 1.9-6.4 2.9-10.1 2.9H445c-3.7 0-7.3-1-10-2.9l-74.4-50c-3.1-2-4.9-5-4.9-8.1v-60.7c0-3.3 2-6.4 5.3-8.4l73.5-46c2.7-1.7 6.1-2.6 9.6-2.6Z" class="cls-87" data-name="butt-bevel" />
          <path id="active-butt-face-3" d="M450.3 773.6h100.3c3.2 0 6.3.8 8.7 2.4L609 809c2.8 1.8 4.4 4.4 4.4 7.2v52.5c0 2.7-1.5 5.2-4.2 7l-75.8 51.6a15.8 15.8 0 0 1-8.8 2.5h-73.5c-3.3 0-6.4-.9-8.8-2.5l-65-43.7c-2.7-1.8-4.3-4.4-4.3-7v-53.2c0-2.8 1.7-5.5 4.6-7.3l64.3-40.2a16 16 0 0 1 8.4-2.2Z" class="cls-15" data-name="active-butt-face" />
          <path id="butt-face-3" d="M450.3 773.6h100.3c3.2 0 6.3.8 8.7 2.4L609 809c2.8 1.8 4.4 4.4 4.4 7.2v52.5c0 2.7-1.5 5.2-4.2 7l-75.8 51.6a15.8 15.8 0 0 1-8.8 2.5h-73.5c-3.3 0-6.4-.9-8.8-2.5l-65-43.7c-2.7-1.8-4.3-4.4-4.3-7v-53.2c0-2.8 1.7-5.5 4.6-7.3l64.3-40.2a16 16 0 0 1 8.4-2.2Z" class="cls-86" data-name="butt-face" style={isTextured ? `fill: url(#distressed-metal-${texture})` : ""} />
          <g id="highlight-4" class="cls-23" data-name="highlight">
            <path d="m377.3 815.5 64.2-40.2a16 16 0 0 1 8.4-2.2h100.3c3.2 0 6.3.8 8.7 2.4l49.8 32.9c1.1.8 2 1.7 2.8 2.7a11 11 0 0 0-2.4-2.2L559.3 776a15.9 15.9 0 0 0-8.7-2.4H450.3c-3 0-6 .8-8.4 2.2L377.6 816c-2.9 1.8-4.6 4.5-4.6 7.3 1 2.7-1.8 57 1.5 57.6-3.7-.7-1.1-55.4-1.8-58 0-2.9 1.7-5.6 4.6-7.4Z" class="cls-39" />
          </g>
          <path d="M451.3 856v-12c0-3.8 1.9-5.7 5.7-5.7h9.8l2.3 1.7v2.7h-11.9c-.7 0-1 .3-1 1v12.6c0 .7.3 1 1 1h7.7V852h-4.5v-4.5h9.4v14.3H457c-3.8 0-5.7-1.9-5.7-5.7ZM474.3 861.7v-25.1h4.7v7.2h5.3c3.6 0 5.5 1.8 5.5 5.5v12.4H485V849c0-.8-.4-1.1-1.1-1.1h-5v13.8h-4.7ZM494.3 856.2v-7c0-3.6 1.8-5.4 5.5-5.4h4.7c3.7 0 5.5 1.8 5.5 5.5v7c0 3.6-1.8 5.4-5.5 5.4h-4.7c-3.7 0-5.5-1.8-5.5-5.5Zm4.6.4c0 .7.4 1 1.1 1h4.3c.7 0 1-.3 1-1v-7.7c0-.7-.3-1-1-1H500c-.7 0-1 .3-1 1v7.7ZM514 860.2v-2.5h7.9c.7 0 1.1-.5 1.1-1.3s-.3-1.4-1-1.5l-3.6-.6c-2.9-.5-4.3-2.2-4.3-5 0-3.7 1.8-5.5 5.5-5.5h5.2l2 1.5v2.6h-7c-.7 0-1.1.4-1.1 1.3s.3 1.4 1 1.5l3.7.6c2.8.5 4.3 2.1 4.3 5 0 3.6-1.9 5.4-5.6 5.4h-6l-2-1.5ZM531.8 856.2v-18h4.7v5.6h5.8v4h-5.8v8.8c0 .7.3 1 1 1h5.2v2.6l-2 1.5h-3.4c-3.7 0-5.5-1.8-5.5-5.5Z" class="cls-5" />
        </g>
        <g id="butt-3">
          <path id="butt-bevel-4" d="M232 763.3H117.2c-3.6 0-7.2 1-9.9 2.8l-57 37.6c-3.1 2.1-4.9 5.1-4.9 8.2V872c0 3.1 1.7 6 4.8 8.1l86.6 59c2.8 1.9 6.4 2.9 10.1 2.9h84.2c3.7 0 7.3-1 10-2.9l74.4-50c3.1-2 4.9-5 4.9-8.1v-60.7c0-3.3-2-6.4-5.3-8.4l-73.5-46a18.3 18.3 0 0 0-9.6-2.6Z" class="cls-88" data-name="butt-bevel" />
          <path id="active-butt-face-4" d="M225.8 774.6H125.5c-3.2 0-6.3.8-8.7 2.4L67.1 810c-2.8 1.8-4.4 4.4-4.4 7.2v52.5c0 2.7 1.5 5.2 4.2 7l75.8 51.6c2.4 1.6 5.5 2.5 8.8 2.5H225c3.2 0 6.4-.9 8.8-2.5l65-43.7c2.7-1.8 4.3-4.4 4.3-7v-53.2c0-2.8-1.7-5.5-4.7-7.3l-64.2-40.2a16 16 0 0 0-8.4-2.2Z" class="cls-20" data-name="active-butt-face" />
          <path id="butt-face-4" d="M225.8 774.6H125.5c-3.2 0-6.3.8-8.7 2.4L67.1 810c-2.8 1.8-4.4 4.4-4.4 7.2v52.5c0 2.7 1.5 5.2 4.2 7l75.8 51.6c2.4 1.6 5.5 2.5 8.8 2.5H225c3.2 0 6.4-.9 8.8-2.5l65-43.7c2.7-1.8 4.3-4.4 4.3-7v-53.2c0-2.8-1.7-5.5-4.7-7.3l-64.2-40.2a16 16 0 0 0-8.4-2.2Z" class="cls-94" data-name="butt-face" style={isTextured ? `fill: url(#distressed-metal-${texture})` : ""} />
          <g id="highlight-5" class="cls-23" data-name="highlight">
            <path d="m298.8 816.5-64.2-40.2a16 16 0 0 0-8.4-2.2H125.9c-3.2 0-6.3.8-8.7 2.4l-49.8 32.9c-1.1.8-2 1.7-2.8 2.7a11 11 0 0 1 2.5-2.2l49.7-32.9c2.4-1.6 5.5-2.4 8.7-2.4h100.3c3 0 6 .8 8.4 2.2l64.3 40.2c2.9 1.8 4.6 4.5 4.6 7.3-1 2.7 1.8 57-1.5 57.6 3.7-.8 1.1-55.5 1.8-58 0-3-1.7-5.6-4.6-7.4Z" class="cls-39" />
          </g>
          <path d="m139.2 839 .6-.8h4.3l5.4 19h.5l5.4-19h4.3l.7.9-6.7 22.5h-7.8l-6.6-22.5ZM162 856.1v-7c0-3.6 1.9-5.4 5.5-5.4h4.8c3.7 0 5.5 1.8 5.5 5.5v7c0 3.6-1.8 5.4-5.5 5.4h-4.8c-3.6 0-5.5-1.8-5.5-5.5Zm4.7.4c0 .7.4 1 1.1 1h4.2c.8 0 1.1-.3 1.1-1v-7.7c0-.7-.3-1-1-1h-4.3c-.7 0-1 .3-1 1v7.7ZM182.3 840.7v-4.6h5v4.6h-5Zm.1 21v-18h4.7v18h-4.7ZM191.8 856.1v-7c0-3.6 1.8-5.4 5.5-5.4h6.3l2 1.5v2.5h-8c-.8 0-1.2.4-1.2 1.1v7.7c0 .7.4 1 1.1 1h8.1v2.6l-2 1.5h-6.3c-3.7 0-5.6-1.8-5.6-5.5ZM209.4 856.1v-7c0-3.6 1.8-5.4 5.5-5.4h4.4c3.7 0 5.5 1.8 5.5 5.5v5.2h-10.7v2c0 .8.3 1.1 1 1.1h9v2.6l-2 1.5h-7.2c-3.7 0-5.5-1.8-5.5-5.5Zm4.7-5.3h6v-2c0-.7-.4-1-1-1h-4c-.7 0-1 .3-1 1v2Z" class="cls-5" />
        </g>
        <g id="butt-2">
          <path id="butt-bevel-5" d="M509.4 519h35.8c4.9 0 9.6 1.5 13.2 4.1l65.9 48.3c4.1 3 6.5 7.3 6.5 11.8v131c0 4.4-2.2 8.6-6.2 11.6l-45.1 24.6a22.3 22.3 0 0 1-13.5 4.3H455.6c-4.8 0-9.5-1.4-13.1-4l-75.2-38.2c-4.1-3-6.5-7.4-6.5-12v-76.2c0-4.6 2.5-9 6.8-12l129-89.4c3.6-2.5 8.1-3.9 12.8-3.9Z" class="cls-89" data-name="butt-bevel" />
          <path id="active-butt-face-5" d="M513 534.4h28.2A20 20 0 0 1 553 538l58.9 43.2c3.7 2.7 5.8 6.5 5.8 10.5v117c0 3.9-2 7.6-5.5 10.3L571.9 737a20 20 0 0 1-12 3.9H452.1c-4.3 0-8.4-1.3-11.7-3.6l-56-29.4c-3.8-2.6-7.9-6.5-7.9-10.6v-65.9c0-4.1 2.2-8 6.1-10.7l118.9-82.8c3.2-2.2 7.2-3.4 11.4-3.4Z" class="cls-19" data-name="active-butt-face" />
          <path id="butt-face-5" d="M513 534.4h28.2A20 20 0 0 1 553 538l58.9 43.2c3.7 2.7 5.8 6.5 5.8 10.5v117c0 3.9-2 7.6-5.5 10.3L571.9 737a20 20 0 0 1-12 3.9H452.1c-4.3 0-8.4-1.3-11.7-3.6l-56-30.4c-3.8-2.6-7.9-6.5-7.9-10.6v-64.9c0-4.1 2.2-8 6.1-10.7l118.9-82.8c3.2-2.2 7.2-3.4 11.4-3.4Z" class={isTextured ? "" : "cls-95"} data-name="butt-face" fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
          <g id="highlight-6" d="M382.7 619.9 501.6 537c3.2-2.2 7.3-3.4 11.4-3.4h28.2a20 20 0 0 1 11.8 3.6l58.9 43.2c4 2.8 6 7 5.8 11.2 0-4-2.1-7.8-5.8-10.5L553 538a20 20 0 0 0-11.8-3.6h-28.1c-4.2 0-8.3 1.2-11.5 3.4l-118.9 82.8a13.3 13.3 0 0 0-6.1 10.7c-.2-4.3 2-8.6 6.1-11.4Z" class="cls-25" data-name="highlight" />
          <path
            d="M453.3 671.3V648h11c3.9 0 5.8 1.9 5.8 5.7v2a3 3 0 0 1-.7 2l-1.2 1.4 1.4 1.2c.8.6 1.1 1.5 1.1 2.7v2.7c0 3.8-1.9 5.7-5.7 5.7h-11.7Zm4.9-14.3h6c.6 0 1-.3 1-1v-2.7c0-.7-.4-1-1-1h-6v4.8Zm0 10h6.6c.7 0 1-.4 1-1.1v-3.4c0-.7-.3-1-1-1h-6.6v5.4ZM474.8 665.8v-7c0-3.6 1.9-5.4 5.5-5.4h4.5c3.6 0 5.5 1.8 5.5 5.5v5.2h-10.8v2c0 .8.4 1.2 1.1 1.2h9v2.5l-2 1.5h-7.3c-3.6 0-5.5-1.8-5.5-5.5Zm4.7-5.3h6v-2c0-.7-.3-1-1-1h-3.9c-.7 0-1 .3-1 1v2ZM499.4 671.3c-3.6 0-5.5-1.8-5.5-5.4s1.9-5.4 5.6-5.4h4.6v-2c0-.7-.3-1-1-1h-7.3v-2.6l2-1.5h5.5c3.7 0 5.5 1.8 5.5 5.5v12.4h-9.3Zm-.8-5.1c0 .7.4 1 1.1 1h4.4v-3h-4.4c-.7 0-1 .3-1 1v1ZM513.3 665.8v-7c0-3.6 1.9-5.4 5.5-5.4h6.4l2 1.5v2.6H519c-.7 0-1 .3-1 1v7.7c0 .7.3 1 1 1h8v2.6l-2 1.5h-6.3c-3.6 0-5.5-1.8-5.5-5.5ZM531 665.8v-7c0-3.6 1.8-5.4 5.4-5.4h4.8c3.7 0 5.5 1.8 5.5 5.5v7c0 3.6-1.8 5.4-5.5 5.4h-4.8c-3.6 0-5.5-1.8-5.5-5.5Zm4.6.4c0 .7.4 1 1.1 1h4.2c.8 0 1.1-.3 1.1-1v-7.7c0-.7-.3-1-1-1h-4.3c-.7 0-1 .3-1 1v7.7ZM551.3 671.3v-18h10c3.6 0 5.5 2 5.5 5.6v12.4H562v-12.7c0-.8-.4-1.1-1.1-1.1h-5v13.8h-4.7Z"
            class="cls-5"
          />
        </g>
        <g id="butt-1">
          <path id="butt-bevel-6" d="M166.5 520h-35.7c-4.9 0-9.6 1.5-13.2 4.1l-66 48.3c-4 3-6.4 7.3-6.4 11.8v131c0 4.4 2.2 8.6 6.1 11.6l45.2 24.6c3.6 2.8 8.4 4.3 13.5 4.3h120.4c4.8 0 9.5-1.4 13-4l65.2-38.2c4.2-3 6.6-7.4 6.6-12v-76.2c0-4.6-2.5-9-6.9-12l-129-89.4a22.6 22.6 0 0 0-12.8-3.9Z" class="cls-57" data-name="butt-bevel" />
          <path id="active-butt-face-6" d="M162.9 535.4h-28.2a20 20 0 0 0-11.8 3.6L64 582.2a13.2 13.2 0 0 0-5.7 10.5v117c0 3.9 2 7.6 5.5 10.3L104 738a20 20 0 0 0 12.1 3.9h107.6c4.3 0 8.5-1.3 11.7-3.6l56-29.4c3.8-2.6 8-6.5 8-10.6v-65.9c0-4.1-2.3-8-6.2-10.7l-118.9-82.8a20.2 20.2 0 0 0-11.4-3.4Z" class="cls-52" data-name="active-butt-face" />
          <path id="butt-face-6" d="M162.9 535.4h-28.2a20 20 0 0 0-11.8 3.6L64 582.2a13.2 13.2 0 0 0-5.7 10.5v117c0 3.9 2 7.6 5.5 10.3L104 738a20 20 0 0 0 12.1 3.9h107.6c4.3 0 8.5-1.3 11.7-3.6l56-30.4c3.8-2.6 8-6.5 8-10.6v-64.9c0-4.1-2.3-8-6.2-10.7l-118.9-82.8a20.2 20.2 0 0 0-11.4-3.4Z" class={isTextured ? "" : "cls-58"} data-name="butt-face" fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
          <g id="highlight-7" d="M293.2 620.9 174.3 538a20.2 20.2 0 0 0-11.4-3.4h-28.2a20 20 0 0 0-11.8 3.6L64 581.5c-3.9 2.8-6 7-5.7 11.2 0-4 2-7.8 5.7-10.5l59-43.2a20 20 0 0 1 11.7-3.6h28.2c4.2 0 8.3 1.2 11.4 3.4l119 82.8c3.8 2.7 6 6.6 6 10.7.3-4.3-2-8.6-6-11.4Z" class="cls-25" data-name="highlight" />
          <path d="M135.3 666.6v-12c0-3.8 2-5.7 5.8-5.7h9l2.3 1.7v2.7h-11.1c-.7 0-1 .3-1 1V667c0 .7.3 1 1 1h11.1v2.7l-2.3 1.7h-9c-3.8 0-5.7-1.9-5.7-5.7ZM156.6 672.3v-25.1h4.7v7.2h5.2c3.7 0 5.5 1.8 5.5 5.5v12.4h-4.7v-12.7c0-.8-.4-1.1-1-1.1h-5v13.8h-4.7ZM181.3 672.3c-3.7 0-5.5-1.8-5.5-5.4s1.8-5.4 5.5-5.4h4.7v-2c0-.7-.4-1-1-1h-7.3v-2.6l2-1.5h5.5c3.7 0 5.5 1.8 5.5 5.5v12.4h-9.4Zm-.8-5.1c0 .7.4 1 1 1h4.5v-3h-4.4c-.7 0-1.1.3-1.1 1v1ZM195.3 666.8v-18h4.7v5.6h5.9v4H200v8.8c0 .7.4 1 1.1 1h5.1v2.6l-2 1.5h-3.4c-3.6 0-5.5-1.8-5.5-5.5Z" class="cls-5" />
        </g>
        <g id="butt-pro-tr">
          <g id="butt-cutout">
            <path d="M500.5 191.8c-2 0-4.1-.6-5.9-1.6l-89-51.7c-1.6-.9-3-2.2-4-3.7L385 109.2a11.7 11.7 0 0 1 9.8-18.1H593c3.1 0 6 1.2 8.3 3.4l24.3 24.4a11.7 11.7 0 0 1 0 16.5l-52.9 53a11.7 11.7 0 0 1-8.3 3.4h-64Z" class="cls-59" />
            <g class="cls-47">
              <g class="cls-97">
                <path d="M500.5 191.8c-2 0-4.1-.6-5.9-1.6l-89-51.7c-1.6-.9-3-2.2-4-3.7L385 109.2a11.7 11.7 0 0 1 9.8-18.1H593c3.1 0 6 1.2 8.3 3.4l24.3 24.4a11.7 11.7 0 0 1 0 16.5l-52.9 53a11.7 11.7 0 0 1-8.3 3.4h-64Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="butt-bevel-7" data-name="butt-bevel">
            <path d="M564.5 187.8c2 0 4-.8 5.5-2.3l53-52.9a7.7 7.7 0 0 0 0-11l-24.4-24.2A7.7 7.7 0 0 0 593 95H394.8a7.7 7.7 0 0 0-6.5 12l16.6 25.5c.7 1 1.6 1.9 2.6 2.5l89.1 51.6c1.2.7 2.5 1 4 1h64Z" class="cls-56" />
            <g class="cls-41">
              <g class="cls-97">
                <path d="M564.5 187.8c2 0 4-.8 5.5-2.3l53-52.9a7.7 7.7 0 0 0 0-11l-24.4-24.2A7.7 7.7 0 0 0 593 95H394.8a7.7 7.7 0 0 0-6.5 12l16.6 25.5c.7 1 1.6 1.9 2.6 2.5l89.1 51.6c1.2.7 2.5 1 4 1h64Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="active-butt-face-7" data-name="active-butt-face">
            <path d="M562.5 180h-60.7a5 5 0 0 1-2.4-.6l-87-50.4c-.6-.4-1.2-1-1.6-1.6l-10.5-16c-3-4.7-1-8.6 4.7-8.6H591c1.3 0 2.5.5 3.4 1.4l19.5 19.5c2 2 2 5 0 6.9l-48 48c-1 1-2.2 1.5-3.5 1.5Z" class="cls-53" />
            <g class="cls-42">
              <g class="cls-97">
                <path d="M562.5 180h-60.7a5 5 0 0 1-2.4-.6l-87-50.4c-.6-.4-1.2-1-1.6-1.6l-10.5-16c-3-4.7-1-8.6 4.7-8.6H591c1.3 0 2.5.5 3.4 1.4l19.5 19.5c2 2 2 5 0 6.9l-48 48c-1 1-2.2 1.5-3.5 1.5Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="butt-face-7" data-name="butt-face">
            <path d="M562.5 180h-60.7a5 5 0 0 1-2.4-.6l-87-50.4c-.6-.4-1.2-1-1.6-1.6l-10.5-16c-3-4.7-1-8.6 4.7-8.6H591c1.3 0 2.5.5 3.4 1.4l19.5 19.5c2 2 2 5 0 6.9l-48 48c-1 1-2.2 1.5-3.5 1.5Z" class="cls-64" style={isTextured ? `fill: url(#distressed-metal-${texture})` : ""} />
            <g class="cls-43">
              <g class="cls-97">
                <path d="M562.5 180h-60.7a5 5 0 0 1-2.4-.6l-87-50.4c-.6-.4-1.2-1-1.6-1.6l-10.5-16c-3-4.7-1-8.6 4.7-8.6H591c1.3 0 2.5.5 3.4 1.4l19.5 19.5c2 2 2 5 0 6.9l-48 48c-1 1-2.2 1.5-3.5 1.5Z" class="cls-99" />
              </g>
            </g>
          </g>
          <path id="top-highlight-2" d="M399 107.2c.2-2.4 2.4-4 6-4H591c1.3 0 2.5.6 3.4 1.5 0 0 20.6 20 20.7 21 .3-2.3-20.7-22.1-20.7-22.1-.9-1-2.1-1.4-3.4-1.4H405c-4.1 0-6.4 2-6 5Z" class="cls-24" data-name="top-highlight" />
          <path id="bottom-highlight" d="M399 108.2c.2 1 .6 2 1.3 3.1l10.5 16.1a5 5 0 0 0 1.6 1.6l87 50.4c.7.4 1.5.6 2.4.6h60.7c1.3 0 2.5-.5 3.4-1.4l48.1-48a4.8 4.8 0 0 0 1.4-4c-.1 1-.6 2-1.4 2.9l-48 48c-1 1-2.2 1.4-3.5 1.4h-60.7c-.9 0-1.7-.2-2.4-.6l-87-50.4a5 5 0 0 1-1.6-1.6l-10.5-16a8 8 0 0 1-1.3-3.6v1.5Z" class="cls-62" />
          <path d="m473.3 142.3 5.4-17.6h5.9l5.4 17.6-.5.7h-3.2l-1-3.7H478l-1.2 3.7h-3.1l-.5-.8Zm5.8-6.5h5l-2.3-7.7h-.4l-2.3 7.7ZM492.3 143v-12.2c.6-1.2 1.9-1.8 3.7-1.8h2.9l1.6 1.2v2H497c-.5 0-.9 0-1 .4V143h-3.8ZM502.9 138.7v-5.4c0-2.9 1.4-4.3 4.3-4.3h4.9l1.6 1.2v2h-6.3c-.6 0-.9.2-.9.8v6c0 .5.3.8.9.8h6.3v2L512 143h-5c-2.8 0-4.2-1.4-4.2-4.3ZM516.8 143v-19.6h3.7v5.6h4c2.9 0 4.3 1.4 4.3 4.3v9.7h-3.6v-10c0-.6-.3-.8-.9-.8h-3.9V143h-3.6ZM532.5 126.7V123h3.8v3.6h-3.8Zm0 16.3v-14h3.7v14h-3.7ZM538.6 129.5l.4-.5h3.1l3.2 10.8h.3l3.2-10.8h3.2l.4.5L548 143h-5.3l-4.2-13.5ZM554.5 138.7v-5.4c0-2.9 1.5-4.3 4.3-4.3h3.5c2.8 0 4.3 1.4 4.3 4.3v4h-8.4v1.6c0 .6.3.9.8.9h7v2l-1.6 1.2h-5.6c-2.8 0-4.3-1.5-4.3-4.3Zm3.7-4.2h4.7V133c0-.5-.3-.8-.8-.8h-3c-.6 0-1 .2-1 .8v1.5Z" class="cls-5" />
        </g>
        <g id="butt-pro-tl">
          <g id="butt-cutout-2" data-name="butt-cutout">
            <path d="M110.5 191.8c-3.2 0-6.1-1.2-8.3-3.5l-53-52.9a11.6 11.6 0 0 1 0-16.5l24.4-24.4c2.2-2.2 5.1-3.4 8.3-3.4h198.3a11.7 11.7 0 0 1 9.8 18.1l-16.6 25.6c-1 1.5-2.4 2.8-4 3.8l-89 51.6c-1.8 1-3.9 1.6-6 1.6h-64Z" class="cls-65" />
            <g class="cls-44">
              <g class="cls-97">
                <path d="M110.5 191.8c-3.2 0-6.1-1.2-8.3-3.5l-53-52.9a11.6 11.6 0 0 1 0-16.5l24.4-24.4c2.2-2.2 5.1-3.4 8.3-3.4h198.3a11.7 11.7 0 0 1 9.8 18.1l-16.6 25.6c-1 1.5-2.4 2.8-4 3.8l-89 51.6c-1.8 1-3.9 1.6-6 1.6h-64Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="butt-bevel-8" data-name="butt-bevel">
            <path d="M110.5 187.8c-2 0-4-.8-5.5-2.3l-53-52.9a7.7 7.7 0 0 1 0-11l24.4-24.2A7.7 7.7 0 0 1 82 95h198.3a7.7 7.7 0 0 1 6.5 12L270 132.5c-.7 1-1.6 1.9-2.7 2.5l-89 51.6c-1.2.7-2.6 1-4 1h-64Z" class="cls-63" />
            <g class="cls-46">
              <g class="cls-97">
                <path d="M110.5 187.8c-2 0-4-.8-5.5-2.3l-53-52.9a7.7 7.7 0 0 1 0-11l24.4-24.2A7.7 7.7 0 0 1 82 95h198.3a7.7 7.7 0 0 1 6.5 12L270 132.5c-.7 1-1.6 1.9-2.7 2.5l-89 51.6c-1.2.7-2.6 1-4 1h-64Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="active-butt-face-8" data-name="active-butt-face">
            <path d="M112.5 180h60.7a5 5 0 0 0 2.4-.6l87-50.4c.6-.4 1.2-1 1.6-1.6l10.5-16c3-4.7 1-8.6-4.7-8.6H84c-1.3 0-2.5.5-3.4 1.4L61 123.7a4.8 4.8 0 0 0 0 6.9l48 48c1 1 2.2 1.5 3.5 1.5Z" class="cls-51" />
            <g class="cls-45">
              <g class="cls-97">
                <path d="M112.5 180h60.7a5 5 0 0 0 2.4-.6l87-50.4c.6-.4 1.2-1 1.6-1.6l10.5-16c3-4.7 1-8.6-4.7-8.6H84c-1.3 0-2.5.5-3.4 1.4L61 123.7a4.8 4.8 0 0 0 0 6.9l48 48c1 1 2.2 1.5 3.5 1.5Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="butt-face-8" data-name="butt-face">
            <path d="M112.5 180h60.7a5 5 0 0 0 2.4-.6l87-50.4c.6-.4 1.2-1 1.6-1.6l10.5-16c3-4.7 1-8.6-4.7-8.6H84c-1.3 0-2.5.5-3.4 1.4L61 123.7a4.8 4.8 0 0 0 0 6.9l48 48c1 1 2.2 1.5 3.5 1.5Z" class="cls-61" style={isTextured ? `fill: url(#distressed-metal-${texture})` : ""} />
            <g class="cls-49">
              <g class="cls-97">
                <path d="M112.5 180h60.7a5 5 0 0 0 2.4-.6l87-50.4c.6-.4 1.2-1 1.6-1.6l10.5-16c3-4.7 1-8.6-4.7-8.6H84c-1.3 0-2.5.5-3.4 1.4L61 123.7a4.8 4.8 0 0 0 0 6.9l48 48c1 1 2.2 1.5 3.5 1.5Z" class="cls-99" />
              </g>
            </g>
          </g>
          <path id="top-highlight-3" d="M276 107.2c-.2-2.4-2.4-4-6-4H84c-1.3 0-2.5.6-3.4 1.5 0 0-20.6 20-20.7 21-.4-1.7 20.7-22.1 20.7-22.1.9-1 2.1-1.4 3.4-1.4H270c4.1 0 6.4 2 6 5Z" class="cls-24" data-name="top-highlight" />
          <g id="bottom-highlight-2" data-name="bottom-highlight">
            <path d="M276 108.2c-.2 1-.6 2-1.3 3.1l-10.5 16.1a5 5 0 0 1-1.6 1.6l-87 50.4c-.7.4-1.5.6-2.4.6h-60.7c-1.3 0-2.5-.5-3.4-1.4l-48.1-48a4.8 4.8 0 0 1-1.4-4c.1 1 .6 2 1.4 2.9l48 48c1 1 2.2 1.4 3.5 1.4h60.7c.9 0 1.7-.2 2.4-.6l87-50.4a5 5 0 0 0 1.6-1.6l10.5-16a8 8 0 0 0 1.3-3.6v1.5Z" class="cls-60" />
            <g class="cls-48">
              <g class="cls-97">
                <path d="M276 108.2c-.2 1-.6 2-1.3 3.1l-10.5 16.1a5 5 0 0 1-1.6 1.6l-87 50.4c-.7.4-1.5.6-2.4.6h-60.7c-1.3 0-2.5-.5-3.4-1.4l-48.1-48a4.8 4.8 0 0 1-1.4-4c.1 1 .6 2 1.4 2.9l48 48c1 1 2.2 1.4 3.5 1.4h60.7c.9 0 1.7-.2 2.4-.6l87-50.4a5 5 0 0 0 1.6-1.6l10.5-16a8 8 0 0 0 1.3-3.6v1.5Z" class="cls-99" />
              </g>
            </g>
          </g>
          <path d="M122.8 143v-18.3h6.9c5 0 7.5 2.5 7.5 7.5v3.3c0 5-2.5 7.5-7.5 7.5h-7Zm3.8-3.5h3.3c2.3 0 3.5-1.1 3.5-3.4v-4.5c0-2.3-1.2-3.5-3.5-3.5h-3.3v11.4ZM140.6 143v-12.2c.7-1.2 2-1.8 3.8-1.8h2.8l1.6 1.2v2h-3.4c-.6 0-1 0-1.1.4V143h-3.7ZM151.3 126.7V123h3.9v3.6h-3.9Zm.1 16.3v-14h3.7v14h-3.7ZM157.5 129.5l.3-.5h3.2l3.2 10.8h.3l3.2-10.8h3.2l.3.5L167 143h-5.3l-4.2-13.5ZM173.4 138.7v-5.4c0-2.9 1.4-4.3 4.3-4.3h3.4c3 0 4.3 1.4 4.3 4.3v4h-8.3v1.6c0 .6.2.9.8.9h7v2l-1.6 1.2h-5.6c-2.9 0-4.3-1.5-4.3-4.3Zm3.7-4.2h4.7V133c0-.5-.3-.8-.8-.8h-3c-.6 0-1 .2-1 .8v1.5Z" class="cls-5" />
        </g>
      </g>
    </g>
  </g>
</svg>

<div class="absolute inset-0 [box-shadow:inset_0_0_17px_10px_#0E0F0D] pointer-events-none"></div>

<style>
  svg {
    @apply h-[80vh];
  }

  #butt-top,
  #butt-pro-tr,
  #butt-pro-tl,
  #butt-1,
  #butt-2,
  #butt-3,
  #butt-4,
  #butt-5,
  #butt-6 {
    [data-name~="butt-face"],
    #butt-face,
    #face {
      /* @apply opacity-0 transition-all duration-150; */
      opacity: 0.25;
      transition-property: opacity;
      transition-timing-function: cubic-bezier(0, 0, 0.14, 1);
      transition-duration: 350ms;
    }

    &:hover {
      [data-name~="butt-face"],
      #butt-face {
        opacity: 0.1;
      }
    }
  }
  /* 
  #butt-pro-tr,
  #butt-pro-tl {
    [data-name~="butt-face"],
    #butt-face {
      opacity: 0.05;
    }
    &:hover {
      [data-name~="butt-face"],
      #butt-face {
        opacity: 0.2;
      }
    }
  } */

  #butt-top {
    mask-image: linear-gradient(45deg, #000 35%, rgba(0, 0, 0, 0.95) 50%, #000 65%);
    mask-size: 800%;
    mask-position: 0;
    cursor: pointer;
    transition: mask-position 400ms ease;

    &:hover,
    &:focus {
      mask-position: 120%;
      #SEAS_Logo {
        @apply transition-all duration-150;
        transform: scale(1.01) translate(-0.2rem, -0.2rem);
      }

      #face {
        @apply transition-all duration-150;
      }
    }

    &.active {
      #SEAS_Logo {
        filter: drop-shadow(0 0 30px rgba(0, 107, 175, 0.6));
      }
    }
  }
</style>
