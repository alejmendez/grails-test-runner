"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METHOD_REGEX = exports.CLASS_REGEX = void 0;
exports.CLASS_REGEX = /^class\s+(\w+(?:Spec|Tests?))\s+/m;
exports.METHOD_REGEX = /void\s+['"](.+?)['"]\s*\(\s*\)/g;
//# sourceMappingURL=constants.js.map