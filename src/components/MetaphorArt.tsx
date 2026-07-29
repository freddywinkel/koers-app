import type { MetaphorArtId } from '../content/types';

const line = {
  fill: 'none',
  stroke: 'var(--ink)',
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

const softLine = {
  ...line,
  strokeWidth: 2,
  opacity: 0.68
};

function Illustration({ art }: { art: MetaphorArtId }) {
  switch (art) {
    case 'stove-pans': {
      const pans = [
        { x: 23, level: 0, steam: 0 },
        { x: 87, level: 3, steam: 0 },
        { x: 151, level: 7, steam: 1 },
        { x: 215, level: 11, steam: 2 },
        { x: 279, level: 15, steam: 3 }
      ];
      return (
        <>
          <rect x="12" y="107" width="330" height="30" rx="7" fill="var(--art-front)" />
          <path d="M18 107h318M26 131h310" {...softLine} />
          {pans.map((pan, index) => (
            <g key={pan.x} transform={`translate(${pan.x} 0)`}>
              <path d="M0 79h43l-4 27H4Z" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.2" />
              <path d="M43 84h12" {...line} />
              {pan.level > 0 && (
                <path
                  d={`M5 ${103 - pan.level}h33v${pan.level}H5Z`}
                  fill={index > 2 ? 'var(--art-warm)' : 'var(--art-accent)'}
                  opacity=".82"
                />
              )}
              {Array.from({ length: pan.steam }, (_, steamIndex) => (
                <path
                  key={steamIndex}
                  d={`M${11 + steamIndex * 10} 73c-5-7 5-10 0-17`}
                  {...softLine}
                  stroke={index === 4 ? 'var(--art-warm)' : 'var(--art-accent)'}
                />
              ))}
              <circle cx="21" cy="120" r="4.5" fill={index === 4 ? 'var(--art-warm)' : 'var(--art-accent)'} />
              {index === 4 && <path d="M4 88c-7 4-5 12-10 15M38 88c7 5 5 11 10 15" {...softLine} stroke="var(--art-warm)" />}
            </g>
          ))}
          <path d="M300 133c8-9 17-12 25-8l10 5" {...line} stroke="var(--art-warm)" />
          <path d="m317 126 8-7m-1 8 9-4" {...softLine} />
        </>
      );
    }

    case 'autopilot-cockpit':
      return (
        <>
          <path d="M37 23h280l-31 81H68Z" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.4" />
          <path d="m177 31-37 70m37-70 37 70M76 93h202" {...softLine} />
          <path d="M151 93 177 36l27 57Z" fill="var(--art-mid)" />
          <path d="M171 82h12m-6-10v20" {...line} stroke="var(--art-accent)" />
          <path d="M24 102h306v38H24Z" fill="var(--art-front)" stroke="var(--ink)" strokeWidth="2.4" />
          <circle cx="177" cy="121" r="18" fill="var(--dune)" stroke="var(--ink)" strokeWidth="2.4" />
          <path d="M177 104v17m-16 7h32" {...line} />
          <rect x="56" y="111" width="48" height="19" rx="9.5" fill="var(--art-accent)" opacity=".8" />
          <circle cx="92" cy="120.5" r="6" fill="var(--sand)" />
          <path d="M237 118h56m-28-8v17" {...softLine} />
          <path d="M130 140c3-14 16-24 29-22m64 22c-2-14-15-24-28-22" {...line} stroke="var(--art-warm)" />
        </>
      );

    case 'mind-reporter':
      return (
        <>
          <path d="M0 122h354v26H0Z" fill="var(--art-front)" />
          <rect x="48" y="32" width="114" height="65" rx="12" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.2" />
          <path d="M63 51h79M63 65h55M63 79h68" {...softLine} />
          <circle cx="228" cy="49" r="17" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2.2" />
          <path d="M199 122c0-32 12-51 29-51s29 19 29 51" fill="var(--art-accent)" opacity=".82" stroke="var(--ink)" strokeWidth="2.2" />
          <path d="M228 72v19m-29 10-32-18m57 18 20-27" {...line} />
          <circle cx="163" cy="80" r="6" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M163 86v28m-8 0h16" {...line} />
          <rect x="251" y="75" width="55" height="39" rx="5" fill="var(--sand)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M261 87h35m-35 10h28" {...softLine} />
        </>
      );

    case 'breath-wave':
      return (
        <>
          <circle cx="292" cy="34" r="14" fill="var(--art-sun)" />
          <path d="M0 98q35-22 70 0t70 0 70 0 70 0 74 0v50H0Z" fill="var(--art-mid)" />
          <path d="M0 111q35-22 70 0t70 0 70 0 70 0 74 0" {...line} stroke="var(--art-accent)" />
          <path d="M0 128q35-18 70 0t70 0 70 0 70 0 74 0" {...softLine} />
          <circle cx="68" cy="70" r="10" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M68 80v25m0-15-16 13m16-13 16 13m-16 2-14 21m14-21 14 21" {...line} />
          <path d="M102 61c13-8 24-8 37 0m-37 13c13 8 24 8 37 0" {...softLine} stroke="var(--art-accent)" />
        </>
      );

    case 'quicksand-float':
      return (
        <>
          <path d="M0 110h354v38H0Z" fill="var(--art-front)" />
          <ellipse cx="178" cy="103" rx="126" ry="31" fill="var(--art-warm)" opacity=".52" stroke="var(--ink)" strokeWidth="2.2" />
          <path d="M72 103c20-9 39 9 59 0s39 9 59 0 39 9 59 0 39 9 59 0" {...softLine} />
          <circle cx="106" cy="83" r="10" fill="var(--art-accent)" stroke="var(--ink)" strokeWidth="2.2" />
          <path d="M116 87c38 5 70 5 110 0m-77 3-23 17m58-15 25 17m-87-14-25-2m111 1 25-3" {...line} />
          <path d="m90 53 8 10m-20-1 12 5m178-4-11 8m24 1-13 4" {...softLine} stroke="var(--art-warm)" />
          <path d="M156 123h45" {...line} stroke="var(--art-accent)" />
        </>
      );

    case 'drop-the-rope':
      return (
        <>
          <path d="M0 121q65-20 130 0t130 0 94 0v27H0Z" fill="var(--art-front)" />
          <circle cx="68" cy="57" r="10" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2.2" />
          <path d="M68 67v34m0-22-22 12m22-12 19 5m-19 17-15 24m15-24 17 24" {...line} />
          <path d="M89 87c31 2 37 30 68 28s33-18 64-10" {...line} stroke="var(--art-warm)" />
          <path d="m92 78 10-6m-8 17 11 4" {...softLine} />
          <path d="M249 66c-13-17 5-29 17-17 12-12 30 0 17 17 14 6 15 29 1 39-17 12-43 7-50-12-5-13 3-23 15-27Z" fill="var(--art-accent)" stroke="var(--ink)" strokeWidth="2.2" />
          <path d="m251 50-8-12m36 12 9-12M253 76h2m14 0h2m-15 14c7 5 13 5 20 0" {...line} />
          <path d="M237 89 219 104" {...line} />
          <circle cx="98" cy="83" r="3.5" fill="var(--art-warm)" />
        </>
      );

    case 'bus-passengers':
      return (
        <>
          <path d="M0 127h354" {...line} />
          <path d="M27 48h275c15 0 25 10 25 25v42H27Z" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.4" />
          <path d="M47 58h209v35H47Zm221 0h36l13 35h-49Z" fill="var(--dune)" stroke="var(--ink)" strokeWidth="2" />
          {[72, 122, 172, 222].map((x) => (
            <g key={x}>
              <circle cx={x} cy="72" r="7" fill="var(--art-warm)" />
              <path d={`M${x - 10} 91c2-10 6-14 10-14s8 4 10 14`} fill="var(--art-accent)" opacity=".8" />
            </g>
          ))}
          <circle cx="289" cy="73" r="7" fill="var(--art-warm)" />
          <path d="M279 94c2-12 6-16 10-16s8 4 10 16m-10-2 17-9" {...line} />
          <circle cx="304" cy="84" r="9" fill="none" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="76" cy="117" r="15" fill="var(--ink)" />
          <circle cx="76" cy="117" r="7" fill="var(--dune)" />
          <circle cx="278" cy="117" r="15" fill="var(--ink)" />
          <circle cx="278" cy="117" r="7" fill="var(--dune)" />
          <path d="M58 39c4-12 20-12 25 0m41 0c4-12 20-12 25 0m41 0c4-12 20-12 25 0" {...softLine} stroke="var(--art-warm)" />
        </>
      );

    case 'leaves-on-stream':
      return (
        <>
          <path d="M0 36c65 22 66 74 137 78s102-43 217-14v48H0Z" fill="var(--art-mid)" />
          <path d="M0 55c61 14 73 66 139 66s103-45 215-12" {...line} stroke="var(--art-accent)" />
          <path d="M0 77c55 8 75 55 137 55s108-40 217-13" {...softLine} />
          {[
            [102, 98, -12],
            [183, 106, 11],
            [255, 94, -18]
          ].map(([x, y, rotate]) => (
            <path
              key={x}
              d="M-9 0Q0-11 9 0Q0 11-9 0Zm0 0H9"
              transform={`translate(${x} ${y}) rotate(${rotate})`}
              fill="var(--art-warm)"
              stroke="var(--ink)"
              strokeWidth="1.7"
            />
          ))}
          <circle cx="55" cy="56" r="9" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M55 65v30m0-19-15 13m15-13 13 12m-13 7-14 22m14-22 9 18" {...line} />
          <path d="M21 119q31-16 67 0" {...line} stroke="var(--art-front)" strokeWidth="8" />
        </>
      );

    case 'chessboard-self': {
      const squares = Array.from({ length: 32 }, (_, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        return { x: 90 + col * 22, y: 24 + row * 22, dark: (row + col) % 2 === 0 };
      });
      return (
        <>
          <rect x="83" y="17" width="190" height="102" rx="8" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.5" />
          {squares.map((square) => (
            <rect
              key={`${square.x}-${square.y}`}
              x={square.x}
              y={square.y}
              width="22"
              height="22"
              fill={square.dark ? 'var(--art-accent)' : 'var(--dune)'}
              opacity={square.dark ? 0.78 : 1}
            />
          ))}
          <g fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="1.7">
            <circle cx="123" cy="38" r="6" />
            <path d="M115 55h16l-3-12h-10Z" />
            <circle cx="224" cy="82" r="6" />
            <path d="M216 99h16l-3-12h-10Z" />
          </g>
          <g fill="var(--ink)">
            <circle cx="180" cy="39" r="6" />
            <path d="M172 56h16l-3-12h-10Z" />
            <circle cx="145" cy="83" r="6" />
            <path d="M137 100h16l-3-12h-10Z" />
          </g>
          <path d="M67 130h222" {...line} stroke="var(--art-warm)" strokeWidth="5" />
        </>
      );
    }

    case 'sky-and-weather':
      return (
        <>
          <path d="M25 119C32 51 88 16 177 16s145 35 152 103Z" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.3" />
          <circle cx="265" cy="52" r="16" fill="var(--art-sun)" />
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            return (
              <path
                key={index}
                d={`M${265 + Math.cos(angle) * 23} ${52 + Math.sin(angle) * 23}l${Math.cos(angle) * 9} ${Math.sin(angle) * 9}`}
                {...softLine}
                stroke="var(--art-warm)"
              />
            );
          })}
          <path d="M59 62c7-18 33-18 40 0 17-8 33 7 26 23H48c-7-14 1-26 11-23Z" fill="var(--art-accent)" stroke="var(--ink)" strokeWidth="2" />
          <path d="m65 94-4 12m23-12-4 12m23-12-4 12" {...line} stroke="var(--art-accent)" />
          <path d="M26 119h303" {...line} />
          <circle cx="177" cy="103" r="8" fill="var(--art-warm)" />
          <path d="M177 111v25m0-17-12 10m12-10 12 10" {...line} />
        </>
      );

    case 'attention-lamp':
      return (
        <>
          <path d="M0 127h354" {...line} />
          <path d="M76 125h85L130 63Z" fill="var(--art-warm)" opacity=".28" />
          <path d="M60 40h56l14 23H74Z" fill="var(--art-accent)" stroke="var(--ink)" strokeWidth="2.3" />
          <path d="m89 40 22-23m0 0 27 23m-27-23v-7" {...line} />
          <path d="M130 63 112 92m0 0v33m-17 0h34" {...line} />
          <circle cx="112" cy="92" r="5" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M178 113c8-25 31-27 39 0m-20-23v35m-18-12h37" {...line} stroke="var(--art-accent)" />
          <path d="M263 52l7 13 15 2-11 10 3 15-14-7-13 7 2-15-11-10 15-2Z" fill="var(--art-back)" opacity=".72" />
          <path d="m245 43-8-10m42 8 9-10m2 59 13 4" {...softLine} stroke="var(--art-warm)" />
          <path d="M143 89c12 1 20 5 26 14" {...line} stroke="var(--art-warm)" />
        </>
      );

    case 'values-compass':
      return (
        <>
          <path d="M0 124q65-25 130-3t113-8 111 10v25H0Z" fill="var(--art-front)" />
          <circle cx="177" cy="76" r="49" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.5" />
          <circle cx="177" cy="76" r="37" fill="var(--dune)" stroke="var(--ink)" strokeWidth="1.7" />
          <path d="m177 33 10 43-10 43-10-43Z" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="m134 76 43-10 43 10-43 10Z" fill="var(--art-accent)" opacity=".82" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="177" cy="76" r="5" fill="var(--ink)" />
          <path d="M234 124c10-16 17-24 28-27 14-4 18-17 24-29" {...line} stroke="var(--art-warm)" strokeDasharray="5 7" />
          <path d="m279 73 8-9 3 12" {...line} stroke="var(--art-warm)" />
        </>
      );

    case 'north-star':
      return (
        <>
          <path d="M0 110q35-15 70 0t70 0 70 0 70 0 74 0v38H0Z" fill="var(--art-mid)" />
          <path d="M0 118q35-14 70 0t70 0 70 0 70 0 74 0" {...softLine} stroke="var(--art-accent)" />
          <path d="m245 22 6 14 15 2-11 10 3 15-13-8-14 8 4-15-12-10 16-2Z" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="1.8" />
          <path d="M240 67c-29 12-50 23-71 41" {...softLine} stroke="var(--art-warm)" strokeDasharray="5 7" />
          <path d="M112 107h92l-19 19h-56Z" fill="var(--art-front)" stroke="var(--ink)" strokeWidth="2.2" />
          <path d="M159 107V54l37 38h-37Z" fill="var(--art-accent)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M159 64 133 97h26" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="160" cy="108" r="4" fill="var(--art-warm)" />
        </>
      );

    case 'long-walk':
      return (
        <>
          <path d="M0 72q72-42 144 0t110 0 100 0v76H0Z" fill="var(--art-back)" />
          <path d="M0 102q80-38 154 0t105-6 95 7v45H0Z" fill="var(--art-front)" />
          <path d="M42 148c26-22 68-21 87-38s6-28 34-39 68 2 93-22 28-29 55-35" {...line} stroke="var(--art-warm)" strokeWidth="6" />
          {[
            [72, 130, -18],
            [112, 113, -15],
            [145, 91, 12],
            [191, 75, -8],
            [236, 59, -18]
          ].map(([x, y, rotate]) => (
            <g key={x} transform={`translate(${x} ${y}) rotate(${rotate})`} fill="var(--art-accent)">
              <ellipse cx="-4" cy="0" rx="4" ry="7" />
              <ellipse cx="5" cy="-5" rx="4" ry="7" />
            </g>
          ))}
          <circle cx="287" cy="47" r="8" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M287 55v25m0-15-10 11m10-11 12 8m-12 7-10 17m10-17 13 15" {...line} />
          <path d="M302 61h10v15h-13" fill="var(--art-accent)" stroke="var(--ink)" strokeWidth="1.8" />
        </>
      );

    case 'marsh-crossing':
      return (
        <>
          <path d="M0 91q55-18 108 2t118-2 128 7v50H0Z" fill="var(--art-mid)" />
          <path d="M0 116q53-16 106 0t123-3 125 7" {...softLine} />
          {[59, 103, 147, 193, 239].map((x, index) => (
            <ellipse
              key={x}
              cx={x}
              cy={125 - index * 11}
              rx="17"
              ry="7"
              fill={index === 4 ? 'var(--art-warm)' : 'var(--art-front)'}
              stroke="var(--ink)"
              strokeWidth="1.8"
            />
          ))}
          <path d="M18 111V78m8 33V70m10 42V84m266 28V73m9 39V65m11 47V82" {...line} stroke="var(--art-accent)" />
          <path d="m14 83 8-8m4 2 6-10m267 11 9-10m4 1 8-12" {...softLine} stroke="var(--art-accent)" />
          <circle cx="217" cy="72" r="8" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M217 80v24m0-15-13 9m13-9 13 9m-13 6-12 16m12-16 13 13" {...line} />
          <path d="M277 84h47v28h-47Zm-7 0 30-23 31 23" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2" />
        </>
      );

    case 'clear-sea':
      return (
        <>
          <path d="M0 91q29-23 58 0t58 0 58 0 58 0 58 0 62 0v57H0Z" fill="var(--art-mid)" />
          <path d="M0 94q29-23 58 0t58 0 58 0" {...line} stroke="var(--art-accent)" />
          <path d="M178 94q44-9 88 0t88 0" {...softLine} stroke="var(--art-accent)" />
          <path d="M33 45c6-17 31-16 37 0 15-7 29 7 22 22H24c-5-12 1-23 9-22Z" fill="var(--art-accent)" opacity=".68" stroke="var(--ink)" strokeWidth="2" />
          <path d="m38 76-4 10m21-10-4 10m21-10-4 10" {...softLine} />
          <circle cx="291" cy="43" r="16" fill="var(--art-sun)" />
          <path d="M217 127c10-11 23-11 33 0-10 11-23 11-33 0Zm33 0 11-8v16Z" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="1.7" />
          <ellipse cx="299" cy="133" rx="13" ry="5" fill="var(--art-front)" stroke="var(--ink)" strokeWidth="1.4" />
          <path d="M174 18v118" {...softLine} strokeDasharray="4 7" />
        </>
      );

    case 'row-to-shore':
      return (
        <>
          <path d="M0 94q31-17 62 0t62 0 62 0 62 0 62 0 44 0v54H0Z" fill="var(--art-mid)" />
          <path d="M0 106q31-16 62 0t62 0 62 0 62 0 62 0 44 0" {...softLine} />
          <path d="M23 76c20-18 43-18 63 0m-52 4c9-8 20-8 30 0m-16 4c4-3 7-3 10 0" {...line} stroke="var(--art-accent)" />
          <path d="M123 89h111l-20 33h-71Z" fill="var(--art-front)" stroke="var(--ink)" strokeWidth="2.3" />
          <circle cx="177" cy="69" r="9" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M177 78v24m0-15-26 15m26-15 25 15m-51-1-17 29m68-29 17 29" {...line} />
          <path d="M250 73c20 0 37-8 54-22m-8 0 10-2-2 10" {...line} stroke="var(--art-warm)" />
          <path d="M299 51q21 13 42 5v42q-21 8-42-5Z" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2" />
        </>
      );

    case 'mist-path':
      return (
        <>
          <path d="M0 62q61-30 122 0t109 0 123 0v86H0Z" fill="var(--art-back)" opacity=".75" />
          <path d="M0 91q60-22 120 0t118 0 116 0v57H0Z" fill="var(--art-mid)" opacity=".8" />
          <path d="M106 148c12-28 51-32 57-55s-12-32 11-48 32-22 35-39" {...line} stroke="var(--art-warm)" strokeWidth="8" />
          <ellipse cx="142" cy="112" rx="20" ry="8" fill="var(--art-warm)" opacity=".85" />
          <path d="M22 43h94m35-13h83m28 20h70M6 75h61m206 6h69" {...softLine} stroke="var(--art-line)" strokeWidth="7" />
          <circle cx="119" cy="106" r="8" fill="var(--art-accent)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M119 114v22m0-14-11 8m11-8 12 8" {...line} />
        </>
      );

    case 'eight-streams-river': {
      const starts = [18, 59, 100, 141, 213, 254, 295, 336];
      return (
        <>
          <path d="M0 118q90-22 177-3t177 3v30H0Z" fill="var(--art-front)" />
          {starts.map((x, index) => (
            <path
              key={x}
              d={`M${x} 16c${index < 4 ? 8 : -8} 31 ${177 - x} 48 ${177 - x} 98`}
              {...line}
              stroke={index % 3 === 0 ? 'var(--art-warm)' : 'var(--art-accent)'}
              strokeWidth="4"
              opacity=".82"
            />
          ))}
          <path d="M177 112c-33 13-44 24-47 36h94c-3-12-14-23-47-36Z" fill="var(--art-accent)" opacity=".85" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="177" cy="112" r="7" fill="var(--art-warm)" />
        </>
      );
    }

    case 'tide-line':
      return (
        <>
          <path d="M0 0h160c24 23 24 43 0 64s-24 44 0 84H0Z" fill="var(--art-mid)" />
          <path d="M160 0c24 23 24 43 0 64s-24 44 0 84" {...line} stroke="var(--art-accent)" strokeWidth="5" />
          <path d="M197 0v148" {...softLine} stroke="var(--art-warm)" strokeDasharray="8 7" />
          <path d="m185 20 12-8 12 8m-24 31 12-8 12 8m-24 31 12-8 12 8m-24 31 12-8 12 8" {...softLine} stroke="var(--art-warm)" />
          <circle cx="257" cy="72" r="10" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M257 82v32m0-20-19 8m19-8 17 11m-17 9-14 23m14-23 18 20" {...line} />
          <path d="M229 104h-22" {...line} stroke="var(--art-warm)" />
        </>
      );

    case 'ebb-and-flow':
      return (
        <>
          <circle cx="177" cy="47" r="20" fill="var(--art-sun)" />
          <path d="M0 110q34-22 68 0t68 0 68 0 68 0 82 0v38H0Z" fill="var(--art-mid)" />
          <path d="M0 116q34-21 68 0t68 0 68 0 68 0 82 0" {...line} stroke="var(--art-accent)" />
          <path d="M75 78c23-24 55-31 84-19m-10-8 13 9-15 5" {...line} stroke="var(--art-warm)" />
          <path d="M279 78c-23-24-55-31-84-19m10-8-13 9 15 5" {...line} stroke="var(--art-accent)" />
          <path d="M91 132h54m64 0h54" {...softLine} stroke="var(--art-line)" strokeWidth="5" />
        </>
      );

    case 'milk-warning':
      return (
        <>
          <path d="M0 126h354v22H0Z" fill="var(--art-front)" />
          <path d="M99 75h118l-10 50H109Z" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M217 83h31" {...line} />
          <path d="M106 102q50-13 104 0v19H106Z" fill="var(--art-warm)" opacity=".82" />
          <circle cx="131" cy="95" r="4" fill="var(--dune)" />
          <circle cx="159" cy="91" r="6" fill="var(--dune)" />
          <circle cx="190" cy="96" r="3.5" fill="var(--dune)" />
          <path d="M128 70c-6-8 6-11 0-21m31 21c-6-9 7-12 0-22m31 22c-6-8 7-11 0-21" {...line} stroke="var(--art-warm)" />
          <path d="M253 77c12-19 34-22 51-5-12 21-34 23-51 5Z" fill="var(--dune)" stroke="var(--ink)" strokeWidth="2.2" />
          <circle cx="282" cy="76" r="5" fill="var(--art-accent)" />
          <path d="M274 105c16 0 28 7 33 20m-42 0h52" {...line} />
          <circle cx="291" cy="125" r="7" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="m291 118-4 7" {...softLine} />
        </>
      );

    case 'self-manual':
      return (
        <>
          <path d="M31 34c44-12 89-5 128 15v78c-40-20-84-27-128-15Zm292 0c-44-12-89-5-128 15v78c40-20 84-27 128-15Z" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.4" />
          <path d="M159 49c11-8 25-8 36 0v78c-11-8-25-8-36 0Z" fill="var(--art-front)" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="89" cy="67" r="10" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M89 77v20m0-13-12 8m12-8 12 8m-12 5-10 13m10-13 10 13" {...line} />
          {[58, 76, 94].map((y, index) => (
            <g key={y}>
              <rect x="217" y={y} width="10" height="10" rx="2" fill={index < 2 ? 'var(--art-accent)' : 'var(--dune)'} stroke="var(--ink)" strokeWidth="1.4" />
              <path d={`M235 ${y + 5}h55`} {...softLine} />
            </g>
          ))}
          <path d="M53 119c16-8 30-8 46 0m125 0c18-8 35-8 53 0" {...softLine} stroke="var(--art-warm)" />
        </>
      );

    case 'ready-coat':
      return (
        <>
          <path d="M0 124h354v24H0Z" fill="var(--art-front)" />
          <rect x="20" y="20" width="126" height="94" rx="6" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="2.3" />
          <path d="M83 20v94" {...softLine} />
          <path d="M30 49c6-17 31-16 37 0 15-7 29 7 22 22H21c-5-12 1-23 9-22Z" fill="var(--art-accent)" opacity=".7" stroke="var(--ink)" strokeWidth="1.8" />
          <path d="m34 79-4 10m22-10-4 10m22-10-4 10m38-43 8 13m-22-2 10 7m14 15 10 8" {...softLine} stroke="var(--art-accent)" />
          <path d="M236 21v28" {...line} />
          <path d="M224 47c-17 8-25 22-25 39v40h74V86c0-17-8-31-25-39l-12 12Z" fill="var(--art-warm)" opacity=".88" stroke="var(--ink)" strokeWidth="2.4" />
          <path d="m224 48 12 23 12-23m-12 23v55m-37-29-18 18m92-18 18 18" {...line} />
          <path d="M229 21c0-10 14-10 14 0 0 7-7 7-7 14" {...line} />
          <circle cx="236" cy="39" r="3" fill="var(--art-accent)" />
        </>
      );

    case 'skilled-traveler':
      return (
        <>
          <path d="M0 87q64-45 128 0t112-2 114 0v63H0Z" fill="var(--art-back)" />
          <path d="M0 119q66-27 132 0t108-5 114 5v29H0Z" fill="var(--art-front)" />
          <path d="M78 148c12-27 50-30 62-49s2-35 25-47 58 3 79-20 33-20 54-26" {...line} stroke="var(--art-warm)" strokeWidth="6" />
          <circle cx="146" cy="66" r="9" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M146 75v31m0-19-16 11m16-11 18 8m-18 11-14 24m14-24 18 22" {...line} />
          <rect x="158" y="77" width="18" height="25" rx="4" fill="var(--art-accent)" stroke="var(--ink)" strokeWidth="1.8" />
          <path d="M128 81h-14v23h16m-16-23 7-8 7 8m32 42 11 9" {...softLine} />
          <circle cx="229" cy="55" r="18" fill="var(--dune)" stroke="var(--ink)" strokeWidth="2" />
          <path d="m229 40 5 15-5 15-5-15Z" fill="var(--art-warm)" stroke="var(--ink)" strokeWidth="1.5" />
          <path d="M259 76c15-7 29-7 44 0v30c-15-7-29-7-44 0Zm44 0c12-6 22-6 34-1v30c-12-5-22-5-34 1Z" fill="var(--art-back)" stroke="var(--ink)" strokeWidth="1.8" />
        </>
      );
  }
}

/** Tekstgetrouwe beeldkaart die automatisch met het gekozen ontwerp meekleurt. */
export default function MetaphorArt({ art }: { art: MetaphorArtId }) {
  return (
    <svg
      viewBox="0 0 354 148"
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      aria-hidden="true"
      data-metaphor-art={art}
    >
      <rect width="354" height="148" fill="var(--dune)" />
      <Illustration art={art} />
    </svg>
  );
}
