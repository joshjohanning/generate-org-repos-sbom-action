"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var octokit_1 = require("octokit");
var globals_1 = require("@jest/globals");
var generate_sbom_1 = require("../src/generate-sbom");
var fs = require("fs");
var mockSBOM = fs.readFileSync('./__tests__/mock-sbom.json', 'utf-8');
var mockRepos = fs.readFileSync('./__tests__/mock-repos.json', 'utf-8');
jest.spyOn(fs, 'writeFile').mockImplementation(function (f, d, callback) {
    console.log('[mock] writing file');
    callback(null);
});
(0, globals_1.describe)('generateSBOMForRepo', function () {
    it('should retrieve the SBOM for a repository', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, resource, _a, owner, repo, octokit;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = 'test-token';
                    resource = 'octocat/hello-world';
                    _a = resource.split('/'), owner = _a[0], repo = _a[1];
                    octokit = new octokit_1.Octokit();
                    octokit.request = jest.fn().mockResolvedValue({
                        data: {
                            sbom: mockSBOM
                        }
                    });
                    return [4 /*yield*/, (0, generate_sbom_1.generateSBOM)(owner, repo, octokit, 'repo')];
                case 1:
                    _b.sent();
                    (0, globals_1.expect)(octokit.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/dependency-graph/sbom', {
                        owner: owner,
                        repo: repo,
                        headers: {
                            'X-GitHub-Api-Version': '2022-11-28'
                        }
                    });
                    (0, globals_1.expect)(fs.writeFile).toHaveBeenCalledWith("sbom-".concat(owner, "-").concat(repo, ".json"), JSON.stringify(mockSBOM), globals_1.expect.any(Function));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, globals_1.describe)('generateSBOMForOrg', function () {
    it('should retrieve the SBOMs for an organization', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, resource, _a, owner, repo, octokit;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = 'test-token';
                    resource = 'actions';
                    _a = resource.split('/'), owner = _a[0], repo = _a[1];
                    octokit = new octokit_1.Octokit();
                    octokit.rest.repos.listForOrg = jest.fn().mockResolvedValue({
                        data: {
                            repos: mockRepos
                        }
                    });
                    console.log("this is org: ".concat(owner));
                    console.log("this is repo ".concat(repo));
                    // await generateSBOM(owner, repo, <any>octokit, 'repo')
                    return [4 /*yield*/, (0, generate_sbom_1.createRepoList)(token, owner, repo, octokit)];
                case 1:
                    // await generateSBOM(owner, repo, <any>octokit, 'repo')
                    _b.sent();
                    (0, globals_1.expect)(octokit.paginate(octokit.rest.repos.listForOrg)).toHaveBeenCalledWith({
                        org: owner,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
