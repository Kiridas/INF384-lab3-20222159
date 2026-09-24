# Dockerfile del repositorio base.
# Contiene cinco malas practicas deliberadas. Cada una lleva su numero en la
# linea anterior. Corregirlas es el bloque A1 de la guia del laboratorio.

#Correccion:

# Etapa 1: construccion. Instala desde el lock file y empaqueta con esbuild.
# Nada de esta etapa llega a la imagen final salvo dist/handler.js.
FROM node:20-slim AS build
WORKDIR /app

# Manifiesto y lock file primero: la capa de dependencias se reutiliza
# mientras no cambien, aunque cambie el codigo.
COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# Etapa 2: imagen final. Base de Lambda con version fija; recibe solo el
# artefacto empaquetado, sin node_modules, sin dnf, sin herramientas de
# depuracion y sin valores de credencial.
FROM public.ecr.aws/lambda/nodejs:20
COPY --from=build /app/dist/handler.js ${LAMBDA_TASK_ROOT}/handler.js
CMD ["handler.handler"]