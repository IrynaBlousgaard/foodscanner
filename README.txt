FoodScanner v0.5 - real AI food analysis

Files:
- index.html
- netlify/functions/analyze-food.mjs

Deploy through your existing GitHub -> Netlify project:
1. Replace the repository's index.html with this index.html.
2. Add the folder netlify/functions and the file analyze-food.mjs exactly as shown.
3. In Netlify open Project configuration -> Environment variables.
4. Add OPENAI_API_KEY with your OpenAI API key. Keep the key in Netlify only; never put it in index.html or GitHub.
5. Redeploy the site after adding/changing the environment variable.
6. Optional: add OPENAI_MODEL if you want to override the default model (gpt-6-luna).

The AI result is an estimate. It identifies visible foods, estimates portion sizes using the selected plate size as a rough reference, and estimates calories/macros. All detected foods can be edited before saving.
