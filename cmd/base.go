package main

import (
	"flag"

	"github.com/VG-Tech-Dojo/treasure2017/mid/sakuttochan/nogiMemorize"
)

func main() {
	var (
		addr   = flag.String("addr", ":8080", "addr to bind")
		dbconf = flag.String("dbconf", "dbconfig.yml", "database configuration file.")
		env    = flag.String("env", "development", "application envirionment (production, development etc.)")
	)
	flag.Parse()
	b := base.New()
	b.Init(*dbconf, *env)
	b.Run(*addr)
}
