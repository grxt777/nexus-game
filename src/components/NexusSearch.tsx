import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, AlertTriangle } from 'lucide-react';
import { audioEngine } from '../AudioEngine';

export default function NexusSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    audioEngine.playKeyPress(true);
    setIsBlocked(false);
    
    const q = query.toLowerCase();

    if (q.includes('project lazarus') || q.includes('node_17')) {
      setIsBlocked(true);
      setResults([]);
      audioEngine.playError();
      return;
    }

    if (q.includes('station personnel')) {
      setResults([
        {
          title: 'Lazarus Station — Команда (официальная страница)',
          content: 'Директор: Эрик Хольм\nГлавный инженер: [REDACTED]\nПерсонал: 47 сотрудников\nСтатус: АКТИВНА\nПоследнее обновление: 2029-01-15'
        }
      ]);
    } else if (q.includes('karin wald') || q.includes('карин вальд')) {
      setResults([
        {
          title: 'Кадровая страница — Карин Вальд',
          content: 'Должность: Старший сетевой инженер\nСтатус: УВОЛЕНА [2031-02-14]\nПричина: нарушение протокола безопасности\nДоступ к системе: ОТОЗВАН'
        }
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="h-full bg-surface flex flex-col p-8 overflow-hidden">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-mono font-bold tracking-[0.2em] text-warning">🔍 NEXUS SEARCH</h1>
          <p className="text-[10px] text-text-dim uppercase tracking-widest italic font-mono">"Knowledge is the property of all"</p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search Lazarus Intranet..."
            className="w-full bg-black border border-[#444] p-4 pl-12 text-text-main font-mono text-sm focus:border-warning outline-none transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-warning/20 hover:bg-warning/40 px-4 py-1 text-[10px] font-mono text-warning transition-colors border border-warning/30"
          >
            EXECUTE
          </button>
        </div>

        <div className="text-[10px] text-text-dim border-l-2 border-[#333] pl-4 py-2 font-mono">
          ℹ️ NEXUS Search индексирует только одобренный контент. Запросы логируются. Несанкционированные запросы передаются в отдел безопасности.
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[400px] pr-4 scrollbar-hide">
          {isBlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error/10 border border-error/50 p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-error font-mono font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>ACCESS DENIED</span>
              </div>
              <p className="text-sm text-text-main/80 font-mono">
                Этот термин не индексируется. Запрос заблокирован системой безопасности. Ваш IP зафиксирован.
              </p>
            </motion.div>
          ) : results ? (
            results.length > 0 ? (
              results.map((res, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-2 group cursor-pointer"
                >
                  <h3 className="text-warning group-hover:underline font-mono font-bold">{res.title}</h3>
                  <p className="text-sm text-text-dim whitespace-pre-wrap leading-relaxed font-sans">{res.content}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-text-dim italic font-mono text-xs">
                Результаты: 0
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
