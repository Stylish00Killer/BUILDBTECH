{pkgs}: {
  deps = [
    pkgs.nspr
    pkgs.xorg.libXfixes
    pkgs.xorg.libXdamage
    pkgs.xorg.libXext
    pkgs.xorg.libXScrnSaver
    pkgs.dbus
    pkgs.mesa
    pkgs.xorg.libXtst
    pkgs.xorg.libXrender
    pkgs.xorg.libXi
    pkgs.xorg.libXrandr
    pkgs.xorg.libXcursor
    pkgs.xorg.libX11
    pkgs.cairo
    pkgs.pango
    pkgs.libxkbcommon
    pkgs.atk
    pkgs.nss
    pkgs.glib
    pkgs.gtk3
  ];
}
