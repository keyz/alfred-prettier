# alfred-prettier

Run Prettier in Alfred. Press Enter to copy the output to your clipboard.

Optionally, you can also get the Flow types stripped out. This is handy for running something quickly in a normal JS environment.

🆕 There's a third option to get the Flow types commented out. Flow actually supports a comment-based syntax. See the usage [here](https://flow.org/en/docs/types/comments/).

<img width="605" alt="Screen Shot" src="https://user-images.githubusercontent.com/2268452/54311034-ff291380-4590-11e9-96d4-e4590f4c69b6.png">

## Install

```
npm install -g alfred-prettier
```

## Custom prettierConfig
You can pass custom prettier config by adding a [workflow environment variable](https://www.alfredapp.com/help/workflows/advanced/variables/#environment) with the name of `prettierConfig` and a JSON value with your [prettier options](https://prettier.io/docs/en/configuration.html) for example 
```json
{ "bracketSpacing": true }
```  
<img width="800" alt="workflow environment variable" src="https://user-images.githubusercontent.com/9304194/80032218-84505d00-84f3-11ea-9cb4-394d60bc2a2e.png"/>
