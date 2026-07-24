(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["OctoPrintClient"], factory);
    } else {
        factory(global.OctoPrintClient);
    }
})(this, function(OctoPrintClient) {
    var OctoPrintMMU2Select = function(base) {
        this.base = base;
    };

    OctoPrintMMU2Select.prototype.select = function(index, opts) {
        var data = {
            choice: index
        };
        return this.base.simpleApiCommand("mmu2filamentselect", "select", data, opts);
    };

    OctoPrintClient.registerPluginComponent("mmu2filamentselect", OctoPrintMMU2Select);
    return OctoPrintMMU2Select;
});

$(function() {
    function MMU2SelectViewModel(parameters) {
        var self = this;

        self.settings = parameters[0];
        self.loginState = parameters[1];
        self.filamentManager = parameters[2];
        self.spoolManager = parameters[3];
        self.access = parameters[4];

        self._modal = undefined;

        self._showPrompt = function() {
            var selections = {
                0:"Filament 1: "+self.settings.settings.plugins.mmu2filamentselect.filament1(),
                1:"Filament 2: "+self.settings.settings.plugins.mmu2filamentselect.filament2(),
                2:"Filament 3: "+self.settings.settings.plugins.mmu2filamentselect.filament3(),
                3:"Filament 4: "+self.settings.settings.plugins.mmu2filamentselect.filament4(),
                4:"Filament 5: "+self.settings.settings.plugins.mmu2filamentselect.filament5(),
                5:"Cancel print"
            };

            var spoolData = null;
            if (self.filamentManager !== null && self.settings.settings.plugins.mmu2filamentselect.labelSource() === "filamentManager") {
                spoolData = self.filamentManager.selectedSpools();
                if (spoolData !== null) {
                    for (i = 0; i < spoolData.length; i++) {
                        var spool = spoolData[i];
                        if (spool !== undefined) {
                            var name = "Filament " + (i+1).toFixed(0) + ": " + spool.name + ' ' + (spool.weight - spool.used).toFixed(0) + 'g - ' + spool.profile.material + ' (' + spool.profile.vendor + ')';
                            selections[i] = name;
                        }
                    }
                }
            } else if (self.spoolManager !== null && self.settings.settings.plugins.mmu2filamentselect.labelSource() === "spoolManager") {
                var selectedSpool = self.spoolManager.api_getSelectedSpoolInformations();
                if (selectedSpool !== null) {
                    for (const spoolInfo of selectedSpool) {
                        if (spoolInfo != null) {
                            var name = "Filament " + (spoolInfo.toolIndex+1).toFixed(0) + ": " + spoolInfo.spoolName + ' - ' + spoolInfo.material + ' (' + spoolInfo.vendor + ')';
                            selections[spoolInfo.toolIndex] = name;
                        }
                    }
                }
            }

            var opts = {
                title: gettext("Prusa MMU2 filament select"),
                message: gettext("Select the filament spool you wish to use for this single color print."), 
                selections: selections,
                onselect: function(index) {
                    if (index > -1) {
                        self._select(index);
                    }
                },
                onclose: function() {
                    self._modal = undefined;
                }
            };

            self._modal = showSelectionDialog(opts)
            setTimeout(self._closePrompt, self.settings.settings.plugins.mmu2filamentselect.timeout() * 1000);
        };

        self._select = function(index) {
            OctoPrint.plugins.mmu2filamentselect.select(index);
        };

        self._closePrompt = function() {
            if (self._modal) {
                self._modal.modal("hide");
            }
        };

        self.onAfterBinding = function(){
            if (self.filamentManager === null && self.settings.settings.plugins.mmu2filamentselect.labelSource() === "filamentManager") {
                self.settings.settings.plugins.mmu2filamentselect.labelSource("manual");
            }
            if (self.spoolManager === null && self.settings.settings.plugins.mmu2filamentselect.labelSource() === "spoolManager") {
                self.settings.settings.plugins.mmu2filamentselect.labelSource("manual");
            }
        }

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (!self.loginState.isUser() || !self.loginState.hasPermission(self.access.permissions.PLUGIN_MMU2FILAMENTSELECT_SELECT)) return;
            if (plugin !== "mmu2filamentselect") {
                return;
            }

            switch (data.action) {
                case "show": {
                    self._showPrompt();
                    break;
                }
                case "close": {
                    self._closePrompt();
                    break;
                }
            }
        }

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: MMU2SelectViewModel,
        dependencies: ["settingsViewModel","loginStateViewModel","filamentManagerViewModel","spoolManagerViewModel", "accessViewModel"],
        optional: ["filamentManagerViewModel","spoolManagerViewModel"],
        elements: ["#settings_plugin_mmu2filamentselect"]
    });
});