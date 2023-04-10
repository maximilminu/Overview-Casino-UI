package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.sistematis.com.ar/OC/be/common/auth"
	"gitlab.sistematis.com.ar/OC/be/common/microservice"
	"gitlab.sistematis.com.ar/OC/be/common/session"
	helpers "gitlab.sistematis.com.ar/OPEN-SOURCE/GO/api-helpers"
)

func main() {
	router := microservice.Init("/", false)
	session.Init(router)
	auth.Init(router)

	router.GET("", func(c *gin.Context) {
		log := helpers.Log(c)

		// Obtener el token de AccessToken del encabezado de la solicitud
		token := auth.GetToken(c)

		if token.ID == "" {
			// Si hay un error al obtener la información del token, redirigir al usuario a la página de inicio de sesión
			c.Redirect(http.StatusTemporaryRedirect, "/sign-in")
			return
		}

		session := helpers.GinGetSession(c)

		AfterLoginGoTo := session.Get("PUBLIC_AfterLoginGoTo")
		log.Debugf("AfterLoginGoTo: %s", AfterLoginGoTo)

		if AfterLoginGoTo != nil {
			c.Redirect(http.StatusTemporaryRedirect, AfterLoginGoTo.(string))
			return
		}

		if token.Profile.DefaultUrlPath != "" {
			// Si el token tiene un valor para DefaultUrlPath, redirigir al usuario a esa URL
			log.Debug("Using DefaultUrlPath")
			c.Redirect(http.StatusTemporaryRedirect, token.Profile.DefaultUrlPath)
			return
		}

		// Si el token no tiene un valor para defaultUI, redirigir al usuario a Error 404
		c.File("error404.html")
		c.Status(http.StatusNotFound)
	})

	microservice.Bind()

}
