// COPIED BUILD FILE HERE SO DEPLOYMENT COULD FIND IT
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, Poseidon } from 'o1js';
export class Match extends SmartContract {
    constructor() {
        super(...arguments);
        this.x = State();
    }
    async initState(salt, firstSecret) {
        this.x.set(Poseidon.hash([salt, firstSecret]));
    }
    async matchSecret(salt, secret) {
        const x = this.x.get();
        this.x.requireEquals(x);
        Poseidon.hash([salt, secret]).assertEquals(x);
        this.x.set(Poseidon.hash([salt, secret]));
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Match.prototype, "x", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", Promise)
], Match.prototype, "initState", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", Promise)
], Match.prototype, "matchSecret", null);
//# sourceMappingURL=Match.js.map