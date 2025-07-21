"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostCatalogueDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_post_catalogue_dto_1 = require("./create-post-catalogue.dto");
class UpdatePostCatalogueDto extends (0, mapped_types_1.PartialType)(create_post_catalogue_dto_1.CreatePostCatalogueDto) {
}
exports.UpdatePostCatalogueDto = UpdatePostCatalogueDto;
//# sourceMappingURL=update-post-catalogue.dto.js.map