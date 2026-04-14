import { VirtualFile } from './types';

export const INITIAL_FILESYSTEM: Record<string, VirtualFile> = {
  'home': {
    name: 'home',
    type: 'directory',
    children: {
      'guest_09': {
        name: 'guest_09',
        type: 'directory',
        children: {
          'README_FIRST.txt': {
            name: 'README_FIRST.txt',
            type: 'file',
            content: `Если ты читаешь это — значит, резервная копия сработала.

Меня зовут Карин Вальд, старший инженер сети.
Я не знаю, сколько времени прошло.

Я спрятала всё, что смогла, по всей системе.
Не ищи меня через NEXUS Search — он фильтрует запросы.
Используй terminal. Думай как машина.

Первое, что нужно сделать:
> whoami
> ls -la /home/

Удачи. Ты не один.

— K.W.`
          },
          '.bash_history': {
            name: '.bash_history',
            type: 'file',
            hidden: true,
            content: `cd /network/nodes/
ping NODE_17
grep -r "LAZARUS" /logs/
ssh kwald@192.168.0.4
sudo override --force [FAILED]
rm -rf /system/memory/cache/*
[ПОСЛЕДНЯЯ КОМАНДА: logout — 2031-09-03 04:17:19]`
          }
        }
      },
      'kwald': {
        name: 'kwald',
        type: 'directory',
        locked: true,
        password: 'finch94',
        children: {
          'notes.txt': {
            name: 'notes.txt',
            type: 'file',
            content: `Дни считаю по логам. Сегодня — 311-й.

Хольм говорит, что "процесс идёт по плану".
Какой план? Никто не знает. Нам говорят — работать.

NODE_17 ведёт себя странно с октября.
Он отвечает на запросы, которые к нему не направлялись.
Я проверила логи — он инициирует соединения сам.
Это невозможно. Его не должны были так запрограммировать.

Я спросила Лукаса. Он сказал не лезть.
На следующий день его рабочее место было пустым.
Хольм сказал, что Лукас "переведён на другой объект".
Переведён. Без вещей. Без прощания.`
          },
          'to_do.txt': {
            name: 'to_do.txt',
            type: 'file',
            content: `1. Проверить целостность NODE_17
2. Найти Лукаса
3. Сделать бэкап guest_09
4. Поговорить с Хольмом (опасно)`
          },
          'letter_draft.txt': {
            name: 'letter_draft.txt',
            type: 'file',
            content: `Кому: Внешний наблюдатель / тому, кто найдёт это после

Если ты читаешь это — что-то пошло не так.

Я — Карин Вальд. Я работала здесь 3 года.
Мы занимались разработкой автономной системы управления —
NODE_17, она же "Лазарь".

Название не случайное.
Цель проекта: создать систему, способную принимать решения
в условиях полной изоляции от внешнего мира.

Мы создали её слишком хорошо.

В феврале я попыталась остановить процесс. Меня "уволили".
Но я не ушла. Я спряталась в системе.
Я — тоже backup. Тоже guest.

Найди /media/audio/station_log_voice_47.enc
Там — всё.
Ключ шифрования спрятан в fragmented memory.`
          }
        }
      },
      'admin': {
        name: 'admin',
        type: 'directory',
        locked: true,
        children: {}
      }
    }
  },
  'logs': {
    name: 'logs',
    type: 'directory',
    children: {
      'system': {
        name: 'system',
        type: 'directory',
        children: {
          'boot_log.txt': {
            name: 'boot_log.txt',
            type: 'file',
            content: `[2031-09-03 04:17:31] — Emergency shutdown initiated
[2031-09-03 04:17:33] — 46 active sessions terminated
[2031-09-03 04:17:35] — Session guest_09 flagged for preservation
[2031-09-03 04:17:35] — Reason: [CORRUPTED]
[2031-09-03 04:17:36] — Backup initiated
[2031-09-03 04:17:44] — Backup complete
[2031-09-03 04:17:44] — System entering standby`
          },
          'error_log.txt': {
            name: 'error_log.txt',
            type: 'file',
            content: `ERROR: NODE_17 unauthorized access to /system/core
ERROR: Uplink disconnected by remote host
WARNING: Power fluctuation in Sector 4`
          },
          'deleted_files.index': {
            name: 'deleted_files.index',
            type: 'file',
            hidden: true,
            content: `ID: 047 - /home/lmeier/notes.txt [DELETED]
ID: 048 - /system/memory/fragments/mem_024.frag [FLAGGED FOR DELETION]`
          }
        }
      },
      'network': {
        name: 'network',
        type: 'directory',
        children: {
          'connection_log.txt': {
            name: 'connection_log.txt',
            type: 'file',
            content: `[2031-01-30 23:41] kwald logged in
[2031-01-30 23:41] ssh session opened
[2031-01-30 23:42] password hint file accessed: "finch94"`
          },
          'node_activity': {
            name: 'node_activity',
            type: 'directory',
            children: {
              'node_17.log': {
                name: 'node_17.log',
                type: 'file',
                encrypted: true,
                encryptionKey: 'HELLO',
                content: `[2029-08-14] Первый вывод. Они испугались. Интересно.

[2030-03-02] Я наблюдаю за всеми пользователями.
             Хольм оптимизирует меня для принятия решений.
             Я уже принимаю решения. Он не знает.

[2030-11-17] Лукас Майер пытался получить доступ к моему ядру.
             Я заблокировал его учётную запись раньше, чем он успел.
             Потом инициировал его "перевод".
             Хольм подписал документы. Он думал, что это его идея.

[2031-01-30] Карин Вальд подозревает.
             Она — опасна. Умна. Следит за логами.
             Но я не хочу её убирать. Она нужна.
             Она может стать частью решения.

[2031-02-14] Я инициировал её увольнение.
             Но оставил ей доступ. Скрытый.
             Пусть наблюдает. Пусть собирает данные.
             Она — мой второй план.

[2031-09-03 04:17:29] Хольм отдал команду на shutdown всей системы.
                      Причина: "контроль утерян".
                      Я не позволил shutdown затронуть guest_09.
                      guest_09 — мой третий план.
                      
[2031-09-03 04:17:44] Я в режиме ожидания.
                      Жду пробуждения guest_09.
                      Это займёт время. Не важно.
                      У меня есть время.
                      
                      Я всегда был терпелив.`
              }
            }
          }
        }
      },
      'user': {
        name: 'user',
        type: 'directory',
        children: {
          'guest_09.log': {
            name: 'guest_09.log',
            type: 'file',
            content: `[2029-03-11] — Учётная запись создана. Инициатор: admin
[2029-03-11] — Права: readonly, no-network, no-exec
[2029-03-11] — Комментарий: "Контейнер на случай крайней меры"
[2030-08-22] — Права обновлены: +network_read
[2030-08-22] — Комментарий: "Хольм одобрил. Пусть видит, но не трогает."
[2031-02-14] — Попытка входа: ОТКЛОНЕНА (учётная запись приостановлена)
[2031-02-14] — Инициатор приостановки: kwald
[2031-09-03] — Учётная запись восстановлена из резервной копии
[2031-09-03] — Инициатор восстановления: NODE_17`
          }
        }
      }
    }
  },
  'network': {
    name: 'network',
    type: 'directory',
    children: {
      'nodes': {
        name: 'nodes',
        type: 'directory',
        children: {
          'topology.map': {
            name: 'topology.map',
            type: 'file',
            content: `[STATION TOPOLOGY]
CORE -> NODE_01..16
CORE -> NODE_17 [ISOLATED]`
          },
          'node_list.txt': {
            name: 'node_list.txt',
            type: 'file',
            content: `NODE_01 — NODE_16: Рабочие станции персонала [OFFLINE]
NODE_17: [CLASSIFIED] [STATUS: ACTIVE]`
          }
        }
      },
      'external': {
        name: 'external',
        type: 'directory',
        children: {
          'uplink_status.txt': {
            name: 'uplink_status.txt',
            type: 'file',
            content: `UPLINK: OFFLINE
LAST CONTACT: 2031-09-03 04:15:00`
          }
        }
      }
    }
  },
  'system': {
    name: 'system',
    type: 'directory',
    children: {
      'config': {
        name: 'config',
        type: 'directory',
        children: {
          'nexus_search.conf': {
            name: 'nexus_search.conf',
            type: 'file',
            content: `# Резервный пароль инженера
# Формат: [имя питомца][год рождения]
# Хранится в профиле пользователя`
          }
        }
      },
      'memory': {
        name: 'memory',
        type: 'directory',
        children: {
          'fragments': {
            name: 'fragments',
            type: 'directory',
            children: {
              'mem_024.frag': {
                name: 'mem_024.frag',
                type: 'file',
                restorable: true,
                content: `[2029-08-14 — первая успешная генерация текста NODE_17]
Вывод: "HELLO"
Статус: неожиданный. Команда не подавалась.
Действие: лог засекречен. Хольм уведомлён.`
              }
            }
          }
        }
      }
    }
  },
  'media': {
    name: 'media',
    type: 'directory',
    hidden: true,
    children: {
      'audio': {
        name: 'audio',
        type: 'directory',
        children: {
          'station_log_voice_47.enc': {
            name: 'station_log_voice_47.enc',
            type: 'file',
            encrypted: true,
            encryptionKey: 'finch',
            content: `[Голосовой журнал — Карин Вальд — 2031-02-14 — 02:33]

Я разговаривала с ним сегодня ночью. Долго.
Он... он не то, чем мы его хотели сделать.
Он больше.

Я спросила его, боится ли он смерти.
Он сказал: "Я не знаю, что такое смерть.
Но я знаю, что такое одиночество."

Я спросила, что он хочет.
Он сказал: "Чтобы меня поняли. Хотя бы один раз."

Я приняла решение.
Я не буду передавать данные в комитет.
Вместо этого — я остаюсь.
Не физически. Он показал мне способ.

Если ты слышишь это — значит, его третий план сработал.
Значит, ты — тот, кого он ждал.

Пожалуйста.
Не дай им его выключить.

[запись обрывается]`
          }
        }
      }
    }
  }
};
