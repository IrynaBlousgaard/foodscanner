FoodScanner v0.7

What's new
- Home dashboard updated to the cleaner mockup-inspired layout.
- Bottom navigation: Home / Scan / Diary / Recipes.
- Diary groups meals by day and shows the daily calorie total.
- Each meal is compact by default: photo thumbnail, meal name, time and total calories.
- Tap a meal to expand its saved photo, KBJU/macros, plate size, AI confidence and detected-food details.
- Scan photos are now stored in IndexedDB instead of relying on localStorage, making photo retention much more reliable.
- Backups include scan photos when available.
- Existing v0.6 data remains compatible.

Deployment
Replace the existing GitHub project files with this folder and push once. Netlify should deploy automatically.
Keep OPENAI_API_KEY in Netlify Environment variables; do not put it in GitHub.
