import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
var AlertPage = /** @class */ (function () {
    function AlertPage(alertCtrl) {
        this.alertCtrl = alertCtrl;
    }
    AlertPage.prototype.ngOnInit = function () {
    };
    AlertPage.prototype.presentAlertPrompt = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: 'Nombre!',
                            inputs: [
                                {
                                    name: 'txtNombre',
                                    type: 'text',
                                    placeholder: 'Ingresa nombre'
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: function () {
                                        console.log('Confirm Cancel');
                                    }
                                }, {
                                    text: 'Ok',
                                    handler: function (data) {
                                        console.log(data);
                                        console.log('Confirm Ok');
                                        _this.titulo = data.txtNombre;
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AlertPage = tslib_1.__decorate([
        Component({
            selector: 'app-alert',
            templateUrl: './alert.page.html',
            styleUrls: ['./alert.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController])
    ], AlertPage);
    return AlertPage;
}());
export { AlertPage };
//# sourceMappingURL=alert.page.js.map