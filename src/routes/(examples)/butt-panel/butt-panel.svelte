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
    <linearGradient id="linear-gradient" x1="-5.6" x2="-.82" y1="-16535.42" y2="-16535.42" gradientTransform="matrix(1 0 0 -1 6.35 -16534.31)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1a1917" />
      <stop offset=".51" stop-color="#1d201c" />
      <stop offset="1" stop-color="#131411" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-2" x1="7.7" x2="12.47" />
    <linearGradient id="linear-gradient-3" x1="1.05" x2="5.83" y1="-16535.45" y2="-16535.45" gradientTransform="matrix(1 0 0 -1 6.35 -16534.31)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4b4e45" />
      <stop offset=".49" stop-color="#5b5d55" />
      <stop offset="1" stop-color="#4c4c46" />
    </linearGradient>
    <linearGradient id="linear-gradient-4" x1="3.44" x2="3.44" y1="-16536.35" y2="-16540.12" gradientTransform="matrix(1 0 0 -1 6.35 -16534.31)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#181a17" />
      <stop offset="1" stop-color="#020503" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-5" x1="14.34" x2="19.12" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-6" x1="16.73" x2="16.73" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-7" y1="-16548.09" y2="-16548.09" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-8" x1="7.7" x2="12.47" y1="-16548.09" y2="-16548.09" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-9" y1="-16548.11" y2="-16548.11" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-10" y1="-16549.01" y2="-16552.78" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-11" x1="14.34" x2="19.12" y1="-16548.11" y2="-16548.11" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-12" x1="16.73" x2="16.73" y1="-16549.01" y2="-16552.78" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-13" x1="17191.6" x2="17196.38" y1="-16541.76" y2="-16541.76" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-14" x1="17204.9" x2="17209.68" y1="-16541.76" y2="-16541.76" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-15" x1="17198.25" x2="17203.03" y1="-16541.78" y2="-16541.78" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-16" x1="17200.64" x2="17200.64" y1="-16542.68" y2="-16546.45" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-17" x1="17211.55" x2="17216.33" y1="-16541.78" y2="-16541.78" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-18" x1="17213.94" x2="17213.94" y1="-16542.68" y2="-16546.45" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-19" x1="17191.6" x2="17196.38" y1="-16554.42" y2="-16554.42" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient" id="linear-gradient-20" x1="17204.9" x2="17209.68" y1="-16554.42" y2="-16554.42" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-21" x1="17198.25" x2="17203.03" y1="-16554.44" y2="-16554.44" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-22" x1="17200.64" x2="17200.64" y1="-16555.34" y2="-16559.12" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient-3" id="linear-gradient-23" x1="17211.55" x2="17216.33" y1="-16554.44" y2="-16554.44" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient xlink:href="#linear-gradient-4" id="linear-gradient-24" x1="17213.94" x2="17213.94" y1="-16555.34" y2="-16559.12" gradientTransform="rotate(-180 8608.535 -8267.155)" />
    <linearGradient id="linear-gradient-25" x1="299.76" x2="367.12" y1="586.65" y2="211.16" gradientUnits="userSpaceOnUse">
      <stop offset="0" />
      <stop offset="1" stop-color="#0E0F0D" />
      <!-- <stop offset="1" stop-color="#171916" /> -->
    </linearGradient>
    <linearGradient id="linear-gradient-26" x1="337.5" x2="337.5" y1="549.82" y2="248.97" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#080a08" />
      <stop offset=".66" stop-color="#171a17" />
      <stop offset="1" stop-color="#747570" />
    </linearGradient>
    <linearGradient id="linear-gradient-27" x1="337.5" x2="337.5" y1="474" y2="324.79" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#82857b" />
      <stop offset=".05" stop-color="#585a53" />
      <stop offset=".28" stop-color="#171a17" />
      <stop offset=".55" stop-color="#171a17" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="linear-gradient-28" x1="392.72" x2="392.72" y1="596.08" y2="353.58" gradientTransform="matrix(1.1 0 0 1.1 -96.07 -124.83)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#161915" />
      <stop offset=".94" stop-color="#1d1f1d" />
    </linearGradient>
    <linearGradient id="linear-gradient-29" x1="285.78" x2="389.22" y1="399.82" y2="399.82" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#747570" />
      <stop offset=".5" stop-color="#52544f" />
      <stop offset="1" stop-color="#747570" />
    </linearGradient>
    <linearGradient id="linear-gradient-30" x1="493.21" x2="493.21" y1="1167.27" y2="988.59" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#080a08" />
      <stop offset=".66" stop-color="#171a17" />
      <stop offset="1" stop-color="#444642" />
    </linearGradient>
    <linearGradient id="linear-gradient-31" x1="493.21" x2="493.21" y1="1156.01" y2="999.85" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0c0e0c" stop-opacity="0" />
      <stop offset="1" stop-color="#fff" stop-opacity=".6" />
    </linearGradient>
    <linearGradient id="linear-gradient-32" x1="373.04" x2="613.37" y1="1077.93" y2="1077.93" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0c0e0c" />
      <stop offset="1" stop-color="#161915" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-33" x1="182.9" x2="182.9" y1="1168.27" y2="989.59" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-34" x1="182.9" x2="182.9" y1="1157.01" y2="1000.85" />
    <linearGradient id="linear-gradient-35" x1="62.73" x2="303.06" y1="1078.93" y2="1078.93" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#161915" />
      <stop offset="1" stop-color="#0c0e0c" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-36" x1="182.9" x2="182.9" y1="1157.01" y2="1000.85" />
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-37" y1="980.99" y2="802.31" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-38" y1="969.73" y2="813.57" />
    <linearGradient xlink:href="#linear-gradient-32" id="linear-gradient-39" y1="891.65" y2="891.65" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-40" y1="969.73" y2="813.57" />
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-41" x1="182.9" x2="182.9" y1="981.99" y2="803.31" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-42" x1="182.9" x2="182.9" y1="970.73" y2="814.57" />
    <linearGradient xlink:href="#linear-gradient-35" id="linear-gradient-43" y1="892.65" y2="892.65" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-44" x1="182.9" x2="182.9" y1="970.73" y2="814.57" />
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-45" x1="-400.48" x2="-400.48" y1="794.71" y2="559" gradientTransform="matrix(-1 0 0 1 95.3 0)" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-46" x1="497.14" x2="497.14" y1="780.76" y2="574.36" />
    <linearGradient xlink:href="#linear-gradient-32" id="linear-gradient-47" x1="376.6" x2="617.68" y1="677.56" y2="677.56" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-48" x1="497.14" x2="497.14" y1="780.76" y2="574.36" />
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-49" x1="180.16" x2="180.16" y1="795.71" y2="560" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-50" x1="178.8" x2="178.8" y1="781.76" y2="575.36" />
    <linearGradient xlink:href="#linear-gradient-35" id="linear-gradient-51" x1="58.26" x2="299.34" y1="678.56" y2="678.56" />
    <linearGradient xlink:href="#linear-gradient-31" id="linear-gradient-52" x1="178.8" x2="178.8" y1="781.76" y2="575.36" />
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-53" x1="393.43" x2="393.43" y1="212.78" y2="120.09" gradientTransform="matrix(-1 0 0 1 899.55 0)" />
    <linearGradient id="linear-gradient-54" x1="507.19" x2="507.19" y1="205.05" y2="127.82" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity=".4" />
      <stop offset=".72" stop-color="#0c0e0c" stop-opacity="0" />
      <stop offset="1" stop-color="#fff" stop-opacity=".4" />
    </linearGradient>
    <linearGradient id="linear-gradient-55" x1="500.62" x2="284.11" y1="166.43" y2="166.43" gradientTransform="matrix(-1 0 0 1 899.55 0)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#161915" />
      <stop offset="1" stop-color="#0c0e0c" />
    </linearGradient>
    <linearGradient xlink:href="#linear-gradient-30" id="linear-gradient-56" x1="168.88" x2="168.88" y1="212.78" y2="120.09" />
    <linearGradient xlink:href="#linear-gradient-54" id="linear-gradient-57" x1="167.81" x2="167.81" />
    <linearGradient xlink:href="#linear-gradient-32" id="linear-gradient-58" x1="59.56" x2="276.07" y1="166.43" y2="166.43" />
    <linearGradient xlink:href="#linear-gradient-54" id="linear-gradient-59" x1="167.81" x2="167.81" />
    <radialGradient id="radial-gradient" cx="392.72" cy="656.53" r="440.91" fx="392.72" fy="656.53" gradientTransform="matrix(1.1 0 0 1.1 -96.07 -124.83)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1d201c" />
      <stop offset="1" stop-color="#050505" />
    </radialGradient>
    <radialGradient id="radial-gradient-2" cx="337.5" cy="600" r="486.78" fx="337.5" fy="600" gradientTransform="matrix(1 0 0 2 0 -600)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1d211c" />
      <stop offset=".46" stop-color="#161915" />
    </radialGradient>
    <radialGradient id="radial-gradient-3" cx="392.72" cy="475.04" r="157.02" fx="392.72" fy="475.04" gradientTransform="matrix(1.1 0 0 .88 -96.07 -19.94)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#252824" />
      <stop offset="1" stop-color="#0c0e0c" />
    </radialGradient>
    <radialGradient id="radial-gradient-4" cx="392.72" cy="474.83" r="113.48" fx="392.72" fy="474.83" gradientTransform="matrix(1.1 0 0 .88 -96.07 -19.98)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3d3e39" />
      <stop offset="1" stop-color="#232723" />
    </radialGradient>
    <radialGradient id="radial-gradient-5" cx="-74.51" cy="1077.93" r="84.9" fx="-74.51" fy="1077.93" gradientTransform="matrix(1.32 0 0 1.32 591.38 -342.25)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#232723" />
      <stop offset="1" stop-color="#161816" />
    </radialGradient>
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-6" cx="2122.82" cy="1078.93" r="84.9" fx="2122.82" fy="1078.93" gradientTransform="matrix(1.32 0 0 -1.32 -2613.94 2500.43)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-7" cy="891.65" r="84.9" fy="891.65" gradientTransform="matrix(1.32 0 0 1.32 591.38 -283.11)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-8" cx="2122.82" cy="892.65" r="84.9" fx="2122.82" fy="892.65" gradientTransform="matrix(1.32 0 0 -1.32 -2613.94 2068.72)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-9" cx="2553.56" cy="677.56" r="99.39" fx="2553.56" fy="677.56" gradientTransform="matrix(1.26 0 0 1.26 -2728.57 -178.35)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-10" cx="2093.91" cy="678.56" r="99.39" fx="2093.91" fy="678.56" gradientTransform="matrix(-1.26 0 0 1 2823.87 0)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-11" cx="392.37" cy="166.43" r="81.27" fx="392.37" fy="166.43" gradientTransform="matrix(-1 0 0 1 899.55 0)" />
    <radialGradient xlink:href="#radial-gradient-5" id="radial-gradient-12" cx="167.81" cy="166.43" r="81.27" fx="167.81" fy="166.43" />
    <filter id="luminosity-noclip" width="679.2" height="1204.08" x="-2.16" y="-2.02" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-2" width="242.4" height="96.96" x="384.96" y="118.02" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-3" width="220.8" height="81.6" x="396.72" y="125.66" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-4" width="220.8" height="81.6" x="396.72" y="125.66" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-5" width="242.4" height="96.96" x="47.76" y="118.02" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-6" width="220.8" height="81.6" x="57.36" y="125.66" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <filter id="luminosity-noclip-7" width="220.8" height="81.6" x="57.36" y="125.66" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-color="#fff" result="bg" />
      <feBlend in="SourceGraphic" in2="bg" />
    </filter>
    <mask id="mask" width="679.2" height="1204.08" x="-2.16" y="-2.02" maskUnits="userSpaceOnUse" />
    <mask id="mask-1" width="242.4" height="96.96" x="384.96" y="118.02" maskUnits="userSpaceOnUse" />
    <mask id="mask-2" width="220.8" height="81.6" x="396.72" y="125.66" maskUnits="userSpaceOnUse">
      <use xlink:href="#image" class="cls-6" transform="matrix(.24 0 0 .24 396.72 125.66)" />
    </mask>
    <mask id="mask-3" width="220.8" height="81.6" x="396.72" y="125.66" maskUnits="userSpaceOnUse">
      <use xlink:href="#image" class="cls-7" transform="matrix(.24 0 0 .24 396.72 125.66)" />
    </mask>
    <mask id="mask-4" width="242.4" height="96.96" x="47.76" y="118.02" maskUnits="userSpaceOnUse" />
    <mask id="mask-5" width="220.8" height="81.6" x="57.36" y="125.66" maskUnits="userSpaceOnUse">
      <use xlink:href="#image-2" class="cls-8" transform="matrix(.24 0 0 .24 57.36 125.66)" />
    </mask>
    <mask id="mask-6" width="220.8" height="81.6" x="57.36" y="125.66" maskUnits="userSpaceOnUse">
      <use xlink:href="#image-2" class="cls-10" transform="matrix(.24 0 0 .24 57.36 125.66)" />
    </mask>
    <clipPath id="clippath">
      <path d="M0 0v1200h675V0H0Zm574.54 415.05V286.93l62.77-62.77v181.89l-35.57 35.57-27.2-26.56Zm62.37 163.66L577.5 532.3v-62.02l9.9-15.87 49.38 41.39.12 82.9ZM123.57 267.13l199.64-114.36a28.753 28.753 0 0 1 28.58 0l199.64 114.36v225.38c0 1.65-.72 3.21-1.98 4.27l-192.13 133.7a34.732 34.732 0 0 1-39.66 0l-192.13-133.7a5.584 5.584 0 0 1-1.98-4.27V267.13Zm-85.89-42.98 62.77 62.77v128.12l-27.2 26.56-35.57-35.57V224.14ZM97.5 470.28v62.02l-59.41 46.41.12-82.9 49.38-41.39 9.9 15.87Z" class="cls-1" />
    </clipPath>
    <pattern id="New_Pattern_3" width="26.17" height="25.7" x="0" y="0" data-name="New Pattern 3" patternTransform="matrix(1.1 0 0 1.1 1970.94 3243.61)" patternUnits="userSpaceOnUse">
      <path d="M0 0h26.17v25.7H0z" class="cls-1" />
      <path d="M0 0h26.17v25.7H0z" class="cls-44" />
      <path d="M.75.77h4.78v.68H.75z" class="cls-30" />
      <path d="M14.04.77h4.78v.68h-4.78z" class="cls-27" />
      <path d="M7.39.8h4.78v.68H7.39z" class="cls-26" />
      <path d="M7.39 2.03h4.78V5.8H7.39z" class="cls-25" />
      <path d="M20.69.8h4.78v.68h-4.78z" class="cls-22" />
      <path d="M20.69 2.03h4.78V5.8h-4.78z" class="cls-23" />
      <path d="M.75 13.44h4.78v.68H.75z" class="cls-21" />
      <path d="M14.04 13.44h4.78v.68h-4.78z" class="cls-20" />
      <path d="M7.39 13.46h4.78v.68H7.39z" class="cls-24" />
      <path d="M7.39 14.7h4.78v3.77H7.39z" class="cls-56" />
      <path d="M20.69 13.46h4.78v.68h-4.78z" class="cls-57" />
      <path d="M20.69 14.7h4.78v3.77h-4.78z" class="cls-58" />
      <path d="M20.69 7.79h4.78v-.68h-4.78v.68z" class="cls-59" />
      <path d="M7.39 7.79h4.78v-.68H7.39v.68z" class="cls-61" />
      <path d="M14.04 7.81h4.78v-.68h-4.78v.68z" class="cls-72" />
      <path d="M14.04 12.14h4.78V8.37h-4.78v3.77z" class="cls-73" />
      <path d="M.75 7.81h4.77v-.68H.75v.68z" class="cls-74" />
      <path d="M.75 12.14h4.77V8.37H.75v3.77z" class="cls-75" />
      <path d="M20.69 20.45h4.78v-.68h-4.78v.68z" class="cls-60" />
      <path d="M7.39 20.45h4.78v-.68H7.39v.68z" class="cls-63" />
      <path d="M14.04 20.47h4.78v-.68h-4.78v.68z" class="cls-62" />
      <path d="M14.04 24.8h4.78v-3.77h-4.78v3.77z" class="cls-64" />
      <path d="M.75 20.47h4.77v-.68H.75v.68z" class="cls-65" />
      <path d="M.75 24.8h4.77v-3.77H.75v3.77z" class="cls-81" />
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
      .cls-5 {
        fill: #6a6b66;
      }
      .cls-6 {
        filter: url(#luminosity-noclip-3);
      }
      .cls-7 {
        filter: url(#luminosity-noclip-4);
      }
      .cls-8 {
        filter: url(#luminosity-noclip-6);
      }
      .cls-10 {
        filter: url(#luminosity-noclip-7);
      }
      .cls-12 {
        fill: url(#radial-gradient-7);
      }
      .cls-13 {
        fill: url(#radial-gradient-6);
      }
      .cls-14 {
        fill: url(#radial-gradient-5);
      }
      .cls-15 {
        fill: url(#radial-gradient-4);
      }
      .cls-16 {
        fill: url(#radial-gradient-9);
      }
      .cls-17 {
        fill: url(#radial-gradient-8);
      }
      .cls-18 {
        fill: url(#radial-gradient-3);
      }
      .cls-19 {
        fill: url(#radial-gradient-2);
      }
      .cls-20 {
        fill: url(#linear-gradient-8);
      }
      .cls-21 {
        fill: url(#linear-gradient-7);
      }
      .cls-22 {
        fill: url(#linear-gradient-5);
      }
      .cls-23 {
        fill: url(#linear-gradient-6);
      }
      .cls-24 {
        fill: url(#linear-gradient-9);
      }
      .cls-25 {
        fill: url(#linear-gradient-4);
      }
      .cls-26 {
        fill: url(#linear-gradient-3);
      }
      .cls-27 {
        fill: url(#linear-gradient-2);
      }
      .cls-28 {
        fill: #0d0f0d;
      }
      .cls-29 {
        fill: url(#radial-gradient);
      }
      .cls-30 {
        fill: url(#linear-gradient);
      }
      .cls-31,
      .cls-32 {
        opacity: 0.2;
        fill: #fff;
      }
      .cls-32 {
        opacity: 0.3;
      }
      .cls-33 {
        isolation: isolate;
      }
      .cls-34 {
        mask: url(#mask-2);
      }
      .cls-35 {
        mask: url(#mask-3);
      }
      .cls-36 {
        mask: url(#mask-4);
      }
      .cls-37 {
        mask: url(#mask-5);
      }
      .cls-38 {
        mask: url(#mask-6);
      }
      .cls-39 {
        mask: url(#mask-1);
      }
      .cls-40 {
        fill: #020202;
      }
      .cls-41 {
        fill: url(#radial-gradient-12);
      }
      .cls-42 {
        fill: url(#radial-gradient-10);
      }
      .cls-43 {
        fill: url(#radial-gradient-11);
      }
      .cls-44 {
        fill: #000100;
      }
      .cls-45 {
        fill: #d92831;
      }
      .cls-46 {
        fill: url(#linear-gradient-43);
      }
      .cls-47 {
        fill: url(#linear-gradient-40);
      }
      .cls-48 {
        fill: url(#linear-gradient-41);
      }
      .cls-49 {
        fill: url(#linear-gradient-42);
      }
      .cls-50 {
        fill: url(#linear-gradient-49);
      }
      .cls-51 {
        fill: url(#linear-gradient-48);
      }
      .cls-52 {
        fill: url(#linear-gradient-45);
      }
      .cls-53 {
        fill: url(#linear-gradient-47);
      }
      .cls-54 {
        fill: url(#linear-gradient-44);
      }
      .cls-55 {
        fill: url(#linear-gradient-46);
      }
      .cls-56 {
        fill: url(#linear-gradient-10);
      }
      .cls-57 {
        fill: url(#linear-gradient-11);
      }
      .cls-58 {
        fill: url(#linear-gradient-12);
      }
      .cls-59 {
        fill: url(#linear-gradient-13);
      }
      .cls-60 {
        fill: url(#linear-gradient-19);
      }
      .cls-61 {
        fill: url(#linear-gradient-14);
      }
      .cls-62 {
        fill: url(#linear-gradient-21);
      }
      .cls-63 {
        fill: url(#linear-gradient-20);
      }
      .cls-64 {
        fill: url(#linear-gradient-22);
      }
      .cls-65 {
        fill: url(#linear-gradient-23);
      }
      .cls-66 {
        fill: url(#linear-gradient-28);
      }
      .cls-67 {
        fill: url(#linear-gradient-25);
      }
      .cls-68 {
        fill: url(#linear-gradient-32);
      }
      .cls-69 {
        fill: url(#linear-gradient-31);
      }
      .cls-70 {
        fill: url(#linear-gradient-33);
      }
      .cls-71 {
        fill: url(#linear-gradient-30);
      }
      .cls-72 {
        fill: url(#linear-gradient-15);
      }
      .cls-73 {
        fill: url(#linear-gradient-16);
      }
      .cls-74 {
        fill: url(#linear-gradient-17);
      }
      .cls-75 {
        fill: url(#linear-gradient-18);
      }
      .cls-76 {
        fill: url(#linear-gradient-35);
      }
      .cls-77 {
        fill: url(#linear-gradient-34);
      }
      .cls-78 {
        fill: url(#linear-gradient-36);
      }
      .cls-79 {
        fill: url(#linear-gradient-38);
      }
      .cls-80 {
        fill: url(#linear-gradient-27);
      }
      .cls-81 {
        fill: url(#linear-gradient-24);
      }
      .cls-82 {
        fill: url(#linear-gradient-26);
      }
      .cls-83 {
        fill: url(#linear-gradient-29);
      }
      .cls-84 {
        fill: url(#linear-gradient-37);
      }
      .cls-85 {
        fill: url(#linear-gradient-39);
      }
      .cls-86 {
        fill: url(#linear-gradient-57);
      }
      .cls-87 {
        fill: url(#linear-gradient-58);
      }
      .cls-88 {
        fill: url(#linear-gradient-59);
      }
      .cls-89 {
        fill: url(#linear-gradient-53);
      }
      .cls-90 {
        fill: url(#linear-gradient-54);
      }
      .cls-91 {
        fill: url(#linear-gradient-55);
      }
      .cls-92 {
        fill: url(#linear-gradient-56);
      }
      .cls-93 {
        fill: url(#linear-gradient-50);
      }
      .cls-94 {
        fill: url(#linear-gradient-51);
      }
      .cls-95 {
        fill: url(#linear-gradient-52);
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
  <g class="cls-33">
    <g id="butt-panel">
      <g id="bg">
        <path id="bg-2" d="M0 0h675v1200H0z" class="cls-29" data-name="bg" />
        <path id="mesh" d="M0 0h675v1200H0z" class="cls-98" />
        <g id="plate">
          <g id="bevel">
            <path
              d="M0 0v1200h675V0H0Zm601.68 430.36-19.14-18.69V290.23l46.77-46.77v159.26l-27.64 27.64Zm27.2 129-43.38-33.38v-53.14l2.92-4.09 40.37 33.38.08 57.23ZM388 124.13a7.727 7.727 0 0 1 6.79-4.04h198.32c2.06 0 4 .8 5.46 2.26l24.33 24.33c1.46 1.46 2.26 3.4 2.26 5.46s-.8 4-2.26 5.47l-52.91 52.9a7.67 7.67 0 0 1-5.46 2.26h-64.04c-1.36 0-2.7-.36-3.88-1.04l-89.08-51.66a7.774 7.774 0 0 1-2.6-2.47l-16.63-25.57a7.7 7.7 0 0 1-.31-7.9Zm-50.5 32.84c3.61 0 7.18.95 10.31 2.75l195.62 112.05v219.46L352.76 623.92c-4.5 3.13-9.78 4.79-15.26 4.79s-10.76-1.66-15.26-4.79L131.57 491.23V271.77l195.62-112.05c3.13-1.8 6.7-2.75 10.31-2.75ZM52.09 146.69l24.33-24.33a7.67 7.67 0 0 1 5.46-2.26H280.2c2.84 0 5.44 1.55 6.79 4.04a7.747 7.747 0 0 1-.31 7.9l-16.63 25.57a7.774 7.774 0 0 1-2.6 2.47l-89.08 51.66a7.778 7.778 0 0 1-3.88 1.04h-64.04c-2.06 0-4-.8-5.46-2.26l-52.91-52.9c-1.46-1.46-2.26-3.4-2.26-5.46s.8-4.01 2.26-5.47Zm-6.41 96.77 46.77 46.77v121.44l-19.14 18.69-27.64-27.64V243.46ZM89.5 472.85v53.14l-43.38 33.38.08-57.23 40.37-33.38 2.92 4.09Zm541.28 281.37c0 4.38-2.23 8.57-6.16 11.58l-22.34 12.15v49.28l23.46 15.5c3.16 2.09 4.96 5.07 4.96 8.2v60.1c0 3.07-1.74 6.01-4.8 8.09l-23.62 16.07v78.31l23.46 15.5c3.16 2.09 4.96 5.07 4.96 8.2v60.1c0 3.07-1.74 6.01-4.8 8.09l-86.65 58.95c-2.75 1.87-6.35 2.91-10.09 2.91h-84.15c-3.71 0-7.28-1.02-10.02-2.86l-26.11-17.54H268.7l-27.59 18.54c-2.74 1.84-6.32 2.86-10.02 2.86h-84.15c-3.74 0-7.34-1.04-10.09-2.91l-86.65-58.95c-3.06-2.08-4.8-5.02-4.8-8.09v-60.1c0-3.13 1.8-6.11 4.96-8.2l22.36-14.77v-79.8L50.2 920.11c-3.06-2.08-4.8-5.02-4.8-8.09v-60.1c0-3.13 1.8-6.11 4.96-8.2l22.36-14.77v-50.52l-21.39-11.64c-3.93-3.01-6.16-7.2-6.16-11.58V624.22c0-4.5 2.35-8.79 6.48-11.82l65.93-48.3c3.62-2.65 8.32-4.12 13.2-4.12h35.75c4.71 0 9.26 1.37 12.83 3.85l131.7 91.02c15.91 10.99 36.97 10.98 52.86-.04l132.67-91.98c3.57-2.48 8.12-3.85 12.83-3.85h35.75c4.88 0 9.58 1.47 13.2 4.12l65.93 48.3c4.12 3.02 6.48 7.31 6.48 11.82v130.99Z"
              class="cls-28"
            />
            <g class="cls-2">
              <g class="cls-96">
                <path
                  d="M0 0v1200h675V0H0Zm601.68 430.36-19.14-18.69V290.23l46.77-46.77v159.26l-27.64 27.64Zm27.2 129-43.38-33.38v-53.14l2.92-4.09 40.37 33.38.08 57.23ZM388 124.13a7.727 7.727 0 0 1 6.79-4.04h198.32c2.06 0 4 .8 5.46 2.26l24.33 24.33c1.46 1.46 2.26 3.4 2.26 5.46s-.8 4-2.26 5.47l-52.91 52.9a7.67 7.67 0 0 1-5.46 2.26h-64.04c-1.36 0-2.7-.36-3.88-1.04l-89.08-51.66a7.774 7.774 0 0 1-2.6-2.47l-16.63-25.57a7.7 7.7 0 0 1-.31-7.9Zm-50.5 32.84c3.61 0 7.18.95 10.31 2.75l195.62 112.05v219.46L352.76 623.92c-4.5 3.13-9.78 4.79-15.26 4.79s-10.76-1.66-15.26-4.79L131.57 491.23V271.77l195.62-112.05c3.13-1.8 6.7-2.75 10.31-2.75ZM52.09 146.69l24.33-24.33a7.67 7.67 0 0 1 5.46-2.26H280.2c2.84 0 5.44 1.55 6.79 4.04a7.747 7.747 0 0 1-.31 7.9l-16.63 25.57a7.774 7.774 0 0 1-2.6 2.47l-89.08 51.66a7.778 7.778 0 0 1-3.88 1.04h-64.04c-2.06 0-4-.8-5.46-2.26l-52.91-52.9c-1.46-1.46-2.26-3.4-2.26-5.46s.8-4.01 2.26-5.47Zm-6.41 96.77 46.77 46.77v121.44l-19.14 18.69-27.64-27.64V243.46ZM89.5 472.85v53.14l-43.38 33.38.08-57.23 40.37-33.38 2.92 4.09Zm541.28 281.37c0 4.38-2.23 8.57-6.16 11.58l-22.34 12.15v49.28l23.46 15.5c3.16 2.09 4.96 5.07 4.96 8.2v60.1c0 3.07-1.74 6.01-4.8 8.09l-23.62 16.07v78.31l23.46 15.5c3.16 2.09 4.96 5.07 4.96 8.2v60.1c0 3.07-1.74 6.01-4.8 8.09l-86.65 58.95c-2.75 1.87-6.35 2.91-10.09 2.91h-84.15c-3.71 0-7.28-1.02-10.02-2.86l-26.11-17.54H268.7l-27.59 18.54c-2.74 1.84-6.32 2.86-10.02 2.86h-84.15c-3.74 0-7.34-1.04-10.09-2.91l-86.65-58.95c-3.06-2.08-4.8-5.02-4.8-8.09v-60.1c0-3.13 1.8-6.11 4.96-8.2l22.36-14.77v-79.8L50.2 920.11c-3.06-2.08-4.8-5.02-4.8-8.09v-60.1c0-3.13 1.8-6.11 4.96-8.2l22.36-14.77v-50.52l-21.39-11.64c-3.93-3.01-6.16-7.2-6.16-11.58V624.22c0-4.5 2.35-8.79 6.48-11.82l65.93-48.3c3.62-2.65 8.32-4.12 13.2-4.12h35.75c4.71 0 9.26 1.37 12.83 3.85l131.7 91.02c15.91 10.99 36.97 10.98 52.86-.04l132.67-91.98c3.57-2.48 8.12-3.85 12.83-3.85h35.75c4.88 0 9.58 1.47 13.2 4.12l65.93 48.3c4.12 3.02 6.48 7.31 6.48 11.82v130.99Z"
                  class="cls-40"
                />
              </g>
            </g>
          </g>
          <g class="cls-100">
            <path
              id="plate-face"
              d="M0 0v1200h675V0H0Zm379.21 119.37a17.7 17.7 0 0 1 15.58-9.27h198.32c4.73 0 9.19 1.84 12.54 5.19l24.33 24.33c3.35 3.35 5.19 7.8 5.19 12.54s-1.84 9.19-5.19 12.54l-52.91 52.9c-3.35 3.35-7.8 5.19-12.53 5.19H500.5c-3.12 0-6.2-.83-8.9-2.39l-89.08-51.66a17.889 17.889 0 0 1-5.97-5.67l-16.63-25.57a17.72 17.72 0 0 1-.72-18.12ZM45.02 139.62l24.33-24.33c3.35-3.35 7.8-5.19 12.54-5.19h198.32a17.7 17.7 0 0 1 15.58 9.27 17.72 17.72 0 0 1-.72 18.12l-16.63 25.57a17.796 17.796 0 0 1-5.97 5.67l-89.08 51.66c-2.7 1.56-5.77 2.39-8.89 2.39h-64.04c-4.73 0-9.19-1.84-12.53-5.19l-52.91-52.9c-3.35-3.35-5.19-7.8-5.19-12.54s1.84-9.19 5.19-12.54Zm595.76 614.6c0 7.5-3.67 14.61-10.08 19.52l-.62.47-17.8 9.69v37.96l18.97 12.54c6.01 3.97 9.45 10 9.45 16.54v60.1c0 6.43-3.34 12.39-9.18 16.36l-19.25 13.09v67.65l18.97 12.54c6.01 3.97 9.45 10 9.45 16.54v60.1c0 6.43-3.34 12.39-9.18 16.36l-86.65 58.96c-4.4 2.99-9.98 4.64-15.72 4.64h-84.15c-5.68 0-11.22-1.62-15.6-4.56l-23.58-15.84H271.73l-25.06 16.84c-4.38 2.94-9.92 4.56-15.6 4.56h-84.15c-5.73 0-11.32-1.65-15.72-4.64l-86.65-58.95c-5.83-3.97-9.18-9.93-9.18-16.36v-60.1c0-6.54 3.44-12.57 9.45-16.54l17.87-11.81v-69.13l-18.14-12.34c-5.83-3.97-9.18-9.93-9.18-16.36v-60.1c0-6.54 3.44-12.57 9.45-16.54l17.87-11.81v-39.2l-16.86-9.17-.62-.47c-6.4-4.9-10.08-12.02-10.08-19.52V624.25c0-7.72 3.85-14.96 10.57-19.88l65.93-48.3c5.33-3.9 12.11-6.05 19.11-6.05h35.75c6.73 0 13.31 2 18.54 5.64l108.71 75.33c.84.58 14.4 9.76 26.2 15.98a37.289 37.289 0 0 0 34.9-.06c11.64-6.19 24.97-15.31 25.78-15.87l110.25-76.39c5.21-3.63 11.8-5.63 18.52-5.63h35.75c7 0 13.79 2.15 19.11 6.05l65.93 48.3c6.71 4.92 10.57 12.17 10.57 19.88v130.99Z"
              class="cls-19"
              data-name="bevel"
            />
            <path id="texture" d="M0 0h675v1200H0z" class="cls-22" style={isTextured ? `fill: #151714` : ""} />
            {#if isTextured}
              <path id="texture-overlay" d="M0 0h675v1200H0z" fill={`url(#distressed-metal-${texture})`} class="cls-100" style="opacity: 0.4;" />
              <!-- <path id="vignette" d="M0 0h675v1200H0z" class="cls-22 opacity-75 mix-blend-multiply invert" /> -->
            {/if}
          </g>
        </g>
      </g>
      <!-- Addition: -->
      <g class="extra-butt-bg">
        <path class="fill-white" d="M497.73 317.12A25.01 25.01 0 0 0 485.29 296l-135.22-78.52a24.964 24.964 0 0 0-12.57-3.38c-4.34 0-8.68 1.13-12.57 3.38L189.7 296a25.023 25.023 0 0 0-12.16 17.87c-.02.15-.06.31-.08.46-.12.92-.18 1.85-.2 2.79 0 .17-.02.34-.02.52v112.12c0 26.11 12.29 50.7 33.18 66.36l112.05 84.04c4.45 3.34 9.73 5.01 15.02 5 5.28 0 10.57-1.67 15.02-5l112.05-84.04a82.947 82.947 0 0 0 33.18-66.36V317.64c0-.17-.01-.34-.02-.52Z" />
      </g>
      <g id="butt-top" onclick={toggleGlow} class:active={isGlowing} class={isTextured ? "" : ""} fill={isTextured ? `url(#distressed-metal-${texture})` : ""}>
        <g id="butt-bg">
          <!-- Apply to butt: -->
          <!-- class={isTextured ? "" : "cls-18"} data-name="butt-face" fill={isTextured ? `url(#distressed-metal-${texture})` : ""} /> -->
          <path data-name="bevel-bg" d="M337.5 585.16v7.73c-7.15 0-13.94-2.26-19.66-6.55L205.79 502.3c-22.71-17.03-36.27-44.15-36.27-72.54V317.64c0-.22 0-.44.02-.65.03-1.33.12-2.53.27-3.67.03-.21.06-.4.1-.6 1.51-9.87 7.31-18.4 15.92-23.4l135.23-78.52c4.99-2.9 10.68-4.43 16.45-4.43s11.46 1.53 16.45 4.43l135.22 78.52c9.81 5.7 16.05 16.29 16.29 27.65.01.24.02.46.02.68v112.12c0 28.39-13.56 55.51-36.27 72.54l-112.05 84.04c-5.71 4.29-12.51 6.55-19.65 6.55v-7.73Z" class="cls-67" />
          <path d="M497.73 317.12A25.01 25.01 0 0 0 485.29 296l-135.22-78.52a24.964 24.964 0 0 0-12.57-3.38c-4.34 0-8.68 1.13-12.57 3.38L189.7 296a25.023 25.023 0 0 0-12.16 17.87c-.02.15-.06.31-.08.46-.12.92-.18 1.85-.2 2.79 0 .17-.02.34-.02.52v112.12c0 26.11 12.29 50.7 33.18 66.36l112.05 84.04c4.45 3.34 9.73 5.01 15.02 5 5.28 0 10.57-1.67 15.02-5l112.05-84.04a82.947 82.947 0 0 0 33.18-66.36V317.64c0-.17-.01-.34-.02-.52Z" class="cls-18" />
          <path data-name="highlight" d="M497.73 317.12A25.01 25.01 0 0 0 485.29 296l-135.22-78.52a24.964 24.964 0 0 0-12.57-3.38c-4.34 0-8.68 1.13-12.57 3.38L189.7 296a25.023 25.023 0 0 0-12.16 17.87c-.02.15-.06.31-.08.46-.12.92-.18 1.85-.2 2.79 0 .17-.02.34-.02.52v1.4c0-.17.01-.34.02-.52.02-.94.08-1.87.2-2.79.02-.16.05-.31.08-.46a25.003 25.003 0 0 1 12.16-17.87l135.23-78.52c3.88-2.26 8.23-3.38 12.57-3.38s8.68 1.13 12.57 3.38l135.22 78.52a25.023 25.023 0 0 1 12.44 21.12c0 .17.02.34.02.52v-1.4c0-.17-.01-.34-.02-.52Z" class="cls-32" />
        </g>
        <path id="bevel-3" data-name="bevel" d="M337.5 549.82c-6.1 0-12.16-2.02-17.04-5.68l-93.47-70.1c-13.86-10.4-22.14-26.95-22.14-44.28v-85.32c0-15.62 8.39-30.19 21.9-38.03l88.67-51.49c6.7-3.89 14.33-5.95 22.08-5.95s15.38 2.06 22.08 5.95l88.67 51.49c13.5 7.84 21.9 22.41 21.9 38.03v85.32c0 17.33-8.28 33.88-22.14 44.28l-93.47 70.1a28.576 28.576 0 0 1-17.04 5.68Z" class="cls-82" />
        <circle id="inner-bevel" cx="337.5" cy="399.39" r="74.6" class="cls-80" />
        <path id="active-face" d="m439.94 320.73-88.67-51.49a27.423 27.423 0 0 0-27.53 0l-88.67 51.49a27.422 27.422 0 0 0-13.65 23.71v85.32c0 12.21 5.75 23.71 15.52 31.03l93.47 70.1c4.21 3.16 10 3.16 14.21 0l93.47-70.1a38.788 38.788 0 0 0 15.52-31.03v-85.32c0-9.77-5.2-18.8-13.65-23.71ZM337.5 472.93c-40.61 0-73.54-32.92-73.54-73.54s32.92-73.54 73.54-73.54 73.54 32.92 73.54 73.54-32.92 73.54-73.54 73.54Z" class="cls-15" />
        <path id="face" d="m439.94 320.73-88.67-51.49a27.423 27.423 0 0 0-27.53 0l-88.67 51.49a27.422 27.422 0 0 0-13.65 23.71v85.32c0 12.21 5.75 23.71 15.52 31.03l93.47 70.1c4.21 3.16 10 3.16 14.21 0l93.47-70.1a38.788 38.788 0 0 0 15.52-31.03v-85.32c0-9.77-5.2-18.8-13.65-23.71ZM337.5 472.93c-40.61 0-73.54-32.92-73.54-73.54s32.92-73.54 73.54-73.54 73.54 32.92 73.54 73.54-32.92 73.54-73.54 73.54Z" class={isTextured ? "" : "cls-66"} style={isTextured ? `fill: url(#distressed-metal-${texture})` : ""} />
        <circle id="bg-3" cx="337.5" cy="399.39" r="65.1" class="cls-3" data-name="bg" />
        <path id="highlight" d="M337.5 474.04c43.49 0 62-35.09 62-35.09s-19.78 33.99-62 33.99-62.01-33.99-62.01-33.99 18.52 35.09 62.01 35.09Z" class="cls-32" />
        <path id="top-highlight" d="m439.94 319.62-88.67-51.49a27.423 27.423 0 0 0-27.53 0l-88.67 51.49a27.422 27.422 0 0 0-13.65 23.71v1.1c0-9.77 5.2-18.8 13.65-23.71l88.67-51.49a27.423 27.423 0 0 1 27.53 0l88.67 51.49a27.422 27.422 0 0 1 13.65 23.71v-1.1c0-9.77-5.2-18.8-13.65-23.71Z" class="cls-31" />
        <g id="SEAS_Logo" data-name="SEAS Logo">
          <path
            d="M335.18 348.29c-43.54 2.48-65.23 53.58-36.09 86.2 24.34 27.24 69.11 20.53 84.97-12.08 16.93-34.8-10.03-76.33-48.89-74.12Zm10.69 24.77c-9.04-2.47-17.86-.73-25.23 4.98-2.32 1.8-3.93 3.75-5.77 5.99-2.26-.34-4.41-1.18-6.6-1.82l8.68 15.72 15.1-9.14c0-.49-4.25-1.21-4.97-1.45-.35-.12-.77-.15-.82-.63.43.04.68-.23.97-.47 7.85-6.32 18.76-4.83 25.06 2.88 2.12 2.59 2.97 5.5 3.85 8.67l17.86 4.95c5.78 2.31 4.72 7.42 2.88 12.2-6.64 17.26-24.95 28.46-43.4 26.31-12.28-1.43-24.12-8.56-30.39-19.22-.74-.52-5.63 3.31-6.08 2.86l4.82-18.28 18.32 4.81-5.45 3.72c2.23 3.82 6.12 7.42 10.05 9.49 12.58 6.61 28.33 2.9 36.42-8.69l6.87 1.58-8.69-15.38-15.09 8.65c-.57.43.06.56.48.64 1.86.32 3.7 1.24 5.63 1.29.47.43-1.89 2.14-2.27 2.39-9.74 6.44-23.1 1.85-26.82-9.12-.23-.68-.67-3.33-1-3.55-3.39-.86-6.73-2-10.09-3.03-2.63-.8-6.23-1.44-8.69-2.56-2.06-.94-3.63-3.23-3.84-5.49-.25-2.62 2.73-9.12 4.1-11.58 8.99-16.09 27.66-24.41 45.77-20.21 10.39 2.41 20.34 9.27 25.66 18.5l5.77-2.88c.17.18-.97 4.18-1.14 4.82-.22.87-.48 1.62-.71 2.48-.99 3.66-1.92 7.35-2.98 10.99l-18.32-4.81 1.39-1.02 4.39-2.7c-3.41-5.61-9.37-10.1-15.73-11.84Z"
            class="cls-83"
          />
          <path d="M336.77 390.29c4.5-.78 7.8 3.32 5.94 7.53-.42.94-1.57 1.9-1.67 2.5-.49 2.86 1.57 9.91-3.05 10.13-4.69.22-2.58-7.35-3.05-10.13-.13-.77-1.09-1.26-1.56-1.97-1.94-2.98-.13-7.45 3.4-8.06Z" class="cls-45" />
        </g>
      </g>
      <g id="main-butts">
        <g id="butt-6">
          <path id="butt-bevel" d="M444.13 988.59h114.75c3.66 0 7.2 1 9.93 2.8l56.94 37.63c3.16 2.09 4.96 5.07 4.96 8.2v60.1c0 3.07-1.74 6.01-4.8 8.09l-86.65 58.95c-2.75 1.87-6.35 2.91-10.09 2.91h-84.15c-3.71 0-7.28-1.02-10.02-2.86l-74.41-50c-3.1-2.08-4.87-5.04-4.87-8.14v-60.74c0-3.24 1.93-6.31 5.27-8.4l73.53-45.95c2.69-1.68 6.1-2.6 9.62-2.6Z" class="cls-71" />
          <g id="active-butt-face">
            <path d="M450.31 999.85H550.6c3.2 0 6.29.87 8.68 2.45l49.76 32.88c2.76 1.82 4.34 4.43 4.34 7.16v52.53c0 2.69-1.52 5.25-4.2 7.07l-75.73 51.52c-2.4 1.64-5.55 2.54-8.82 2.54h-73.54c-3.24 0-6.36-.89-8.76-2.5l-65.03-43.69c-2.71-1.82-4.26-4.4-4.26-7.11v-53.08c0-2.83 1.69-5.51 4.61-7.34l64.26-40.16c2.35-1.47 5.33-2.27 8.41-2.27Z" class="cls-14" />
            <path d="M550.6 1000.6c3.06 0 6 .83 8.26 2.32l49.76 32.88c2.54 1.68 4 4.06 4 6.54v52.53c0 2.43-1.41 4.78-3.87 6.45l-75.73 51.52c-2.29 1.56-5.27 2.41-8.4 2.41h-73.54c-3.1 0-6.06-.84-8.34-2.37l-65.03-43.69c-2.49-1.68-3.93-4.04-3.93-6.49v-53.08c0-2.57 1.55-5.01 4.26-6.7l64.26-40.16c2.23-1.39 5.07-2.16 8.01-2.16H550.6m0-.75H450.31c-3.08 0-6.06.81-8.41 2.27l-64.26 40.16c-2.92 1.83-4.61 4.51-4.61 7.34v53.08c0 2.71 1.55 5.29 4.26 7.11l65.03 43.69c2.4 1.61 5.52 2.5 8.76 2.5h73.54c3.27 0 6.42-.91 8.82-2.54l75.73-51.52c2.68-1.82 4.2-4.38 4.2-7.07v-52.53c0-2.73-1.58-5.34-4.34-7.16l-49.76-32.88c-2.39-1.58-5.48-2.45-8.68-2.45Z" class="cls-69" />
          </g>
          <g id="butt-face">
            <path d="M450.31 999.85H550.6c3.2 0 6.29.87 8.68 2.45l49.76 32.88c2.76 1.82 4.34 4.43 4.34 7.16v52.53c0 2.69-1.52 5.25-4.2 7.07l-75.73 51.52c-2.4 1.64-5.55 2.54-8.82 2.54h-73.54c-3.24 0-6.36-.89-8.76-2.5l-65.03-43.69c-2.71-1.82-4.26-4.4-4.26-7.11v-53.08c0-2.83 1.69-5.51 4.61-7.34l64.26-40.16c2.35-1.47 5.33-2.27 8.41-2.27Z" class={isTextured ? `` : "cls-68"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
            <path d="M550.6 1000.6c3.06 0 6 .83 8.26 2.32l49.76 32.88c2.54 1.68 4 4.06 4 6.54v52.53c0 2.43-1.41 4.78-3.87 6.45l-75.73 51.52c-2.29 1.56-5.27 2.41-8.4 2.41h-73.54c-3.1 0-6.06-.84-8.34-2.37l-65.03-43.69c-2.49-1.68-3.93-4.04-3.93-6.49v-53.08c0-2.57 1.55-5.01 4.26-6.7l64.26-40.16c2.23-1.39 5.07-2.16 8.01-2.16H550.6m0-.75H450.31c-3.08 0-6.06.81-8.41 2.27l-64.26 40.16c-2.92 1.83-4.61 4.51-4.61 7.34v53.08c0 2.71 1.55 5.29 4.26 7.11l65.03 43.69c2.4 1.61 5.52 2.5 8.76 2.5h73.54c3.27 0 6.42-.91 8.82-2.54l75.73-51.52c2.68-1.82 4.2-4.38 4.2-7.07v-52.53c0-2.73-1.58-5.34-4.34-7.16l-49.76-32.88c-2.39-1.58-5.48-2.45-8.68-2.45Z" class="cls-69" />
          </g>
          <path d="M444.61 1089.71v-22.03h7.34v9.84h6.77v4.33h-6.77v7.85h-7.34Zm12.35-14.73v-2.91h-3.85v-4.4h11.19v7.3h-7.34Zm10.01 14.73v-4.7h2.21v-12.65h-2.21v-4.68h11.75v4.68h-2.21v12.65h2.21v4.7h-11.75Zm15.31 0v-22.03h7.34v22.03h-7.34Zm8.5 0v-4.4h3.64v-2.79h6.66v7.19h-10.29Zm13.58 0v-22.03h7.34v8.73h7.02v4.25h-7.02v9.05h-7.34Zm13.06-15.66v-2.11h-4.57v-4.27h11.47v6.38h-6.91Zm-4.56 15.66v-4.4h4.13v-2.21h7.34v6.61h-11.47Zm28.24 0v-8.25h-9.53l-4.42-4.42v-4.96l4.42-4.4h2.49v7.82h10.13l4.27 4.42v5.4l-4.4 4.4h-2.96Zm-10.25 0-3.7-4.4v-2.21h7.34v2.62h5.45v3.98h-9.08Zm10.25-15.86v-2.21h-5.88v-3.97h8.82l3.82 3.83v2.34h-6.76Z" class="cls-5" />
        </g>
        <g id="butt-5">
          <path id="butt-bevel-2" d="M231.98 989.59H117.23c-3.66 0-7.2 1-9.93 2.8l-56.94 37.63c-3.16 2.09-4.96 5.07-4.96 8.2v60.1c0 3.07 1.74 6.01 4.8 8.09l86.65 58.95c2.75 1.87 6.35 2.91 10.09 2.91h84.15c3.71 0 7.28-1.02 10.02-2.86l74.41-50c3.1-2.08 4.87-5.04 4.87-8.14v-60.74c0-3.24-1.93-6.31-5.27-8.4l-73.53-45.95c-2.69-1.68-6.1-2.6-9.62-2.6Z" class="cls-70" data-name="butt-bevel" />
          <g id="active-butt-face-2" data-name="active-butt-face">
            <path d="M225.79 1000.85H125.5c-3.2 0-6.29.87-8.68 2.45l-49.76 32.88c-2.76 1.82-4.34 4.43-4.34 7.16v52.53c0 2.69 1.52 5.25 4.2 7.07l75.73 51.52c2.4 1.64 5.55 2.54 8.82 2.54h73.54c3.24 0 6.36-.89 8.76-2.5l65.03-43.69c2.71-1.82 4.26-4.4 4.26-7.11v-53.08c0-2.83-1.69-5.51-4.61-7.34l-64.26-40.16c-2.35-1.47-5.33-2.27-8.41-2.27Z" class="cls-13" />
            <path d="M225.79 1001.6c2.94 0 5.78.77 8.01 2.16l64.26 40.16c2.7 1.69 4.26 4.13 4.26 6.7v53.08c0 2.45-1.43 4.81-3.93 6.49l-65.03 43.69c-2.28 1.53-5.24 2.37-8.34 2.37h-73.54c-3.13 0-6.11-.86-8.4-2.41l-75.73-51.52c-2.46-1.67-3.87-4.02-3.87-6.45v-52.53c0-2.48 1.46-4.86 4-6.54l49.76-32.88c2.27-1.5 5.2-2.32 8.26-2.32h100.29m0-.75H125.5c-3.2 0-6.29.87-8.68 2.45l-49.76 32.88c-2.76 1.82-4.34 4.43-4.34 7.16v52.53c0 2.69 1.52 5.25 4.2 7.07l75.73 51.52c2.4 1.64 5.55 2.54 8.82 2.54h73.54c3.24 0 6.36-.89 8.76-2.5l65.03-43.69c2.71-1.82 4.26-4.4 4.26-7.11v-53.08c0-2.83-1.69-5.51-4.61-7.34l-64.26-40.16c-2.35-1.47-5.33-2.27-8.41-2.27Z" class="cls-77" />
          </g>
          <g id="butt-face-2" data-name="butt-face">
            <path d="M225.79 1000.85H125.5c-3.2 0-6.29.87-8.68 2.45l-49.76 32.88c-2.76 1.82-4.34 4.43-4.34 7.16v52.53c0 2.69 1.52 5.25 4.2 7.07l75.73 51.52c2.4 1.64 5.55 2.54 8.82 2.54h73.54c3.24 0 6.36-.89 8.76-2.5l65.03-43.69c2.71-1.82 4.26-4.4 4.26-7.11v-53.08c0-2.83-1.69-5.51-4.61-7.34l-64.26-40.16c-2.35-1.47-5.33-2.27-8.41-2.27Z" class={isTextured ? `` : "cls-76"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
            <path d="M225.79 1001.6c2.94 0 5.78.77 8.01 2.16l64.26 40.16c2.7 1.69 4.26 4.13 4.26 6.7v53.08c0 2.45-1.43 4.81-3.93 6.49l-65.03 43.69c-2.28 1.53-5.24 2.37-8.34 2.37h-73.54c-3.13 0-6.11-.86-8.4-2.41l-75.73-51.52c-2.46-1.67-3.87-4.02-3.87-6.45v-52.53c0-2.48 1.46-4.86 4-6.54l49.76-32.88c2.27-1.5 5.2-2.32 8.26-2.32h100.29m0-.75H125.5c-3.2 0-6.29.87-8.68 2.45l-49.76 32.88c-2.76 1.82-4.34 4.43-4.34 7.16v52.53c0 2.69 1.52 5.25 4.2 7.07l75.73 51.52c2.4 1.64 5.55 2.54 8.82 2.54h73.54c3.24 0 6.36-.89 8.76-2.5l65.03-43.69c2.71-1.82 4.26-4.4 4.26-7.11v-53.08c0-2.83-1.69-5.51-4.61-7.34l-64.26-40.16c-2.35-1.47-5.33-2.27-8.41-2.27Z" class="cls-78" />
          </g>
          <path d="m135.02 1089.6-7.97-22.03h7.49l7.62 22.03h-7.14Zm8.03-.66-3.3-9.7 3.55-11.67h7.37l-7.62 21.37Zm9.38.66v-4.7h2.21v-12.65h-2.21v-4.68h11.75v4.68h-2.21v12.65h2.21v4.7h-11.75Zm15.31 0v-22.03h7.34v22.03h-7.34Zm8.5 0v-4.4h5.45v-13.23h-5.45v-4.4h8.38l4.42 4.4v13.23l-4.42 4.4h-8.38Zm16.17 0v-22.03h7.34v8.73h7.02v4.25h-7.02v9.05h-7.34Zm13.06-15.65v-2.11h-4.57v-4.27h11.47v6.38h-6.91Zm-4.56 15.65v-4.4h4.13v-2.21h7.34v6.61h-11.47Zm18.76 0-4.47-4.4v-13.23l4.47-4.4h5.64v4.47h-2.76v13.08h2.76v4.48h-5.64Zm6.81 0v-4.48h2.81v-13.08h-2.81v-4.47h5.69l4.45 4.4v13.23l-4.45 4.4h-5.69Z" class="cls-5" />
        </g>
        <g id="butt-4">
          <path id="butt-bevel-3" d="M444.13 802.31h114.75c3.66 0 7.2 1 9.93 2.8l56.94 37.63c3.16 2.09 4.96 5.07 4.96 8.2v60.1c0 3.07-1.74 6.01-4.8 8.09l-86.65 58.95c-2.75 1.87-6.35 2.91-10.09 2.91h-84.15c-3.71 0-7.28-1.02-10.02-2.86l-74.41-50c-3.1-2.08-4.87-5.04-4.87-8.14v-60.74c0-3.24 1.93-6.31 5.27-8.4l73.53-45.95c2.69-1.68 6.1-2.6 9.62-2.6Z" class="cls-84" data-name="butt-bevel" />
          <g id="active-butt-face-3" data-name="active-butt-face">
            <path d="M450.31 813.57H550.6c3.2 0 6.29.87 8.68 2.45l49.76 32.88c2.76 1.82 4.34 4.43 4.34 7.16v52.53c0 2.69-1.52 5.25-4.2 7.07l-75.73 51.52c-2.4 1.64-5.55 2.54-8.82 2.54h-73.54c-3.24 0-6.36-.89-8.76-2.5l-65.03-43.69c-2.71-1.82-4.26-4.4-4.26-7.11v-53.08c0-2.83 1.69-5.51 4.61-7.34l64.26-40.16c2.35-1.47 5.33-2.27 8.41-2.27Z" class="cls-12" />
            <path d="M550.6 814.32c3.06 0 6 .83 8.26 2.32l49.76 32.88c2.54 1.68 4 4.06 4 6.54v52.53c0 2.43-1.41 4.78-3.87 6.45l-75.73 51.52c-2.29 1.56-5.27 2.41-8.4 2.41h-73.54c-3.1 0-6.06-.84-8.34-2.37l-65.03-43.69c-2.49-1.68-3.93-4.04-3.93-6.49v-53.08c0-2.57 1.55-5.01 4.26-6.7l64.26-40.16c2.23-1.39 5.07-2.16 8.01-2.16H550.6m0-.75H450.31c-3.08 0-6.06.81-8.41 2.27L377.64 856c-2.92 1.83-4.61 4.51-4.61 7.34v53.08c0 2.71 1.55 5.29 4.26 7.11l65.03 43.69c2.4 1.61 5.52 2.5 8.76 2.5h73.54c3.27 0 6.42-.91 8.82-2.54l75.73-51.52c2.68-1.82 4.2-4.38 4.2-7.07v-52.53c0-2.73-1.58-5.34-4.34-7.16l-49.76-32.88c-2.39-1.58-5.48-2.45-8.68-2.45Z" class="cls-79" />
          </g>
          <g id="butt-face-3" data-name="butt-face">
            <path d="M450.31 813.57H550.6c3.2 0 6.29.87 8.68 2.45l49.76 32.88c2.76 1.82 4.34 4.43 4.34 7.16v52.53c0 2.69-1.52 5.25-4.2 7.07l-75.73 51.52c-2.4 1.64-5.55 2.54-8.82 2.54h-73.54c-3.24 0-6.36-.89-8.76-2.5l-65.03-43.69c-2.71-1.82-4.26-4.4-4.26-7.11v-53.08c0-2.83 1.69-5.51 4.61-7.34l64.26-40.16c2.35-1.47 5.33-2.27 8.41-2.27Z" class={isTextured ? `` : "cls-85"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
            <path d="M550.6 814.32c3.06 0 6 .83 8.26 2.32l49.76 32.88c2.54 1.68 4 4.06 4 6.54v52.53c0 2.43-1.41 4.78-3.87 6.45l-75.73 51.52c-2.29 1.56-5.27 2.41-8.4 2.41h-73.54c-3.1 0-6.06-.84-8.34-2.37l-65.03-43.69c-2.49-1.68-3.93-4.04-3.93-6.49v-53.08c0-2.57 1.55-5.01 4.26-6.7l64.26-40.16c2.23-1.39 5.07-2.16 8.01-2.16H550.6m0-.75H450.31c-3.08 0-6.06.81-8.41 2.27L377.64 856c-2.92 1.83-4.61 4.51-4.61 7.34v53.08c0 2.71 1.55 5.29 4.26 7.11l65.03 43.69c2.4 1.61 5.52 2.5 8.76 2.5h73.54c3.27 0 6.42-.91 8.82-2.54l75.73-51.52c2.68-1.82 4.2-4.38 4.2-7.07v-52.53c0-2.73-1.58-5.34-4.34-7.16l-49.76-32.88c-2.39-1.58-5.48-2.45-8.68-2.45Z" class="cls-47" />
          </g>
          <path d="m443.17 901.73-4.4-4.4V884.1l4.4-4.4h2.94v17.63h6.29v4.4h-9.23Zm9.57-15.42v-2.21h-5.46v-4.4h8.95l3.85 4.4v2.21h-7.34Zm.83 15.42v-7.85H450v-4.37h10.08v12.22h-6.51Zm10.02 0V879.7h7.34v22.03h-7.34Zm13.95 0v-8.95h-5.45v-4.42h5.4v-8.67h7.4v22.03h-7.35Zm15.2 0-4.47-4.4V884.1l4.47-4.4h5.64v4.47h-2.76v13.08h2.76v4.48h-5.64Zm6.81 0v-4.48h2.81v-13.08h-2.81v-4.47h5.69l4.45 4.4v13.23l-4.45 4.4h-5.69Zm27.28 0v-8.25h-9.53l-4.42-4.42v-4.96l4.42-4.4h2.49v7.82h10.13l4.27 4.42v5.4l-4.4 4.4h-2.96Zm-10.25 0-3.7-4.4v-2.21h7.34v2.62h5.45v3.98h-9.08Zm10.25-15.86v-2.21h-5.88v-3.97h8.82l3.82 3.83v2.34h-6.76Zm9.05-1.37v-4.8H555v4.8h-19.12Zm5.74 17.23v-16.09h7.64v16.09h-7.64Z" class="cls-5" />
        </g>
        <g id="butt-3">
          <path id="butt-bevel-4" d="M231.98 803.31H117.23c-3.66 0-7.2 1-9.93 2.8l-56.94 37.63c-3.16 2.09-4.96 5.07-4.96 8.2v60.1c0 3.07 1.74 6.01 4.8 8.09l86.65 58.95c2.75 1.87 6.35 2.91 10.09 2.91h84.15c3.71 0 7.28-1.02 10.02-2.86l74.41-50c3.1-2.08 4.87-5.04 4.87-8.14v-60.74c0-3.24-1.93-6.31-5.27-8.4l-73.53-45.95c-2.69-1.68-6.1-2.6-9.62-2.6Z" class="cls-48" data-name="butt-bevel" />
          <g id="active-butt-face-4" data-name="active-butt-face">
            <path d="M225.79 814.57H125.5c-3.2 0-6.29.87-8.68 2.45L67.06 849.9c-2.76 1.82-4.34 4.43-4.34 7.16v52.53c0 2.69 1.52 5.25 4.2 7.07l75.73 51.52c2.4 1.64 5.55 2.54 8.82 2.54h73.54c3.24 0 6.36-.89 8.76-2.5l65.03-43.69c2.71-1.82 4.26-4.4 4.26-7.11v-53.08c0-2.83-1.69-5.51-4.61-7.34l-64.26-40.16c-2.35-1.47-5.33-2.27-8.41-2.27Z" class="cls-17" />
            <path d="M225.79 815.32c2.94 0 5.78.77 8.01 2.16l64.26 40.16c2.7 1.69 4.26 4.13 4.26 6.7v53.08c0 2.45-1.43 4.81-3.93 6.49l-65.03 43.69c-2.28 1.53-5.24 2.37-8.34 2.37h-73.54c-3.13 0-6.11-.86-8.4-2.41l-75.73-51.52c-2.46-1.67-3.87-4.02-3.87-6.45v-52.53c0-2.47 1.46-4.86 4-6.54l49.76-32.88c2.27-1.5 5.2-2.32 8.27-2.32H225.8m-.01-.75H125.5c-3.2 0-6.29.87-8.68 2.45L67.06 849.9c-2.76 1.82-4.34 4.43-4.34 7.16v52.53c0 2.69 1.52 5.25 4.2 7.07l75.73 51.52c2.4 1.64 5.55 2.54 8.82 2.54h73.54c3.24 0 6.36-.89 8.76-2.5l65.03-43.69c2.71-1.82 4.26-4.4 4.26-7.11v-53.08c0-2.83-1.69-5.51-4.61-7.34l-64.26-40.16c-2.35-1.47-5.33-2.27-8.41-2.27Z" class="cls-49" />
          </g>
          <g id="butt-face-4" data-name="butt-face">
            <path d="M225.79 814.57H125.5c-3.2 0-6.29.87-8.68 2.45L67.06 849.9c-2.76 1.82-4.34 4.43-4.34 7.16v52.53c0 2.69 1.52 5.25 4.2 7.07l75.73 51.52c2.4 1.64 5.55 2.54 8.82 2.54h73.54c3.24 0 6.36-.89 8.76-2.5l65.03-43.69c2.71-1.82 4.26-4.4 4.26-7.11v-53.08c0-2.83-1.69-5.51-4.61-7.34l-64.26-40.16c-2.35-1.47-5.33-2.27-8.41-2.27Z" class={isTextured ? `` : "cls-46"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
            <path d="M225.79 815.32c2.94 0 5.78.77 8.01 2.16l64.26 40.16c2.7 1.69 4.26 4.13 4.26 6.7v53.08c0 2.45-1.43 4.81-3.93 6.49l-65.03 43.69c-2.28 1.53-5.24 2.37-8.34 2.37h-73.54c-3.13 0-6.11-.86-8.4-2.41l-75.73-51.52c-2.46-1.67-3.87-4.02-3.87-6.45v-52.53c0-2.47 1.46-4.86 4-6.54l49.76-32.88c2.27-1.5 5.2-2.32 8.27-2.32H225.8m-.01-.75H125.5c-3.2 0-6.29.87-8.68 2.45L67.06 849.9c-2.76 1.82-4.34 4.43-4.34 7.16v52.53c0 2.69 1.52 5.25 4.2 7.07l75.73 51.52c2.4 1.64 5.55 2.54 8.82 2.54h73.54c3.24 0 6.36-.89 8.76-2.5l65.03-43.69c2.71-1.82 4.26-4.4 4.26-7.11v-53.08c0-2.83-1.69-5.51-4.61-7.34l-64.26-40.16c-2.35-1.47-5.33-2.27-8.41-2.27Z" class="cls-54" />
          </g>
          <path d="m135.87 901.62-7.97-22.03h7.49l7.62 22.03h-7.14Zm8.04-.66-3.3-9.7 3.55-11.67h7.37l-7.62 21.37Zm13.16.66-4.47-4.4v-13.23l4.47-4.4h5.64v4.47h-2.76v13.08h2.76v4.48h-5.64Zm6.81 0v-4.48h2.81v-13.08h-2.81v-4.47h5.69l4.45 4.4v13.23l-4.45 4.4h-5.69Zm13 0v-4.7h2.21v-12.65h-2.21v-4.68h11.75v4.68h-2.21v12.65h2.21v4.7h-11.75Zm19.06 0-4.42-4.4v-13.23l4.42-4.4h2.92v22.03h-2.92Zm8.96-13.19V884h-4.88v-4.4h7.82l4.4 4.4v4.43h-7.34Zm-4.88 13.19v-4.4h4.88V894h7.34v3.22l-4.4 4.4h-7.82Zm15.64 0v-22.03H223v8.73h7.02v4.25H223v9.05h-7.34Zm13.06-15.65v-2.11h-4.57v-4.27h11.47v6.38h-6.91Zm-4.56 15.65v-4.4h4.13v-2.21h7.34v6.61h-11.47Z" class="cls-5" />
        </g>
        <g id="butt-2">
          <path id="butt-bevel-5" d="M509.42 559h35.75c4.88 0 9.58 1.47 13.2 4.12l65.93 48.3c4.12 3.02 6.48 7.31 6.48 11.82v130.99c0 4.38-2.23 8.57-6.16 11.58l-45.13 24.56c-3.65 2.8-8.49 4.36-13.52 4.36H455.58c-4.83 0-9.5-1.44-13.11-4.05l-75.13-38.21c-4.18-3.02-6.57-7.35-6.57-11.89v-76.27c0-4.64 2.5-9.06 6.85-12.08l128.96-89.36c3.57-2.48 8.12-3.85 12.83-3.85Z" class="cls-52" data-name="butt-bevel" />
          <g id="active-butt-face-5" data-name="active-butt-face">
            <path d="M513.05 574.36h28.19c4.36 0 8.56 1.31 11.79 3.68l58.87 43.13c3.68 2.7 5.78 6.53 5.78 10.55v116.96c0 3.91-1.99 7.65-5.5 10.34l-40.29 17.85c-3.26 2.5-7.58 3.89-12.07 3.89H452.25c-4.32 0-8.48-1.29-11.7-3.61l-56.08-29.3c-3.73-2.7-7.87-6.56-7.87-10.61v-65.89c0-4.15 2.23-8.09 6.12-10.79l118.88-82.75c3.19-2.22 7.25-3.44 11.45-3.44Z" class="cls-16" />
            <path d="M541.24 575.11c4.21 0 8.24 1.25 11.34 3.53l58.87 43.13c3.48 2.55 5.48 6.17 5.48 9.94v116.96c0 3.63-1.87 7.16-5.13 9.69l-40.21 17.82-.08.04-.07.05c-3.15 2.41-7.27 3.74-11.62 3.74H452.25c-4.17 0-8.17-1.23-11.26-3.47l-.04-.03-.05-.03-56.03-29.28c-4.92-3.56-7.51-7.01-7.51-9.97v-65.89c0-3.9 2.11-7.61 5.8-10.17l118.88-82.75c3.06-2.13 6.98-3.3 11.02-3.3h28.19m-.01-.76h-28.19c-4.2 0-8.27 1.22-11.45 3.44l-118.88 82.75c-3.88 2.7-6.12 6.64-6.12 10.79v65.89c0 4.05 4.13 7.91 7.87 10.61l56.08 29.3c3.22 2.33 7.39 3.61 11.7 3.61h107.57c4.49 0 8.81-1.39 12.07-3.89l40.29-17.85c3.51-2.69 5.5-6.43 5.5-10.34V631.71c0-4.02-2.1-7.85-5.78-10.55l-58.87-43.13c-3.23-2.37-7.43-3.68-11.79-3.68Z" class="cls-55" />
          </g>
          <g id="butt-face-5" data-name="butt-face">
            <path d="M513.05 574.36h28.19c4.36 0 8.56 1.31 11.79 3.68l58.87 43.13c3.68 2.7 5.78 6.53 5.78 10.55v116.96c0 3.91-1.99 7.65-5.5 10.34l-40.29 17.85c-3.26 2.5-7.58 3.89-12.07 3.89H452.25c-4.32 0-8.48-1.29-11.7-3.61l-56.08-30.3c-3.73-2.7-7.87-6.56-7.87-10.61v-64.89c0-4.15 2.23-8.09 6.12-10.79l118.88-82.75c3.19-2.22 7.25-3.44 11.45-3.44Z" class={isTextured ? `` : "cls-53"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
            <path d="M541.24 575.11c4.21 0 8.24 1.25 11.34 3.53l58.87 43.13c3.48 2.55 5.48 6.17 5.48 9.94v116.96c0 3.63-1.87 7.16-5.13 9.69l-40.21 17.82-.08.04-.07.05c-3.15 2.41-7.27 3.74-11.62 3.74H452.25c-4.17 0-8.17-1.23-11.26-3.47l-.04-.03-.04-.02-56.04-30.28c-4.92-3.56-7.52-7.01-7.52-9.98v-64.89c0-3.9 2.11-7.61 5.8-10.17l118.88-82.75c3.06-2.13 6.98-3.3 11.02-3.3h28.19m0-.76h-28.19c-4.2 0-8.27 1.22-11.45 3.44l-118.88 82.75c-3.88 2.7-6.12 6.64-6.12 10.79v64.89c0 4.05 4.13 7.91 7.87 10.61l56.08 30.3c3.22 2.33 7.39 3.61 11.7 3.61h107.57c4.49 0 8.81-1.39 12.07-3.89l40.29-17.85c3.51-2.69 5.5-6.43 5.5-10.34V631.71c0-4.02-2.1-7.85-5.78-10.55l-58.87-43.13c-3.23-2.37-7.43-3.68-11.79-3.68Z" class="cls-51" />
          </g>
          <path d="M438.77 711.33V689.3h7.34v22.03h-7.34Zm8.5 0v-4.4h5.45v-4.7h-5.45v-3.83h5.45v-4.7h-5.45v-4.4h8.52l4.42 4.4v4.48l-2.21 2.21 2.21 2.21v4.33l-4.42 4.4h-8.52Zm16.32 0V689.3h7.34v8.73h7.02v4.25h-7.02v9.05h-7.34Zm13.07-15.65v-2.11h-4.57v-4.27h11.47v6.38h-6.91Zm-4.57 15.65v-4.4h4.13v-2.21h7.34v6.61h-11.47Zm13.23 0 7.87-21.03 3.25 8.75-4.03 12.29h-7.09Zm17.19 0-.93-2.41h-7.21l1.53-4.37h3.98l-5.89-15.26h7.16l8.78 22.03h-7.42Zm12.85 0-4.42-4.4V693.7l4.42-4.4h2.92v22.03h-2.92Zm8.96-13.19v-4.43h-4.88v-4.4h7.82l4.4 4.4v4.43h-7.34Zm-4.88 13.19v-4.4h4.88v-3.22h7.34v3.22l-4.4 4.4h-7.82Zm19.87 0-4.47-4.4V693.7l4.47-4.4h5.64v4.47h-2.76v13.08h2.76v4.48h-5.64Zm6.81 0v-4.48h2.81v-13.08h-2.81v-4.47h5.69l4.45 4.4v13.23l-4.45 4.4h-5.69Zm26.88 0-13.35-22.03h7.75l13.4 22.03H573Zm-13.35 0v-19.94l6.39 10.48v9.46h-6.39Zm21.15-2.09-6.39-10.53v-9.41h6.39v19.94Z" class="cls-5" />
        </g>
        <g id="butt-1">
          <path id="butt-bevel-6" d="M166.53 560h-35.75c-4.88 0-9.58 1.47-13.2 4.12l-65.93 48.3c-4.12 3.02-6.48 7.31-6.48 11.82v130.99c0 4.38 2.23 8.57 6.16 11.58l45.13 24.56c3.65 2.8 8.49 4.36 13.52 4.36h120.39c4.83 0 9.5-1.44 13.11-4.05l65.13-38.21c4.18-3.02 6.57-7.35 6.57-11.89v-76.27c0-4.64-2.5-9.06-6.85-12.08l-128.96-89.36c-3.57-2.48-8.12-3.85-12.83-3.85Z" class="cls-50" data-name="butt-bevel" />
          <g id="active-butt-face-6" data-name="active-butt-face">
            <path d="M162.89 575.36H134.7c-4.36 0-8.56 1.31-11.79 3.68l-58.87 43.13c-3.68 2.7-5.78 6.53-5.78 10.55v116.96c0 3.91 1.99 7.65 5.5 10.34l40.29 17.85c3.26 2.5 7.58 3.89 12.07 3.89h107.57c4.32 0 8.48-1.29 11.7-3.61l56.08-29.3c3.73-2.7 7.87-6.56 7.87-10.61v-65.89c0-4.15-2.23-8.09-6.12-10.79l-118.88-82.75c-3.19-2.22-7.25-3.44-11.45-3.44Z" class="cls-42" />
            <path d="M162.89 576.11c4.05 0 7.96 1.17 11.02 3.3l118.88 82.75c3.68 2.56 5.8 6.27 5.8 10.17v65.89c0 2.96-2.6 6.41-7.51 9.97l-56.03 29.28-.05.03-.04.03c-3.1 2.24-7.1 3.47-11.26 3.47H116.13c-4.34 0-8.47-1.33-11.62-3.74l-.07-.05-.08-.04-40.21-17.82c-3.26-2.53-5.13-6.05-5.13-9.69V632.7c0-3.77 2-7.4 5.48-9.94l58.87-43.13c3.11-2.28 7.14-3.53 11.34-3.53h28.19m-.01-.74H134.7c-4.36 0-8.56 1.31-11.79 3.68l-58.87 43.13c-3.68 2.7-5.78 6.53-5.78 10.55v116.96c0 3.91 1.99 7.65 5.5 10.34l40.29 17.85c3.26 2.5 7.58 3.89 12.07 3.89h107.57c4.32 0 8.48-1.29 11.7-3.61l56.08-29.3c3.73-2.7 7.87-6.56 7.87-10.61v-65.89c0-4.15-2.23-8.09-6.12-10.79l-118.88-82.75c-3.19-2.22-7.25-3.44-11.45-3.44Z" class="cls-93" />
          </g>
          <g id="butt-face-6" data-name="butt-face">
            <path d="M162.89 575.36H134.7c-4.36 0-8.56 1.31-11.79 3.68l-58.87 43.13c-3.68 2.7-5.78 6.53-5.78 10.55v116.96c0 3.91 1.99 7.65 5.5 10.34l40.29 17.85c3.26 2.5 7.58 3.89 12.07 3.89h107.57c4.32 0 8.48-1.29 11.7-3.61l56.08-30.3c3.73-2.7 7.87-6.56 7.87-10.61v-64.89c0-4.15-2.23-8.09-6.12-10.79l-118.88-82.75c-3.19-2.22-7.25-3.44-11.45-3.44Z" class={isTextured ? `` : "cls-94"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
            <path d="M162.89 576.11c4.05 0 7.96 1.17 11.02 3.3l118.88 82.75c3.68 2.56 5.8 6.27 5.8 10.17v64.89c0 2.96-2.6 6.41-7.52 9.98l-56.04 30.28-.04.02-.04.03c-3.1 2.24-7.1 3.47-11.26 3.47H116.12c-4.34 0-8.47-1.33-11.62-3.74l-.07-.05-.08-.04-40.21-17.82c-3.26-2.53-5.13-6.05-5.13-9.69V632.7c0-3.77 2-7.4 5.48-9.94l58.87-43.13c3.11-2.28 7.14-3.53 11.34-3.53h28.19m0-.74H134.7c-4.36 0-8.56 1.31-11.79 3.68l-58.87 43.13c-3.68 2.7-5.78 6.53-5.78 10.55v116.96c0 3.91 1.99 7.65 5.5 10.34l40.29 17.85c3.26 2.5 7.58 3.89 12.07 3.89h107.57c4.32 0 8.48-1.29 11.7-3.61l56.08-30.3c3.73-2.7 7.87-6.56 7.87-10.61v-64.89c0-4.15-2.23-8.09-6.12-10.79l-118.88-82.75c-3.19-2.22-7.25-3.44-11.45-3.44Z" class="cls-96" />
          </g>
          <path d="m130.41 712.33-4.42-4.4V694.7l4.42-4.4h2.92v22.03h-2.92Zm8.97-13.19v-4.43h-4.88v-4.4h7.82l4.4 4.4v4.43h-7.34Zm-4.88 13.19v-4.4h4.88v-3.22h7.34v3.22l-4.4 4.4h-7.82Zm15.63 0V690.3h7.34v22.03h-7.34Zm13.95 0v-8.95h-5.45v-4.42h5.4v-8.67h7.4v22.03h-7.35Zm9.33 0 7.87-21.03 3.25 8.75-4.03 12.29h-7.09Zm17.18 0-.93-2.41h-7.21l1.53-4.37h3.98l-5.89-15.26h7.16l8.78 22.03h-7.42Zm5.36-17.23v-4.8h19.12v4.8h-19.12Zm5.75 17.23v-16.09h7.64v16.09h-7.64Z" class="cls-5" />
        </g>
        <g id="butt-pro-tr">
          <g id="butt-bevel-7" data-name="butt-bevel">
            <path d="M564.54 212.78c2.05 0 4.02-.81 5.46-2.26l52.91-52.9c1.45-1.45 2.26-3.42 2.26-5.46s-.81-4.02-2.26-5.47l-24.33-24.33a7.73 7.73 0 0 0-5.46-2.26H394.8c-2.83 0-5.44 1.55-6.79 4.04s-1.23 5.52.31 7.9l16.63 25.57a7.682 7.682 0 0 0 2.6 2.47l89.08 51.66c1.18.68 2.52 1.04 3.88 1.04h64.04Z" class="cls-89" />
            <g class="cls-39">
              <g class="cls-97">
                <path d="M564.54 212.78c2.05 0 4.02-.81 5.46-2.26l52.91-52.9c1.45-1.45 2.26-3.42 2.26-5.46s-.81-4.02-2.26-5.47l-24.33-24.33a7.73 7.73 0 0 0-5.46-2.26H394.8c-2.83 0-5.44 1.55-6.79 4.04s-1.23 5.52.31 7.9l16.63 25.57a7.682 7.682 0 0 0 2.6 2.47l89.08 51.66c1.18.68 2.52 1.04 3.88 1.04h64.04Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="active-butt-face-7" data-name="active-butt-face">
            <path d="M562.53 205.05H501.8c-.85 0-1.69-.23-2.43-.65l-86.95-50.43c-.66-.38-1.22-.91-1.63-1.55l-10.45-16.07c-3.05-4.69-.97-8.53 4.63-8.53h186.14c1.29 0 2.52.51 3.43 1.42l19.49 19.49a4.847 4.847 0 0 1 0 6.85l-48.06 48.05c-.91.91-2.14 1.42-3.43 1.42Z" class="cls-43" />
            <path d="M591.11 128.57c1.09 0 2.12.43 2.9 1.2l19.49 19.49c.77.77 1.2 1.8 1.2 2.9 0 1.09-.43 2.12-1.2 2.9l-48.06 48.05c-.77.77-1.8 1.2-2.9 1.2h-60.73c-.72 0-1.43-.19-2.06-.55l-86.95-50.43c-.55-.32-1.03-.77-1.38-1.31l-10.45-16.07c-1.32-2.03-1.64-3.9-.9-5.26s2.48-2.11 4.9-2.11h186.14m0-.76H404.97c-5.6 0-7.68 3.84-4.63 8.53l10.45 16.07c.41.64.97 1.17 1.63 1.55l86.95 50.43c.74.43 1.58.65 2.43.65h60.73c1.29 0 2.52-.51 3.43-1.42l48.06-48.05a4.847 4.847 0 0 0 0-6.85l-19.49-19.49a4.843 4.843 0 0 0-3.43-1.42Z" class="cls-90" />
            <g class="cls-34">
              <g class="cls-97">
                <path d="M562.53 205.05H501.8c-.85 0-1.69-.23-2.43-.65l-86.95-50.43c-.66-.38-1.22-.91-1.63-1.55l-10.45-16.07c-3.05-4.69-.97-8.53 4.63-8.53h186.14c1.29 0 2.52.51 3.43 1.42l19.49 19.49a4.847 4.847 0 0 1 0 6.85l-48.06 48.05c-.91.91-2.14 1.42-3.43 1.42Z" class="cls-99" />
                <path d="M591.11 128.57c1.09 0 2.12.43 2.9 1.2l19.49 19.49c.77.77 1.2 1.8 1.2 2.9 0 1.09-.43 2.12-1.2 2.9l-48.06 48.05c-.77.77-1.8 1.2-2.9 1.2h-60.73c-.72 0-1.43-.19-2.06-.55l-86.95-50.43c-.55-.32-1.03-.77-1.38-1.31l-10.45-16.07c-1.32-2.03-1.64-3.9-.9-5.26s2.48-2.11 4.9-2.11h186.14m0-.76H404.97c-5.6 0-7.68 3.84-4.63 8.53l10.45 16.07c.41.64.97 1.17 1.63 1.55l86.95 50.43c.74.43 1.58.65 2.43.65h60.73c1.29 0 2.52-.51 3.43-1.42l48.06-48.05a4.847 4.847 0 0 0 0-6.85l-19.49-19.49a4.843 4.843 0 0 0-3.43-1.42Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="butt-face-7" data-name="butt-face">
            <path d="M562.53 205.05H501.8c-.85 0-1.69-.23-2.43-.65l-86.95-50.43c-.66-.38-1.22-.91-1.63-1.55l-10.45-16.07c-3.05-4.69-.97-8.53 4.63-8.53h186.14c1.29 0 2.52.51 3.43 1.42l19.49 19.49a4.847 4.847 0 0 1 0 6.85l-48.06 48.05c-.91.91-2.14 1.42-3.43 1.42Z" class={isTextured ? `` : "cls-91"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
            <path d="M591.11 128.57c1.09 0 2.12.43 2.9 1.2l19.49 19.49c.77.77 1.2 1.8 1.2 2.9 0 1.09-.43 2.12-1.2 2.9l-48.06 48.05c-.77.77-1.8 1.2-2.9 1.2h-60.73c-.72 0-1.43-.19-2.06-.55l-86.95-50.43c-.55-.32-1.03-.77-1.38-1.31l-10.45-16.07c-1.32-2.03-1.64-3.9-.9-5.26s2.48-2.11 4.9-2.11h186.14m0-.76H404.97c-5.6 0-7.68 3.84-4.63 8.53l10.45 16.07c.41.64.97 1.17 1.63 1.55l86.95 50.43c.74.43 1.58.65 2.43.65h60.73c1.29 0 2.52-.51 3.43-1.42l48.06-48.05a4.847 4.847 0 0 0 0-6.85l-19.49-19.49a4.843 4.843 0 0 0-3.43-1.42Z" class="cls-90" />
            <g class="cls-35">
              <g class="cls-97">
                <path d="M562.53 205.05H501.8c-.85 0-1.69-.23-2.43-.65l-86.95-50.43c-.66-.38-1.22-.91-1.63-1.55l-10.45-16.07c-3.05-4.69-.97-8.53 4.63-8.53h186.14c1.29 0 2.52.51 3.43 1.42l19.49 19.49a4.847 4.847 0 0 1 0 6.85l-48.06 48.05c-.91.91-2.14 1.42-3.43 1.42Z" class="cls-99" />
                <path d="M591.11 128.57c1.09 0 2.12.43 2.9 1.2l19.49 19.49c.77.77 1.2 1.8 1.2 2.9 0 1.09-.43 2.12-1.2 2.9l-48.06 48.05c-.77.77-1.8 1.2-2.9 1.2h-60.73c-.72 0-1.43-.19-2.06-.55l-86.95-50.43c-.55-.32-1.03-.77-1.38-1.31l-10.45-16.07c-1.32-2.03-1.64-3.9-.9-5.26s2.48-2.11 4.9-2.11h186.14m0-.76H404.97c-5.6 0-7.68 3.84-4.63 8.53l10.45 16.07c.41.64.97 1.17 1.63 1.55l86.95 50.43c.74.43 1.58.65 2.43.65h60.73c1.29 0 2.52-.51 3.43-1.42l48.06-48.05a4.847 4.847 0 0 0 0-6.85l-19.49-19.49a4.843 4.843 0 0 0-3.43-1.42Z" class="cls-99" />
              </g>
            </g>
          </g>
          <path d="m458.11 167.97 6.13-16.39 2.54 6.82-3.14 9.57h-5.52Zm13.39 0-.72-1.88h-5.62l1.19-3.4h3.1l-4.59-11.89h5.58l6.84 17.17h-5.78Zm7.33 0V150.8h5.72v17.17h-5.72Zm6.62-5.15v-3.32h4.3v-5.27h-4.3v-3.43h6.53l3.44 3.43v5.15l-2.67 2.67 3.25 5.93h-6.11l-2.43-5.15h-2.02Zm15.84 5.15-3.44-3.43v-10.31l3.44-3.43h2.28v17.17h-2.28Zm6.98-10.29v-3.45h-3.8v-3.43h6.09l3.43 3.43v3.45h-5.72Zm-3.8 10.29v-3.43h3.8v-2.51h5.72v2.51l-3.43 3.43h-6.09Zm12.19 0V150.8h5.72v17.17h-5.72Zm10.86 0V161h-4.24v-3.44h4.21v-6.75h5.77v17.17h-5.73Zm8.4 0v-3.66h1.72v-9.86h-1.72v-3.65h9.16v3.65h-1.72v9.86h1.72v3.66h-9.16Zm16.74 0-6.21-17.17h5.83l5.94 17.17h-5.56Zm6.27-.52-2.57-7.56 2.77-9.1h5.74l-5.94 16.65Zm7.34.52V150.8h5.72v6.81h5.47v3.31h-5.47v7.05h-5.72Zm10.19-12.2v-1.64h-3.56v-3.33h8.94v4.97h-5.38Zm-3.56 12.2v-3.43h3.22v-1.72h5.72v5.15h-8.94Z" class="cls-5" />
        </g>
        <g id="butt-pro-tl">
          <g id="butt-bevel-8" data-name="butt-bevel">
            <path d="M110.46 212.78c-2.05 0-4.02-.81-5.46-2.26l-52.91-52.9c-1.45-1.45-2.26-3.42-2.26-5.46s.81-4.02 2.26-5.47l24.33-24.33a7.73 7.73 0 0 1 5.46-2.26H280.2c2.83 0 5.44 1.55 6.79 4.04s1.23 5.52-.31 7.9l-16.63 25.57a7.682 7.682 0 0 1-2.6 2.47l-89.08 51.66a7.778 7.778 0 0 1-3.88 1.04h-64.04Z" class="cls-92" />
            <g class="cls-36">
              <g class="cls-97">
                <path d="M110.46 212.78c-2.05 0-4.02-.81-5.46-2.26l-52.91-52.9c-1.45-1.45-2.26-3.42-2.26-5.46s.81-4.02 2.26-5.47l24.33-24.33a7.73 7.73 0 0 1 5.46-2.26H280.2c2.83 0 5.44 1.55 6.79 4.04s1.23 5.52-.31 7.9l-16.63 25.57a7.682 7.682 0 0 1-2.6 2.47l-89.08 51.66a7.778 7.778 0 0 1-3.88 1.04h-64.04Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="active-butt-face-8" data-name="active-butt-face">
            <path d="M112.47 205.05h60.73c.85 0 1.69-.23 2.43-.65l86.95-50.43c.66-.38 1.22-.91 1.63-1.55l10.45-16.07c3.05-4.69.97-8.53-4.63-8.53H83.89c-1.29 0-2.52.51-3.43 1.42l-19.49 19.49a4.847 4.847 0 0 0 0 6.85l48.06 48.05c.91.91 2.14 1.42 3.43 1.42Z" class="cls-41" />
            <path d="M270.03 128.57c2.42 0 4.16.75 4.9 2.11.74 1.36.42 3.23-.9 5.26l-10.45 16.07c-.35.54-.83.99-1.38 1.31l-86.95 50.43c-.62.36-1.33.55-2.06.55h-60.73c-1.09 0-2.12-.43-2.9-1.2L61.5 155.05c-.77-.77-1.2-1.8-1.2-2.9 0-1.09.43-2.12 1.2-2.9l19.49-19.49c.77-.77 1.8-1.2 2.9-1.2h186.14m0-.74H83.89c-1.29 0-2.52.51-3.43 1.42l-19.49 19.49a4.847 4.847 0 0 0 0 6.85l48.06 48.05c.91.91 2.14 1.42 3.43 1.42h60.73c.85 0 1.69-.23 2.43-.65l86.95-50.43c.66-.38 1.22-.91 1.63-1.55l10.45-16.07c3.05-4.69.97-8.53-4.63-8.53Z" class="cls-86" />
            <g class="cls-37">
              <g class="cls-97">
                <path d="M112.47 205.05h60.73c.85 0 1.69-.23 2.43-.65l86.95-50.43c.66-.38 1.22-.91 1.63-1.55l10.45-16.07c3.05-4.69.97-8.53-4.63-8.53H83.89c-1.29 0-2.52.51-3.43 1.42l-19.49 19.49a4.847 4.847 0 0 0 0 6.85l48.06 48.05c.91.91 2.14 1.42 3.43 1.42Z" class="cls-99" />
                <path d="M270.03 128.57c2.42 0 4.16.75 4.9 2.11.74 1.36.42 3.23-.9 5.26l-10.45 16.07c-.35.54-.83.99-1.38 1.31l-86.95 50.43c-.62.36-1.33.55-2.06.55h-60.73c-1.09 0-2.12-.43-2.9-1.2L61.5 155.05c-.77-.77-1.2-1.8-1.2-2.9 0-1.09.43-2.12 1.2-2.9l19.49-19.49c.77-.77 1.8-1.2 2.9-1.2h186.14m0-.74H83.89c-1.29 0-2.52.51-3.43 1.42l-19.49 19.49a4.847 4.847 0 0 0 0 6.85l48.06 48.05c.91.91 2.14 1.42 3.43 1.42h60.73c.85 0 1.69-.23 2.43-.65l86.95-50.43c.66-.38 1.22-.91 1.63-1.55l10.45-16.07c3.05-4.69.97-8.53-4.63-8.53Z" class="cls-99" />
              </g>
            </g>
          </g>
          <g id="butt-face-8" data-name="butt-face">
            <path d="M112.47 205.05h60.73c.85 0 1.69-.23 2.43-.65l86.95-50.43c.66-.38 1.22-.91 1.63-1.55l10.45-16.07c3.05-4.69.97-8.53-4.63-8.53H83.89c-1.29 0-2.52.51-3.43 1.42l-19.49 19.49a4.847 4.847 0 0 0 0 6.85l48.06 48.05c.91.91 2.14 1.42 3.43 1.42Z" class={isTextured ? `` : "cls-87"} fill={isTextured ? `url(#distressed-metal-${texture})` : ""} />
            <path d="M270.03 128.57c2.42 0 4.16.75 4.9 2.11.74 1.36.42 3.23-.9 5.26l-10.45 16.07c-.35.54-.83.99-1.38 1.31l-86.95 50.43c-.62.36-1.33.55-2.06.55h-60.73c-1.09 0-2.12-.43-2.9-1.2L61.5 155.05c-.77-.77-1.2-1.8-1.2-2.9 0-1.09.43-2.12 1.2-2.9l19.49-19.49c.77-.77 1.8-1.2 2.9-1.2h186.14m0-.74H83.89c-1.29 0-2.52.51-3.43 1.42l-19.49 19.49a4.847 4.847 0 0 0 0 6.85l48.06 48.05c.91.91 2.14 1.42 3.43 1.42h60.73c.85 0 1.69-.23 2.43-.65l86.95-50.43c.66-.38 1.22-.91 1.63-1.55l10.45-16.07c3.05-4.69.97-8.53-4.63-8.53Z" class="cls-88" />
            <g class="cls-38">
              <g class="cls-97">
                <path d="M112.47 205.05h60.73c.85 0 1.69-.23 2.43-.65l86.95-50.43c.66-.38 1.22-.91 1.63-1.55l10.45-16.07c3.05-4.69.97-8.53-4.63-8.53H83.89c-1.29 0-2.52.51-3.43 1.42l-19.49 19.49a4.847 4.847 0 0 0 0 6.85l48.06 48.05c.91.91 2.14 1.42 3.43 1.42Z" class="cls-99" />
                <path d="M270.03 128.57c2.42 0 4.16.75 4.9 2.11.74 1.36.42 3.23-.9 5.26l-10.45 16.07c-.35.54-.83.99-1.38 1.31l-86.95 50.43c-.62.36-1.33.55-2.06.55h-60.73c-1.09 0-2.12-.43-2.9-1.2L61.5 155.05c-.77-.77-1.2-1.8-1.2-2.9 0-1.09.43-2.12 1.2-2.9l19.49-19.49c.77-.77 1.8-1.2 2.9-1.2h186.14m0-.74H83.89c-1.29 0-2.52.51-3.43 1.42l-19.49 19.49a4.847 4.847 0 0 0 0 6.85l48.06 48.05c.91.91 2.14 1.42 3.43 1.42h60.73c.85 0 1.69-.23 2.43-.65l86.95-50.43c.66-.38 1.22-.91 1.63-1.55l10.45-16.07c3.05-4.69.97-8.53-4.63-8.53Z" class="cls-99" />
              </g>
            </g>
          </g>
          <path d="M111.98 167.97V150.8h5.72v17.17h-5.72Zm6.62 0v-3.43h4.24v-10.31h-4.24v-3.43h6.53l3.44 3.43v10.31l-3.44 3.43h-6.53Zm12.6 0V150.8h5.72v17.17h-5.72Zm6.63-5.15v-3.32h4.3v-5.27h-4.3v-3.43h6.53l3.44 3.43v5.15l-2.67 2.67 3.25 5.93h-6.11l-2.43-5.15h-2.02Zm12.3 5.15v-3.66h1.72v-9.86h-1.72v-3.65h9.16v3.65h-1.72v9.86h1.72v3.66h-9.16Zm16.74 0-6.21-17.17h5.83l5.94 17.17h-5.56Zm6.26-.52-2.57-7.56 2.77-9.1h5.74l-5.94 16.65Zm7.35.52V150.8h5.72v6.81h5.47v3.31h-5.47v7.05h-5.72Zm10.18-12.2v-1.64h-3.56v-3.33h8.94v4.97h-5.38Zm-3.55 12.2v-3.43h3.22v-1.72h5.72v5.15h-8.94Z" class="cls-5" />
        </g>
      </g>
    </g>
  </g>
</svg>

<div class="absolute inset-0 [box-shadow:inset_0_0_17px_10px_#0E0F0D] pointer-events-none"></div>

<!-- <div class="absolute inset-0 [box-shadow:inset_0_0_17px_10px_#171916] pointer-events-none"></div> -->

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
