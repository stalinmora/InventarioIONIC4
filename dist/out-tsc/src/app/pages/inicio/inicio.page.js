import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
var InicioPage = /** @class */ (function () {
    function InicioPage() {
        this.compomenetes = [
            {
                icon: 'american-football',
                name: 'Action Sheet',
                redireccionarA: '/action-sheet'
            },
            {
                icon: 'appstore',
                name: 'Alert',
                redireccionarA: '/alert'
            }
        ];
    }
    InicioPage.prototype.ngOnInit = function () {
    };
    InicioPage = tslib_1.__decorate([
        Component({
            selector: 'app-inicio',
            templateUrl: './inicio.page.html',
            styleUrls: ['./inicio.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], InicioPage);
    return InicioPage;
}());
export { InicioPage };
//# sourceMappingURL=inicio.page.js.map