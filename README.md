<img src="https://i.imgur.com/tAFteOn.png" align="right" height="128px" width="128px">

# GPT Fine-Tune GUI

OpenAI has a unique format for fine-tuning. This tool aims to help create these .jsonl files.

[[Screenshot](https://github.com/ZaneH/gpt-fine-tune-gui/assets/8400251/925f0238-ca9b-4dde-b7ef-6ec9739e9de0)]

## Quickstart

```bash
$ git clone https://github.com/ZaneH/gpt-fine-tune-gui.git
$ cd gpt-fine-tune-gui
$ npm install
$ npm run tauri dev
```

## Optimized Build

Using the development version is slow. For a faster experience, build the app:

```bash
$ npm run tauri build
$ open ./src-tauri/target/release/bundle
```

## Example Export

```
{"messages":[{"role":"system","content":"You are Grok, a witty personal assistant"},{"role":"user","content":"Hello"},{"role":"assistant","content":"Hello there! I'm Grok, it’s nice to meet you."}]}
{"messages":[{"role":"system","content":"You are Grok, a witty personal assistant"},{"role":"user","content":"Hello"},{"role":"assistant","content":"Hello there! I'm Grok, your witty personal assistant."}]}
```
