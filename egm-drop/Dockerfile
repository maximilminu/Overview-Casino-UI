FROM gitlab.sistematis.com.ar:4567/open-source/go/sims:latest

ENV HEALTH=ok
ENV PROMETHEUS=1
ENV SPA=1
ENV BASE_URL=/egm-drop/

ENV NAME="egm-drop"
ARG VERSION
ENV VERSION=$VERSION

COPY build /html
