from pathlib import Path
text = Path('node_modules/play-dl/dist/index.js').read_text(encoding='utf-8', errors='ignore')
tokens = ['function be(i,e)', 'function be(i', 'async function Pt', 'return i instanceof T?await Et(i,e):await be(i,e)']
for token in tokens:
    idx = text.find(token)
    print('TOKEN', token, 'INDEX', idx)
    if idx != -1:
        print(text[idx:idx+500])
        print('---')
