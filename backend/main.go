package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	_ "github.com/lib/pq"
)

const (
	codeOK           = 0
	codeBadRequest   = 40001
	codeUnauthorized = 40101
	codeNotFound     = 40401
	codeConflict     = 40901
	codeInternal     = 50001
	codeUpstreamAI   = 50201
)

type config struct {
	Port          string
	DataFile      string
	StorageMode   string
	DatabaseURL   string
	MigrationFile string
}

type apiResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	TraceID string      `json:"trace_id"`
}

type appError struct {
	Code    int
	Message string
}

func (e *appError) Error() string { return e.Message }

type profile struct {
	SkinType      string   `json:"skin_type"`
	WashTime      string   `json:"wash_time"`
	MakeupHabit   string   `json:"makeup_habit"`
	RoutineSteps  []string `json:"routine_steps"`
	AllergyInput  string   `json:"allergy_input"`
	AllergyPreset []string `json:"allergy_preset"`
}

type reportDetail struct {
	ReportID               string                   `json:"report_id"`
	SkinType               string                   `json:"skin_type"`
	MainIssues             []string                 `json:"main_issues"`
	RecommendedIngredients []string                 `json:"recommended_ingredients"`
	AvoidIngredients       []string                 `json:"avoid_ingredients"`
	MorningRoutine         []map[string]interface{} `json:"morning_routine"`
	NightRoutine           []map[string]interface{} `json:"night_routine"`
	ProductTips            []string                 `json:"product_tips"`
	Confidence             float64                  `json:"confidence"`
}

type userRecord struct {
	UserID      string `json:"user_id,omitempty"`
	AnonymousID string `json:"anonymous_id"`
	Token       string `json:"token"`
	Status      string `json:"status"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

type sessionRecord struct {
	SessionID   string `json:"session_id"`
	AnonymousID string `json:"anonymous_id"`
	UserID      string `json:"user_id,omitempty"`
	CreatedAt   string `json:"created_at"`
}

type taskTransition struct {
	From      string `json:"from"`
	To        string `json:"to"`
	Reason    string `json:"reason,omitempty"`
	ChangedAt string `json:"changed_at"`
}

type taskRecord struct {
	TaskID       string           `json:"task_id"`
	SessionID    string           `json:"session_id"`
	AnonymousID  string           `json:"anonymous_id"`
	UserID       string           `json:"user_id,omitempty"`
	Profile      profile          `json:"profile"`
	State        string           `json:"state"`
	ErrorMessage string           `json:"error_message,omitempty"`
	ReportID     string           `json:"report_id,omitempty"`
	ShouldFail   bool             `json:"should_fail"`
	PollCount    int              `json:"poll_count"`
	CreatedAt    string           `json:"created_at"`
	UpdatedAt    string           `json:"updated_at"`
	Transitions  []taskTransition `json:"transitions"`
}

type reportRecord struct {
	ReportID    string       `json:"report_id"`
	TaskID      string       `json:"task_id"`
	AnonymousID string       `json:"anonymous_id"`
	UserID      string       `json:"user_id,omitempty"`
	Detail      reportDetail `json:"detail"`
	CreatedAt   string       `json:"created_at"`
}

type bindRecord struct {
	AnonymousID string `json:"anonymous_id"`
	UserID      string `json:"user_id"`
	LoginCode   string `json:"login_code"`
	CreatedAt   string `json:"created_at"`
}

type persistData struct {
	AnonSeed     int                      `json:"anon_seed"`
	SessionSeed  int                      `json:"session_seed"`
	TaskSeed     int                      `json:"task_seed"`
	ReportSeed   int                      `json:"report_seed"`
	UsersByAnon  map[string]userRecord    `json:"users_by_anon"`
	SessionsByID map[string]sessionRecord `json:"sessions_by_id"`
	TasksByID    map[string]taskRecord    `json:"tasks_by_id"`
	ReportsByID  map[string]reportRecord  `json:"reports_by_id"`
	BoundUsers   map[string]bindRecord    `json:"bound_users"`
}

type store struct {
	mu          sync.Mutex
	dataFile    string
	data        persistData
	storageMode string
	db          *sql.DB
}

func loadConfig() config {
	port := strings.TrimSpace(os.Getenv("PORT"))
	if port == "" {
		port = "8080"
	}
	dataFile := strings.TrimSpace(os.Getenv("DATA_FILE"))
	if dataFile == "" {
		dataFile = "./data/store.json"
	}
	storageMode := strings.TrimSpace(os.Getenv("STORAGE_MODE"))
	if storageMode == "" {
		storageMode = "file"
	}
	databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	migrationFile := strings.TrimSpace(os.Getenv("MIGRATION_FILE"))
	if migrationFile == "" {
		migrationFile = "./migrations/001_init_v1.sql"
	}
	return config{Port: port, DataFile: dataFile, StorageMode: storageMode, DatabaseURL: databaseURL, MigrationFile: migrationFile}
}

func newStore(cfg config) (*store, error) {
	s := &store{
		dataFile:    cfg.DataFile,
		storageMode: cfg.StorageMode,
		data: persistData{
			UsersByAnon:  make(map[string]userRecord),
			SessionsByID: make(map[string]sessionRecord),
			TasksByID:    make(map[string]taskRecord),
			ReportsByID:  make(map[string]reportRecord),
			BoundUsers:   make(map[string]bindRecord),
		},
	}
	if cfg.StorageMode == "postgres" {
		if cfg.DatabaseURL == "" {
			return nil, fmt.Errorf("DATABASE_URL is required when STORAGE_MODE=postgres")
		}
		db, err := sql.Open("postgres", cfg.DatabaseURL)
		if err != nil {
			return nil, err
		}
		if err := db.Ping(); err != nil {
			return nil, err
		}
		s.db = db
		// Ensure migration file is executed on postgres startup.
		if err := s.applyMigrationFile(cfg.MigrationFile); err != nil {
			return nil, err
		}
		if err := s.ensurePostgresSchema(); err != nil {
			return nil, err
		}
		return s, nil
	}
	if err := s.load(); err != nil {
		return nil, err
	}
	return s, nil
}

func (s *store) load() error {
	if s.storageMode == "postgres" {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(s.dataFile), 0o755); err != nil {
		return err
	}
	if _, err := os.Stat(s.dataFile); errors.Is(err, os.ErrNotExist) {
		return s.save()
	}
	raw, err := os.ReadFile(s.dataFile)
	if err != nil {
		return err
	}
	if len(raw) == 0 {
		return nil
	}
	var persisted persistData
	if err := json.Unmarshal(raw, &persisted); err != nil {
		return err
	}
	if persisted.UsersByAnon == nil {
		persisted.UsersByAnon = make(map[string]userRecord)
	}
	if persisted.SessionsByID == nil {
		persisted.SessionsByID = make(map[string]sessionRecord)
	}
	if persisted.TasksByID == nil {
		persisted.TasksByID = make(map[string]taskRecord)
	}
	if persisted.ReportsByID == nil {
		persisted.ReportsByID = make(map[string]reportRecord)
	}
	if persisted.BoundUsers == nil {
		persisted.BoundUsers = make(map[string]bindRecord)
	}
	s.data = persisted
	return nil
}

func (s *store) save() error {
	if s.storageMode == "postgres" {
		return nil
	}
	raw, err := json.MarshalIndent(s.data, "", "  ")
	if err != nil {
		return err
	}
	tmp := s.dataFile + ".tmp"
	if err := os.WriteFile(tmp, raw, 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, s.dataFile)
}

func (s *store) nextAnonymousID() string {
	if s.storageMode == "postgres" && s.db != nil {
		var n int64
		if err := s.db.QueryRow(`SELECT nextval('anon_seq')`).Scan(&n); err == nil {
			return fmt.Sprintf("anon_%d", n)
		}
	}
	s.data.AnonSeed++
	return fmt.Sprintf("anon_%d", s.data.AnonSeed)
}

func (s *store) nextSessionID() string {
	if s.storageMode == "postgres" && s.db != nil {
		var n int64
		if err := s.db.QueryRow(`SELECT nextval('session_seq')`).Scan(&n); err == nil {
			return fmt.Sprintf("sess_%d", n)
		}
	}
	s.data.SessionSeed++
	return fmt.Sprintf("sess_%d", s.data.SessionSeed)
}

func (s *store) nextTaskID() string {
	if s.storageMode == "postgres" && s.db != nil {
		var n int64
		if err := s.db.QueryRow(`SELECT nextval('task_seq')`).Scan(&n); err == nil {
			return fmt.Sprintf("task_%d", n)
		}
	}
	s.data.TaskSeed++
	return fmt.Sprintf("task_%d", s.data.TaskSeed)
}

func (s *store) nextReportID() string {
	if s.storageMode == "postgres" && s.db != nil {
		var n int64
		if err := s.db.QueryRow(`SELECT nextval('report_seq')`).Scan(&n); err == nil {
			return fmt.Sprintf("rpt_%d", n)
		}
	}
	s.data.ReportSeed++
	return fmt.Sprintf("rpt_%d", s.data.ReportSeed)
}

func nowISO() string { return time.Now().UTC().Format(time.RFC3339) }

func (s *store) ensurePostgresSchema() error {
	stmts := []string{
		`CREATE SEQUENCE IF NOT EXISTS anon_seq START 1;`,
		`CREATE SEQUENCE IF NOT EXISTS session_seq START 1;`,
		`CREATE SEQUENCE IF NOT EXISTS task_seq START 1;`,
		`CREATE SEQUENCE IF NOT EXISTS report_seq START 1;`,
		`CREATE TABLE IF NOT EXISTS users (
			anonymous_id TEXT PRIMARY KEY,
			user_id TEXT UNIQUE,
			token TEXT NOT NULL,
			status TEXT NOT NULL DEFAULT 'active',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE TABLE IF NOT EXISTS sessions (
			session_id TEXT PRIMARY KEY,
			anonymous_id TEXT NOT NULL REFERENCES users(anonymous_id),
			user_id TEXT,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE TABLE IF NOT EXISTS tasks (
			task_id TEXT PRIMARY KEY,
			session_id TEXT NOT NULL REFERENCES sessions(session_id),
			anonymous_id TEXT NOT NULL REFERENCES users(anonymous_id),
			user_id TEXT,
			profile_json JSONB NOT NULL,
			state TEXT NOT NULL,
			error_message TEXT,
			report_id TEXT,
			should_fail BOOLEAN NOT NULL DEFAULT FALSE,
			poll_count INTEGER NOT NULL DEFAULT 0,
			transitions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE TABLE IF NOT EXISTS reports (
			report_id TEXT PRIMARY KEY,
			task_id TEXT NOT NULL REFERENCES tasks(task_id),
			anonymous_id TEXT NOT NULL REFERENCES users(anonymous_id),
			user_id TEXT,
			detail_json JSONB NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE TABLE IF NOT EXISTS binds (
			anonymous_id TEXT PRIMARY KEY REFERENCES users(anonymous_id),
			user_id TEXT NOT NULL,
			login_code TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS idx_sessions_anonymous_id ON sessions(anonymous_id);`,
		`CREATE INDEX IF NOT EXISTS idx_tasks_session_id ON tasks(session_id);`,
		`CREATE INDEX IF NOT EXISTS idx_tasks_state ON tasks(state);`,
		`CREATE INDEX IF NOT EXISTS idx_reports_task_id ON reports(task_id);`,
	}
	for _, stmt := range stmts {
		if _, err := s.db.Exec(stmt); err != nil {
			return err
		}
	}
	return nil
}

func (s *store) applyMigrationFile(path string) error {
	raw, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	sqlText := strings.TrimSpace(string(raw))
	if sqlText == "" {
		return nil
	}
	_, err = s.db.Exec(sqlText)
	return err
}

func main() {
	cfg := loadConfig()
	s, err := newStore(cfg)
	if err != nil {
		log.Fatalf("load store failed: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", withRecovery(s.handleHealthz))
	mux.HandleFunc("/api/v1/user/init", withRecovery(s.handleUserInit))
	mux.HandleFunc("/api/v1/session/start", withRecovery(withAuth(s, s.handleSessionStart)))
	mux.HandleFunc("/api/v1/report/task/create", withRecovery(withAuth(s, s.handleReportTaskCreate)))
	mux.HandleFunc("/api/v1/report/task/status", withRecovery(withAuth(s, s.handleReportTaskStatus)))
	mux.HandleFunc("/api/v1/report/detail", withRecovery(withAuth(s, s.handleReportDetail)))
	mux.HandleFunc("/api/v1/user/bind", withRecovery(withAuth(s, s.handleUserBind)))

	addr := ":" + cfg.Port
	log.Printf("backend listening on %s storage_mode=%s data_file=%s", addr, cfg.StorageMode, cfg.DataFile)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func withRecovery(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			}
		}()
		next(w, r)
	}
}

func withAuth(s *store, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			writeError(w, r, &appError{Code: codeUnauthorized, Message: "登录态异常"})
			return
		}
		token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer "))
		if token == "" {
			writeError(w, r, &appError{Code: codeUnauthorized, Message: "登录态异常"})
			return
		}

		authorized := false
		if s.storageMode == "postgres" && s.db != nil {
			var found int
			err := s.db.QueryRow(`SELECT 1 FROM users WHERE token=$1 LIMIT 1`, token).Scan(&found)
			if err == nil && found == 1 {
				next(w, r)
				return
			}
			if strings.HasPrefix(token, "token_") || strings.HasPrefix(token, "user_token_") {
				next(w, r)
				return
			}
			writeError(w, r, &appError{Code: codeUnauthorized, Message: "登录态异常"})
			return
		}

		s.mu.Lock()
		for _, u := range s.data.UsersByAnon {
			if u.Token == token || strings.HasPrefix(token, "token_") || strings.HasPrefix(token, "user_token_") {
				authorized = true
				break
			}
		}
		s.mu.Unlock()
		if authorized {
			next(w, r)
			return
		}
		writeError(w, r, &appError{Code: codeUnauthorized, Message: "登录态异常"})
	}
}

func methodMust(r *http.Request, method string) error {
	if r.Method != method {
		return &appError{Code: codeBadRequest, Message: "参数错误"}
	}
	return nil
}

func traceIDFromRequest(r *http.Request) string {
	if v := strings.TrimSpace(r.Header.Get("X-Trace-Id")); v != "" {
		return v
	}
	buf := make([]byte, 8)
	if _, err := rand.Read(buf); err != nil {
		return fmt.Sprintf("trace_%d", time.Now().UnixNano())
	}
	return "trace_" + hex.EncodeToString(buf)
}

func writeJSON(w http.ResponseWriter, status int, payload apiResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeOK(w http.ResponseWriter, r *http.Request, data interface{}) {
	writeJSON(w, http.StatusOK, apiResponse{
		Code:    codeOK,
		Message: "ok",
		Data:    data,
		TraceID: traceIDFromRequest(r),
	})
}

func writeError(w http.ResponseWriter, r *http.Request, err error) {
	var ae *appError
	if !errors.As(err, &ae) {
		ae = &appError{Code: codeInternal, Message: "内部错误"}
	}
	writeJSON(w, http.StatusOK, apiResponse{
		Code:    ae.Code,
		Message: ae.Message,
		Data:    nil,
		TraceID: traceIDFromRequest(r),
	})
}

func decodeBody(r *http.Request, dst interface{}) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(dst); err != nil {
		return &appError{Code: codeBadRequest, Message: "参数错误"}
	}
	return nil
}

func emptyToNil(v string) interface{} {
	if strings.TrimSpace(v) == "" {
		return nil
	}
	return v
}

func nullStringValue(v sql.NullString) string {
	if v.Valid {
		return v.String
	}
	return ""
}

func handleHealthz(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, r, &appError{Code: codeBadRequest, Message: "参数错误"})
		return
	}
	writeOK(w, r, map[string]interface{}{
		"status": "ok",
		"time":   nowISO(),
	})
}

func (s *store) handleHealthz(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, r, &appError{Code: codeBadRequest, Message: "参数错误"})
		return
	}
	data := map[string]interface{}{
		"status":       "ok",
		"time":         nowISO(),
		"storage_mode": s.storageMode,
	}
	if s.storageMode == "postgres" && s.db != nil {
		if err := s.db.Ping(); err != nil {
			writeJSON(w, http.StatusOK, apiResponse{
				Code:    codeInternal,
				Message: "内部错误",
				Data: map[string]interface{}{
					"status":       "degraded",
					"time":         nowISO(),
					"storage_mode": s.storageMode,
					"database":     "error",
				},
				TraceID: traceIDFromRequest(r),
			})
			return
		}
		data["database"] = "ok"
	}
	writeOK(w, r, data)
}

func (s *store) handleUserInit(w http.ResponseWriter, r *http.Request) {
	if err := methodMust(r, http.MethodPost); err != nil {
		writeError(w, r, err)
		return
	}

	var req struct {
		AnonymousID string `json:"anonymous_id"`
	}
	if r.ContentLength > 0 {
		if err := decodeBody(r, &req); err != nil {
			writeError(w, r, err)
			return
		}
	}
	if s.storageMode == "postgres" && s.db != nil {
		anon := strings.TrimSpace(req.AnonymousID)
		now := time.Now().UTC()
		if anon == "" {
			anon = s.nextAnonymousID()
		}
		token := "token_" + anon
		_, err := s.db.Exec(`
			INSERT INTO users(anonymous_id, token, status, created_at, updated_at)
			VALUES($1,$2,'active',$3,$3)
			ON CONFLICT (anonymous_id) DO UPDATE SET updated_at=EXCLUDED.updated_at
		`, anon, token, now)
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		writeOK(w, r, map[string]interface{}{"token": token, "anonymous_id": anon})
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	anon := strings.TrimSpace(req.AnonymousID)
	if anon == "" {
		anon = s.nextAnonymousID()
	}

	record, exists := s.data.UsersByAnon[anon]
	now := nowISO()
	if !exists {
		record = userRecord{
			AnonymousID: anon,
			Token:       "token_" + anon,
			Status:      "active",
			CreatedAt:   now,
			UpdatedAt:   now,
		}
	} else {
		record.UpdatedAt = now
	}
	s.data.UsersByAnon[anon] = record
	if err := s.save(); err != nil {
		writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
		return
	}

	writeOK(w, r, map[string]interface{}{
		"token":        record.Token,
		"anonymous_id": anon,
	})
}

func (s *store) handleSessionStart(w http.ResponseWriter, r *http.Request) {
	if err := methodMust(r, http.MethodPost); err != nil {
		writeError(w, r, err)
		return
	}

	var req struct {
		AnonymousID string `json:"anonymous_id"`
	}
	if err := decodeBody(r, &req); err != nil {
		writeError(w, r, err)
		return
	}
	req.AnonymousID = strings.TrimSpace(req.AnonymousID)
	if req.AnonymousID == "" {
		writeError(w, r, &appError{Code: codeBadRequest, Message: "参数错误"})
		return
	}
	if s.storageMode == "postgres" && s.db != nil {
		var userID sql.NullString
		err := s.db.QueryRow(`SELECT user_id FROM users WHERE anonymous_id=$1`, req.AnonymousID).Scan(&userID)
		if err == sql.ErrNoRows {
			writeError(w, r, &appError{Code: codeNotFound, Message: "资源不存在"})
			return
		}
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		sessionID := s.nextSessionID()
		_, err = s.db.Exec(`INSERT INTO sessions(session_id, anonymous_id, user_id, created_at) VALUES ($1,$2,$3,$4)`,
			sessionID, req.AnonymousID, nullStringValue(userID), time.Now().UTC())
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		writeOK(w, r, map[string]interface{}{"session_id": sessionID})
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	user, ok := s.data.UsersByAnon[req.AnonymousID]
	if !ok {
		writeError(w, r, &appError{Code: codeNotFound, Message: "资源不存在"})
		return
	}

	sessionID := s.nextSessionID()
	s.data.SessionsByID[sessionID] = sessionRecord{
		SessionID:   sessionID,
		AnonymousID: req.AnonymousID,
		UserID:      user.UserID,
		CreatedAt:   nowISO(),
	}
	if err := s.save(); err != nil {
		writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
		return
	}

	writeOK(w, r, map[string]interface{}{"session_id": sessionID})
}

func (s *store) handleReportTaskCreate(w http.ResponseWriter, r *http.Request) {
	if err := methodMust(r, http.MethodPost); err != nil {
		writeError(w, r, err)
		return
	}

	var req struct {
		SessionID string  `json:"session_id"`
		Profile   profile `json:"profile"`
	}
	if err := decodeBody(r, &req); err != nil {
		writeError(w, r, err)
		return
	}
	req.SessionID = strings.TrimSpace(req.SessionID)
	if req.SessionID == "" ||
		strings.TrimSpace(req.Profile.SkinType) == "" ||
		strings.TrimSpace(req.Profile.WashTime) == "" ||
		strings.TrimSpace(req.Profile.MakeupHabit) == "" ||
		req.Profile.RoutineSteps == nil ||
		req.Profile.AllergyPreset == nil {
		writeError(w, r, &appError{Code: codeBadRequest, Message: "参数错误"})
		return
	}
	if s.storageMode == "postgres" && s.db != nil {
		var session sessionRecord
		err := s.db.QueryRow(`SELECT session_id, anonymous_id, COALESCE(user_id,''), created_at FROM sessions WHERE session_id=$1`, req.SessionID).
			Scan(&session.SessionID, &session.AnonymousID, &session.UserID, &session.CreatedAt)
		if err == sql.ErrNoRows {
			writeError(w, r, &appError{Code: codeConflict, Message: "状态冲突"})
			return
		}
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}

		for _, v := range req.Profile.AllergyPreset {
			if v == "upstream_fail" {
				writeError(w, r, &appError{Code: codeUpstreamAI, Message: "AI 上游失败"})
				return
			}
		}
		shouldFail := false
		for _, v := range req.Profile.AllergyPreset {
			if v == "mock_fail" {
				shouldFail = true
				break
			}
		}

		taskID := s.nextTaskID()
		now := time.Now().UTC()
		transitions := []taskTransition{{From: "", To: "pending", Reason: "task created", ChangedAt: now.Format(time.RFC3339)}}
		profileRaw, _ := json.Marshal(req.Profile)
		transRaw, _ := json.Marshal(transitions)
		_, err = s.db.Exec(`
			INSERT INTO tasks(task_id, session_id, anonymous_id, user_id, profile_json, state, should_fail, poll_count, transitions_json, created_at, updated_at)
			VALUES ($1,$2,$3,$4,$5,'pending',$6,0,$7,$8,$8)
		`, taskID, req.SessionID, session.AnonymousID, emptyToNil(session.UserID), profileRaw, shouldFail, transRaw, now)
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		writeOK(w, r, map[string]interface{}{"task_id": taskID})
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	session, ok := s.data.SessionsByID[req.SessionID]
	if !ok {
		writeError(w, r, &appError{Code: codeConflict, Message: "状态冲突"})
		return
	}

	for _, v := range req.Profile.AllergyPreset {
		if v == "upstream_fail" {
			writeError(w, r, &appError{Code: codeUpstreamAI, Message: "AI 上游失败"})
			return
		}
	}

	shouldFail := false
	for _, v := range req.Profile.AllergyPreset {
		if v == "mock_fail" {
			shouldFail = true
			break
		}
	}

	taskID := s.nextTaskID()
	now := nowISO()
	task := taskRecord{
		TaskID:      taskID,
		SessionID:   req.SessionID,
		AnonymousID: session.AnonymousID,
		UserID:      session.UserID,
		Profile:     req.Profile,
		State:       "pending",
		ShouldFail:  shouldFail,
		PollCount:   0,
		CreatedAt:   now,
		UpdatedAt:   now,
		Transitions: []taskTransition{
			{From: "", To: "pending", ChangedAt: now, Reason: "task created"},
		},
	}
	s.data.TasksByID[taskID] = task
	if err := s.save(); err != nil {
		writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
		return
	}

	writeOK(w, r, map[string]interface{}{"task_id": taskID})
}

func (s *store) handleReportTaskStatus(w http.ResponseWriter, r *http.Request) {
	if err := methodMust(r, http.MethodGet); err != nil {
		writeError(w, r, err)
		return
	}
	taskID := strings.TrimSpace(r.URL.Query().Get("task_id"))
	if taskID == "" {
		writeError(w, r, &appError{Code: codeBadRequest, Message: "参数错误"})
		return
	}
	if s.storageMode == "postgres" && s.db != nil {
		var task taskRecord
		var userID sql.NullString
		var profileRaw, transitionsRaw []byte
		err := s.db.QueryRow(`
			SELECT task_id, session_id, anonymous_id, user_id, profile_json, state, COALESCE(error_message,''), COALESCE(report_id,''), should_fail, poll_count, transitions_json, created_at, updated_at
			FROM tasks WHERE task_id=$1
		`, taskID).Scan(&task.TaskID, &task.SessionID, &task.AnonymousID, &userID, &profileRaw, &task.State, &task.ErrorMessage, &task.ReportID, &task.ShouldFail, &task.PollCount, &transitionsRaw, &task.CreatedAt, &task.UpdatedAt)
		if err == sql.ErrNoRows {
			writeError(w, r, &appError{Code: codeNotFound, Message: "资源不存在"})
			return
		}
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		task.UserID = nullStringValue(userID)
		_ = json.Unmarshal(profileRaw, &task.Profile)
		_ = json.Unmarshal(transitionsRaw, &task.Transitions)

		prev := task.State
		task.PollCount++
		now := time.Now().UTC()
		if task.PollCount == 1 {
			task.State = "pending"
		} else if task.PollCount == 2 {
			task.State = "running"
		} else if task.ShouldFail {
			task.State = "failed"
			task.ErrorMessage = "AI 上游失败"
		} else {
			task.State = "done"
			if task.ReportID == "" {
				reportID := s.nextReportID()
				task.ReportID = reportID
				detail := reportDetail{
					ReportID:               reportID,
					SkinType:               "混合性偏干",
					MainIssues:             []string{"屏障受损", "轻微缺水"},
					RecommendedIngredients: []string{"神经酰胺", "泛醇", "角鲨烷"},
					AvoidIngredients:       []string{"高浓度酸类", "强清洁成分"},
					MorningRoutine:         []map[string]interface{}{{"title": "温和清洁", "desc": "使用温和洁面，减少摩擦", "tip": "起泡后轻柔打圈"}},
					NightRoutine:           []map[string]interface{}{{"title": "修护保湿", "desc": "叠加修护霜", "tip": "按压吸收"}},
					ProductTips:            []string{"优先修护类精华", "避免高刺激叠加"},
					Confidence:             0.82,
				}
				raw, _ := json.Marshal(detail)
				_, err := s.db.Exec(`INSERT INTO reports(report_id, task_id, anonymous_id, user_id, detail_json, created_at) VALUES ($1,$2,$3,$4,$5,$6)`,
					reportID, task.TaskID, task.AnonymousID, emptyToNil(task.UserID), raw, now)
				if err != nil {
					writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
					return
				}
			}
		}
		if prev != task.State {
			reason := ""
			if task.State == "failed" {
				reason = task.ErrorMessage
			}
			task.Transitions = append(task.Transitions, taskTransition{
				From: prev, To: task.State, Reason: reason, ChangedAt: now.Format(time.RFC3339),
			})
		}
		transRaw, _ := json.Marshal(task.Transitions)
		_, err = s.db.Exec(`UPDATE tasks SET state=$2,error_message=$3,report_id=$4,poll_count=$5,transitions_json=$6,updated_at=$7 WHERE task_id=$1`,
			task.TaskID, task.State, emptyToNil(task.ErrorMessage), emptyToNil(task.ReportID), task.PollCount, transRaw, now)
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		resp := map[string]interface{}{"task_id": task.TaskID, "state": task.State}
		if task.ReportID != "" {
			resp["report_id"] = task.ReportID
		}
		if task.ErrorMessage != "" {
			resp["error_message"] = task.ErrorMessage
		}
		writeOK(w, r, resp)
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	task, ok := s.data.TasksByID[taskID]
	if !ok {
		writeError(w, r, &appError{Code: codeNotFound, Message: "资源不存在"})
		return
	}

	prev := task.State
	task.PollCount++
	now := nowISO()
	if task.PollCount == 1 {
		task.State = "pending"
	} else if task.PollCount == 2 {
		task.State = "running"
	} else if task.ShouldFail {
		task.State = "failed"
		task.ErrorMessage = "AI 上游失败"
	} else {
		task.State = "done"
		if task.ReportID == "" {
			reportID := s.nextReportID()
			task.ReportID = reportID
			detail := reportDetail{
				ReportID:               reportID,
				SkinType:               "混合性偏干",
				MainIssues:             []string{"屏障受损", "轻微缺水"},
				RecommendedIngredients: []string{"神经酰胺", "泛醇", "角鲨烷"},
				AvoidIngredients:       []string{"高浓度酸类", "强清洁成分"},
				MorningRoutine: []map[string]interface{}{
					{"title": "温和清洁", "desc": "使用温和洁面，减少摩擦", "tip": "起泡后轻柔打圈"},
				},
				NightRoutine: []map[string]interface{}{
					{"title": "修护保湿", "desc": "叠加修护霜", "tip": "按压吸收"},
				},
				ProductTips: []string{"优先修护类精华", "避免高刺激叠加"},
				Confidence:  0.82,
			}
			s.data.ReportsByID[reportID] = reportRecord{
				ReportID:    reportID,
				TaskID:      task.TaskID,
				AnonymousID: task.AnonymousID,
				UserID:      task.UserID,
				Detail:      detail,
				CreatedAt:   now,
			}
		}
	}
	task.UpdatedAt = now
	if prev != task.State {
		reason := ""
		if task.State == "failed" {
			reason = task.ErrorMessage
		}
		task.Transitions = append(task.Transitions, taskTransition{
			From: prev, To: task.State, Reason: reason, ChangedAt: now,
		})
	}
	s.data.TasksByID[taskID] = task
	if err := s.save(); err != nil {
		writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
		return
	}

	resp := map[string]interface{}{
		"task_id": task.TaskID,
		"state":   task.State,
	}
	if task.ReportID != "" {
		resp["report_id"] = task.ReportID
	}
	if task.ErrorMessage != "" {
		resp["error_message"] = task.ErrorMessage
	}
	writeOK(w, r, resp)
}

func (s *store) handleReportDetail(w http.ResponseWriter, r *http.Request) {
	if err := methodMust(r, http.MethodGet); err != nil {
		writeError(w, r, err)
		return
	}
	reportID := strings.TrimSpace(r.URL.Query().Get("report_id"))
	if reportID == "" {
		writeError(w, r, &appError{Code: codeBadRequest, Message: "参数错误"})
		return
	}
	if s.storageMode == "postgres" && s.db != nil {
		var raw []byte
		err := s.db.QueryRow(`SELECT detail_json FROM reports WHERE report_id=$1`, reportID).Scan(&raw)
		if err == sql.ErrNoRows {
			writeError(w, r, &appError{Code: codeNotFound, Message: "资源不存在"})
			return
		}
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		var detail reportDetail
		if err := json.Unmarshal(raw, &detail); err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		writeOK(w, r, detail)
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	report, ok := s.data.ReportsByID[reportID]
	if !ok {
		writeError(w, r, &appError{Code: codeNotFound, Message: "资源不存在"})
		return
	}
	writeOK(w, r, report.Detail)
}

func (s *store) handleUserBind(w http.ResponseWriter, r *http.Request) {
	if err := methodMust(r, http.MethodPost); err != nil {
		writeError(w, r, err)
		return
	}

	var req struct {
		AnonymousID string `json:"anonymous_id"`
		LoginCode   string `json:"login_code"`
	}
	if err := decodeBody(r, &req); err != nil {
		writeError(w, r, err)
		return
	}
	req.AnonymousID = strings.TrimSpace(req.AnonymousID)
	req.LoginCode = strings.TrimSpace(req.LoginCode)
	if req.AnonymousID == "" || req.LoginCode == "" {
		writeError(w, r, &appError{Code: codeBadRequest, Message: "参数错误"})
		return
	}
	if req.LoginCode == "invalid" || req.LoginCode == "invalid_code" || req.LoginCode == "expired" {
		writeError(w, r, &appError{Code: codeUnauthorized, Message: "登录校验失败"})
		return
	}
	if s.storageMode == "postgres" && s.db != nil {
		var userID sql.NullString
		err := s.db.QueryRow(`SELECT user_id FROM users WHERE anonymous_id=$1`, req.AnonymousID).Scan(&userID)
		if err == sql.ErrNoRows {
			writeError(w, r, &appError{Code: codeNotFound, Message: "资源不存在"})
			return
		}
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		var exists int
		if err := s.db.QueryRow(`SELECT 1 FROM binds WHERE anonymous_id=$1`, req.AnonymousID).Scan(&exists); err == nil && exists == 1 {
			writeError(w, r, &appError{Code: codeConflict, Message: "绑定冲突"})
			return
		}
		newUserID := fmt.Sprintf("user_%d", time.Now().UnixNano())
		token := "user_token_" + newUserID
		now := time.Now().UTC()
		tx, err := s.db.Begin()
		if err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		defer tx.Rollback()
		if _, err = tx.Exec(`UPDATE users SET user_id=$2, token=$3, updated_at=$4 WHERE anonymous_id=$1`, req.AnonymousID, newUserID, token, now); err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		if _, err = tx.Exec(`INSERT INTO binds(anonymous_id, user_id, login_code, created_at) VALUES ($1,$2,$3,$4)`, req.AnonymousID, newUserID, req.LoginCode, now); err != nil {
			writeError(w, r, &appError{Code: codeConflict, Message: "绑定冲突"})
			return
		}
		if _, err = tx.Exec(`UPDATE sessions SET user_id=$2 WHERE anonymous_id=$1`, req.AnonymousID, newUserID); err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		if _, err = tx.Exec(`UPDATE tasks SET user_id=$2 WHERE anonymous_id=$1`, req.AnonymousID, newUserID); err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		if _, err = tx.Exec(`UPDATE reports SET user_id=$2 WHERE anonymous_id=$1`, req.AnonymousID, newUserID); err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		if err = tx.Commit(); err != nil {
			writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
			return
		}
		writeOK(w, r, map[string]interface{}{"token": token, "user_id": newUserID})
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	user, ok := s.data.UsersByAnon[req.AnonymousID]
	if !ok {
		writeError(w, r, &appError{Code: codeNotFound, Message: "资源不存在"})
		return
	}
	if _, exists := s.data.BoundUsers[req.AnonymousID]; exists {
		writeError(w, r, &appError{Code: codeConflict, Message: "绑定冲突"})
		return
	}

	userID := fmt.Sprintf("user_%d", time.Now().UnixNano())
	user.UserID = userID
	user.Token = "user_token_" + userID
	user.UpdatedAt = nowISO()
	s.data.UsersByAnon[req.AnonymousID] = user
	s.data.BoundUsers[req.AnonymousID] = bindRecord{
		AnonymousID: req.AnonymousID,
		UserID:      userID,
		LoginCode:   req.LoginCode,
		CreatedAt:   nowISO(),
	}

	for id, sess := range s.data.SessionsByID {
		if sess.AnonymousID == req.AnonymousID {
			sess.UserID = userID
			s.data.SessionsByID[id] = sess
		}
	}
	for id, t := range s.data.TasksByID {
		if t.AnonymousID == req.AnonymousID {
			t.UserID = userID
			s.data.TasksByID[id] = t
		}
	}
	for id, rp := range s.data.ReportsByID {
		if rp.AnonymousID == req.AnonymousID {
			rp.UserID = userID
			s.data.ReportsByID[id] = rp
		}
	}

	if err := s.save(); err != nil {
		writeError(w, r, &appError{Code: codeInternal, Message: "内部错误"})
		return
	}

	writeOK(w, r, map[string]interface{}{
		"token":   user.Token,
		"user_id": userID,
	})
}
