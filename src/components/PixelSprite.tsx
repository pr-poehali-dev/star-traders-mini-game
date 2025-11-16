interface PixelSpriteProps {
  type: 'ship' | 'planet' | 'nebula' | 'artefact' | 'cyber' | 'credit' | 'key';
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'lava' | 'ice' | 'tech';
  size?: number;
  className?: string;
}

export default function PixelSprite({ type, color = 'red', size = 32, className = '' }: PixelSpriteProps) {
  const renderShip = (shipColor: string) => (
    <g>
      <rect x="0" y="1" width="1" height="1" fill="#111"/>
      <rect x="1" y="0" width="6" height="1" fill={shipColor}/>
      <rect x="2" y="1" width="4" height="1" fill={shipColor}/>
      <rect x="1" y="2" width="1" height="1" fill={shipColor}/>
      <rect x="6" y="2" width="1" height="1" fill={shipColor}/>
      <rect x="2" y="3" width="4" height="1" fill={shipColor}/>
      <rect x="3" y="4" width="2" height="1" fill={shipColor} opacity="0.7"/>
    </g>
  );

  const renderPlanet = (planetType: string) => {
    const colors = {
      lava: { main: '#ff6633', accent: '#cc4422', glow: '#ff8844' },
      ice: { main: '#88ccff', accent: '#5599cc', glow: '#aaddff' },
      tech: { main: '#444444', accent: '#222222', glow: '#00ff00' }
    };
    const c = colors[planetType as keyof typeof colors] || colors.lava;
    
    return (
      <g>
        <rect x="0" y="2" width="8" height="4" fill={c.main}/>
        <rect x="1" y="1" width="6" height="1" fill={c.accent}/>
        <rect x="1" y="5" width="6" height="1" fill={c.accent}/>
        <rect x="2" y="3" width="4" height="2" fill={c.glow}/>
      </g>
    );
  };

  const renderNebula = () => (
    <g>
      <rect x="0" y="1" width="8" height="6" fill="#8855ff" opacity="0.9"/>
      <rect x="1" y="2" width="6" height="4" fill="#aa77ff"/>
      <rect x="2" y="3" width="4" height="2" fill="#cc99ff"/>
    </g>
  );

  const renderArtefact = () => (
    <g>
      <rect x="2" y="2" width="4" height="4" fill="#ffdd00"/>
      <rect x="3" y="1" width="2" height="1" fill="#bbaa00"/>
      <rect x="3" y="6" width="2" height="1" fill="#bbaa00"/>
      <rect x="2" y="3" width="1" height="2" fill="#bbaa00"/>
      <rect x="6" y="3" width="1" height="2" fill="#bbaa00"/>
    </g>
  );

  const renderCyber = () => (
    <g>
      <rect x="3" y="1" width="2" height="6" fill="#00ffaa"/>
      <rect x="5" y="2" width="2" height="4" fill="#00dd88"/>
      <rect x="4" y="3" width="2" height="2" fill="#00ffcc"/>
    </g>
  );

  const renderCredit = () => (
    <g>
      <rect x="3" y="2" width="2" height="4" fill="#ffdd00"/>
      <rect x="2" y="3" width="1" height="2" fill="#bbaa00"/>
      <rect x="5" y="3" width="1" height="2" fill="#bbaa00"/>
    </g>
  );

  const renderKey = () => (
    <g>
      <rect x="3" y="1" width="2" height="6" fill="#888"/>
      <rect x="4" y="2" width="1" height="4" fill="#ffff00"/>
    </g>
  );

  const shipColors = {
    red: '#ff5555',
    blue: '#55aaff',
    green: '#55ff55',
    yellow: '#ffff55'
  };

  let content;
  if (type === 'ship') {
    content = renderShip(shipColors[color as keyof typeof shipColors] || shipColors.red);
  } else if (type === 'planet') {
    content = renderPlanet(color);
  } else if (type === 'nebula') {
    content = renderNebula();
  } else if (type === 'artefact') {
    content = renderArtefact();
  } else if (type === 'cyber') {
    content = renderCyber();
  } else if (type === 'credit') {
    content = renderCredit();
  } else if (type === 'key') {
    content = renderKey();
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 8 8" 
      className={`pixel-perfect ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {content}
    </svg>
  );
}
