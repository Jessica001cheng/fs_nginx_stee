version=$1
echo "version :$version"
docker build -t fs_nginx .
##docker run -p 8080:80 fs_nginx
docker tag fs_nginx 10.8.0.1:30003/lta_lib/alpine_fs_nginx:$version
docker push 10.8.0.1:30003/lta_lib/alpine_fs_nginx:$version
echo "finish push ng_inx to harbor"
