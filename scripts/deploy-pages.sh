git add -A
git stash
rm -rf ./build
mkdir ../deploy
cp ./index.html ../deploy
npm run build
cp -r ./build ../deploy/build
git checkout gh-pages
rm -rf index.html build
cp ../deploy/index.html ./index.html
cp -r ../deploy/build ./build
git add -A
git commit -m 'deploy build'
git push
git checkout master
git stash pop
rm -rf ../deploy
