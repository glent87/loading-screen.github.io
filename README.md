# BlockLife RP — Загрузочный экран для Garry's Mod

Этот репозиторий содержит **загрузочный экран (loading screen)** для сервера Garry's Mod **BlockLife RP**.  
Экран выполнен в чёрно-серой цветовой гамме с анимациями и динамическими советами для игроков.
## ⚙️ Как запустить
1. Сделайте **fork** или **clone** репозитория.
2. В настройках GitHub включите **GitHub Pages**:
   - Settings → Pages → Source → выберите `main` и `/root`.
   - Получите ссылку вида:
     ```
     https://yourusername.github.io/blocklife-loading/
     ```
3. На сервере GMod в `server.cfg` добавьте:
   ```cfg
   sv_loadingurl "https://yourusername.github.io/blocklife-loading/"
   ```

## 🎨 Кастомизация
- Измените название сервера в `index.html`:
  ```html
  <h1 class="server-name">BlockLife RP</h1>
  ```
- Добавьте свои правила/советы в `script.js`:
  ```js
  const tips = [
    "Совет: Соблюдайте правила RP.",
    "Совет: Уважайте игроков.",
    "Совет: Используйте /me и /do для ролевых действий."
  ];
  ```
- Поменяйте фон или шрифт в `style.css`.

## 📜 Лицензия
MIT — можно свободно использовать и модифицировать.
