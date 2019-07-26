import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
var ActionSheetPage = /** @class */ (function () {
    function ActionSheetPage(actionSheetCtrl) {
        this.actionSheetCtrl = actionSheetCtrl;
    }
    ActionSheetPage.prototype.ngOnInit = function () {
    };
    ActionSheetPage.prototype.presentActionSheet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var actionSheet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetCtrl.create({
                            header: 'Albums',
                            buttons: [{
                                    text: 'Delete',
                                    role: 'destructive',
                                    icon: 'trash',
                                    handler: function () {
                                        console.log('Delete clicked');
                                    }
                                }, {
                                    text: 'Share',
                                    icon: 'share',
                                    handler: function () {
                                        console.log('Share clicked');
                                    }
                                }, {
                                    text: 'Play (open modal)',
                                    icon: 'arrow-dropright-circle',
                                    handler: function () {
                                        console.log('Play clicked');
                                    }
                                }, {
                                    text: 'Favorite',
                                    icon: 'heart',
                                    handler: function () {
                                        console.log('Favorite clicked');
                                    }
                                }, {
                                    text: 'Cancel',
                                    icon: 'close',
                                    role: 'cancel',
                                    handler: function () {
                                        console.log('Cancel clicked');
                                    }
                                }]
                        })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ActionSheetPage = tslib_1.__decorate([
        Component({
            selector: 'app-action-sheet',
            templateUrl: './action-sheet.page.html',
            styleUrls: ['./action-sheet.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ActionSheetController])
    ], ActionSheetPage);
    return ActionSheetPage;
}());
export { ActionSheetPage };
//# sourceMappingURL=action-sheet.page.js.map