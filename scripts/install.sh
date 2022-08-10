cd "$( dirname "$0" )/.."

# MAIN APP INSTALLATION
npm i
npm run build

# MAIN APP AUTOSTART
chmod +x dist/redox-ui*.AppImage
mkdir -p ~/inenergy-gui/dist
cp dist/redox-ui*.AppImage ~/inenergy-gui/dist/
mkdir -p ~/.inenergy
echo '~/inengergy-gui/dist/redox-ui*.AppImage > ~/.inenergy/hydrogen-energy-ui.log' > ~/.config/openbox/autostart
