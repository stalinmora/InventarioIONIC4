import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActionSheetPage } from './action-sheet.page';
var routes = [
    {
        path: '',
        component: ActionSheetPage
    }
];
var ActionSheetPageModule = /** @class */ (function () {
    function ActionSheetPageModule() {
    }
    ActionSheetPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ActionSheetPage]
        })
    ], ActionSheetPageModule);
    return ActionSheetPageModule;
}());
export { ActionSheetPageModule };
//# sourceMappingURL=action-sheet.module.js.map