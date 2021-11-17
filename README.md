# OctoPrint-Mmu2filamentselect (OctoDash)

<img src="https://raw.githubusercontent.com/rubegartor/OctoPrint-Mmu2filamentselect/pics/octoprusa.png" width="25%" align="left">

This plugin shows a dialog to select the filament when a print on a Prusa printer with MMU2 is started in single mode. **This repo adds support to OctoDash.**

You can select the filament which should be used in this dialog or in OctoDash screen. So you don't have to go over to your printer to select the filament in the printers menu.

The dialog will timeout after a given time (see [Configuration](#configuration), default 300 seconds (5 minutes)). Then everything will work as usual and you have to select the filament at your printers menu, a default filament is used, or the print gets canceled (depending on the default action that is set).

<img src="https://raw.githubusercontent.com/rubegartor/OctoPrint-Mmu2filamentselect/pics/dialog.png">

## Setup

Install manually using this URL:

    https://github.com/rubegartor/OctoPrint-Mmu2filamentselect/archive/master.zip

## Configuration

In the settings of this plugin you can set the timeout. If this timeout runs out after the dialog pops up, it will close the dialog automatically, and perform a default action.

<img src="https://raw.githubusercontent.com/rubegartor/OctoPrint-Mmu2filamentselect/pics/settings2.png">
