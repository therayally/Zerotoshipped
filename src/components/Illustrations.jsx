// Subject illustrations for each module, drawn in a 300x300 box with one shared palette.
// Keep the top-left (module number) and bottom-left (tool logos) corners clear.

export const PAL = {
  white: '#FFFFFF',
  paper: '#EEF1FF',
  lilac: '#C5CDFD',
  violet: '#6E7CF5',
  ink: '#1A1F4E',
  pink: '#F48AA7',
  mint: '#6EE2CF',
};
const { white: W, paper: L, lilac: V2, violet: V, ink: D, pink: P, mint: M } = PAL;

// A soft drop shadow drawn as an offset shape.
const Shadow = ({ children }) => <g transform="translate(6 9)" opacity="0.22" fill="#000">{children}</g>;

function Window({ x, y, w, h, dark, children }) {
  return (
    <g>
      <Shadow><rect x={x} y={y} width={w} height={h} rx="5" /></Shadow>
      <rect x={x} y={y} width={w} height={h} rx="5" fill={dark ? D : W} />
      <circle cx={x + 14} cy={y + 13} r="3.5" fill={P} />
      <circle cx={x + 26} cy={y + 13} r="3.5" fill={V2} />
      <circle cx={x + 38} cy={y + 13} r="3.5" fill={M} />
      <line x1={x} x2={x + w} y1={y + 26} y2={y + 26} stroke={dark ? '#2E3570' : L} strokeWidth="1.5" />
      {children}
    </g>
  );
}

const Bar = ({ x, y, w, c = L, h = 7 }) => <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={c} />;
const Sparkle = ({ x, y, s = 1, c = W }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -10 C1.5 -3 3 -1.5 10 0 C3 1.5 1.5 3 0 10 C-1.5 3 -3 1.5 -10 0 C-3 -1.5 -1.5 -3 0 -10 Z" fill={c} />
);
const Check = ({ x, y, r = 12, c = M }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={c} />
    <path d={`M${x - r * 0.42} ${y} l${r * 0.3} ${r * 0.3} l${r * 0.55} -${r * 0.6}`} fill="none" stroke={D} strokeWidth={r * 0.22} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const scenes = {
  // Start: a rocket launching along a dotted path.
  start: () => (
    <g>
      <path d="M70 250 C 110 230, 130 200, 168 176" fill="none" stroke={V2} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
      <g transform="rotate(35 190 140)">
        <Shadow><path d="M190 52 C222 80 226 128 215 168 L165 168 C154 128 158 80 190 52 Z" /></Shadow>
        <path d="M168 168 Q190 228 212 168 Z" fill={P} />
        <path d="M178 168 Q190 205 202 168 Z" fill={W} opacity="0.9" />
        <path d="M190 52 C222 80 226 128 215 168 L165 168 C154 128 158 80 190 52 Z" fill={W} />
        <path d="M190 52 C206 66 214 84 217 102 L163 102 C166 84 174 66 190 52 Z" fill={P} />
        <circle cx="190" cy="126" r="15" fill={V} stroke={L} strokeWidth="5" />
        <path d="M165 140 L140 176 L166 170 Z" fill={V2} />
        <path d="M215 140 L240 176 L214 170 Z" fill={V2} />
      </g>
      <Sparkle x={250} y={70} s={1.3} />
      <Sparkle x={110} y={110} s={0.8} c={V2} />
      <circle cx="262" cy="200" r="3" fill={W} opacity="0.8" />
      <circle cx="132" cy="62" r="2.5" fill={W} opacity="0.7" />
    </g>
  ),

  // Claude Code: a dark terminal with a prompt, plus a chat bubble.
  'ai-coder': () => (
    <g>
      <Window x={62} y={92} w={200} h={150} dark>
        <path d="M80 134 l10 8 l-10 8" fill="none" stroke={M} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <Bar x={98} y={138} w={92} c={V2} />
        <Bar x={80} y={162} w={130} c="#3E4689" />
        <Bar x={80} y={180} w={104} c="#3E4689" />
        <Bar x={80} y={198} w={140} c="#3E4689" />
        <rect x="80" y="214" width="12" height="16" rx="2" fill={W} />
      </Window>
      <g>
        <Shadow><path d="M170 46 h96 a12 12 0 0 1 12 12 v40 a12 12 0 0 1 -12 12 h-60 l-16 14 v-14 h-20 a12 12 0 0 1 -12 -12 v-40 a12 12 0 0 1 12 -12 Z" /></Shadow>
        <path d="M170 46 h96 a12 12 0 0 1 12 12 v40 a12 12 0 0 1 -12 12 h-60 l-16 14 v-14 h-20 a12 12 0 0 1 -12 -12 v-40 a12 12 0 0 1 12 -12 Z" fill={W} />
        <Sparkle x={184} y={78} s={1.1} c={P} />
        <Bar x={202} y={66} w={60} c={L} />
        <Bar x={202} y={84} w={42} c={L} />
      </g>
    </g>
  ),

  // Accounts: an ID card with avatar, plus a key.
  accounts: () => (
    <g>
      <Shadow><rect x="58" y="88" width="190" height="122" rx="5" /></Shadow>
      <rect x="58" y="88" width="190" height="122" rx="5" fill={W} />
      <rect x="58" y="88" width="190" height="30" rx="5" fill={V} />
      <rect x="58" y="106" width="190" height="12" fill={V} />
      <circle cx="102" cy="158" r="26" fill={L} />
      <circle cx="102" cy="150" r="10" fill={V} />
      <path d="M84 176 a18 14 0 0 1 36 0 Z" fill={V} />
      <Bar x={142} y={142} w={84} c={D} h={8} />
      <Bar x={142} y={160} w={64} c={L} />
      <Bar x={142} y={176} w={74} c={L} />
      <g transform="rotate(-20 232 214)">
        <Shadow><circle cx="212" cy="214" r="22" /></Shadow>
        <circle cx="212" cy="214" r="20" fill="none" stroke={P} strokeWidth="9" />
        <rect x="230" y="209" width="50" height="10" rx="4" fill={P} />
        <rect x="262" y="219" width="8" height="12" rx="2" fill={P} />
        <rect x="248" y="219" width="7" height="9" rx="2" fill={P} />
      </g>
      <Check x={242} y={86} r={14} />
    </g>
  ),

  // Plan: a kanban board with cards moving across.
  plan: () => (
    <g>
      <Shadow><rect x="50" y="78" width="220" height="164" rx="5" /></Shadow>
      <rect x="50" y="78" width="220" height="164" rx="5" fill={W} />
      {[0, 1, 2].map((c) => (
        <g key={c}>
          <rect x={62 + c * 70} y={92} width="62" height="138" rx="5" fill={L} />
          <Bar x={70 + c * 70} y={102} w={34} c={[V2, V, M][c]} h={6} />
        </g>
      ))}
      <rect x="68" y="118" width="50" height="30" rx="6" fill={W} />
      <rect x="68" y="154" width="50" height="24" rx="6" fill={W} />
      <rect x="68" y="184" width="50" height="30" rx="6" fill={W} />
      <rect x="138" y="118" width="50" height="34" rx="6" fill={P} />
      <rect x="208" y="118" width="50" height="26" rx="6" fill={W} />
      <rect x="208" y="150" width="50" height="30" rx="6" fill={W} />
      <path d="M120 140 C 130 128, 134 128, 136 132" fill="none" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
      <Check x={248} y={170} r={9} />
      <Check x={248} y={136} r={9} />
    </g>
  ),

  // Build: a code editor with </> and a gear.
  build: () => (
    <g>
      <Window x={56} y={74} w={208} h={156}>
        <text x="80" y="160" fontSize="54" fontWeight="800" fill={V} fontFamily="ui-monospace, Menlo, monospace">&lt;/&gt;</text>
        <Bar x={80} y={180} w={110} c={L} />
        <Bar x={80} y={196} w={80} c={L} />
        <Bar x={196} y={180} w={44} c={P} />
      </Window>
      <g transform="translate(236 220)">
        <Shadow><circle r="26" /></Shadow>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <rect key={a} x="-6" y="-31" width="12" height="14" rx="3" fill={D} transform={`rotate(${a})`} />)}
        <circle r="24" fill={D} />
        <circle r="10" fill={M} />
      </g>
    </g>
  ),

  // Beautiful UI: a design canvas with a layout, swatches and a pen tool.
  ui: () => (
    <g>
      <Window x={52} y={70} w={196} h={166}>
        <rect x="66" y="88" width="80" height="58" rx="6" fill={L} />
        <path d="M74 134 l18 -18 l14 12 l12 -8 l20 14 Z" fill={V2} />
        <text x="158" y="128" fontSize="40" fontWeight="800" fill={D} fontFamily="system-ui, sans-serif">Aa</text>
        {[P, V, M, D].map((c, i) => <circle key={c} cx={78 + i * 26} cy={172} r="10" fill={c} />)}
        <Bar x={66} y={196} w={120} c={L} />
        <Bar x={66} y={212} w={86} c={L} />
      </Window>
      <path d="M150 248 C 190 210, 230 250, 268 196" fill="none" stroke={W} strokeWidth="3" />
      <circle cx="150" cy="248" r="5" fill={W} />
      <rect x="263" y="191" width="10" height="10" fill={W} stroke={D} strokeWidth="2" />
      <g transform="rotate(30 248 120)">
        <Shadow><path d="M238 86 h20 l10 34 l-20 40 l-20 -40 Z" /></Shadow>
        <path d="M238 86 h20 l10 34 l-20 40 l-20 -40 Z" fill={P} />
        <circle cx="248" cy="124" r="5" fill={W} />
        <line x1="248" y1="129" x2="248" y2="158" stroke={W} strokeWidth="2" />
        <rect x="236" y="74" width="24" height="14" rx="3" fill={D} />
      </g>
    </g>
  ),

  // Building blocks: stacked layers (languages, database) with a plug (MCP).
  blocks: () => {
    const slab = (y, top, side, label) => (
      <g>
        <path d={`M150 ${y} l70 32 l-70 32 l-70 -32 Z`} fill={top} />
        <path d={`M80 ${y + 32} l70 32 v18 l-70 -32 Z`} fill={side} opacity="0.85" />
        <path d={`M220 ${y + 32} l-70 32 v18 l70 -32 Z`} fill={side} />
        <line x1="80" y1={y + 40} x2="64" y2={y + 40} stroke={W} strokeWidth="2" opacity="0.7" />
        <rect x="18" y={y + 30} width="46" height="20" rx="5" fill={W} />
        <text x="41" y={y + 44} textAnchor="middle" fontSize="11" fontWeight="800" fill={D} fontFamily="ui-monospace, Menlo, monospace">{label}</text>
      </g>
    );
    return (
      <g>
        <Shadow><path d="M150 168 l70 32 v18 l-70 32 l-70 -32 v-18 Z" /></Shadow>
        {slab(160, V2, '#5866E0', 'SQL')}
        {slab(118, L, V2, 'RUST')}
        {slab(76, W, L, 'TS')}
        <path d="M222 150 C 250 150, 256 196, 236 214" fill="none" stroke={W} strokeWidth="5" strokeLinecap="round" />
        <rect x="218" y="208" width="34" height="24" rx="6" fill={P} transform="rotate(30 235 220)" />
        <rect x="226" y="226" width="5" height="12" rx="2" fill={W} transform="rotate(30 235 220)" />
        <rect x="238" y="226" width="5" height="12" rx="2" fill={W} transform="rotate(30 235 220)" />
      </g>
    );
  },

  // Data and money: a database cylinder and a credit card.
  'data-money': () => (
    <g>
      <g>
        <Shadow><path d="M70 96 v100 a56 18 0 0 0 112 0 v-100 Z" /></Shadow>
        <path d="M70 96 v100 a56 18 0 0 0 112 0 v-100 Z" fill={W} />
        <path d="M70 130 a56 18 0 0 0 112 0" fill="none" stroke={L} strokeWidth="4" />
        <path d="M70 164 a56 18 0 0 0 112 0" fill="none" stroke={L} strokeWidth="4" />
        <ellipse cx="126" cy="96" rx="56" ry="18" fill={V2} />
        <circle cx="160" cy="146" r="4" fill={M} />
        <circle cx="160" cy="180" r="4" fill={M} />
      </g>
      <g transform="rotate(-12 210 190)">
        <Shadow><rect x="140" y="148" width="136" height="86" rx="5" /></Shadow>
        <rect x="140" y="148" width="136" height="86" rx="5" fill={P} />
        <rect x="140" y="166" width="136" height="16" fill={D} opacity="0.85" />
        <rect x="154" y="194" width="24" height="18" rx="3" fill={L} />
        <Bar x={190} y={200} w={70} c={W} h={6} />
        <Bar x={190} y={214} w={44} c={W} h={6} />
      </g>
      <g>
        <circle cx="236" cy="96" r="22" fill={M} />
        <text x="236" y="104" textAnchor="middle" fontSize="24" fontWeight="800" fill={D} fontFamily="system-ui, sans-serif">$</text>
      </g>
    </g>
  ),

  // Go live: a globe, your web address and an email.
  live: () => (
    <g>
      <Shadow><circle cx="160" cy="166" r="66" /></Shadow>
      <circle cx="160" cy="166" r="66" fill={W} />
      <ellipse cx="160" cy="166" rx="28" ry="66" fill="none" stroke={V2} strokeWidth="3.5" />
      <line x1="94" x2="226" y1="166" y2="166" stroke={V2} strokeWidth="3.5" />
      <path d="M104 132 h112 M104 200 h112" stroke={V2} strokeWidth="3.5" />
      <line x1="160" x2="160" y1="100" y2="232" stroke={V2} strokeWidth="3.5" />
      <g>
        <Shadow><rect x="70" y="64" width="190" height="34" rx="17" /></Shadow>
        <rect x="70" y="64" width="190" height="34" rx="17" fill={D} />
        <rect x="84" y="75" width="10" height="12" rx="2" fill={M} />
        <path d="M86 76 v-3 a3 3 0 0 1 6 0 v3" fill="none" stroke={M} strokeWidth="2" />
        <text x="104" y="86" fontSize="13" fontWeight="700" fill={W} fontFamily="system-ui, sans-serif">www.yourapp.com</text>
      </g>
      <g transform="rotate(10 240 222)">
        <Shadow><rect x="208" y="200" width="64" height="44" rx="6" /></Shadow>
        <rect x="208" y="200" width="64" height="44" rx="6" fill={P} />
        <path d="M208 204 l32 22 l32 -22" fill="none" stroke={W} strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    </g>
  ),

  // Security: a shield with a lock and a check.
  secure: () => (
    <g>
      <Shadow><path d="M160 58 L238 88 V150 C238 206 204 238 160 258 C116 238 82 206 82 150 V88 Z" /></Shadow>
      <path d="M160 58 L238 88 V150 C238 206 204 238 160 258 C116 238 82 206 82 150 V88 Z" fill={W} />
      <path d="M160 76 L222 100 V150 C222 196 194 222 160 238 Z" fill={L} />
      <rect x="132" y="146" width="56" height="46" rx="5" fill={V} />
      <path d="M142 146 v-14 a18 18 0 0 1 36 0 v14" fill="none" stroke={V} strokeWidth="8" />
      <circle cx="160" cy="164" r="6" fill={W} />
      <rect x="157" y="166" width="6" height="14" rx="2" fill={W} />
      <Check x={232} y={226} r={18} />
      <Sparkle x={86} y={232} s={0.9} c={V2} />
    </g>
  ),

  // Grown-up stuff: a checklist and a certification seal.
  'grown-up': () => (
    <g>
      <Shadow><rect x="70" y="70" width="150" height="180" rx="5" /></Shadow>
      <rect x="70" y="70" width="150" height="180" rx="5" fill={W} />
      <rect x="115" y="60" width="60" height="22" rx="5" fill={D} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          {i < 3 ? <Check x={96} y={112 + i * 36} r={10} /> : <circle cx="96" cy={112 + i * 36} r="10" fill="none" stroke={V2} strokeWidth="3" />}
          <Bar x={116} y={108 + i * 36} w={i === 3 ? 60 : 84} c={i === 3 ? L : V2} h={8} />
        </g>
      ))}
      <g transform="translate(232 196)">
        <Shadow><circle r="32" /></Shadow>
        <path d="M-14 22 l-8 38 l22 -12 l22 12 l-8 -38 Z" fill={V} />
        <circle r="32" fill={P} />
        <circle r="22" fill="none" stroke={W} strokeWidth="3" strokeDasharray="4 4" />
        <path d="M-10 0 l7 7 l13 -14" fill="none" stroke={W} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  ),

  // GitHub: a main line with a branch that merges back, over a code window.
  'github-pro': () => (
    <g>
      <Window x={60} y={120} w={180} h={130} dark>
        <Bar x={78} y={162} w={90} c={V} /><Bar x={78} y={180} w={120} c="#2E3570" /><Bar x={78} y={198} w={70} c={M} /><Bar x={78} y={216} w={104} c="#2E3570" />
      </Window>
      <path d="M40 90 H260" stroke={W} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M100 90 C130 90 130 46 160 46 H200 C230 46 230 90 250 90" stroke={M} strokeWidth="6" fill="none" strokeLinecap="round" />
      {[60, 100, 250].map((x) => <circle key={x} cx={x} cy={90} r="11" fill={V} stroke={W} strokeWidth="4" />)}
      {[160, 200].map((x) => <circle key={x} cx={x} cy={46} r="11" fill={P} stroke={W} strokeWidth="4" />)}
      <Sparkle x={262} y={150} s={1.1} />
    </g>
  ),

  // Power tools: a laptop with a chip (local AI) and a saved coin.
  'save-money': () => (
    <g>
      <Shadow><rect x="70" y="80" width="170" height="112" rx="5" /></Shadow>
      <rect x="70" y="80" width="170" height="112" rx="5" fill={D} />
      <rect x="80" y="90" width="150" height="92" rx="5" fill="#232A66" />
      <g transform="translate(155 136)">
        {[-18, -6, 6, 18].map((d) => (
          <g key={d}>
            <rect x={d - 2} y="-36" width="4" height="10" rx="1" fill={V2} />
            <rect x={d - 2} y="26" width="4" height="10" rx="1" fill={V2} />
            <rect x="-36" y={d - 2} width="10" height="4" rx="1" fill={V2} />
            <rect x="26" y={d - 2} width="10" height="4" rx="1" fill={V2} />
          </g>
        ))}
        <rect x="-26" y="-26" width="52" height="52" rx="5" fill={V} />
        <text y="7" textAnchor="middle" fontSize="18" fontWeight="800" fill={W} fontFamily="system-ui, sans-serif">AI</text>
      </g>
      <path d="M52 192 h206 l-14 18 h-178 Z" fill={W} />
      <g>
        <Shadow><circle cx="244" cy="96" r="24" /></Shadow>
        <circle cx="244" cy="96" r="24" fill={M} />
        <text x="244" y="104" textAnchor="middle" fontSize="24" fontWeight="800" fill={D} fontFamily="system-ui, sans-serif">$</text>
        <path d="M244 128 v18 m-8 -8 l8 8 l8 -8" fill="none" stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={210} y={230} s={0.9} c={P} />
    </g>
  ),

  // Agents: a friendly robot that works on a schedule.
  agents: () => (
    <g>
      <line x1="150" y1="60" x2="150" y2="84" stroke={W} strokeWidth="5" />
      <circle cx="150" cy="56" r="9" fill={P} />
      <Shadow><rect x="86" y="84" width="128" height="104" rx="26" /></Shadow>
      <rect x="86" y="84" width="128" height="104" rx="26" fill={W} />
      <rect x="102" y="104" width="96" height="56" rx="18" fill={D} />
      <circle cx="128" cy="132" r="10" fill={M} />
      <circle cx="172" cy="132" r="10" fill={M} />
      <rect x="74" y="118" width="12" height="32" rx="5" fill={V2} />
      <rect x="214" y="118" width="12" height="32" rx="5" fill={V2} />
      <rect x="112" y="192" width="76" height="46" rx="5" fill={L} />
      <circle cx="150" cy="215" r="8" fill={V} />
      <g transform="translate(240 206)">
        <Shadow><circle r="28" /></Shadow>
        <circle r="28" fill={P} />
        <circle r="21" fill={W} />
        <path d="M0 -12 v12 l9 6" fill="none" stroke={D} strokeWidth="4" strokeLinecap="round" />
      </g>
      <Sparkle x={248} y={90} s={1.1} />
    </g>
  ),

  // AI products: a phone with chat bubbles and a voice wave.
  'ai-products': () => (
    <g>
      <Shadow><rect x="96" y="60" width="108" height="196" rx="18" /></Shadow>
      <rect x="96" y="60" width="108" height="196" rx="18" fill={D} />
      <rect x="104" y="74" width="92" height="170" rx="5" fill={W} />
      <rect x="132" y="66" width="36" height="5" rx="2.5" fill="#2E3570" />
      <rect x="112" y="88" width="62" height="24" rx="5" fill={L} />
      <rect x="128" y="120" width="60" height="24" rx="5" fill={V} />
      <rect x="112" y="152" width="70" height="24" rx="5" fill={L} />
      <rect x="138" y="184" width="50" height="24" rx="5" fill={P} />
      <g transform="translate(232 150)">
        {[[-16, 14], [-8, 26], [0, 40], [8, 22], [16, 12]].map(([x, h]) => <rect key={x} x={x - 3} y={-h / 2} width="6" height={h} rx="3" fill={W} />)}
      </g>
      <Sparkle x={70} y={110} s={1.2} c={M} />
      <Sparkle x={250} y={92} s={0.8} />
    </g>
  ),

  // Final project: a storefront with chat and a ringing phone.
  capstone: () => (
    <g>
      <Shadow><rect x="70" y="118" width="170" height="126" rx="6" /></Shadow>
      <rect x="70" y="118" width="170" height="126" rx="6" fill={W} />
      <path d="M62 96 h186 l-8 30 h-170 Z" fill={P} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${70 + i * 28.3} 126 a14.15 12 0 0 0 28.3 0`} fill={i % 2 ? P : W} />
      ))}
      <rect x="86" y="160" width="60" height="44" rx="4" fill={L} />
      <rect x="168" y="160" width="52" height="84" rx="4" fill={V} />
      <circle cx="208" cy="204" r="3.5" fill={W} />
      <g>
        <Shadow><path d="M170 50 h76 a10 10 0 0 1 10 10 v28 a10 10 0 0 1 -10 10 h-46 l-12 12 v-12 h-18 a10 10 0 0 1 -10 -10 v-28 a10 10 0 0 1 10 -10 Z" /></Shadow>
        <path d="M170 50 h76 a10 10 0 0 1 10 10 v28 a10 10 0 0 1 -10 10 h-46 l-12 12 v-12 h-18 a10 10 0 0 1 -10 -10 v-28 a10 10 0 0 1 10 -10 Z" fill={W} />
        <circle cx="186" cy="74" r="4.5" fill={V} />
        <circle cx="200" cy="74" r="4.5" fill={V} />
        <circle cx="214" cy="74" r="4.5" fill={V} />
      </g>
      <g transform="translate(260 196) rotate(-15)">
        <Shadow><rect x="-16" y="-28" width="32" height="56" rx="7" /></Shadow>
        <rect x="-16" y="-28" width="32" height="56" rx="7" fill={D} />
        <rect x="-11" y="-21" width="22" height="38" rx="3" fill={M} />
      </g>
      <path d="M286 170 a20 20 0 0 1 0 28 M294 162 a32 32 0 0 1 0 44" fill="none" stroke={W} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
};

export function Scene({ moduleId }) {
  const S = scenes[moduleId] || scenes.start;
  return <S />;
}
