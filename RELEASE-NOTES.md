# Version 31.1 release notes

## Firmware 3.00 compatibility audit

- Corrected reset instructions to Nikon's per-bank O (Q) workflow and made Extended menu banks On explicit.
- Corrected firmware 3.00 labels including Secondary slot function and Image quality settings → Image quality.
- Standardized Bank C on Aperture Priority with Auto ISO minimum shutter 1/500 s for people.
- Assigned Fn2 Recall Shooting Functions to A–C only and Starlight view (photo Lv) to D; documented that Starlight disables the live histogram.
- Added missing photo/video focus, MF subject-detection area, metering, destination, High ISO NR mode Type A, a12, a13, g13 and g22 values.
- Corrected Bank D's 70mm starting exposure to 5 seconds within a 5–7 second range.
- Added Hi-Res Zoom compatibility constraints, H.265 10-bit frame-rate clarification, Pinpoint AF/AF-S constraint, audio clipping guidance and the 70mm wide-angle coverage caution.

## Personalized settings package

- Updated A–D Photo and Video banks while preserving the existing companion layout and CSS.
- Added exact lens, focus, metering, RAW compression, audio, Hi-Res Zoom, and zebra recommendations.
- Aligned every Custom Settings entry to Nikon Z8 C firmware 3.00 and moved focus, subject-detection, and bracketing choices to their correct shooting menu.
- Added complete 12-position Photo and Video i Menu layouts for f1 and g1, including exact Nikon item names and setup paths.
- Added the complete structured replacement Markdown document with per-bank Fn2 recall submenus, momentary-versus-latching behavior, sub-selector-center setup, field workflows, limitations, and photographer references.
- Added complete firmware 3.00 g2 Video Custom Controls for Banks A–D, including Fast AF-ON, AF-area cycling, focus checks, recording controls, zebra access, microphone sensitivity, and lens/grip applicability.
- Added the field-visibility reason for choosing Red rather than Gray zebras, plus the color-vision alternative.
- Clarified everywhere that Recall Shooting Functions cannot change Focus mode; Bank D must leave MF before recalled AF-ON can focus.
- Added Nikon Z8 Save/load menu settings instructions: primary-card selection, NCSET*** computer backup, restoration, verification, filename caution, same-model restriction, and exclusions.
- Reworked f Controls into an explicit A–D matrix and placed the complete per-bank Fn2 Recall Shooting Functions submenu directly inside the web Camera Setup section and Markdown f Controls section.
- Added step-by-step live-histogram setup for photo d19/d20 and video g18/g20/g21, monitor/viewfinder DISP operation, field interpretation, display interactions, and A–D verification.
- Added Bank D shutter guidance from 70mm through 180mm.
- Changed Slot 2 from Backup to Overflow for the 512 GB CFexpress-first workflow.
- Set AF-C priority to Release in Banks A–C and added explicit back-button, camera Fn, sub-selector, and 180–600mm L-Fn focus-control assignments.

- Restores a complete Nikon Z8 setup-from-scratch workflow.
- Sorts the camera configuration by Global, Photo, Video and Custom menu types.
- Shows exact menu path, storage/bank type and A–D values.
- Includes RAW, compression, bit depth, white balance, noise reduction and VR per Photo bank.
- Preserves smart recommendations, itinerary, weather, species guide, journal, Zanzibar, resources and offline documents.
- Consolidates the application back to one CSS file and one JavaScript file.
