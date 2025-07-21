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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./cart.entity");
const users_service_1 = require("../users/users.service");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    cartRepository;
    cartItemRepository;
    usersService;
    productsService;
    constructor(cartRepository, cartItemRepository, usersService, productsService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.usersService = usersService;
        this.productsService = productsService;
    }
    async findOrCreateCart(userId) {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.product'],
        });
        if (!cart) {
            const user = await this.usersService.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            cart = this.cartRepository.create({ user, items: [] });
            cart = await this.cartRepository.save(cart);
        }
        return cart;
    }
    async addItem(userId, createCartItemDto) {
        const cart = await this.findOrCreateCart(userId);
        const { productId, quantity } = createCartItemDto;
        const product = await this.productsService.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        let cartItem = cart.items.find((item) => item.product.id === productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        }
        else {
            cartItem = this.cartItemRepository.create({ cart, product, quantity });
            cart.items.push(cartItem);
        }
        await this.cartItemRepository.save(cartItem);
        return this.cartRepository.save(cart);
    }
    async updateItem(userId, cartItemId, updateCartItemDto) {
        const cart = await this.findOrCreateCart(userId);
        const cartItem = cart.items.find((item) => item.id === cartItemId);
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        cartItem.quantity = updateCartItemDto.quantity;
        await this.cartItemRepository.save(cartItem);
        return this.cartRepository.save(cart);
    }
    async removeItem(userId, cartItemId) {
        const cart = await this.findOrCreateCart(userId);
        const cartItemIndex = cart.items.findIndex((item) => item.id === cartItemId);
        if (cartItemIndex === -1) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        const [cartItem] = cart.items.splice(cartItemIndex, 1);
        await this.cartItemRepository.remove(cartItem);
        return this.cartRepository.save(cart);
    }
    async getCartSummary(userId) {
        return this.findOrCreateCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.findOrCreateCart(userId);
        await this.cartItemRepository.remove(cart.items);
        cart.items = [];
        await this.cartRepository.save(cart);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map