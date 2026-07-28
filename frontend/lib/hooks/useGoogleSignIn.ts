"use client";

import { useState, useEffect, useRef, useCallback } from "react";

function isClient() {
    return typeof window !== "undefined";
}

function loadGoogleScript(clientId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (isClient() && (window as any).google?.accounts?.id) {
            resolve();
            return;
        }

        const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existing) {
            const check = () => {
                if ((window as any).google?.accounts?.id) {
                    resolve();
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            const check = () => {
                if ((window as any).google?.accounts?.id) {
                    resolve();
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        };
        script.onerror = () => {
            reject(new Error("Failed to load Google Identity Services script"));
        };
        document.head.appendChild(script);
    });
}

export function useGoogleSignIn(clientId: string, onSuccess: (credential: string) => void) {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const onSuccessRef = useRef(onSuccess);
    const initializedRef = useRef(false);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    const handleCredential = useCallback((credential: string) => {
        if (!credential) {
            setError("Google credential is missing");
            return;
        }
        onSuccessRef.current(credential);
    }, []);

    useEffect(() => {
        if (!isClient()) return;
        if (!clientId) {
            setError("Google Client ID is missing");
            return;
        }

        let mounted = true;

        async function init() {
            try {
                await loadGoogleScript(clientId);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Google Sign-In script failed to load");
                setReady(false);
                return;
            }

            if (!mounted) return;

            const origin = isClient() ? window.location.origin : "unknown";
            console.log("[Google Sign-In Diagnostics] Origin:", origin, "| Client ID:", clientId);
            console.log("[Google Sign-In Diagnostics] Authorized origins must include:", origin);

            const google = (window as any).google;
            if (!google?.accounts?.id) {
                setError(`Google Sign-In is not available. Origin: ${origin}. Client ID: ${clientId ? clientId.slice(0, 20) + "..." : "missing"}. Check Google Cloud Console authorized origins.`);
                setReady(false);
                return;
            }

            try {
                google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response: any) => {
                        handleCredential(response?.credential);
                    },
                });

                initializedRef.current = true;
                setReady(true);
                setError(null);
            } catch (err) {
                console.error("[Google Sign-In] initialize error:", err);
                setError(`Google Sign-In initialization failed: ${err instanceof Error ? err.message : err}. Origin: ${origin}`);
                setReady(false);
            }
        }

        init();

        return () => {
            mounted = false;
        };
    }, [clientId, handleCredential]);

    const signIn = useCallback(() => {
        if (!ready || !initializedRef.current) {
            setError("Google Sign-In is not ready yet");
            return;
        }

        try {
            const google = (window as any).google;
            if (!google?.accounts?.id) {
                setError("Google Sign-In is not available");
                return;
            }

            google.accounts.id.prompt();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Google Sign-In failed");
        }
    }, [ready]);

    const retry = useCallback(() => {
        setReady(false);
        setError(null);
        initializedRef.current = false;
    }, []);

    return { ready, error, signIn, retry };
}
