"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinigameModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const minigame_service_1 = require("./minigame.service");
const minigame_controller_1 = require("./minigame.controller");
const user_entity_1 = require("../users/user.entity");
const coupons_module_1 = require("../coupons/coupons.module");
const ticket_earning_log_entity_1 = require("./ticket-earning-log.entity");
const notifications_module_1 = require("../notifications/notifications.module");
const coupon_entity_1 = require("../coupons/coupon.entity");
const user_coupon_entity_1 = require("../coupons/user-coupon.entity");
let MinigameModule = class MinigameModule {
};
exports.MinigameModule = MinigameModule;
exports.MinigameModule = MinigameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, ticket_earning_log_entity_1.TicketEarningLog, coupon_entity_1.Coupon, user_coupon_entity_1.UserCoupon]),
            coupons_module_1.CouponsModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [minigame_service_1.MinigameService],
        controllers: [minigame_controller_1.MinigameController],
    })
], MinigameModule);
//# sourceMappingURL=minigame.module.js.map