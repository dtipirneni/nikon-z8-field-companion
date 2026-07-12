#!/bin/bash
cd "$(dirname "$0")"
echo "Drag the nikon-z8-field-companion project folder into this Terminal window, then press Return:"
read -r PROJECT
PROJECT=${PROJECT#\'}; PROJECT=${PROJECT%\'}
PROJECT=${PROJECT#\"}; PROJECT=${PROJECT%\"}
python3 apply-v15.py "$PROJECT"
echo "Done. Upload the updated project files to GitHub."
read -n 1 -s -r -p "Press any key to close."
