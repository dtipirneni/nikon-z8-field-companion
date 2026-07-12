#!/usr/bin/env python3
from pathlib import Path
import re, shutil, sys

root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
required = ['index.html','trip.html','shoot.html','wildlife.html','more.html','js/app.js']
missing = [x for x in required if not (root/x).exists()]
if missing:
    raise SystemExit('Run this inside the project folder, or pass the project path. Missing: ' + ', '.join(missing))
package = Path(__file__).resolve().parent
(root/'js').mkdir(exist_ok=True)
for src, dst in [('js/preflight.js','js/preflight.js'),('js/v15-enhancements.js','js/v15-enhancements.js'),('v15.css','v15.css'),('sw.js','sw.js')]:
    shutil.copy2(package/src, root/dst)
for name in ['index.html','trip.html','shoot.html','wildlife.html','more.html']:
    p=root/name
    text=p.read_text(encoding='utf-8')
    if 'v15.css' not in text:
        text=text.replace('</head>','<link href="v15.css" rel="stylesheet"/>\n</head>',1)
    if 'js/preflight.js' not in text:
        text=text.replace('<script defer="True" src="js/app.js"></script>','<script src="js/preflight.js"></script><script defer="True" src="js/app.js"></script><script defer src="js/v15-enhancements.js"></script>')
        text=text.replace('<script defer src="js/app.js"></script>','<script src="js/preflight.js"></script><script defer src="js/app.js"></script><script defer src="js/v15-enhancements.js"></script>')
    text=re.sub(r'Version 13\.0', 'Version 15.0', text)
    p.write_text(text,encoding='utf-8')
print('Version 15 update applied to:', root)
