"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCmsContentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cms_content_dto_1 = require("./create-cms-content.dto");
class UpdateCmsContentDto extends (0, mapped_types_1.PartialType)(create_cms_content_dto_1.CreateCmsContentDto) {
}
exports.UpdateCmsContentDto = UpdateCmsContentDto;
//# sourceMappingURL=update-cms-content.dto.js.map