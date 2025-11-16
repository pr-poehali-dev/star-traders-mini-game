import { useState } from 'react';
import PixelSprite from '@/components/PixelSprite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

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

export default function Index() {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  const [players] = useState<PlayerState[]>([
    { id: 1, color: 'red', position: 0, credits: 0, cybernite: 0, hasEnergy: false, hasNav: false, hasKey: false, hasArtefact: false },
    { id: 2, color: 'blue', position: 1, credits: 0, cybernite: 0, hasEnergy: false, hasNav: false, hasKey: false, hasArtefact: false },
  ]);

  const planets = [
    { id: 1, name: 'Лавара', type: 'lava', x: 15, y: 20 },
    { id: 2, name: 'Криос', type: 'ice', x: 70, y: 15 },
    { id: 3, name: 'Тех-7', type: 'tech', x: 80, y: 65 },
    { id: 4, name: 'Вулкар', type: 'lava', x: 25, y: 75 },
    { id: 5, name: 'Небула', type: 'nebula', x: 45, y: 45 },
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
      }
    }, 100);
  };

  const player = players[currentPlayer];

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-purple-950 to-space-dark overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <div className="container mx-auto p-4 relative z-10">
        <header className="text-center py-6 mb-4">
          <h1 className="text-2xl md:text-4xl text-primary mb-2 drop-shadow-[0_0_10px_rgba(136,85,255,0.8)]">
            STAR TRADERS
          </h1>
          <p className="text-secondary text-sm md:text-base">Космическая настолка • 2-4 игрока</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-primary/30 p-6">
            <div className="relative aspect-square w-full max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-radial from-space-nebula/20 to-transparent rounded-lg" />
              
              {planets.map((planet) => (
                <div
                  key={planet.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                  style={{ left: `${planet.x}%`, top: `${planet.y}%` }}
                >
                  <div className="relative">
                    <div className={planet.type === 'nebula' ? 'animate-pulse-glow' : 'animate-float'}>
                      <PixelSprite
                        type={planet.type === 'nebula' ? 'nebula' : 'planet'}
                        color={planet.type as any}
                        size={planet.type === 'nebula' ? 80 : 64}
                      />
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-xs text-foreground/80 font-semibold">{planet.name}</p>
                    </div>
                    
                    {players.filter(p => p.position === planet.id).map((p) => (
                      <div
                        key={p.id}
                        className="absolute -top-2 -right-2 animate-float"
                        style={{ animationDelay: `${p.id * 0.5}s` }}
                      >
                        <PixelSprite type="ship" color={p.color} size={32} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
                <svg width="300" height="300" className="animate-spin" style={{ animationDuration: '60s' }}>
                  <circle cx="150" cy="150" r="140" fill="none" stroke="#8855ff" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="150" cy="150" r="100" fill="none" stroke="#00ffff" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/30 p-4">
              <div className="flex items-center gap-3 mb-4">
                <PixelSprite type="ship" color={player.color} size={48} />
                <div>
                  <h3 className="text-lg font-bold text-primary">Игрок {currentPlayer + 1}</h3>
                  <p className="text-sm text-muted-foreground">Ход: {player.color}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <PixelSprite type="credit" size={24} />
                    Кредиты
                  </span>
                  <span className="font-bold text-yellow-400">{player.credits}/7</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <PixelSprite type="cyber" size={24} />
                    Кибернит
                  </span>
                  <span className="font-bold text-cyan-400">{player.cybernite}/5</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className={`text-xs p-2 rounded border ${player.hasEnergy ? 'bg-green-900/30 border-green-500' : 'bg-muted/30 border-border'}`}>
                  ⚡ Энерго-ядро
                </div>
                <div className={`text-xs p-2 rounded border ${player.hasNav ? 'bg-green-900/30 border-green-500' : 'bg-muted/30 border-border'}`}>
                  🧭 Нав-комп
                </div>
                <div className={`text-xs p-2 rounded border ${player.hasKey ? 'bg-green-900/30 border-green-500' : 'bg-muted/30 border-border'}`}>
                  <PixelSprite type="key" size={16} className="inline mr-1" />
                  Ключ-карта
                </div>
                <div className={`text-xs p-2 rounded border ${player.hasArtefact ? 'bg-green-900/30 border-green-500' : 'bg-muted/30 border-border'}`}>
                  <PixelSprite type="artefact" size={16} className="inline mr-1" />
                  Артефакт
                </div>
              </div>

              <div className="text-center py-6">
                {diceValue && (
                  <div className="text-6xl font-bold text-primary mb-4 animate-pulse-glow">
                    {diceValue}
                  </div>
                )}
                <Button
                  onClick={rollDice}
                  disabled={isRolling}
                  className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-6"
                  size="lg"
                >
                  <Icon name="Dices" size={24} className="mr-2" />
                  {isRolling ? 'Бросаю...' : 'Бросить кубик'}
                </Button>
              </div>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-primary/30 p-4">
              <h4 className="font-bold mb-3 text-primary">Действия</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-secondary/50 hover:bg-secondary/20"
                  disabled={!diceValue}
                >
                  <Icon name="Search" size={20} className="mr-2" />
                  Скан
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-accent/50 hover:bg-accent/20"
                  disabled={!diceValue}
                >
                  <Icon name="Swords" size={20} className="mr-2" />
                  Рейд
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-primary/50 hover:bg-primary/20"
                  disabled={!player.hasEnergy || !player.hasNav}
                >
                  <Icon name="Zap" size={20} className="mr-2" />
                  Гипер-прыжок
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
