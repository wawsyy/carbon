module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/frontend/config/wagmi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$rainbow$2d$me$2f$rainbowkit$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@rainbow-me/rainbowkit/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/viem/_esm/chains/definitions/sepolia.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hardhat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/viem/_esm/chains/definitions/hardhat.js [app-ssr] (ecmascript)");
;
;
// Note: You need to get a WalletConnect Project ID from https://cloud.walletconnect.com
// For local development, you can use a placeholder, but for production you should use a real project ID
const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';
// Configure hardhat local network properly
const localhost = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hardhat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hardhat"],
    id: 31337,
    name: 'Hardhat Local',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH'
    },
    rpcUrls: {
        default: {
            http: [
                'http://localhost:8545'
            ]
        }
    }
};
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$rainbow$2d$me$2f$rainbowkit$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultConfig"])({
    appName: 'Encrypted Home Energy Log',
    projectId: PROJECT_ID,
    chains: [
        localhost,
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sepolia"]
    ],
    ssr: true
});
}),
"[project]/frontend/fhevm/GenericStringStorage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericStringInMemoryStorage",
    ()=>GenericStringInMemoryStorage
]);
class GenericStringInMemoryStorage {
    #store = new Map();
    getItem(key) {
        return this.#store.has(key) ? this.#store.get(key) : null;
    }
    setItem(key, value) {
        this.#store.set(key, value);
    }
    removeItem(key) {
        this.#store.delete(key);
    }
}
}),
"[project]/frontend/hooks/useInMemoryStorage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InMemoryStorageProvider",
    ()=>InMemoryStorageProvider,
    "useInMemoryStorage",
    ()=>useInMemoryStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$fhevm$2f$GenericStringStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/fhevm/GenericStringStorage.ts [app-ssr] (ecmascript)");
;
;
;
const InMemoryStorageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useInMemoryStorage = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(InMemoryStorageContext);
    if (!context) {
        throw new Error("useInMemoryStorage must be used within a InMemoryStorageProvider");
    }
    return context;
};
const InMemoryStorageProvider = ({ children })=>{
    const [storage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$fhevm$2f$GenericStringStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GenericStringInMemoryStorage"]());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InMemoryStorageContext.Provider, {
        value: {
            storage
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/hooks/useInMemoryStorage.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/frontend/app/error-handler.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorHandler",
    ()=>ErrorHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function ErrorHandler() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Suppress "Failed to fetch" errors in console
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalLog = console.log;
        const errorHandler = (message, ...args)=>{
            const messageStr = String(message || "");
            const argsStr = args.map((arg)=>String(arg || "")).join(" ");
            const fullMessage = messageStr + " " + argsStr;
            // Filter out non-critical fetch errors
            if (fullMessage.includes("Failed to fetch") || fullMessage.includes("NetworkError") || fullMessage.includes("TypeError: Failed to fetch") || fullMessage.includes("Network request failed (suppressed)") || fullMessage.includes("Network request failed") || fullMessage.includes("ERR_BLOCKED_BY_RESPONSE") || fullMessage.includes("NotSameOriginAfterDefaultedToSameOriginByCoep") || fullMessage.includes("coinbase.com")) {
                // Suppress this error - it's likely a non-critical network issue
                return;
            }
            originalError(message, ...args);
        };
        // Override console.error
        console.error = errorHandler;
        // Also intercept console.warn for fetch-related warnings
        const warnHandler = (message, ...args)=>{
            const messageStr = String(message || "");
            const argsStr = args.map((arg)=>String(arg || "")).join(" ");
            const fullMessage = messageStr + " " + argsStr;
            if (fullMessage.includes("Failed to fetch") || fullMessage.includes("ERR_BLOCKED_BY_RESPONSE") || fullMessage.includes("coinbase.com")) {
                return;
            }
            originalWarn(message, ...args);
        };
        console.warn = warnHandler;
        // Catch unhandled promise rejections
        const unhandledRejectionHandler = (event)=>{
            const reason = event.reason;
            const reasonStr = String(reason || "");
            const errorMessage = reason instanceof Error ? reason.message : reasonStr;
            const errorStack = reason instanceof Error ? reason.stack : "";
            // Suppress non-critical fetch errors
            if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError") || errorMessage.includes("Network request failed") || errorMessage.includes("ERR_BLOCKED_BY_RESPONSE") || reasonStr.includes("Failed to fetch") || reasonStr.includes("ERR_BLOCKED_BY_RESPONSE") || errorStack.includes("Failed to fetch")) {
                event.preventDefault();
                // Silently suppress - these are non-critical
                return;
            }
        };
        // Catch global errors
        const globalErrorHandler = (event)=>{
            const errorMessage = event.message || "";
            const errorFilename = event.filename || "";
            // Suppress fetch errors
            if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError") || errorMessage.includes("TypeError: Failed to fetch") || errorMessage.includes("Network request failed") || errorMessage.includes("ERR_BLOCKED_BY_RESPONSE") || errorFilename.includes("coinbase.com")) {
                event.preventDefault();
                return false;
            }
        };
        // Don't intercept fetch - let it fail naturally and catch errors at higher level
        // This avoids issues with Response status codes and allows proper error handling
        window.addEventListener("unhandledrejection", unhandledRejectionHandler);
        window.addEventListener("error", globalErrorHandler);
        return ()=>{
            console.error = originalError;
            console.warn = originalWarn;
            console.log = originalLog;
            window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
            window.removeEventListener("error", globalErrorHandler);
        };
    }, []);
    return null;
}
}),
"[project]/frontend/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/wagmi/dist/esm/context.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$rainbow$2d$me$2f$rainbowkit$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@rainbow-me/rainbowkit/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$config$2f$wagmi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/config/wagmi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$useInMemoryStorage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/hooks/useInMemoryStorage.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$error$2d$handler$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/error-handler.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            // Suppress network errors in query retries
            retry: (failureCount, error)=>{
                const errorMessage = String(error?.message || "");
                if (errorMessage.includes("Failed to fetch")) {
                    return false; // Don't retry fetch errors
                }
                return failureCount < 3;
            }
        }
    }
});
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$context$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WagmiProvider"], {
        config: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$config$2f$wagmi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["config"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$rainbow$2d$me$2f$rainbowkit$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RainbowKitProvider"], {
                locale: "en",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$error$2d$handler$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorHandler"], {}, void 0, false, {
                        fileName: "[project]/frontend/app/providers.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$useInMemoryStorage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryStorageProvider"], {
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/providers.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/providers.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/app/providers.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/providers.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7271a75f._.js.map