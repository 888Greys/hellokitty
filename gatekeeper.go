package main

import (
    "crypto/sha256"
    "crypto/subtle"
    "encoding/hex"
    "encoding/json"
    "errors"
    "log"
    "net"
    "net/http"
    "net/http/httputil"
    "net/url"
    "os"
    "path/filepath"
    "strings"
    "syscall"
)

func firstNonEmpty(values ...string) string {
    for _, v := range values {
        if strings.TrimSpace(v) != "" {
            return strings.TrimSpace(v)
        }
    }
    return ""
}

func sha256Hex(s string) string {
    sum := sha256.Sum256([]byte(s))
    return hex.EncodeToString(sum[:])
}

func validPassword(password, expectedHash string) bool {
    got := strings.ToLower(strings.TrimSpace(sha256Hex(password)))
    want := strings.ToLower(strings.TrimSpace(expectedHash))
    if len(got) != len(want) {
        return false
    }
    return subtle.ConstantTimeCompare([]byte(got), []byte(want)) == 1
}

func setCORS(w http.ResponseWriter) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Pompom-Key")
}

func unauthorized(w http.ResponseWriter) {
    w.Header().Set("WWW-Authenticate", `Basic realm="LLM Chat", charset="UTF-8"`)
    http.Error(w, "Unauthorized", http.StatusUnauthorized)
}

func writeJSONError(w http.ResponseWriter, status int, message string, errorType string) {
    setCORS(w)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    _ = json.NewEncoder(w).Encode(map[string]any{
        "error": map[string]any{
            "message": message,
            "type":    errorType,
            "code":    status,
        },
    })
}

func isUpstreamDialError(err error) bool {
    var opErr *net.OpError
    if errors.As(err, &opErr) {
        return errors.Is(opErr.Err, syscall.ECONNREFUSED) || errors.Is(opErr.Err, syscall.ECONNRESET)
    }
    return errors.Is(err, syscall.ECONNREFUSED) || errors.Is(err, syscall.ECONNRESET)
}

func main() {
    apiKey := firstNonEmpty(os.Getenv("API_KEY"), os.Getenv("POMPOM_KEY"))
    if apiKey == "" {
        log.Fatal("missing API_KEY")
    }

    appUser := firstNonEmpty(os.Getenv("APP_USER"), "mathew")
    appPassHash := firstNonEmpty(os.Getenv("APP_PASS_SHA256"))
    if appPassHash == "" {
        if plain := os.Getenv("APP_PASS"); plain != "" {
            appPassHash = sha256Hex(plain)
        }
    }
    if appPassHash == "" {
        log.Fatal("missing APP_PASS or APP_PASS_SHA256")
    }

    target, err := url.Parse("http://127.0.0.1:8000")
    if err != nil {
        log.Fatalf("invalid proxy target: %v", err)
    }

    proxy := httputil.NewSingleHostReverseProxy(target)
    proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
        log.Printf("proxy error %s %s: %v", r.Method, r.URL.Path, err)
        if strings.HasPrefix(r.URL.Path, "/v1/") || r.URL.Path == "/v1" {
            w.Header().Set("Retry-After", "10")
            if isUpstreamDialError(err) {
                writeJSONError(w, http.StatusServiceUnavailable, "Model warming up. Retry in a few seconds.", "ServiceUnavailableError")
                return
            }
            writeJSONError(w, http.StatusBadGateway, "Upstream unavailable. Retry in a few seconds.", "BadGatewayError")
            return
        }
        http.Error(w, "Upstream unavailable", http.StatusBadGateway)
    }

    distDir := "/home/nvidia/hellokitty/dist"
    staticFS := http.FileServer(http.Dir(distDir))

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        setCORS(w)

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        if r.URL.Path == "/healthz" {
            w.WriteHeader(http.StatusOK)
            _, _ = w.Write([]byte("ok"))
            return
        }

        user, pass, ok := r.BasicAuth()
        if !ok || user != appUser || !validPassword(pass, appPassHash) {
            unauthorized(w)
            return
        }

        if strings.HasPrefix(r.URL.Path, "/v1/") || r.URL.Path == "/v1" {
            r.Header.Set("Authorization", "Bearer "+apiKey)
            r.Header.Del("X-Pompom-Key")
            proxy.ServeHTTP(w, r)
            return
        }

        cleanPath := filepath.Clean(r.URL.Path)
        if cleanPath == "/" {
            http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
            return
        }

        fullPath := filepath.Join(distDir, cleanPath)
        if info, err := os.Stat(fullPath); err == nil && !info.IsDir() {
            staticFS.ServeHTTP(w, r)
            return
        }

        http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
    })

    log.Println("Gatekeeper: static app + basic auth + server-side API key on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
