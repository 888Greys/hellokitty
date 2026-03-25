package main

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
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
	got := sha256Hex(password)
	got = strings.ToLower(strings.TrimSpace(got))
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

func loadChatHTML() (string, error) {
	candidates := []string{
		"/home/nvidia/hellokitty/chat.html",
		"./chat.html",
		"./chet.html",
	}
	for _, p := range candidates {
		b, err := os.ReadFile(p)
		if err == nil {
			return string(b), nil
		}
	}
	return "", os.ErrNotExist
}

func unauthorized(w http.ResponseWriter) {
	w.Header().Set("WWW-Authenticate", `Basic realm="LLM Chat", charset="UTF-8"`)
	http.Error(w, "Unauthorized", http.StatusUnauthorized)
}

func main() {
	apiKey := firstNonEmpty(os.Getenv("API_KEY"), os.Getenv("POMPOM_KEY"))
	if apiKey == "" {
		log.Fatal("missing API key: set API_KEY (or POMPOM_KEY)")
	}

	appUser := firstNonEmpty(os.Getenv("APP_USER"), "mathew")
	appPassHash := firstNonEmpty(os.Getenv("APP_PASS_SHA256"))
	if appPassHash == "" {
		if plain := os.Getenv("APP_PASS"); plain != "" {
			appPassHash = sha256Hex(plain)
			log.Println("APP_PASS used; prefer APP_PASS_SHA256 in env file")
		}
	}
	if appPassHash == "" {
		log.Fatal("missing password: set APP_PASS_SHA256 (recommended) or APP_PASS")
	}

	target, err := url.Parse("http://127.0.0.1:8000")
	if err != nil {
		log.Fatalf("invalid proxy target: %v", err)
	}
	proxy := httputil.NewSingleHostReverseProxy(target)
	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, e error) {
		log.Printf("proxy error %s %s: %v", r.Method, r.URL.Path, e)
		http.Error(w, "Upstream unavailable", http.StatusBadGateway)
	}

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

		switch r.URL.Path {
		case "/", "/index.html", "/chat.html":
			html, readErr := loadChatHTML()
			if readErr != nil {
				http.Error(w, "chat.html not found", http.StatusNotFound)
				return
			}
			html = strings.Replace(html, "INSERT_API_BASE_HERE", "/v1", 1)
			html = strings.Replace(html, "INSERT_API_KEY_HERE", "", 1)
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			_, _ = w.Write([]byte(html))
			return
		}

		if strings.HasPrefix(r.URL.Path, "/v1/") || r.URL.Path == "/v1" {
			r.Header.Set("Authorization", "Bearer "+apiKey)
			r.Header.Del("X-Pompom-Key")
			proxy.ServeHTTP(w, r)
			return
		}

		http.NotFound(w, r)
	})

	log.Println("Gatekeeper: BasicAuth + server-side API key mode on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
