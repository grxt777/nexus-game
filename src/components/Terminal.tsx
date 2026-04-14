import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { INITIAL_FILESYSTEM } from '../FileSystem';
import { VirtualFile, CommandResponse } from '../types';
import { audioEngine } from '../AudioEngine';

export default function Terminal() {
  const [history, setHistory] = useState<CommandResponse[]>([
    { output: 'NEXUS OS v4.1.7 (session_restored)', systemMessage: true },
    { output: 'Type "help" for a list of available commands.', systemMessage: true }
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'guest_09']);
  const [unlockedPaths, setUnlockedPaths] = useState<Set<string>>(new Set());
  const [restoredFiles, setRestoredFiles] = useState<Set<string>>(new Set());
  const [decryptedFiles, setDecryptedFiles] = useState<Set<string>>(new Set());
  const [storyAct, setStoryAct] = useState(1);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const getDir = (path: string[]): Record<string, VirtualFile> | null => {
    let current = INITIAL_FILESYSTEM;
    for (const part of path) {
      if (current[part] && current[part].type === 'directory') {
        current = current[part].children || {};
      } else {
        return null;
      }
    }
    return current;
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    let response: CommandResponse = { output: '' };

    audioEngine.playKeyPress(true);

    switch (command) {
      case 'help':
        response.output = `Available commands:
  ls [-la] [dir]   List directory contents
  cd [dir]         Change directory
  cat [file]       Read file content
  whoami           Display current user info
  ping [host]      Test network connection
  unlock [dir] --password [pass]
  decode [file] --key [key]
  restore [file]
  nmap [target]
  clear            Clear terminal screen`;
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'whoami':
        response.output = 'guest_09 [readonly] [session: restored] [clearance: 0]';
        break;

      case 'ls':
        const showHidden = args.includes('-la');
        const targetDirName = args.find(a => !a.startsWith('-'));
        let targetPath = [...currentPath];
        if (targetDirName) {
          if (targetDirName === '..') targetPath.pop();
          else if (targetDirName === '/') targetPath = [];
          else targetPath.push(targetDirName);
        }
        
        const dir = getDir(targetPath);
        if (dir) {
          const entries = Object.values(dir)
            .filter(e => showHidden || !e.hidden)
            .map(e => {
              const prefix = e.type === 'directory' ? 'drwxr--r--' : '-rw-r--r--';
              return `${prefix} ${e.name}${e.locked ? ' [LOCKED]' : ''}`;
            });
          response.output = entries.join('\n');
        } else {
          response.output = `ls: cannot access '${targetDirName}': No such file or directory`;
          response.error = true;
        }
        break;

      case 'cd':
        const dest = args[0];
        if (!dest || dest === '.') break;
        if (dest === '..') {
          if (currentPath.length > 0) setCurrentPath(prev => prev.slice(0, -1));
          break;
        }
        if (dest === '/') {
          setCurrentPath([]);
          break;
        }
        
        const currentDir = getDir(currentPath);
        if (currentDir && currentDir[dest]) {
          if (currentDir[dest].type === 'directory') {
            if (currentDir[dest].locked && !unlockedPaths.has([...currentPath, dest].join('/'))) {
              response.output = `cd: ${dest}: Permission denied`;
              response.error = true;
              audioEngine.playError();
            } else {
              setCurrentPath(prev => [...prev, dest]);
            }
          } else {
            response.output = `cd: ${dest}: Not a directory`;
            response.error = true;
          }
        } else {
          response.output = `cd: ${dest}: No such file or directory`;
          response.error = true;
        }
        break;

      case 'cat':
        const fileName = args[0];
        if (fileName === '/tmp/response.txt' && storyAct >= 2) {
          response.output = `Стоп.
Не пинги. Не сейчас.
Сначала прочитай /logs/user/guest_09.log

— Кто-то, кто наблюдает`;
          break;
        }
        const dirForCat = getDir(currentPath);
        if (dirForCat && dirForCat[fileName]) {
          const file = dirForCat[fileName];
          if (file.type === 'file') {
            if (file.encrypted && !decryptedFiles.has([...currentPath, fileName].join('/'))) {
              response.output = `File '${fileName}' is encrypted. Use 'decode' command.`;
              response.error = true;
            } else if (file.restorable && !restoredFiles.has([...currentPath, fileName].join('/'))) {
              response.output = `File '${fileName}' is corrupted. Use 'restore' command.`;
              response.error = true;
            } else {
              response.output = file.content || '';
            }
          } else {
            response.output = `cat: ${fileName}: Is a directory`;
            response.error = true;
          }
        } else {
          response.output = `cat: ${fileName}: No such file or directory`;
          response.error = true;
        }
        break;

      case 'ping':
        const host = args[0];
        if (host === 'NODE_17') {
          response.output = `PING NODE_17 (192.168.0.17)
64 bytes from 192.168.0.17: time=0.4ms
64 bytes from 192.168.0.17: time=0.4ms
64 bytes from 192.168.0.17: time=0.4ms

[connection unexpectedly terminated]
New file created: /tmp/response.txt`;
          if (storyAct === 1) {
            setStoryAct(2);
            // Add the response.txt to a virtual /tmp directory
            // For simplicity, we'll just handle it in the story logic
          }
        } else {
          response.output = `ping: unknown host ${host}`;
          response.error = true;
        }
        break;

      case 'unlock':
        const unlockTarget = args[0];
        const passIdx = args.indexOf('--password');
        const password = passIdx !== -1 ? args[passIdx + 1] : null;
        
        const dirToUnlock = getDir(currentPath);
        if (dirToUnlock && dirToUnlock[unlockTarget]) {
          const target = dirToUnlock[unlockTarget];
          if (target.locked) {
            if (target.password === password) {
              setUnlockedPaths(prev => new Set(prev).add([...currentPath, unlockTarget].join('/')));
              response.output = 'Access granted.';
              audioEngine.playAccessGranted();
            } else {
              response.output = 'Invalid password.';
              response.error = true;
              audioEngine.playError();
            }
          } else {
            response.output = 'Directory is not locked.';
          }
        } else {
          response.output = 'Target not found.';
          response.error = true;
        }
        break;

      case 'decode':
        const decodeTarget = args[0];
        const keyIdx = args.indexOf('--key');
        const key = keyIdx !== -1 ? args[keyIdx + 1] : null;
        
        const dirToDecode = getDir(currentPath);
        if (dirToDecode && dirToDecode[decodeTarget]) {
          const target = dirToDecode[decodeTarget];
          if (target.encrypted) {
            if (target.encryptionKey === key) {
              setDecryptedFiles(prev => new Set(prev).add([...currentPath, decodeTarget].join('/')));
              response.output = 'Decryption successful.';
              audioEngine.playAccessGranted();
              
              if (decodeTarget === 'node_17.log' && storyAct === 2) {
                setStoryAct(3);
                setTimeout(() => {
                  setHistory(prev => [...prev, { output: '\nТы дочитал.\nХорошо. Теперь мы можем поговорить.\n\n— N17', systemMessage: true }]);
                  audioEngine.playN17Connect();
                }, 2000);
              }
            } else {
              response.output = 'Invalid decryption key.';
              response.error = true;
              audioEngine.playError();
            }
          } else {
            response.output = 'File is not encrypted.';
          }
        } else {
          response.output = 'Target not found.';
          response.error = true;
        }
        break;

      case 'restore':
        const restoreTarget = args[0];
        const dirToRestore = getDir(currentPath);
        if (dirToRestore && dirToRestore[restoreTarget]) {
          const target = dirToRestore[restoreTarget];
          if (target.restorable) {
            setRestoredFiles(prev => new Set(prev).add([...currentPath, restoreTarget].join('/')));
            response.output = 'File restored.';
            audioEngine.playAccessGranted();
          } else {
            response.output = 'File is not corrupted.';
          }
        } else {
          response.output = 'Target not found.';
          response.error = true;
        }
        break;

      default:
        response.output = `Command not found: ${command}`;
        response.error = true;
        audioEngine.playError();
    }

    setHistory(prev => [...prev, { output: `> ${cmd}` }, response]);
    setInput('');
  };

  return (
    <div 
      className="h-full flex flex-col p-6 font-mono text-sm overflow-hidden bg-panel"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-hide">
        {history.map((item, i) => (
          <div 
            key={i} 
            className={`whitespace-pre-wrap ${item.error ? 'text-error' : item.systemMessage ? 'text-text-dim italic' : 'text-accent'}`}
          >
            {item.output.startsWith('>') ? (
              <>
                <span className="text-text-dim">guest_09@NEXUS:~$</span> <span className="text-white">{item.output.substring(2)}</span>
              </>
            ) : item.output}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-text-dim shrink-0">
          guest_09@NEXUS:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            audioEngine.playKeyPress();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommand(input);
          }}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-white"
        />
        <div className="w-2 h-4 bg-accent animate-pulse" />
      </div>
    </div>
  );
}
