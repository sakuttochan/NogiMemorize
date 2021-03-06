package controller

import (
	"encoding/json"
	"net/http"
	"github.com/sakuttochan/NogiMemorize/model"
	"github.com/jmoiron/sqlx"
	"time"
	"fmt"
	"math/rand"
	"io/ioutil"
	"github.com/joho/godotenv"
	"os"
)

type Member struct {
	DB *sqlx.DB
}

type Url struct {
	Data []struct {
		Image struct {
			Original struct {
				URL    string `json:"url"`
				Width  int    `json:"width"`
				Height int    `json:"height"`
			} `json:"original"`
		} `json:"image"`
		ID string `json:"id"`
	} `json:"data"`
	Page struct {
		Cursor interface{} `json:"cursor"`
		Next   interface{} `json:"next"`
	} `json:"page"`
}

func Env_load() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("cannot load .env file")
		fmt.Printf("%#v", err)
	}
}


func (t *Member) GetMemberByRandom(w http.ResponseWriter, r *http.Request) error {
	rand.Seed(time.Now().UnixNano())
	randomId := rand.Intn(45)
	randomId = randomId + 1
	member, err := model.GetMemberById(t.DB, int64(randomId))
	if err != nil {
		return err
	}
	member.PictureUrl, err = GetMemberPic(member.Name)
	if err != nil {
		return err
	}

	return JSON(w, 200, member)
}

func GetMemberPic(memberName string) (string, error) {
	Env_load()
	accessToken := os.Getenv("TOKEN")
	board := "sakuttochan/" + memberName
	resp, err := http.Get("https://api.pinterest.com/v1/boards/" + board + "/pins/?access_token=" + accessToken + "&fields=image")
	if err != nil {
		fmt.Println("something went wrong when access pintarest api")
		fmt.Printf("%#v", err)
	}

	defer resp.Body.Close()
	bytes := execute(resp)
	var url Url
	if err := json.Unmarshal(bytes, &url); err != nil {
		fmt.Printf("%#v", err)
	}
	var urlList []string
	for i := 0; i < len(url.Data); i++ {
		urlList = append(urlList, url.Data[i].Image.Original.URL)
	}
	rand.Seed(time.Now().UnixNano())
	key := rand.Intn(len(urlList) - 1)

	return urlList[key], err
}

func execute(response *http.Response) []byte {
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("%#v", err)
	}
	return body
}
