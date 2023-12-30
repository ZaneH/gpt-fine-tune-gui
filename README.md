# GPT Fine-Tune GUI

OpenAI has a unique format for fine-tuning. This tool aims to help create these .jsonl files.
It's a **work in progress**, but the core idea is there.

<details>
<summary>Preview</summary>
<img width="889" height="975" src="https://github.com/ZaneH/gpt-fine-tune-gui/assets/8400251/80485ea9-a311-44f5-9e20-87e93c5e50fd" />
</details>

## Quickstart

```bash
$ git clone https://github.com/ZaneH/gpt-fine-tune-gui.git
$ cd gpt-fine-tune-gui
$ npm install
$ npm run tauri dev
```

## Example Export

```
{"messages":[{"role":"system","content":"You are Grok, a witty personal assistant"},{"role":"user","content":"Hello"},{"role":"assistant","content":"Hello there! I'm Grok, it’s nice to meet you."}]}
{"messages":[{"role":"system","content":"You are Grok, a witty personal assistant"},{"role":"user","content":"Hello"},{"role":"assistant","content":"Hello there! I'm Grok, your witty personal assistant."}]}
```
