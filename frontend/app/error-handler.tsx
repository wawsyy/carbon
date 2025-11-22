"use client";

import { useEffect } from "react";

// Global error handler to catch and suppress non-critical fetch errors
export function ErrorHandler() {
  useEffect(() => {
    // Suppress "Failed to fetch" errors in console
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    const errorHandler = (message?: any, ...args: any[]) => {
      const messageStr = String(message || "");
      const argsStr = args.map(arg => String(arg || "")).join(" ");
      const fullMessage = messageStr + " " + argsStr;
      
      // Filter out non-critical fetch errors
      if (
        fullMessage.includes("Failed to fetch") ||
        fullMessage.includes("NetworkError") ||
        fullMessage.includes("TypeError: Failed to fetch") ||
        fullMessage.includes("Network request failed (suppressed)") ||
        fullMessage.includes("Network request failed") ||
        fullMessage.includes("ERR_BLOCKED_BY_RESPONSE") ||
        fullMessage.includes("NotSameOriginAfterDefaultedToSameOriginByCoep") ||
        fullMessage.includes("coinbase.com")
      ) {
        // Suppress this error - it's likely a non-critical network issue
        return;
      }
      
      originalError(message, ...args);
    };

    // Override console.error
    console.error = errorHandler;

    // Also intercept console.warn for fetch-related warnings
    const warnHandler = (message?: any, ...args: any[]) => {
      const messageStr = String(message || "");
      const argsStr = args.map(arg => String(arg || "")).join(" ");
      const fullMessage = messageStr + " " + argsStr;
      
      if (
        fullMessage.includes("Failed to fetch") ||
        fullMessage.includes("ERR_BLOCKED_BY_RESPONSE") ||
        fullMessage.includes("coinbase.com")
      ) {
        return;
      }
      
      originalWarn(message, ...args);
    };

    console.warn = warnHandler;

    // Catch unhandled promise rejections
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const reasonStr = String(reason || "");
      const errorMessage = reason instanceof Error ? reason.message : reasonStr;
      const errorStack = reason instanceof Error ? (reason.stack || "") : "";
      
      // Suppress non-critical fetch errors
      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("ERR_BLOCKED_BY_RESPONSE") ||
        reasonStr.includes("Failed to fetch") ||
        reasonStr.includes("ERR_BLOCKED_BY_RESPONSE") ||
        errorStack.includes("Failed to fetch")
      ) {
        event.preventDefault();
        // Silently suppress - these are non-critical
        return;
      }
    };

    // Catch global errors
    const globalErrorHandler = (event: ErrorEvent) => {
      const errorMessage = event.message || "";
      const errorFilename = event.filename || "";
      
      // Suppress fetch errors
      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("TypeError: Failed to fetch") ||
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("ERR_BLOCKED_BY_RESPONSE") ||
        errorFilename.includes("coinbase.com")
      ) {
        event.preventDefault();
        return false;
      }
    };

    // Don't intercept fetch - let it fail naturally and catch errors at higher level
    // This avoids issues with Response status codes and allows proper error handling

    window.addEventListener("unhandledrejection", unhandledRejectionHandler);
    window.addEventListener("error", globalErrorHandler);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
      window.removeEventListener("error", globalErrorHandler);
    };
  }, []);

  return null;
}

