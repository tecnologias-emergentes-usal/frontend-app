import React from "react";

interface SurveillanceIconProps {
  width?: number;
  height?: number;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function SurveillanceIcon({
  width = 300,
  height = 220,
  className = "",
  primaryColor = "#388E3C", // Updated to the Light Mode HorusAlert primary color
  secondaryColor = "#212121", // Updated to the Light Mode HorusAlert text color
}: SurveillanceIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 910.88794 653.61419"
      className={className}
      role="img"
    >
      <rect y="646.47623" width="431.1819" height="1.87469" fill={secondaryColor} />
      <polygon points="109.607 639.942 121.866 639.942 127.699 592.654 109.605 592.654 109.607 639.942" fill="#ffb8b8" />
      <path
        d="M251.53582,759.63143h38.53073a0,0,0,0,1,0,0V774.5183a0,0,0,0,1,0,0H266.42267a14.88685,14.88685,0,0,1-14.88685-14.88685v0A0,0,0,0,1,251.53582,759.63143Z"
        transform="translate(397.08134 1410.94447) rotate(179.99738)"
        fill={secondaryColor}
      />
      <polygon points="44.379 637.585 56.532 639.205 68.564 593.103 50.629 590.712 44.379 637.585" fill="#ffb8b8" />
      <path
        d="M185.6415,759.43939h38.53073a0,0,0,0,1,0,0v14.88687a0,0,0,0,1,0,0H200.52836a14.88686,14.88686,0,0,1-14.88686-14.88686v0a0,0,0,0,1,0,0Z"
        transform="translate(162.1087 1430.92651) rotate(-172.40554)"
        fill={secondaryColor}
      />
      <polygon points="61.796 444.64 130.796 447.64 127.796 622.64 109.796 620.64 95.796 501.64 62.796 628.64 44.796 625.64 61.796 444.64" fill={secondaryColor} />
      <path
        d="M252.35236,463.83242l-24-4.90286-15,109.90286s44,29,58-1Z"
        transform="translate(-144.55603 -123.1929)"
        fill={primaryColor}
      />
      <circle cx="97.32782" cy="303.17101" r="24.56103" fill="#ffb8b8" />
      <path
        d="M228.35236,457.83242l-35,11s17,85-11,129c0,0,35,37,50-46C232.35236,551.83242,244.35236,484.83242,228.35236,457.83242Z"
        transform="translate(-144.55603 -123.1929)"
        fill={secondaryColor}
      />
      <path
        d="M252.35236,463.83242l26,16s14,117,0,128S252.35236,463.83242,252.35236,463.83242Z"
        transform="translate(-144.55603 -123.1929)"
        fill={secondaryColor}
      />
      <path
        d="M289.1621,624.79959a10.0558,10.0558,0,0,1,.96818-15.3889l-10.57065-34.13562,17.83265,5.17981,7.30413,31.62164a10.11027,10.11027,0,0,1-15.53431,12.72307Z"
        transform="translate(-144.55603 -123.1929)"
        fill="#ffb8b8"
      />
      <path
        d="M199.338,614.92719a10.05577,10.05577,0,0,1-1.00976-15.38624l-14.85349-32.50158,18.349,2.85437,11.292,30.42646a10.11027,10.11027,0,0,1-13.77778,14.607Z"
        transform="translate(-144.55603 -123.1929)"
        fill="#ffb8b8"
      />
      <polygon points="57.796 346.64 48.796 345.64 25.796 420.64 48.796 472.64 66.796 461.64 46.796 418.64 62.796 372.64 57.796 346.64" fill={secondaryColor} />
      <polygon points="128.796 355.64 133.796 356.64 157.796 473.64 141.796 478.64 122.796 409.64 128.796 355.64" fill={secondaryColor} />
      <path
        d="M225.00655,436.44921a14.06316,14.06316,0,0,1,8.44415-11.03667c4.7277-1.93846,10.06074-1.11966,15.15695-.7489s10.76991.04877,14.44758-3.49856c3.3597-3.24064,4.11524-8.61848,2.49281-12.99537s-5.29609-7.775-9.46944-9.866a40.79142,40.79142,0,0,0-13.47062-3.56c-6.811-.82288-13.80511-.92776-20.44341.80412s-4.9267,5.44408-8.81681,11.095-5.05548,13.34984-2.08959,19.53611c1.98454,4.13936,5.54088,7.27259,9.004,10.28584"
        transform="translate(-144.55603 -123.1929)"
        fill={secondaryColor}
      />
      <circle cx="530.38349" cy="297.68538" r="180.90894" fill={secondaryColor} />
      <ellipse cx="466.17488" cy="297.68538" rx="96.07861" ry="132.16663" fill="#fff" />
      <ellipse cx="434.32575" cy="325.68538" rx="26.81427" ry="42.18085" fill={secondaryColor} />
      <circle cx="885.81702" cy="196.65475" r="17.80969" fill={primaryColor} />
      <circle cx="680.09215" cy="26.24586" r="26.24586" fill={primaryColor} />
      <circle cx="662.70442" cy="581.35092" r="17.80969" fill={primaryColor} />
    </svg>
  );
} 