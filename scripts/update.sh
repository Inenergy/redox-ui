set -e

cd "$( dirname "$0" )/.."

# MAIN APP BUILD
git pull
npm run build

# MAIN APP INSTALL
chmod +x dist/redox-ui*.AppImage
rm ~/inenergy-gui/dist/redox-ui*
cp dist/redox-ui*.AppImage ~/inenergy-gui/dist/
sudo reboot