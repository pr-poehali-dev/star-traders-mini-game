import { useState, useEffect } from 'react';
import PixelSprite from '@/components/PixelSprite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PlayerState {
  id: number;
  color: 'red' | 'blue' | 'green' | 'yellow';
  position: number;
  credits: number;
  cybernite: number;
  hasEnergy: boolean;
  hasNav: boolean;
  hasKey: boolean;
  hasArtefact: boolean;
}

interface Token {
  id: string;
  type: 'credit' | 'cyber' | 'energy' | 'nav' | 'key' | 'artefact' | 'empty';
  revealed: boolean;
  planetId: number;
}

export default function Index() {
  const { toast } = useToast();
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  
  const [players, setPlayers] = useState<PlayerState[]>([
    { id: 1, color: 'red', position: 0, credits: 0, cybernite: 0, hasEnergy: false, hasNav: false, hasKey: false, hasArtefact: false },
    { id: 2, color: 'blue', position: 1, credits: 0, cybernite: 0, hasEnergy: false, hasNav: false, hasKey: false, hasArtefact: false },
  ]);

  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const initialTokens: Token[] = [];
    const tokenTypes: Token['type'][] = ['credit', 'credit', 'cyber', 'cyber', 'energy', 'nav', 'key', 'empty', 'empty'];
    
    planets.slice(0, 4).forEach((planet) => {
      for (let i = 0; i < 3; i++) {
        const randomType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
        initialTokens.push({
          id: `${planet.id}-${i}`,
          type: randomType,
          revealed: false,
          planetId: planet.id
        });
      }
    });

    initialTokens.push({
      id: '5-0',
      type: 'artefact',
      revealed: false,
      planetId: 5
    });

    setTokens(initialTokens);
  }, []);

  const planets = [
    { id: 0, name: 'Лавара', type: 'lava', x: 15, y: 20 },
    { id: 1, name: 'Криос', type: 'ice', x: 70, y: 15 },
    { id: 2, name: 'Тех-7', type: 'tech', x: 80, y: 65 },
    { id: 3, name: 'Вулкар', type: 'lava', x: 25, y: 75 },
    { id: 4, name: 'Небула', type: 'nebula', x: 45, y: 45 },
  ];

  const rollDice = () => {
    setIsRolling(true);
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        toast({
          title: `🎲 Выпало ${finalValue}`,
          description: 'Выберите планету для перемещения',
        });
      }
    }, 100);
  };

  const moveToPlanet = (planetId: number) => {
    if (!diceValue) return;
    
    const newPlayers = [...players];
    newPlayers[currentPlayer].position = planetId;
    setPlayers(newPlayers);
    setSelectedPlanet(planetId);
    
    setParticles([...particles, { id: Date.now(), x: planets[planetId].x, y: planets[planetId].y }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== Date.now()));
    }, 1000);

    toast({
      title: '🚀 Прыжок завершён!',
      description: `Корабль ${players[currentPlayer].color} прибыл на ${planets[planetId].name}`,
    });
  };

  const scanToken = () => {
    const currentPos = players[currentPlayer].position;
    const planetTokens = tokens.filter(t => t.planetId === currentPos && !t.revealed);
    
    if (planetTokens.length === 0) {
      toast({
        title: '🔍 Нет жетонов',
        description: 'На этой планете все жетоны уже открыты',
        variant: 'destructive'
      });
      return;
    }

    const randomToken = planetTokens[Math.floor(Math.random() * planetTokens.length)];
    
    setTokens(tokens.map(t => 
      t.id === randomToken.id ? { ...t, revealed: true } : t
    ));

    const newPlayers = [...players];
    const player = newPlayers[currentPlayer];

    switch (randomToken.type) {
      case 'credit':
        player.credits = Math.min(7, player.credits + 1);
        toast({ title: '💰 Кредиты!', description: '+1 галактический кредит' });
        break;
      case 'cyber':
        player.cybernite = Math.min(5, player.cybernite + 1);
        toast({ title: '💎 Кибернит!', description: '+1 кристалл кибернита' });
        break;
      case 'energy':
        player.hasEnergy = true;
        toast({ title: '⚡ Энерго-ядро!', description: 'Получен модуль гипер-двигателя' });
        break;
      case 'nav':
        player.hasNav = true;
        toast({ title: '🧭 Нав-комп!', description: 'Получен навигационный компьютер' });
        break;
      case 'key':
        player.hasKey = true;
        toast({ title: '🔑 Ключ-карта!', description: 'Можно открыть артефакт' });
        break;
      case 'artefact':
        if (player.hasKey) {
          player.hasArtefact = true;
          toast({ title: '🏆 АРТЕФАКТ!', description: 'Возвращайтесь на родную планету!' });
        } else {
          toast({ title: '🔒 Заблокировано', description: 'Нужна ключ-карта', variant: 'destructive' });
        }
        break;
      case 'empty':
        toast({ title: '🌌 Пусто', description: 'Здесь ничего нет' });
        break;
    }

    setPlayers(newPlayers);
    nextTurn();
  };

  const hyperJump = () => {
    if (!players[currentPlayer].hasEnergy || !players[currentPlayer].hasNav) return;
    
    toast({
      title: '🌟 Гипер-прыжок активирован!',
      description: 'Выберите любую планету',
    });
  };

  const nextTurn = () => {
    setDiceValue(null);
    setCurrentPlayer((currentPlayer + 1) % players.length);
  };

  const player = players[currentPlayer];
  const planetTokens = tokens.filter(t => t.planetId === selectedPlanet && !t.revealed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-purple-950 to-space-dark overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}

        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: 'particle-burst 1s ease-out forwards'
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-secondary rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-30px)`,
                  opacity: 0,
                  animation: 'particle-fade 0.8s ease-out forwards',
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="container mx-auto p-4 relative z-10">
        <header className="text-center py-6 mb-4">
          <h1 className="text-2xl md:text-4xl text-primary mb-2 drop-shadow-[0_0_20px_rgba(136,85,255,0.9)] animate-pulse-glow">
            STAR TRADERS
          </h1>
          <p className="text-secondary text-sm md:text-base tracking-wider">Космическая настолка • 2-4 игрока</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-primary/30 p-6 shadow-[0_0_30px_rgba(136,85,255,0.3)]">
            <div className="relative aspect-square w-full max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-radial from-space-nebula/20 to-transparent rounded-lg" />
              
              {planets.map((planet) => (
                <div
                  key={planet.id}
                  onClick={() => diceValue && moveToPlanet(planet.id)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    diceValue ? 'hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(136,85,255,0.8)]' : ''
                  } ${selectedPlanet === planet.id ? 'scale-110' : ''}`}
                  style={{ left: `${planet.x}%`, top: `${planet.y}%` }}
                >
                  <div className="relative">
                    <div className={planet.type === 'nebula' ? 'animate-pulse-glow' : 'animate-float'}>
                      <PixelSprite
                        type={planet.type === 'nebula' ? 'nebula' : 'planet'}
                        color={planet.type as any}
                        size={planet.type === 'nebula' ? 96 : 72}
                      />
                    </div>
                    
                    {planet.id !== 4 && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {tokens.filter(t => t.planetId === planet.id && !t.revealed).map((token, idx) => (
                          <div
                            key={token.id}
                            className="w-3 h-3 bg-muted/60 border border-primary/40 rounded-full animate-pulse"
                            style={{ animationDelay: `${idx * 0.2}s` }}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="text-center mt-2">
                      <p className="text-xs text-foreground/90 font-bold tracking-wide drop-shadow-lg">{planet.name}</p>
                    </div>
                    
                    {players.filter(p => p.position === planet.id).map((p, idx) => (
                      <div
                        key={p.id}
                        className="absolute -top-4 animate-float"
                        style={{ 
                          animationDelay: `${p.id * 0.5}s`,
                          left: `${idx * 20 - 10}px`
                        }}
                      >
                        <div className={`${currentPlayer === players.indexOf(p) ? 'ring-4 ring-secondary rounded-full animate-pulse-glow' : ''}`}>
                          <PixelSprite type="ship" color={p.color} size={40} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
                <svg width="400" height="400" className="animate-spin" style={{ animationDuration: '80s' }}>
                  <circle cx="200" cy="200" r="180" fill="none" stroke="#8855ff" strokeWidth="2" strokeDasharray="6 6" />
                  <circle cx="200" cy="200" r="130" fill="none" stroke="#00ffff" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="200" cy="200" r="80" fill="none" stroke="#ff5555" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-card/90 backdrop-blur-sm border-primary/40 p-4 shadow-[0_0_20px_rgba(136,85,255,0.2)]">
              <div className="flex items-center gap-3 mb-4 p-2 bg-primary/10 rounded-lg">
                <div className="relative">
                  <PixelSprite type="ship" color={player.color} size={56} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">Игрок {currentPlayer + 1}</h3>
                  <p className="text-sm text-secondary capitalize font-semibold">{player.color} корабль</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded border border-yellow-500/30">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <PixelSprite type="credit" size={24} />
                    Кредиты
                  </span>
                  <span className="text-lg font-bold text-yellow-400">{player.credits}/7</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded border border-cyan-500/30">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <PixelSprite type="cyber" size={24} />
                    Кибернит
                  </span>
                  <span className="text-lg font-bold text-cyan-400">{player.cybernite}/5</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className={`text-xs p-3 rounded-lg border-2 transition-all ${player.hasEnergy ? 'bg-green-900/40 border-green-400 shadow-[0_0_10px_rgba(0,255,0,0.3)]' : 'bg-muted/20 border-border'}`}>
                  <div className="text-center">⚡</div>
                  <div className="text-center mt-1">Энерго-ядро</div>
                </div>
                <div className={`text-xs p-3 rounded-lg border-2 transition-all ${player.hasNav ? 'bg-green-900/40 border-green-400 shadow-[0_0_10px_rgba(0,255,0,0.3)]' : 'bg-muted/20 border-border'}`}>
                  <div className="text-center">🧭</div>
                  <div className="text-center mt-1">Нав-комп</div>
                </div>
                <div className={`text-xs p-3 rounded-lg border-2 transition-all ${player.hasKey ? 'bg-green-900/40 border-green-400 shadow-[0_0_10px_rgba(0,255,0,0.3)]' : 'bg-muted/20 border-border'}`}>
                  <div className="flex justify-center">
                    <PixelSprite type="key" size={20} />
                  </div>
                  <div className="text-center mt-1">Ключ-карта</div>
                </div>
                <div className={`text-xs p-3 rounded-lg border-2 transition-all ${player.hasArtefact ? 'bg-yellow-900/40 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.5)] animate-pulse-glow' : 'bg-muted/20 border-border'}`}>
                  <div className="flex justify-center">
                    <PixelSprite type="artefact" size={20} />
                  </div>
                  <div className="text-center mt-1">Артефакт</div>
                </div>
              </div>

              <div className="text-center py-4">
                {diceValue && (
                  <div className="text-7xl font-bold text-primary mb-4 animate-pulse-glow drop-shadow-[0_0_20px_rgba(136,85,255,1)]">
                    {diceValue}
                  </div>
                )}
                <Button
                  onClick={rollDice}
                  disabled={isRolling || diceValue !== null}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-bold py-6 shadow-[0_0_20px_rgba(136,85,255,0.5)] transition-all"
                  size="lg"
                >
                  <Icon name="Dices" size={24} className="mr-2" />
                  {isRolling ? 'Бросаю...' : diceValue ? 'Ход сделан' : 'Бросить кубик'}
                </Button>
              </div>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-primary/40 p-4 shadow-[0_0_20px_rgba(136,85,255,0.2)]">
              <h4 className="font-bold mb-3 text-primary text-lg">Действия</h4>
              <div className="space-y-2">
                <Button
                  onClick={scanToken}
                  variant="outline"
                  className="w-full justify-start border-secondary/60 hover:bg-secondary/30 hover:border-secondary hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                  disabled={!diceValue || selectedPlanet === null}
                >
                  <Icon name="Search" size={20} className="mr-2" />
                  Скан ({planetTokens.length} жетонов)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-accent/60 hover:bg-accent/30 hover:border-accent transition-all"
                  disabled={!diceValue}
                >
                  <Icon name="Swords" size={20} className="mr-2" />
                  Рейд
                </Button>
                <Button
                  onClick={hyperJump}
                  variant="outline"
                  className="w-full justify-start border-primary/60 hover:bg-primary/30 hover:border-primary hover:shadow-[0_0_15px_rgba(136,85,255,0.4)] transition-all"
                  disabled={!player.hasEnergy || !player.hasNav}
                >
                  <Icon name="Zap" size={20} className="mr-2" />
                  Гипер-прыжок {player.hasEnergy && player.hasNav ? '✓' : '✗'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes particle-fade {
          to {
            opacity: 0;
            transform: translateY(-50px) scale(0);
          }
        }

        @keyframes particle-burst {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(0); }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
