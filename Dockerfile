FROM nginx:alpine

# Step 1: Install All Build Tools 
COPY ./nginx /usr/share/nginx/html
COPY ./nginx/index.html /usr/share/nginx/html


# Step 4: Execute necessary command
#CMD [ "dev_sim" ]
