package base

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/VG-Tech-Dojo/treasure2017/mid/sakuttochan/nogiMemorize/controller"
	"github.com/VG-Tech-Dojo/treasure2017/mid/sakuttochan/nogiMemorize/db"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/context"
	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type Server struct {
	dbx    *sqlx.DB
	router *mux.Router
}

func (s *Server) Close() error {
	return s.dbx.Close()
}

// InitはServerを初期化する
func (s *Server) Init(dbconf, env string) {
	cs, err := db.NewConfigsFromFile(dbconf)
	if err != nil {
		log.Fatalf("cannot open database configuration. exit. %s", err)
	}
	dbx, err := cs.Open(env)
	if err != nil {
		log.Fatalf("db initialization failed: %s", err)
	}
	s.dbx = dbx
	s.router = s.Route()
}

func New() *Server {
	return &Server{}
}

// csrfProtectKey should have 32 byte length.
var csrfProtectKey = []byte("32-byte-long-auth-key")

func (s *Server) Run(addr string) {
	log.Printf("start listening on %s", addr)
	// NOTE: when you serve on TLS, make csrf.Secure(true)
	CSRF := csrf.Protect(
		csrfProtectKey, csrf.Secure(false))
	http.ListenAndServe(addr, context.ClearHandler(CSRF(s.router)))
}

func (s *Server) Route() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "pong")
	}).Methods("GET")
	router.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"token": csrf.Token(r),
		})
	}).Methods("GET")

	member := &controller.Member{DB: s.dbx}

	// TODO ng?
	router.Handle("/api/member", handler(member.GetMemberByRandom)).Methods("GET")

	// TODO return index.html
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "public/index.html")
	})
	router.PathPrefix("/static/").Handler(
		http.StripPrefix("/static/", http.FileServer(http.Dir("public"))))

	return router
}
