{
  description = "Shardeum JSON RPC server";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    utils,
  }: let
    appName = "shardeum-rpc";
    out =
      utils.lib.eachDefaultSystem
      (system: let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfreePredicate = pkg:
            builtins.elem (nixpkgs.lib.getName pkg) [
              "vscode"
            ];
        };
        buildNodeJs = pkgs.callPackage "${nixpkgs}/pkgs/development/web/nodejs/nodejs.nix" {python = pkgs.python3;};
        custom-nodejs = buildNodeJs {
          enableNpm = true;
          version = "18.16.0";
          sha256 = "067ijdh9073wyvqb7rlxjy8lbl08j0hg5954vnd50ni37qiimn1k";
        };

        nativeBuildInputs = with pkgs; [
          custom-nodejs
        ];
        buildInputs = with pkgs; [];
      in {
        # TODO `nix build`

        # TODO `nix run`
        defaultApp = utils.lib.mkApp {
          name = appName;
          drv = self.defaultPackage."${system}";
          exePath = "/bin/${appName}";
        };

        # `nix develop` or direnv
        devShell = pkgs.mkShell {
          packages =
            nativeBuildInputs
            ++ buildInputs
            ++ (with pkgs; [
              nodePackages.typescript-language-server
              nodePackages.vscode-langservers-extracted
              nodePackages.prettier
            ]);
        };
      });
  in
    out
    // {
      overlay = final: prev: {
        ${appName} = self.defaultPackage.${prev.system};
      };
    };
}
