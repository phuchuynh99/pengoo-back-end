"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketEarningLog = exports.TicketEarningType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
var TicketEarningType;
(function (TicketEarningType) {
    TicketEarningType["POST"] = "post";
    TicketEarningType["PRODUCT"] = "product";
    TicketEarningType["SOCIAL"] = "social";
})(TicketEarningType || (exports.TicketEarningType = TicketEarningType = {}));
let TicketEarningLog = class TicketEarningLog {
    id;
    user;
    type;
    refId;
    createdAt;
};
exports.TicketEarningLog = TicketEarningLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TicketEarningLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.ticketEarningLogs),
    __metadata("design:type", user_entity_1.User)
], TicketEarningLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TicketEarningType }),
    __metadata("design:type", String)
], TicketEarningLog.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TicketEarningLog.prototype, "refId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TicketEarningLog.prototype, "createdAt", void 0);
exports.TicketEarningLog = TicketEarningLog = __decorate([
    (0, typeorm_1.Entity)()
], TicketEarningLog);
//# sourceMappingURL=ticket-earning-log.entity.js.map